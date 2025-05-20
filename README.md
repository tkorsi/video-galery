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

## Running as a Daemon on Raspberry Pi
To have the service start automatically on boot and store all videos locally, use a systemd unit:

1. Place the project in a fixed directory (e.g. `/home/pi/video-galery`):
   ```bash
   cd /home/pi
   git clone https://github.com/tkorsi/video-galery.git
   cd video-galery
   python3 -m venv .venv
   source .venv/bin/activate
   pip install --upgrade pip
   pip install -r requirements.txt
   deactivate
   ```

2. Create the systemd service file `/etc/systemd/system/video-gallery.service`:
   ```ini
   [Unit]
   Description=Video Gallery FastAPI Service
   After=network.target

   [Service]
   Type=simple
   User=pi
   WorkingDirectory=/home/pi/video-galery
   ExecStart=/home/pi/video-galery/.venv/bin/uvicorn main:app --host 0.0.0.0 --port 8000
   Restart=on-failure
   RestartSec=5s

   [Install]
   WantedBy=multi-user.target
   ```

3. Enable and start the service:
   ```bash
   sudo systemctl daemon-reload
   sudo systemctl enable video-gallery.service
   sudo systemctl start video-gallery.service
   ```

4. Verify status:
   ```bash
   sudo systemctl status video-gallery.service
   ```

5. Access the running service (all uploaded videos and metadata are stored under `/home/pi/video-galery/videos`):
   - UI: `http://<pi-ip-or-hostname>:8000/`
   - Swagger: `http://<pi-ip-or-hostname>:8000/docs`
   - ReDoc: `http://<pi-ip-or-hostname>:8000/redoc`

---
Video Gallery © 2025