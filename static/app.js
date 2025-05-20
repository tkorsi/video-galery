async function fetchVideos() {
    const response = await fetch('/videos/');
    if (!response.ok) {
        console.error('Failed to fetch videos');
        return [];
    }
    return await response.json();
}

function createVideoCell(video) {
    const cell = document.createElement('div');
    cell.className = 'cell';

    const vid = document.createElement('video');
    vid.src = video.video_url;
    vid.controls = true;
    vid.muted = true;
    vid.preload = 'metadata';
    vid.width = 200;
    cell.appendChild(vid);

    const metaDiv = document.createElement('div');
    metaDiv.className = 'metadata';
    for (const [key, value] of Object.entries(video.metadata)) {
        const item = document.createElement('div');
        item.textContent = `${key}: ${value}`;
        metaDiv.appendChild(item);
    }
    cell.appendChild(metaDiv);
    return cell;
}

async function loadGallery() {
    const gallery = document.getElementById('gallery');
    const videos = await fetchVideos();
    gallery.innerHTML = '';
    videos.forEach(video => {
        const cell = createVideoCell(video);
        gallery.appendChild(cell);
    });
}

window.addEventListener('DOMContentLoaded', () => {
    setupUpload();
    loadGallery();
});

/**
 * Initialize drag-and-drop upload and form submission
 */
function setupUpload() {
    const dropZone = document.getElementById('drop-zone');
    const fileInput = document.getElementById('file-input');
    const uploadForm = document.getElementById('upload-form');
    const statusDiv = document.getElementById('upload-status');
    const titleInput = document.getElementById('title-input');
    const descriptionInput = document.getElementById('description-input');

    dropZone.addEventListener('click', () => fileInput.click());
    dropZone.addEventListener('dragover', (e) => {
        e.preventDefault();
        dropZone.classList.add('dragover');
    });
    dropZone.addEventListener('dragleave', (e) => {
        e.preventDefault();
        dropZone.classList.remove('dragover');
    });
    dropZone.addEventListener('drop', (e) => {
        e.preventDefault();
        dropZone.classList.remove('dragover');
        if (e.dataTransfer.files.length) {
            fileInput.files = e.dataTransfer.files;
            dropZone.textContent = e.dataTransfer.files[0].name;
        }
    });
    fileInput.addEventListener('change', () => {
        if (fileInput.files.length) {
            dropZone.textContent = fileInput.files[0].name;
        }
    });

    uploadForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        if (!fileInput.files.length) {
            statusDiv.textContent = 'Please select a video file to upload.';
            return;
        }
        const formData = new FormData();
        formData.append('file', fileInput.files[0]);
        const metadata = {
            title: titleInput.value.trim(),
            description: descriptionInput.value.trim()
        };
        formData.append('metadata', JSON.stringify(metadata));

        statusDiv.textContent = 'Uploading...';

        try {
            const response = await fetch('/videos/', {
                method: 'POST',
                body: formData
            });
            if (!response.ok) {
                throw new Error(`Server error: ${response.statusText}`);
            }
            const result = await response.json();
            statusDiv.textContent = 'Upload successful! (ID: ' + result.id + ')';
            uploadForm.reset();
            dropZone.textContent = 'Drag & Drop video here or click to select';
            loadGallery();
        } catch (err) {
            console.error(err);
            statusDiv.textContent = 'Upload failed: ' + err.message;
        }
    });
}