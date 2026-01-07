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
    model: str = "llama3.1"
    conversation_id: Optional[str] = None

OLLAMA_API_URL = "http://localhost:11434/api/chat"

# --- RAG Setup ---
print("Initializing RAG system...")
try:
    # 1. Initialize ChromaDB with default embedding function
    chroma_client = chromadb.Client()
    
    # Use default embedding function (avoids TensorFlow/Keras issues)
    # ChromaDB will use its built-in embedding model
    default_ef = embedding_functions.DefaultEmbeddingFunction()
    
    collection = chroma_client.get_or_create_collection(
        name="company_info",
        embedding_function=default_ef
    )

    # 2. Load Company Data
    DATA_FILE = os.path.join(os.path.dirname(__file__), "data", "company_info.txt")
    
    if os.path.exists(DATA_FILE):
        with open(DATA_FILE, "r", encoding="utf-8") as f:
            text = f.read()
        
        # 3. Improved chunking - split by section headers (===)
        # This preserves semantic sections from the company info document
        sections = text.split('================================')
        chunks = []
        
        for section in sections:
            section = section.strip()
            if section and len(section) > 20:  # Filter out very short chunks
                chunks.append(section)
        
        documents = chunks
        
        if documents:
             # Need unique IDs
             ids = [f"doc_{i}" for i in range(len(documents))]
             
             # Upsert documents into collection
             try:
                 collection.upsert(
                     documents=documents,
                     ids=ids
                 )
                 print(f"✓ Loaded {len(documents)} document sections into Vector DB.")
             except Exception as load_err:
                 print(f"✗ Error upserting documents: {load_err}")

    else:
        print(f"⚠ Warning: Data file not found at {DATA_FILE}")

except Exception as e:
    print(f"✗ Failed to initialize RAG: {e}")
    collection = None

@app.post("/api/chat")
async def chat(request: ChatRequest):
    try:
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
        system_message_content = "You are Ratala AI's helpful assistant."
        if context_str:
            system_message_content += f"\n\nUse the following context to answer the user's question if relevant:\n{context_str}\n\nIf the answer is not in the context, answer generally but mention you don't have specific company info on that."

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
    return {"status": "ok"}
