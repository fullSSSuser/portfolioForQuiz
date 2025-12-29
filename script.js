        // Milestones data
        const milestones = [
            {
                id: 1,
                title: "Unique Login Site Design",
                duration: "1:30",
                videoSrc: "videoDemo/demo1.mp4",
                description: "A special login site design that shows user a new interactive way for logging in or register, helps boosting user engagement "
            },
            {
                id: 2,
                title: "MacOS inspried Navigation Bả",
                duration: "2:15",
                videoSrc: "videoDemo/demo2.mp4",
                description: "An intuitive, user friendly home page inteface where it is introduced with a renovative reimagined design for navigation bar."
            },
            {
                id: 3,
                title: "Learning with Cards",
                duration: "2:00",
                videoSrc: "videoDemo/demo3.mp4",
                description: "Core learning method of the platform where cards are utilized for learning especially helps learners with rememorizing"
            },
            {
                id: 4,
                title: "Classroom",
                duration: "1:45",
                videoSrc: "videoDemo/demo4.mp4",
                description: "Universal educational space where shared learning among users is encouraged by helping connecting teacher with students, tracking users' progress, promoting study group elavates learning exprience"
            },
            {
                id: 5,
                title: "Creating Custom Quiz",
                duration: "1:30",
                videoSrc: "videoDemo/demo5.mp4",
                description: "Optimizing user's ability to custome their own learning resources, especially large resources, and arrange them into organized, engaging set of cards "
            }
        ];

        // State management
        let currentMilestoneIndex = 0;
        let autoPlayEnabled = true;
        let videoPlayer = null;
        let completedMilestones = new Set();
        
        // Initialize the application
        function initApp() {
            videoPlayer = document.getElementById('mainVideoPlayer');
            
            // Create timeline milestones
            createTimelineMilestones();
            
            // Load the first milestone
            loadMilestone(currentMilestoneIndex);
            
            // Set up event listeners
            setupEventListeners();
            
            // Update timeline progress
            updateTimelineProgress();
            
            // Set up video player
            setupVideoPlayer();
        }
        
        // Create timeline milestones
        function createTimelineMilestones() {
            const timelineMilestones = document.getElementById('timelineMilestones');
            
            milestones.forEach((milestone, index) => {
                const milestoneElement = document.createElement('div');
                milestoneElement.className = 'milestone-item';
                if (index === currentMilestoneIndex) milestoneElement.classList.add('active');
                if (completedMilestones.has(index)) milestoneElement.classList.add('completed');
                milestoneElement.setAttribute('data-index', index);
                
                milestoneElement.innerHTML = `
                    <div class="milestone-dot"></div>
                    <div class="milestone-title">${milestone.title}</div>
                `;
                
                // Add click event to switch to this milestone
                milestoneElement.addEventListener('click', () => {
                    switchToMilestone(index);
                });
                
                timelineMilestones.appendChild(milestoneElement);
            });
        }
        
        // Load a specific milestone
        function loadMilestone(index) {
            if (index < 0 || index >= milestones.length) return;
            
            const milestone = milestones[index];
            currentMilestoneIndex = index;
            
            // Update UI elements
            document.getElementById('videoTitleText').textContent = milestone.title;
            document.getElementById('videoDescription').textContent = milestone.description;
            
            // Show loading indicator
            document.getElementById('videoLoading').style.display = 'flex';
            videoPlayer.style.display = 'none';
            
            // Set video source
            videoPlayer.src = milestone.videoSrc;
            
            // Update active milestone in timeline
            updateActiveMilestone();
            
            // Update timeline progress
            updateTimelineProgress();
            
            // Preload next video if available
            if (index < milestones.length - 1) {
                preloadVideo(index + 1);
            }
        }
        
        // Preload a video
        function preloadVideo(index) {
            const video = document.createElement('video');
            video.preload = 'metadata';
            video.src = milestones[index].videoSrc;
        }
        
        // Switch to a specific milestone
        function switchToMilestone(index) {
            // Pause current video if playing
            if (!videoPlayer.paused) {
                videoPlayer.pause();
            }
            
            // Load the new milestone
            loadMilestone(index);
            
            // Play the video after a short delay
            setTimeout(() => {
                videoPlayer.play().catch(e => {
                    console.log("Auto-play prevented:", e);
                });
            }, 300);
        }
        
        // Update active milestone in timeline
        function updateActiveMilestone() {
            const milestoneItems = document.querySelectorAll('.milestone-item');
            
            milestoneItems.forEach((item, index) => {
                item.classList.remove('active');
                if (index === currentMilestoneIndex) {
                    item.classList.add('active');
                }
                
                if (completedMilestones.has(index)) {
                    item.classList.add('completed');
                }
            });
        }
        
        // Update timeline progress
        function updateTimelineProgress() {
            const progressBar = document.getElementById('timelineProgress');
            const progressPercent = (currentMilestoneIndex / (milestones.length - 1)) * 100;
            progressBar.style.width = `${progressPercent}%`;
        }
        
        // Set up video player
        function setupVideoPlayer() {
            // Format time as MM:SS
            function formatTime(seconds) {
                if (isNaN(seconds)) return "0:00";
                const mins = Math.floor(seconds / 60);
                const secs = Math.floor(seconds % 60);
                return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
            }
            
            // Update time display
            function updateTimeDisplay() {
                const timeDisplay = document.getElementById('timeDisplay');
                if (videoPlayer.duration && !isNaN(videoPlayer.duration)) {
                    timeDisplay.textContent = `${formatTime(videoPlayer.currentTime)} / ${formatTime(videoPlayer.duration)}`;
                }
            }
            
            // When video metadata is loaded
            videoPlayer.addEventListener('loadedmetadata', () => {
                document.getElementById('videoLoading').style.display = 'none';
                videoPlayer.style.display = 'block';
                updateTimeDisplay();
            });
            
            // Update time during playback
            videoPlayer.addEventListener('timeupdate', updateTimeDisplay);
            
            // When video ends
            videoPlayer.addEventListener('ended', () => {
                completedMilestones.add(currentMilestoneIndex);
                
                // Update timeline UI
                const currentMilestoneItem = document.querySelector(`.milestone-item[data-index="${currentMilestoneIndex}"]`);
                if (currentMilestoneItem) {
                    currentMilestoneItem.classList.add('completed');
                }
                
                // Auto-play next video if enabled
                if (autoPlayEnabled && currentMilestoneIndex < milestones.length - 1) {
                    setTimeout(() => {
                        switchToMilestone(currentMilestoneIndex + 1);
                    }, 800);
                }
            });
            
            // Handle video errors
            videoPlayer.addEventListener('error', () => {
                document.getElementById('videoLoading').innerHTML = `
                    <div style="text-align: center; color: #e74c3c;">
                        <i class="fas fa-exclamation-triangle" style="font-size: 1.5rem; margin-bottom: 10px;"></i>
                        <p>Video failed to load</p>
                    </div>
                `;
            });
        }
        
        // Set up event listeners
        function setupEventListeners() {
            // Play/Pause button
            document.getElementById('playPauseBtn').addEventListener('click', () => {
                const icon = document.getElementById('playPauseBtn').querySelector('i');
                if (videoPlayer.paused) {
                    videoPlayer.play();
                    icon.className = 'fas fa-pause';
                } else {
                    videoPlayer.pause();
                    icon.className = 'fas fa-play';
                }
            });
            
            // Restart button
            document.getElementById('restartBtn').addEventListener('click', () => {
                videoPlayer.currentTime = 0;
                videoPlayer.play();
                document.getElementById('playPauseBtn').querySelector('i').className = 'fas fa-pause';
            });
            
            // Auto-play toggle
            document.getElementById('autoPlayToggle').addEventListener('change', (e) => {
                autoPlayEnabled = e.target.checked;
            });
            
            // Keyboard shortcuts
            document.addEventListener('keydown', (e) => {
                // Space bar to play/pause
                if (e.code === 'Space' && !e.target.matches('input, textarea, button')) {
                    e.preventDefault();
                    document.getElementById('playPauseBtn').click();
                }
                
                // Number keys 1-5 to jump to specific milestones
                if (e.code >= 'Digit1' && e.code <= 'Digit5') {
                    const milestoneIndex = parseInt(e.code.replace('Digit', '')) - 1;
                    if (milestoneIndex < milestones.length) {
                        switchToMilestone(milestoneIndex);
                    }
                }
            });
        }
        
        // Initialize the app
        document.addEventListener('DOMContentLoaded', initApp);