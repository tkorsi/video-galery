import os
import uuid
import json

from fastapi import FastAPI, UploadFile, File, Form, HTTPException
from fastapi.responses import FileResponse
from fastapi.staticfiles import StaticFiles
import aiofiles

# Directories
VIDEO_DIR = "videos"
STATIC_DIR = "static"

# Create directories if they don't exist
os.makedirs(VIDEO_DIR, exist_ok=True)
os.makedirs(STATIC_DIR, exist_ok=True)

app = FastAPI()

# Mount static files
app.mount("/static", StaticFiles(directory=STATIC_DIR), name="static")

@app.post("/videos/")
async def upload_video(file: UploadFile = File(...), metadata: str = Form(...)):
    try:
        metadata_json = json.loads(metadata)
    except json.JSONDecodeError:
        raise HTTPException(status_code=400, detail="Invalid JSON metadata")

    video_id = str(uuid.uuid4())
    # Preserve file extension
    _, ext = os.path.splitext(file.filename)
    video_folder = os.path.join(VIDEO_DIR, video_id)
    os.makedirs(video_folder, exist_ok=True)
    video_path = os.path.join(video_folder, "video" + ext)

    # Save uploaded video in chunks
    async with aiofiles.open(video_path, "wb") as out_file:
        while True:
            chunk = await file.read(1024*1024)
            if not chunk:
                break
            await out_file.write(chunk)

    # Save metadata
    metadata_path = os.path.join(video_folder, "metadata.json")
    async with aiofiles.open(metadata_path, "w") as meta_file:
        await meta_file.write(json.dumps(metadata_json))

    return {"id": video_id}

@app.get("/videos/")
async def list_videos():
    videos = []
    for video_id in os.listdir(VIDEO_DIR):
        video_folder = os.path.join(VIDEO_DIR, video_id)
        if not os.path.isdir(video_folder):
            continue
        # Find video file
        video_files = [f for f in os.listdir(video_folder) if f.startswith("video")]
        if not video_files:
            continue
        metadata_path = os.path.join(video_folder, "metadata.json")
        if not os.path.exists(metadata_path):
            continue
        with open(metadata_path, "r") as meta_file:
            metadata_json = json.load(meta_file)

        videos.append({
            "id": video_id,
            "video_url": f"/videos/{video_id}/file",
            "metadata": metadata_json
        })
    return videos

@app.get("/videos/{video_id}/file")
async def get_video_file(video_id: str):
    video_folder = os.path.join(VIDEO_DIR, video_id)
    if not os.path.isdir(video_folder):
        raise HTTPException(status_code=404, detail="Video not found")
    video_files = [f for f in os.listdir(video_folder) if f.startswith("video")]
    if not video_files:
        raise HTTPException(status_code=404, detail="Video file not found")
    video_path = os.path.join(video_folder, video_files[0])
    return FileResponse(video_path, media_type="application/octet-stream")

@app.get("/videos/{video_id}/metadata")
async def get_video_metadata(video_id: str):
    metadata_path = os.path.join(VIDEO_DIR, video_id, "metadata.json")
    if not os.path.exists(metadata_path):
        raise HTTPException(status_code=404, detail="Metadata not found")
    return FileResponse(metadata_path, media_type="application/json")

@app.get("/")
async def serve_index():
    index_path = os.path.join(STATIC_DIR, "index.html")
    return FileResponse(index_path, media_type="text/html")

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)