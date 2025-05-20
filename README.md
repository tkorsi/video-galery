# Video Gallery

A simple local web service built with FastAPI that lets you upload, store, and view videos along with custom JSON metadata.

## Features
- Upload videos of any size via a REST endpoint (`POST /videos/`)
- Store metadata (JSON) alongside each video
- List stored videos and metadata (`GET /videos/`)
- Stream individual video files (`GET /videos/{id}/file`)
- Retrieve metadata (`GET /videos/{id}/metadata`)
- Built-in API documentation with Swagger UI and ReDoc
- Simple frontend gallery at the root (`/`)

## Installation
1. (Optional) Create a virtual environment:
   ```bash
   python3 -m venv .venv
   source .venv/bin/activate
   ```
2. Install dependencies:
   ```bash
   pip install --upgrade pip
   pip install -r requirements.txt
   ```

## Running the Server
Start the service locally:
```bash
python main.py       # uses uvicorn with --reload
# or:
uvicorn main:app --reload --host 0.0.0.0 --port 8000
```

## API Documentation
- Swagger UI: `http://localhost:8000/docs`
- ReDoc:      `http://localhost:8000/redoc`
- OpenAPI JSON: `http://localhost:8000/openapi.json`

## Usage Examples
```bash
# Upload a video with metadata
curl -X POST http://localhost:8000/videos/ \
  -F "file=@/path/to/video.mp4" \
  -F 'metadata={"title":"Sample","description":"Test clip"}'

# List videos
curl http://localhost:8000/videos/
```

## Frontend
Navigate your browser to `http://localhost:8000/` to see the video gallery.

---
Video Gallery © 2025