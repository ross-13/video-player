const playPauseBtn = document.querySelector('.play-pause-btn');
const fullScreenBtn = document.querySelector('.full-screen-btn');
const theatherBtn = document.querySelector('.theater-btn');
const miniPlayerBtn = document.querySelector('.mini-player-btn');
const videoContainer = document.querySelector('.video-container');
const video = document.querySelector('video');


playPauseBtn?.addEventListener('click', togglePlay)
fullScreenBtn?.addEventListener('click', toggleFullScreenMode)
theatherBtn?.addEventListener('click', toggleTheaterMode)
miniPlayerBtn?.addEventListener('click', toggleMiniPlayerMode)

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
        case 'f':
            toggleFullScreenMode()
            break;
        case 'escape':
            videoContainer?.classList.remove('full-screen');
            break
        case 't':
            toggleTheaterMode()
            break
    }
})

function togglePlay() {
    video?.paused ? video.play() : video?.pause()
}

function toggleFullScreenMode() {
    if(document.fullscreenElement == null) {
        videoContainer?.requestFullscreen()
    } else {
        document.exitFullscreen()
    }
}

document.addEventListener('fullscreenchange', () => {
    videoContainer?.classList.toggle('full-screen', Boolean(document.fullscreenElement));
})

function toggleMiniPlayerMode() {
    if(videoContainer?.classList.contains('mini-player')) {
        document.exitPictureInPicture()
    } else {
        video?.requestPictureInPicture()
    }
}

document.addEventListener('enterpictureinpicture', () => {
    videoContainer?.classList.add('mini-player')
})

document.addEventListener('leavepictureinpicture', () => {
    videoContainer?.classList.remove('mini-player')
})

function toggleTheaterMode() {
    videoContainer?.classList.toggle('theater');
}