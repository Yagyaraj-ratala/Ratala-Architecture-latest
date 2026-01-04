from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List, Optional
import httpx
import json
import os
import asyncio
import chromadb
from chromadb.utils import embedding_functions
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

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

class ImageGenerationRequest(BaseModel):
    prompt: str
    size: str = "1:1"  # Default to 1:1 aspect ratio
    seed: Optional[int] = None
    nsfw_check: bool = False

OLLAMA_API_URL = "http://localhost:11434/api/chat"
EVOLINK_API_KEY = os.getenv("API_KEY")
# Evolink AI API endpoints
EVOLINK_API_URL = "https://api.evolink.ai/v1/images/generations"
EVOLINK_TASK_URL = "https://api.evolink.ai/v1/tasks"  # For querying task status

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
        
        # RAG Retrieval
        context_str = ""
        if collection:
            results = collection.query(
                query_texts=[user_message],
                n_results=3  # Get top 3 matches for better context
            )
            
            if results and results['documents']:
                retrieved_docs = results['documents'][0]
                context_str = "\n".join(retrieved_docs)
                print(f"Retrieved Context: {context_str}")

        # Construct System Prompt with Context
        system_message_content = "You are Ratala AI's helpful assistant."
        if context_str:
            system_message_content += f"\n\nUse the following context to answer the user's question if relevant:\n{context_str}\n\nIf the answer is not in the context, answer generally but mention you don't have specific company info on that."

        # Prepare messages for Ollama
        # We inject the system message at the start or append to existing system message logic
        # For simplicity, we'll prepend a system message
        
        final_messages = [
            {"role": "system", "content": system_message_content}
        ] + [msg.dict() for msg in request.messages]


        # Prepare the payload for Ollama
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
                
                # Check if user query or AI response contains image generation keywords
                generation_keywords = [
                    "generate", "design", "create", "make", "draw", "render",
                    "image", "picture", "visual", "visualization", "illustration",
                    "floor plan", "3d view", "interior render", "architectural design",
                    "show me", "display", "visualize"
                ]
                
                # Check both user message and AI response
                user_message_lower = user_message.lower()
                assistant_content_lower = assistant_content.lower()
                
                should_generate_image = any(
                    keyword.lower() in user_message_lower or keyword.lower() in assistant_content_lower
                    for keyword in generation_keywords
                )
                
                return {
                    "role": data.get("message", {}).get("role", "assistant"),
                    "content": assistant_content,
                    "should_generate_image": should_generate_image
                }
                
            except httpx.ConnectError:
                 raise HTTPException(status_code=503, detail="Could not connect to Ollama. Ensure it is running at http://localhost:11434")
            except httpx.ReadTimeout:
                 raise HTTPException(status_code=504, detail="Ollama timed out processing the request.")

    except Exception as e:
        print(f"Error: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/api/generate-image")
async def generate_image(request: ImageGenerationRequest):
    """Generate image using Evolink Z Image Turbo (async task-based)"""
    if not EVOLINK_API_KEY:
        raise HTTPException(
            status_code=500, 
            detail="Evolink API key not configured. Please set API_KEY in .env file"
        )
    
    try:
        headers = {
            "Authorization": f"Bearer {EVOLINK_API_KEY}",
            "Content-Type": "application/json"
        }
        
        # Prepare payload according to Evolink API documentation
        payload = {
            "model": "z-image-turbo",
            "prompt": request.prompt[:2000],  # Limit to 2000 characters
            "size": request.size
        }
        
        # Add optional parameters
        if request.seed:
            payload["seed"] = request.seed
        if request.nsfw_check:
            payload["nsfw_check"] = request.nsfw_check
        
        async with httpx.AsyncClient(timeout=30.0) as client:
            # Step 1: Create image generation task
            response = await client.post(
                EVOLINK_API_URL,
                json=payload,
                headers=headers
            )
            response.raise_for_status()
            task_data = response.json()
            
            task_id = task_data.get("id")
            if not task_id:
                raise HTTPException(status_code=500, detail="No task ID returned from Evolink API")
            
            # Step 2: Poll task status until completed
            max_attempts = 60  # Maximum polling attempts (60 * 2 seconds = 2 minutes)
            attempt = 0
            
            while attempt < max_attempts:
                await asyncio.sleep(2)  # Wait 2 seconds between polls
                
                task_response = await client.get(
                    f"{EVOLINK_TASK_URL}/{task_id}",
                    headers=headers
                )
                task_response.raise_for_status()
                task_status = task_response.json()
                
                status = task_status.get("status")
                
                if status == "completed":
                    # Extract image URL from completed task
                    # Evolink API may return result in different formats
                    result = task_status.get("result", {})
                    
                    # Try different possible response structures
                    image_url = None
                    if isinstance(result, dict):
                        if "data" in result and len(result["data"]) > 0:
                            image_data = result["data"][0]
                            image_url = image_data.get("url") or image_data.get("image_url")
                        elif "url" in result:
                            image_url = result.get("url")
                        elif "image_url" in result:
                            image_url = result.get("image_url")
                    
                    # Also check if image URL is directly in task_status
                    if not image_url:
                        if "data" in task_status and len(task_status["data"]) > 0:
                            image_data = task_status["data"][0]
                            image_url = image_data.get("url") or image_data.get("image_url")
                    
                    if image_url:
                        return {
                            "success": True,
                            "task_id": task_id,
                            "image_url": image_url,
                            "status": "completed"
                        }
                    else:
                        # Log the response structure for debugging
                        print(f"Task completed but unexpected response structure: {task_status}")
                        raise HTTPException(status_code=500, detail="Task completed but no image URL found in response")
                
                elif status == "failed":
                    error_msg = task_status.get("error", {}).get("message", "Image generation failed")
                    raise HTTPException(status_code=500, detail=f"Image generation failed: {error_msg}")
                
                # Continue polling if status is "pending" or "processing"
                attempt += 1
            
            # If we've exhausted polling attempts, return task ID for client to poll
            return {
                "success": False,
                "task_id": task_id,
                "status": task_status.get("status", "processing"),
                "message": "Image generation is taking longer than expected. Please query task status separately."
            }
                
    except httpx.HTTPError as e:
        print(f"Evolink API error: {str(e)}")
        if hasattr(e, 'response') and e.response is not None:
            error_detail = e.response.text
            print(f"Error response: {error_detail}")
        raise HTTPException(
            status_code=500, 
            detail=f"Failed to generate image: {str(e)}"
        )
    except Exception as e:
        print(f"Image generation error: {str(e)}")
        raise HTTPException(
            status_code=500, 
            detail=f"Error generating image: {str(e)}"
        )

@app.get("/api/task-status/{task_id}")
async def get_task_status(task_id: str):
    """Query Evolink task status"""
    if not EVOLINK_API_KEY:
        raise HTTPException(
            status_code=500, 
            detail="Evolink API key not configured"
        )
    
    try:
        headers = {
            "Authorization": f"Bearer {EVOLINK_API_KEY}",
            "Content-Type": "application/json"
        }
        
        async with httpx.AsyncClient(timeout=30.0) as client:
            response = await client.get(
                f"{EVOLINK_TASK_URL}/{task_id}",
                headers=headers
            )
            response.raise_for_status()
            task_status = response.json()
            
            status = task_status.get("status")
            result = {}
            
            if status == "completed":
                result_data = task_status.get("result", {})
                
                # Try different possible response structures
                image_url = None
                image_data_b64 = None
                
                if isinstance(result_data, dict):
                    if "data" in result_data and len(result_data["data"]) > 0:
                        image_data = result_data["data"][0]
                        image_url = image_data.get("url") or image_data.get("image_url")
                        image_data_b64 = image_data.get("b64_json")
                    elif "url" in result_data:
                        image_url = result_data.get("url")
                    elif "image_url" in result_data:
                        image_url = result_data.get("image_url")
                
                # Also check if image URL is directly in task_status
                if not image_url:
                    if "data" in task_status and len(task_status["data"]) > 0:
                        image_data = task_status["data"][0]
                        image_url = image_data.get("url") or image_data.get("image_url")
                        image_data_b64 = image_data.get("b64_json")
                
                if image_url or image_data_b64:
                    result = {
                        "image_url": image_url,
                        "image_data": image_data_b64
                    }
            
            return {
                "task_id": task_id,
                "status": status,
                "progress": task_status.get("progress", 0),
                "result": result if result else None,
                "error": task_status.get("error") if status == "failed" else None
            }
            
    except httpx.HTTPError as e:
        raise HTTPException(
            status_code=500,
            detail=f"Failed to query task status: {str(e)}"
        )
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Error querying task: {str(e)}"
        )

@app.get("/health")
async def health():
    return {"status": "ok"}
