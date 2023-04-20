const playPauseBtn = document.querySelector('.play-pause-btn');
const videoContainer = document.querySelector('.video-container');
const video = document.querySelector('video');


playPauseBtn?.addEventListener('click', togglePlay)

video?.addEventListener('click', togglePlay)

video?.addEventListener('play', () => {
    videoContainer?.classList.remove('paused');
})

video?.addEventListener('pause', () => {
    videoContainer?.classList.add('paused');
})

document.addEventListener('keydown', (e: any) => {
    switch(e.key.toLowerCase()) {
        case ' ':
        case "k":
            togglePlay()
            break;
    }
})

function togglePlay() {
    video?.paused ? video.play() : video?.pause()
}