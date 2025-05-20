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
    loadGallery();
});