# InnerCents Pet Reward System

## Overview
A low-maintenance, Tamagotchi-style virtual pet reward system designed to motivate K-12 students to complete financial literacy lessons and activities. The system uses an in-game currency ("InnerCents Coins") similar to a simplified Roblox-style economy.

## Features

### 1. Virtual Pet System
- **Pet Evolution**: 3 stages (Baby 🐣 → Teen 🐥 → Adult 🦜)
- **Pet Stats**: Happiness, Hunger, Energy, and Learning Progress
- **Low Maintenance**: Stats decay very slowly (~1 point per hour), allowing students to take breaks without penalty
- **Visual Feedback**: Pet displays different moods based on stats and shows speech bubbles

### 2. Currency System
- **InnerCents Coins**: Virtual currency earned through learning
- **Starting Balance**: 100 coins for new players
- **Earning Methods**:
  - Complete demo lessons: 50 coins each
  - Daily login bonus: 20 coins per day
  - Achievements: 20-200 coins depending on achievement
  - Math mini-game: 10 coins per correct answer

### 3. Shop System
Four categories of purchasable items:

#### Food Items
- Apple (10 coins): +20 hunger
- Pizza Slice (20 coins): +30 hunger, +10 happiness
- Cake (30 coins): +25 hunger, +20 happiness
- Sushi (40 coins): +35 hunger, +15 happiness
- Ice Cream (25 coins): +15 hunger, +30 happiness

#### Toys
- Ball (15 coins): +20 happiness, -10 energy
- Teddy Bear (30 coins): +25 happiness
- Video Game (50 coins): +35 happiness, -15 energy
- Kite (20 coins): +30 happiness, -5 energy
- Puzzle (25 coins): +20 happiness, +5 learning progress

#### Accessories
- Party Hat (40 coins): Cosmetic
- Cool Sunglasses (35 coins): Cosmetic
- Crown (100 coins): Cosmetic
- Bow Tie (30 coins): Cosmetic

#### Backgrounds
- Forest (60 coins): Green forest scene
- Ocean (60 coins): Blue ocean view
- Sunset (75 coins): Orange/yellow sunset
- Space (100 coins): Purple space theme

### 4. Achievement System
9 achievements to unlock:

1. **First Pet!** (50 coins): Adopt your first pet
2. **First Meal** (20 coins): Feed your pet for the first time
3. **Growing Up** (100 coins): Evolve to Teen stage
4. **All Grown Up** (200 coins): Evolve to Adult stage
5. **Scholar** (50 coins): Complete your first lesson
6. **Dedicated Learner** (150 coins): Complete 5 lessons
7. **Coin Collector** (100 coins): Earn 500 total coins
8. **Ultimate Happiness** (75 coins): Reach 100 happiness
9. **Shopaholic** (150 coins): Buy 10 items from the shop

### 5. Pet Interactions
- **Feed**: Costs 10 coins, increases hunger and happiness
- **Play**: Costs 5 coins, increases happiness, decreases energy
- **Rest**: Free, restores energy

### 6. Mini-Games
- **Quick Math Challenge**: Solve arithmetic problems (addition, subtraction, multiplication) to earn bonus coins

### 7. Lesson Integration
Demo pages can integrate with the reward system using the `lesson-completion.js` script:

```html
<script src="lesson-completion.js"></script>
<script>
    setupLessonCompletion('unique-lesson-id');
</script>
```

## Technical Details

### Data Persistence
All game data is stored in browser localStorage:
- Coins and stats
- Pet stage and name
- Owned items and completed lessons
- Unlocked achievements
- Last visit timestamp
- Current background selection

### Low Maintenance Design
- **Slow Stat Decay**: ~0.05 points per minute when page is active
- **Offline Calculation**: When returning, stats are reduced by 1 point per hour offline
- **No Penalties**: Pet never dies or runs away
- **Flexible Play**: Students can take breaks without worry

### File Structure
```
reward-system.html          # Main pet page
reward-system.css          # Styling for reward system
reward-system.js           # Game logic and state management
lesson-completion.js       # Reusable lesson integration script
```

### Browser Compatibility
- Works in all modern browsers (Chrome, Firefox, Safari, Edge)
- Requires JavaScript and localStorage support
- Mobile responsive design

## Usage Guide

### For Students
1. Visit the "My Pet" page from the navigation menu
2. Complete the welcome tutorial
3. Complete lessons to earn coins
4. Use coins to care for your pet and buy items
5. Watch your pet evolve as you learn!

### For Educators
The reward system:
- Motivates lesson completion
- Provides visual progress tracking
- Rewards consistent learning
- Maintains engagement without being distracting
- Works independently - no teacher management needed

## Customization Options

### Adding New Lessons
Edit demo pages to include the completion button and script integration.

### Adding Shop Items
Edit `reward-system.js` and add items to the `shopItems` object with properties:
- `id`: Unique identifier
- `name`: Display name
- `price`: Cost in coins
- `icon`: Emoji/icon to display
- `effect`: Object with stat modifications

### Adding Achievements
Edit the `achievementsList` array in `reward-system.js` with:
- `id`: Unique identifier
- `name`: Achievement name
- `description`: What to do to unlock
- `reward`: Coins awarded
- `icon`: Emoji/icon
- `condition`: Function to check if unlocked

## Future Enhancement Ideas

1. **Pet Customization**: Allow students to name their pets
2. **Multiple Pets**: Unlock additional pet types
3. **Leaderboards**: Compare progress with classmates
4. **Special Events**: Seasonal items and challenges
5. **Parent Dashboard**: View student progress
6. **More Mini-Games**: Educational games for different subjects
7. **Trading System**: Exchange items with classmates
8. **Pet Accessories**: Visible cosmetic items on pet
9. **Story Mode**: Unlock story chapters through learning

## Maintenance Notes

### Resetting Student Data
Students can reset their pet by clearing browser localStorage or using browser developer tools to delete the `innerCentsPetState` key.

### Backup System
Consider implementing a cloud save system for students who use multiple devices.

### Analytics Integration
Track which lessons students complete most and adjust curriculum accordingly.

## Credits
Created for InnerCents - K-12 Financial Literacy Education
Designed to motivate students through gamification while maintaining focus on learning objectives.
