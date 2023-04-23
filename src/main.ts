const playPauseBtn = document.querySelector('.play-pause-btn');
const fullScreenBtn = document.querySelector('.full-screen-btn');
const theatherBtn = document.querySelector('.theater-btn');
const miniPlayerBtn = document.querySelector('.mini-player-btn');
const muteBtn = document.querySelector('.mute-btn');
const volumeSlider = document.querySelector('.volume-slider');
const videoContainer = document.querySelector('.video-container');
const video = document.querySelector('video');
const currentTimeEl = document.querySelector('.current-time');
const totalTimeEl = document.querySelector('.total-time');
const captionsBtn = document.querySelector('.captions-btn');


playPauseBtn?.addEventListener('click', togglePlay)
fullScreenBtn?.addEventListener('click', toggleFullScreenMode)
theatherBtn?.addEventListener('click', toggleTheaterMode)
miniPlayerBtn?.addEventListener('click', toggleMiniPlayerMode)
muteBtn?.addEventListener('click', toggleMute)
video?.addEventListener('loadeddata',() => {
    // @ts-ignore
    totalTimeEl.textContent = formatTime(video.duration)
})
video?.addEventListener('timeupdate', () => {
    // @ts-ignore
    currentTimeEl.textContent = formatTime(video.currentTime)
})
video?.addEventListener('click', togglePlay)
video?.addEventListener('volumechange', () => {
    if( !videoContainer || !volumeSlider) return;
    // @ts-ignore
    volumeSlider.value = video.volume //TODO: 
    let volumeLevel;

    if(video.muted || video.volume === 0) {
        volumeLevel = 'muted';
    } else if (video.volume >= 0.5) {
        volumeLevel = 'high'
    } else {
        volumeLevel = 'low'
    }
    // @ts-ignore
    videoContainer.dataset.volumeLevel = volumeLevel

})
video?.addEventListener('play', () => {
    videoContainer?.classList.remove('paused');
})

volumeSlider?.addEventListener('input', (e: any) => {
    if (video) {
        video.volume = e.target.value
        video.muted = e.target.value === 0
    }
})
video?.addEventListener('pause', () => {
    videoContainer?.classList.add('paused');
})

document.addEventListener('keydown', (e: any) => {
    switch (e.key.toLowerCase()) {
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
        case 'm':
            toggleMute()
            break
        case 'arrowleft':
        case 'j':
            skip(-5);
            break
        case 'arrowright':
        case 'l':
            skip(5);
            break
    }
})

document.addEventListener('fullscreenchange', () => {
    videoContainer?.classList.toggle('full-screen', Boolean(document.fullscreenElement));
})

document.addEventListener('enterpictureinpicture', () => {
    videoContainer?.classList.add('mini-player')
})

document.addEventListener('leavepictureinpicture', () => {
    videoContainer?.classList.remove('mini-player')
})

const captions = video!.textTracks[0]
captions.mode = 'hidden'

captionsBtn?.addEventListener('click', toggleCaptions)

function toggleCaptions() {
    const isHidden = captions.mode === 'hidden'

    captions.mode = isHidden ? 'showing': 'hidden'
    videoContainer?.classList.toggle('captions', isHidden)
}

function toggleTheaterMode() {
    videoContainer?.classList.toggle('theater');
}

function toggleMiniPlayerMode() {
    if (videoContainer?.classList.contains('mini-player')) {
        document.exitPictureInPicture()
    } else {
        video?.requestPictureInPicture()
    }
}

function toggleFullScreenMode() {
    if (document.fullscreenElement == null) {
        videoContainer?.requestFullscreen()
    } else {
        document.exitFullscreen()
    }
}

function togglePlay() {
    video?.paused ? video.play() : video?.pause()
}

function toggleMute() {
    if (!video) return;
    video.muted = !video.muted
}

const leadingZeroFormatter = Intl.NumberFormat(undefined, {
    minimumIntegerDigits: 2
})
function formatTime (time: number) {
    const seconds = Math.floor(time % 60);
    const minutes = Math.floor(time / 60) % 60;
    const hours = Math.floor(time / 3600); 
    if ( hours === 0) {
        return `${minutes}:${leadingZeroFormatter.format(seconds)}`
    } else {
        return `${hours}:${leadingZeroFormatter.format(minutes)}:${leadingZeroFormatter.format(seconds)}`
    }
}

function skip(duration: number) {
    if( !video) return;
    video.currentTime += duration
}