from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List, Optional
import httpx
import json
import os
import asyncio
import sqlite3
import chromadb
from datetime import datetime
from chromadb.utils import embedding_functions
from dotenv import load_dotenv
import re

# Load environment variables
load_dotenv()

DB_PATH = os.path.join(os.path.dirname(__file__), "chat_history.db")

def init_db():
    conn = sqlite3.connect(DB_PATH)
    c = conn.cursor()
    c.execute('''
        CREATE TABLE IF NOT EXISTS chat_history (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            conversation_id TEXT,
            role TEXT,
            content TEXT,
            timestamp DATETIME DEFAULT CURRENT_TIMESTAMP
        )
    ''')
    conn.commit()
    conn.close()

# Initialize database
init_db()

app = FastAPI()

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],  # Next.js app origin
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class Message(BaseModel):
    role: str
    content: str

class ChatRequest(BaseModel):
    messages: List[Message]
    model: str = "qwen2.5-coder:0.5b"
    conversation_id: Optional[str] = None

OLLAMA_API_URL = "http://localhost:11434/api/chat"

# --- RAG Setup ---
print("Initializing RAG system...")
LAST_LOAD_TIME = 0

def load_data_to_chroma(force=False):
    global LAST_LOAD_TIME
    try:
        DATA_FILE = os.path.join(os.path.dirname(__file__), "data", "company_info.txt")
        if not os.path.exists(DATA_FILE):
            print(f"⚠ Warning: Data file not found at {DATA_FILE}")
            return False
            
        mtime = os.path.getmtime(DATA_FILE)
        if not force and mtime <= LAST_LOAD_TIME:
            return True # Already up to date
            
        print(f"🔄 Loading/Updating company knowledge from {DATA_FILE}...")
        with open(DATA_FILE, "r", encoding="utf-8") as f:
            text = f.read()
        
        # Split by section separators (lines of ===)
        # We look for lines that are just or mostly equals signs
        parts = re.split(r'\n={10,}\n', text)
        chunks = []
        
        current_chunk = ""
        for part in parts:
            part = part.strip()
            if not part: continue
            
            # If the part is short (likely a header), start a new chunk or append if we just started one
            if len(part) < 100:
                if current_chunk:
                    chunks.append(current_chunk.strip())
                current_chunk = part + "\n"
            else:
                current_chunk += part + "\n"
        
        if current_chunk:
            chunks.append(current_chunk.strip())
        
        if chunks:
             # Clear existing collection to avoid stale data from previous versions
             try:
                 all_docs = collection.get()
                 if all_docs['ids']:
                     collection.delete(ids=all_docs['ids'])
                     print(f"Cleared {len(all_docs['ids'])} old documents.")
             except Exception as e:
                 print(f"Note: Could not clear collection (might be empty): {e}")

             ids = [f"doc_{i}" for i in range(len(chunks))]
             collection.upsert(documents=chunks, ids=ids)
             LAST_LOAD_TIME = mtime
             print(f"✓ Loaded {len(chunks)} document sections into Vector DB.")
             return True
    except Exception as e:
        print(f"✗ Error loading data: {e}")
        return False

try:
    # 1. Initialize ChromaDB with persistence
    CHROMA_DATA_PATH = os.path.join(os.path.dirname(__file__), "chroma_db")
    chroma_client = chromadb.PersistentClient(path=CHROMA_DATA_PATH)
    
    # Use default embedding function
    default_ef = embedding_functions.DefaultEmbeddingFunction()
    
    collection = chroma_client.get_or_create_collection(
        name="company_info",
        embedding_function=default_ef
    )

    # Initial load
    load_data_to_chroma()

except Exception as e:
    print(f"✗ Failed to initialize RAG: {e}")
    collection = None

@app.post("/api/chat")
async def chat(request: ChatRequest):
    try:
        # Check for knowledge updates before querying
        if collection:
            load_data_to_chroma()
            
        user_message = request.messages[-1].content
        conversation_id = request.conversation_id or "default"
        
        # 1. Save User Message to SQLite
        conn = sqlite3.connect(DB_PATH)
        c = conn.cursor()
        c.execute(
            "INSERT INTO chat_history (conversation_id, role, content) VALUES (?, ?, ?)",
            (conversation_id, "user", user_message)
        )
        conn.commit()

        # 2. Retrieve history for context (last 10 messages)
        c.execute(
            "SELECT role, content FROM chat_history WHERE conversation_id = ? ORDER BY timestamp DESC LIMIT 11",
            (conversation_id,)
        )
        history = c.fetchall()
        
        # History is DESC, so reverse it
        history.reverse()
        # Convert to Message format
        db_messages = [{"role": h[0], "content": h[1]} for h in history]

        # 3. RAG Retrieval
        context_str = ""
        if collection:
            results = collection.query(
                query_texts=[user_message],
                n_results=3
            )
            
            if results and results['documents']:
                retrieved_docs = results['documents'][0]
                context_str = "\n".join(retrieved_docs)
                print(f"Retrieved Context: {context_str}")

        # 4. Construct System Prompt with Context
        system_message_content = (
            "You are Ratala AI, a helpful and professional assistant for Ratala Architecture and Interiors. "
            "Your goal is to provide accurate information based on the company knowledge provided. "
        )
        
        if context_str:
            system_message_content += (
                f"\n\nCOMMAND: Use the following COMPANY CONTEXT to answer the user's query accurately. "
                "If the information is available in the context, prioritize it. "
                "If the answer is not in the context, answer generally and politely mention that you don't have that specific company detail.\n\n"
                f"--- COMPANY CONTEXT ---\n{context_str}\n-----------------------"
            )
        else:
            system_message_content += "\n\nNote: No specific company context was found for this query, so provide a general helpful response."

        # 5. Prepare final messages for Ollama (System + History)
        # We use the history from DB as the primary context
        final_messages = [{"role": "system", "content": system_message_content}] + db_messages


        # 6. Prepare the payload for Ollama
        payload = {
            "model": request.model,
            "messages": final_messages,
            "stream": False 
        }

        async with httpx.AsyncClient() as client:
            try:
                response = await client.post(OLLAMA_API_URL, json=payload, timeout=60.0)
                response.raise_for_status()
                data = response.json()
                
                assistant_content = data.get("message", {}).get("content", "")
                
                # 7. Save Assistant Response to SQLite
                c.execute(
                    "INSERT INTO chat_history (conversation_id, role, content) VALUES (?, ?, ?)",
                    (conversation_id, "assistant", assistant_content)
                )
                conn.commit()
                conn.close()

                return {
                    "role": "assistant",
                    "content": assistant_content,
                    "conversation_id": conversation_id
                }
                
            except httpx.ConnectError:
                 raise HTTPException(status_code=503, detail="Could not connect to Ollama. Ensure it is running at http://localhost:11434")
            except httpx.ReadTimeout:
                 raise HTTPException(status_code=504, detail="Ollama timed out processing the request.")

    except Exception as e:
        print(f"Error: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))



@app.get("/health")
async def health():
    return {
        "status": "ok",
        "rag_initialized": collection is not None,
        "last_load_time": datetime.fromtimestamp(LAST_LOAD_TIME).isoformat() if LAST_LOAD_TIME > 0 else None
    }

class TestRAGRequest(BaseModel):
    query: str
    n_results: int = 3

@app.post("/api/test-rag")
async def test_rag_endpoint(request: TestRAGRequest):
    if not collection:
        raise HTTPException(status_code=500, detail="RAG system not initialized")
    
    try:
        results = collection.query(
            query_texts=[request.query],
            n_results=request.n_results
        )
        return {
            "query": request.query,
            "results": results['documents'][0] if results and results['documents'] else []
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/api/reload-rag")
async def reload_rag():
    success = load_data_to_chroma(force=True)
    if success:
        return {"message": "RAG data reloaded successfully"}
    else:
        raise HTTPException(status_code=500, detail="Failed to reload RAG data")
