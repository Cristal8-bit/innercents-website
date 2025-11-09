// InnerCents Pet Reward System
// Low-maintenance Tamagotchi-style virtual pet

class InnerCentsPet {
    constructor() {
        this.loadGameState();
        this.initializeShopItems();
        this.initializeAchievements();
        this.setupEventListeners();
        this.startGameLoop();
        this.checkFirstVisit();
    }

    // Initialize default game state
    loadGameState() {
        const savedState = localStorage.getItem('innerCentsPetState');
        if (savedState) {
            const state = JSON.parse(savedState);
            this.coins = state.coins || 100;
            this.petName = state.petName || "My Pet";
            this.happiness = state.happiness || 100;
            this.hunger = state.hunger || 100;
            this.energy = state.energy || 100;
            this.learningProgress = state.learningProgress || 0;
            this.stage = state.stage || 0; // 0: baby, 1: teen, 2: adult
            this.ownedItems = state.ownedItems || [];
            this.completedLessons = state.completedLessons || [];
            this.achievements = state.achievements || [];
            this.lastVisit = state.lastVisit || Date.now();
            this.currentBackground = state.currentBackground || 'default';
            this.firstVisit = state.firstVisit || false;
        } else {
            // Default values for new players
            this.coins = 100;
            this.petName = "My Pet";
            this.happiness = 100;
            this.hunger = 100;
            this.energy = 100;
            this.learningProgress = 0;
            this.stage = 0;
            this.ownedItems = [];
            this.completedLessons = [];
            this.achievements = [];
            this.lastVisit = Date.now();
            this.currentBackground = 'default';
            this.firstVisit = true;
        }
        this.updateUI();
        this.checkTimePassed();
    }

    // Save game state to localStorage
    saveGameState() {
        const state = {
            coins: this.coins,
            petName: this.petName,
            happiness: this.happiness,
            hunger: this.hunger,
            energy: this.energy,
            learningProgress: this.learningProgress,
            stage: this.stage,
            ownedItems: this.ownedItems,
            completedLessons: this.completedLessons,
            achievements: this.achievements,
            lastVisit: Date.now(),
            currentBackground: this.currentBackground,
            firstVisit: false
        };
        localStorage.setItem('innerCentsPetState', JSON.stringify(state));
    }

    // Check time passed since last visit and update stats accordingly
    checkTimePassed() {
        const now = Date.now();
        const timePassed = now - this.lastVisit;
        const hoursPassed = timePassed / (1000 * 60 * 60);

        // Low maintenance: stats decay slowly (1 point per hour)
        // This means the pet can survive for ~100 hours without care
        const decay = Math.floor(hoursPassed);
        
        if (decay > 0) {
            this.happiness = Math.max(0, this.happiness - decay);
            this.hunger = Math.max(0, this.hunger - decay);
            this.energy = Math.max(0, this.energy - decay);
            this.updateUI();
            this.saveGameState();
        }
    }

    // Initialize shop items
    initializeShopItems() {
        this.shopItems = {
            food: [
                { id: 'apple', name: 'Apple', price: 10, icon: '🍎', effect: { hunger: 20 } },
                { id: 'pizza', name: 'Pizza Slice', price: 20, icon: '🍕', effect: { hunger: 30, happiness: 10 } },
                { id: 'cake', name: 'Cake', price: 30, icon: '🍰', effect: { hunger: 25, happiness: 20 } },
                { id: 'sushi', name: 'Sushi', price: 40, icon: '🍣', effect: { hunger: 35, happiness: 15 } },
                { id: 'icecream', name: 'Ice Cream', price: 25, icon: '🍦', effect: { hunger: 15, happiness: 30 } }
            ],
            toys: [
                { id: 'ball', name: 'Ball', price: 15, icon: '⚽', effect: { happiness: 20, energy: -10 } },
                { id: 'teddy', name: 'Teddy Bear', price: 30, icon: '🧸', effect: { happiness: 25 } },
                { id: 'game', name: 'Video Game', price: 50, icon: '🎮', effect: { happiness: 35, energy: -15 } },
                { id: 'kite', name: 'Kite', price: 20, icon: '🪁', effect: { happiness: 30, energy: -5 } },
                { id: 'puzzle', name: 'Puzzle', price: 25, icon: '🧩', effect: { happiness: 20, learningProgress: 5 } }
            ],
            accessories: [
                { id: 'hat', name: 'Party Hat', price: 40, icon: '🎩', description: 'A fancy hat!' },
                { id: 'sunglasses', name: 'Cool Sunglasses', price: 35, icon: '🕶️', description: 'Looking cool!' },
                { id: 'crown', name: 'Crown', price: 100, icon: '👑', description: 'Royal treatment!' },
                { id: 'bowtie', name: 'Bow Tie', price: 30, icon: '🎀', description: 'Formal wear!' }
            ],
            backgrounds: [
                { id: 'bg-forest', name: 'Forest', price: 60, icon: '🌲', description: 'A peaceful forest scene' },
                { id: 'bg-ocean', name: 'Ocean', price: 60, icon: '🌊', description: 'Beautiful ocean view' },
                { id: 'bg-sunset', name: 'Sunset', price: 75, icon: '🌅', description: 'Stunning sunset' },
                { id: 'bg-space', name: 'Space', price: 100, icon: '🌌', description: 'Explore the cosmos' }
            ]
        };
    }

    // Initialize achievements
    initializeAchievements() {
        this.achievementsList = [
            { id: 'first-pet', name: 'First Pet!', description: 'Adopt your first pet', reward: 50, icon: '🐣', condition: () => true },
            { id: 'first-feed', name: 'First Meal', description: 'Feed your pet for the first time', reward: 20, icon: '🍎', condition: () => this.achievements.includes('first-feed') },
            { id: 'reach-teen', name: 'Growing Up', description: 'Evolve your pet to Teen stage', reward: 100, icon: '🐥', condition: () => this.stage >= 1 },
            { id: 'reach-adult', name: 'All Grown Up', description: 'Evolve your pet to Adult stage', reward: 200, icon: '🦜', condition: () => this.stage >= 2 },
            { id: 'first-lesson', name: 'Scholar', description: 'Complete your first lesson', reward: 50, icon: '📚', condition: () => this.completedLessons.length >= 1 },
            { id: 'five-lessons', name: 'Dedicated Learner', description: 'Complete 5 lessons', reward: 150, icon: '🎓', condition: () => this.completedLessons.length >= 5 },
            { id: 'coin-collector', name: 'Coin Collector', description: 'Earn 500 total coins', reward: 100, icon: '🪙', condition: () => false }, // Manual check
            { id: 'happy-pet', name: 'Ultimate Happiness', description: 'Reach 100 happiness', reward: 75, icon: '😊', condition: () => this.happiness >= 100 },
            { id: 'shopaholic', name: 'Shopaholic', description: 'Buy 10 items from the shop', reward: 150, icon: '🛍️', condition: () => this.ownedItems.length >= 10 }
        ];

        // Unlock first pet achievement if new player
        if (this.firstVisit && !this.achievements.includes('first-pet')) {
            this.unlockAchievement('first-pet');
        }
    }

    // Setup event listeners
    setupEventListeners() {
        // Action buttons
        document.getElementById('feed-button').addEventListener('click', () => this.feedPet());
        document.getElementById('play-button').addEventListener('click', () => this.playWithPet());
        document.getElementById('rest-button').addEventListener('click', () => this.restPet());

        // Daily bonus
        document.getElementById('daily-bonus-button').addEventListener('click', () => this.claimDailyBonus());

        // Achievements
        document.getElementById('achievements-button').addEventListener('click', () => this.showAchievements());
        document.getElementById('close-achievements').addEventListener('click', () => {
            document.getElementById('achievements-modal').style.display = 'none';
        });

        // Math game
        document.getElementById('math-game-button').addEventListener('click', () => this.playMathGame());

        // Tutorial
        document.getElementById('start-journey-button').addEventListener('click', () => {
            document.getElementById('tutorial-modal').style.display = 'none';
        });

        // Shop tabs
        document.querySelectorAll('.shop-tab').forEach(tab => {
            tab.addEventListener('click', (e) => {
                document.querySelectorAll('.shop-tab').forEach(t => t.classList.remove('active'));
                e.currentTarget.classList.add('active');
                const category = e.currentTarget.getAttribute('data-category');
                this.displayShopItems(category);
            });
        });

        // Initialize with food category
        this.displayShopItems('food');

        // Close modal when clicking outside
        window.addEventListener('click', (e) => {
            const achievementsModal = document.getElementById('achievements-modal');
            const tutorialModal = document.getElementById('tutorial-modal');
            if (e.target === achievementsModal) {
                achievementsModal.style.display = 'none';
            }
            if (e.target === tutorialModal) {
                tutorialModal.style.display = 'none';
            }
        });
    }

    // Check if this is the first visit
    checkFirstVisit() {
        if (this.firstVisit) {
            setTimeout(() => {
                document.getElementById('tutorial-modal').style.display = 'flex';
            }, 500);
        }
    }

    // Update all UI elements
    updateUI() {
        // Update coin display
        document.getElementById('coin-count').textContent = this.coins;

        // Update pet name and stage
        document.getElementById('pet-name').textContent = this.petName;
        const stageNames = ['Baby', 'Teen', 'Adult'];
        document.getElementById('pet-stage').textContent = stageNames[this.stage];

        // Update pet sprite
        const petEmojis = ['🐣', '🐥', '🦜'];
        document.querySelector('.pet-emoji').textContent = petEmojis[this.stage];

        // Update stats
        this.updateStatBar('happiness', this.happiness);
        this.updateStatBar('hunger', this.hunger);
        this.updateStatBar('energy', this.energy);
        this.updateStatBar('learning', this.learningProgress);

        // Update pet mood
        this.updatePetMood();

        // Update background
        const petBackground = document.getElementById('pet-background');
        petBackground.className = 'pet-background';
        if (this.currentBackground !== 'default') {
            petBackground.classList.add(this.currentBackground);
        }

        // Check for evolution
        this.checkEvolution();
    }

    // Update individual stat bar
    updateStatBar(stat, value) {
        const clampedValue = Math.max(0, Math.min(100, value));
        document.getElementById(`${stat}-bar`).style.width = `${clampedValue}%`;
        document.getElementById(`${stat}-value`).textContent = Math.round(clampedValue);

        // Change color based on value for warning
        const bar = document.getElementById(`${stat}-bar`);
        if (clampedValue < 30) {
            bar.style.opacity = '0.5';
        } else {
            bar.style.opacity = '1';
        }
    }

    // Update pet mood based on stats
    updatePetMood() {
        const petSprite = document.querySelector('.pet-sprite');
        const avgStat = (this.happiness + this.hunger + this.energy) / 3;

        petSprite.classList.remove('sad', 'sleeping');

        if (avgStat < 30) {
            petSprite.classList.add('sad');
            this.showPetMessage('I need some care!');
        } else if (this.energy < 20) {
            petSprite.classList.add('sleeping');
            this.showPetMessage('Zzz...');
        } else if (avgStat > 80) {
            this.showPetMessage('I\'m so happy!');
        }
    }

    // Show pet speech bubble
    showPetMessage(message) {
        const speechBubble = document.getElementById('pet-speech');
        const messageElement = document.getElementById('pet-message');
        messageElement.textContent = message;
        speechBubble.style.display = 'block';

        setTimeout(() => {
            speechBubble.style.display = 'none';
        }, 3000);
    }

    // Feed the pet
    feedPet() {
        const cost = 10;
        if (this.coins >= cost) {
            this.coins -= cost;
            this.hunger = Math.min(100, this.hunger + 25);
            this.happiness = Math.min(100, this.happiness + 10);
            this.showPetMessage('Yummy! Thank you!');
            
            // First feed achievement
            if (!this.achievements.includes('first-feed')) {
                this.unlockAchievement('first-feed');
            }

            this.updateUI();
            this.saveGameState();
        } else {
            this.showPetMessage('You need more coins!');
        }
    }

    // Play with pet
    playWithPet() {
        const cost = 5;
        if (this.coins >= cost && this.energy >= 10) {
            this.coins -= cost;
            this.happiness = Math.min(100, this.happiness + 20);
            this.energy = Math.max(0, this.energy - 10);
            this.showPetMessage('This is so fun!');
            this.updateUI();
            this.saveGameState();
        } else if (this.energy < 10) {
            this.showPetMessage('I\'m too tired...');
        } else {
            this.showPetMessage('You need more coins!');
        }
    }

    // Rest the pet
    restPet() {
        this.energy = Math.min(100, this.energy + 30);
        this.showPetMessage('That was a good rest!');
        this.updateUI();
        this.saveGameState();
    }

    // Check for pet evolution
    checkEvolution() {
        const oldStage = this.stage;

        if (this.learningProgress >= 30 && this.stage === 0) {
            this.stage = 1;
        } else if (this.learningProgress >= 70 && this.stage === 1) {
            this.stage = 2;
        }

        if (oldStage !== this.stage) {
            this.showPetMessage('I\'m evolving!');
            this.updateUI();
            
            // Check evolution achievements
            if (this.stage === 1 && !this.achievements.includes('reach-teen')) {
                setTimeout(() => this.unlockAchievement('reach-teen'), 1000);
            } else if (this.stage === 2 && !this.achievements.includes('reach-adult')) {
                setTimeout(() => this.unlockAchievement('reach-adult'), 1000);
            }
            
            this.saveGameState();
        }
    }

    // Display shop items
    displayShopItems(category) {
        const shopItemsContainer = document.getElementById('shop-items');
        shopItemsContainer.innerHTML = '';

        const items = this.shopItems[category];
        items.forEach(item => {
            const itemDiv = document.createElement('div');
            itemDiv.className = 'shop-item';
            
            const owned = this.ownedItems.includes(item.id);
            if (owned) {
                itemDiv.classList.add('owned');
            }

            itemDiv.innerHTML = `
                <div class="item-icon">${item.icon}</div>
                <div class="item-name">${item.name}</div>
                ${item.description ? `<div class="item-description">${item.description}</div>` : ''}
                <div class="item-price">
                    <i class="fas fa-coins"></i>
                    ${item.price}
                </div>
                <button class="buy-button" ${owned ? 'disabled' : ''}>
                    ${owned ? 'Owned' : 'Buy'}
                </button>
            `;

            const buyButton = itemDiv.querySelector('.buy-button');
            if (!owned) {
                buyButton.addEventListener('click', () => this.buyItem(item, category));
            }

            shopItemsContainer.appendChild(itemDiv);
        });
    }

    // Buy item from shop
    buyItem(item, category) {
        if (this.coins >= item.price) {
            this.coins -= item.price;
            this.ownedItems.push(item.id);

            // Apply effects
            if (item.effect) {
                if (item.effect.hunger) this.hunger = Math.min(100, this.hunger + item.effect.hunger);
                if (item.effect.happiness) this.happiness = Math.min(100, this.happiness + item.effect.happiness);
                if (item.effect.energy) this.energy = Math.max(0, Math.min(100, this.energy + item.effect.energy));
                if (item.effect.learningProgress) this.learningProgress = Math.min(100, this.learningProgress + item.effect.learningProgress);
            }

            // Apply background if it's a background item
            if (category === 'backgrounds') {
                this.currentBackground = item.id;
            }

            this.showPetMessage(`You bought ${item.name}!`);
            this.updateUI();
            this.displayShopItems(category);
            this.saveGameState();

            // Check shopaholic achievement
            if (this.ownedItems.length >= 10 && !this.achievements.includes('shopaholic')) {
                setTimeout(() => this.unlockAchievement('shopaholic'), 500);
            }
        } else {
            alert('Not enough coins!');
        }
    }

    // Claim daily bonus
    claimDailyBonus() {
        const now = Date.now();
        const lastBonus = localStorage.getItem('lastDailyBonus');
        const oneDayMs = 24 * 60 * 60 * 1000;

        if (!lastBonus || now - parseInt(lastBonus) >= oneDayMs) {
            this.coins += 20;
            localStorage.setItem('lastDailyBonus', now.toString());
            this.showPetMessage('Daily bonus claimed!');
            alert('You earned 20 InnerCents Coins! Come back tomorrow for more!');
            this.updateUI();
            this.saveGameState();
        } else {
            const timeLeft = oneDayMs - (now - parseInt(lastBonus));
            const hoursLeft = Math.floor(timeLeft / (1000 * 60 * 60));
            alert(`You already claimed your daily bonus! Come back in ${hoursLeft} hours.`);
        }
    }

    // Complete a lesson (called from demo pages)
    completeLesson(lessonId) {
        if (!this.completedLessons.includes(lessonId)) {
            this.completedLessons.push(lessonId);
            this.coins += 50;
            this.learningProgress = Math.min(100, this.learningProgress + 10);
            
            // Check achievements
            if (this.completedLessons.length === 1 && !this.achievements.includes('first-lesson')) {
                this.unlockAchievement('first-lesson');
            } else if (this.completedLessons.length >= 5 && !this.achievements.includes('five-lessons')) {
                this.unlockAchievement('five-lessons');
            }

            if (this.happiness >= 100 && !this.achievements.includes('happy-pet')) {
                this.unlockAchievement('happy-pet');
            }

            this.updateUI();
            this.saveGameState();
            return true;
        }
        return false;
    }

    // Unlock achievement
    unlockAchievement(achievementId) {
        if (!this.achievements.includes(achievementId)) {
            this.achievements.push(achievementId);
            const achievement = this.achievementsList.find(a => a.id === achievementId);
            if (achievement) {
                this.coins += achievement.reward;
                alert(`🎉 Achievement Unlocked!\n${achievement.name}\n+${achievement.reward} coins!`);
                this.updateUI();
                this.saveGameState();
            }
        }
    }

    // Show achievements modal
    showAchievements() {
        const achievementsList = document.getElementById('achievements-list');
        achievementsList.innerHTML = '';

        this.achievementsList.forEach(achievement => {
            const unlocked = this.achievements.includes(achievement.id);
            const achievementDiv = document.createElement('div');
            achievementDiv.className = `achievement-item ${unlocked ? 'unlocked' : 'locked'}`;
            
            achievementDiv.innerHTML = `
                <div class="achievement-icon">${unlocked ? achievement.icon : '🔒'}</div>
                <div class="achievement-info">
                    <div class="achievement-name">${achievement.name}</div>
                    <div class="achievement-description">${achievement.description}</div>
                </div>
                <div class="achievement-reward">
                    ${unlocked ? '✓' : `+${achievement.reward}`}
                    ${unlocked ? '' : '<i class="fas fa-coins"></i>'}
                </div>
            `;

            achievementsList.appendChild(achievementDiv);
        });

        document.getElementById('achievements-modal').style.display = 'flex';
    }

    // Play math mini-game
    playMathGame() {
        const num1 = Math.floor(Math.random() * 20) + 1;
        const num2 = Math.floor(Math.random() * 20) + 1;
        const operations = ['+', '-', '×'];
        const operation = operations[Math.floor(Math.random() * operations.length)];
        
        let answer;
        let question;
        if (operation === '+') {
            answer = num1 + num2;
            question = `${num1} + ${num2}`;
        } else if (operation === '-') {
            answer = Math.max(num1, num2) - Math.min(num1, num2);
            question = `${Math.max(num1, num2)} - ${Math.min(num1, num2)}`;
        } else {
            answer = num1 * num2;
            question = `${num1} × ${num2}`;
        }
        
        const userAnswer = prompt(`Quick Math Challenge!\n\nWhat is ${question}?`);
        
        if (userAnswer !== null) {
            if (parseInt(userAnswer) === answer) {
                this.coins += 10;
                this.learningProgress = Math.min(100, this.learningProgress + 2);
                this.showPetMessage('Great job!');
                alert('Correct! You earned 10 coins! 🎉');
                this.updateUI();
                this.saveGameState();
            } else {
                alert(`Not quite! The answer was ${answer}. Try again!`);
                this.showPetMessage('Keep practicing!');
            }
        }
    }

    // Game loop for passive stat decay
    startGameLoop() {
        setInterval(() => {
            // Very slow decay - 1 point every 5 minutes of active play
            // This is intentionally very low maintenance
            const decayAmount = 0.05; // Will take ~33 hours to go from 100 to 0
            
            this.happiness = Math.max(0, this.happiness - decayAmount);
            this.hunger = Math.max(0, this.hunger - decayAmount);
            this.energy = Math.max(0, this.energy - decayAmount);
            
            this.updateUI();
            
            // Save every 5 minutes
            if (Math.random() < 0.01) {
                this.saveGameState();
            }
        }, 60000); // Every minute
    }
}

// Initialize the pet system when page loads
let petSystem;
document.addEventListener('DOMContentLoaded', () => {
    petSystem = new InnerCentsPet();
});

// Expose function for demo pages to award coins
function awardLessonCoins(lessonId) {
    if (petSystem && petSystem.completeLesson(lessonId)) {
        return true;
    }
    return false;
}
