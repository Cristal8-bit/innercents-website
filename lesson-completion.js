// Reusable lesson completion script for demo pages
function setupLessonCompletion(lessonId) {
    const button = document.getElementById('complete-lesson-btn');
    if (!button) return;
    
    button.addEventListener('click', function() {
        // Get current pet state from localStorage
        let petState = localStorage.getItem('innerCentsPetState');
        if (petState) {
            petState = JSON.parse(petState);
        } else {
            // Initialize if not exists
            petState = {
                coins: 100,
                petName: "My Pet",
                happiness: 100,
                hunger: 100,
                energy: 100,
                learningProgress: 0,
                stage: 0,
                ownedItems: [],
                completedLessons: [],
                achievements: [],
                lastVisit: Date.now(),
                currentBackground: 'default',
                firstVisit: true
            };
        }
        
        // Check if lesson already completed
        if (petState.completedLessons.includes(lessonId)) {
            document.getElementById('completion-message').textContent = 'You already completed this lesson!';
            document.getElementById('completion-message').style.display = 'block';
            document.getElementById('visit-pet-link').style.display = 'inline-block';
        } else {
            // Award coins and mark as complete
            petState.completedLessons.push(lessonId);
            petState.coins += 50;
            petState.learningProgress = Math.min(100, petState.learningProgress + 10);
            
            // Check for Scholar achievement (first lesson)
            if (petState.completedLessons.length === 1 && !petState.achievements.includes('first-lesson')) {
                petState.achievements.push('first-lesson');
                petState.coins += 50;
                setTimeout(() => {
                    alert('🎉 Achievement Unlocked!\nScholar\n+50 coins!');
                }, 500);
            }
            
            // Check for Dedicated Learner achievement (5 lessons)
            if (petState.completedLessons.length === 5 && !petState.achievements.includes('five-lessons')) {
                petState.achievements.push('five-lessons');
                petState.coins += 150;
                setTimeout(() => {
                    alert('🎉 Achievement Unlocked!\nDedicated Learner\n+150 coins!');
                }, 500);
            }
            
            // Save updated state
            localStorage.setItem('innerCentsPetState', JSON.stringify(petState));
            
            // Show success message
            document.getElementById('completion-message').textContent = '✅ Lesson completed! You earned 50 coins!';
            document.getElementById('completion-message').style.display = 'block';
            document.getElementById('visit-pet-link').style.display = 'inline-block';
            button.disabled = true;
            button.textContent = 'Completed!';
        }
    });
}
