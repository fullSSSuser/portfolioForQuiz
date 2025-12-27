// Chapter data
const chapters = [
    {
        time: 0,
        name: "Unique Login Site Design",
        description: "Special interactive login page ",
        script: "Two card-like sections for login and sign-up. To switch between them, simply hover over desired card."
    },
    {
        time: 17,
        name: "Home Page and Dashboard",
        description: "Home page with recommended lessons and classes",
        script: "- Recommended lessons and classes based on user preferences. Interactive MacOS dock-styled navigation bar for easy access to different sections."
    },
    {
        time: 39,
        name: "Learning by Memorizing Cards",
        description: "Interactive cards for learning and memorization.",
        script: "Proven learning method using flashcards to enhance memory retention. Each lesson also equips with other options like Play, Test, and Build Quiz."
    },
    {
        time: 59,
        name: "Class - Inclusive Space",
        description: "Classroom environment for collaborative learning.",
        script: "Virtual classroom setup where multiple students can join a class led by a teacher. Real-time interaction features including chat and live quizzes."
    },
    {
        time: 97,
        name: "Building Users' Own Custom Quiz",
        description: "Custom quiz creation tool for personalized learning.",
        script: "Users can create their own custom quizzes using the lesson content. Interactive interface helps building large quizzes with ease."
    }
];

// DOM Elements
const video = document.getElementById('mainVideo');
const chaptersList = document.getElementById('chaptersList');
const scriptContent = document.getElementById('scriptContent');
const timeDisplay = document.getElementById('timeDisplay');
const playPauseBtn = document.getElementById('playPause');
const restartBtn = document.getElementById('restartBtn');

// Initialize chapters
function initChapters() {
    chaptersList.innerHTML = '';
    
    chapters.forEach((chapter, index) => {
        const li = document.createElement('li');
        li.className = 'chapter-item';
        li.innerHTML = `
            <div class="chapter-time">${formatTime(chapter.time)}</div>
            <div class="chapter-name">${chapter.name}</div>
            <div class="chapter-desc">${chapter.description}</div>
            <div class="progress-bar" style="width: 0%"></div>
        `;
        
        li.addEventListener('click', () => {
            video.currentTime = chapter.time;
            video.play();
            updateActiveChapter(index);
            updateScript(chapter.script);
        });
        
        chaptersList.appendChild(li);
    });
    
    updateActiveChapter(0);
    updateScript(chapters[0].script);
}

// Format seconds to MM:SS
function formatTime(seconds) {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
}

// Update active chapter UI
function updateActiveChapter(activeIndex) {
    document.querySelectorAll('.chapter-item').forEach((item, index) => {
        if (index === activeIndex) {
            item.classList.add('active');
        } else {
            item.classList.remove('active');
        }
    });
}

// Update script text
function updateScript(text) {
    scriptContent.textContent = text;
}

// Find current chapter based on video time
function findCurrentChapter(currentTime) {
    let currentChapterIndex = 0;
    for (let i = chapters.length - 1; i >= 0; i--) {
        if (currentTime >= chapters[i].time) {
            currentChapterIndex = i;
            break;
        }
    }
    return currentChapterIndex;
}

// Update time and progress bars
function updateTimeDisplay() {
    const current = formatTime(video.currentTime);
    const duration = formatTime(video.duration || 0);
    timeDisplay.textContent = `${current} / ${duration}`;
    
    const currentChapterIndex = findCurrentChapter(video.currentTime);
    updateActiveChapter(currentChapterIndex);
    
    // Update individual progress bars inside chapter items
    document.querySelectorAll('.chapter-item').forEach((item, index) => {
        const progressBar = item.querySelector('.progress-bar');
        const chapter = chapters[index];
        const nextChapter = chapters[index + 1];
        
        if (video.currentTime >= chapter.time) {
            if (nextChapter && video.currentTime < nextChapter.time) {
                const chapterDuration = nextChapter.time - chapter.time;
                const timeInChapter = video.currentTime - chapter.time;
                const progressPercent = (timeInChapter / chapterDuration) * 100;
                progressBar.style.width = `${Math.min(progressPercent, 100)}%`;
            } else if (!nextChapter && video.currentTime >= chapter.time) {
                progressBar.style.width = '100%';
            } else {
                progressBar.style.width = '100%';
            }
        } else {
            progressBar.style.width = '0%';
        }
    });
}

// Event Listeners
video.addEventListener('timeupdate', updateTimeDisplay);
video.addEventListener('loadedmetadata', updateTimeDisplay);

playPauseBtn.addEventListener('click', () => {
    if (video.paused) {
        video.play();
    } else {
        video.pause();
    }
});

restartBtn.addEventListener('click', () => {
    video.currentTime = 0;
    video.play();
});

video.addEventListener('play', () => {
    playPauseBtn.innerHTML = '<span>⏸️</span> Pause';
});

video.addEventListener('pause', () => {
    playPauseBtn.innerHTML = '<span>▶️</span> Play';
});

// Update script when chapter changes automatically
video.addEventListener('timeupdate', () => {
    const currentChapterIndex = findCurrentChapter(video.currentTime);
    const currentChapter = chapters[currentChapterIndex];
    if (scriptContent.textContent !== currentChapter.script) {
        updateScript(currentChapter.script);
    }
});

// Run init
document.addEventListener('DOMContentLoaded', initChapters);