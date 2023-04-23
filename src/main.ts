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
const speedBtn = document.querySelector('.speed-btn');
const previewImg = document.querySelector('.preview-img') as HTMLImageElement;
const thumbnailImg = document.querySelector('.thumbnail-img')  as HTMLImageElement;
const timeLineContainer = document.querySelector('.timeline-container');

playPauseBtn?.addEventListener('click', togglePlay)
fullScreenBtn?.addEventListener('click', toggleFullScreenMode)
theatherBtn?.addEventListener('click', toggleTheaterMode)
miniPlayerBtn?.addEventListener('click', toggleMiniPlayerMode)
muteBtn?.addEventListener('click', toggleMute)
speedBtn?.addEventListener('click', changePlaybackSpeed)

video?.addEventListener('loadeddata',() => {
    // @ts-ignore
    totalTimeEl.textContent = formatTime(video.duration)
})
video?.addEventListener('timeupdate', () => {
    // @ts-ignore
    currentTimeEl.textContent = formatTime(video.currentTime)
    const percent = video.currentTime / video.duration
    //@ts-ignore
    timeLineContainer.style.setProperty("--progress-position", percent)
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
        case 'c':
            toggleCaptions()
            break;
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

//TIMELINE

timeLineContainer?.addEventListener('mousemove', handleTimelineUpdate)
timeLineContainer?.addEventListener('mousedown', toggleScrubbing)
document.addEventListener("mouseup", (e) => {
    if(isScrubbing) toggleScrubbing(e)
})
document.addEventListener("mousemove", (e) => {
    if(isScrubbing) handleTimelineUpdate(e)
})

let isScrubbing = false;
let wasPaused = false;
function toggleScrubbing(e:any) {
    if(!timeLineContainer || !video) return;

    const rect = timeLineContainer?.getBoundingClientRect()
    const percent = Math.min(Math.max(0, e.x - rect.x), rect.width) / rect.width;
    isScrubbing = (e.buttons & 1) === 1;
    videoContainer?.classList.toggle('scrubbing', isScrubbing)

    if (isScrubbing) {
        wasPaused = video.paused;
        video.pause() 
    } else {
        video.currentTime = percent * video.duration
        if(!wasPaused) video.play();
    }

    handleTimelineUpdate(e);
}

function handleTimelineUpdate(e:any) {
    if(!timeLineContainer || !video || !previewImg || !thumbnailImg) return;

    const rect = timeLineContainer?.getBoundingClientRect()
    const percent = Math.min(Math.max(0, e.x - rect.x), rect.width) / rect.width;
    const previewImgNumber = Math.max(1, Math.floor((percent * video.duration) / 10))
    const previewImgSrc = `assets/previewImgs/preview${previewImgNumber}.jpg`
    previewImg.src = previewImgSrc
    //@ts-ignore
    timeLineContainer.style.setProperty("--preview-position", percent)

    if (isScrubbing) {
        e.preventDefault();
        thumbnailImg.src = previewImgSrc
        //@ts-ignore
        timeLineContainer.style.setProperty("--progress-position", percent)
    }
}

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

function changePlaybackSpeed() {
    if(!video) return;
    let newPlaybackRate = video?.playbackRate + 0.25;
    if (newPlaybackRate > 2 ) newPlaybackRate = 0.25;
    video.playbackRate = newPlaybackRate;
    speedBtn!.textContent = `${newPlaybackRate}x`
}