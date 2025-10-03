# Restaurant Rush

Restaurant Rush is a fast-paced restaurant management game where you oversee staff, inventory, customer satisfaction, and more. The game features dynamic data loading, real-time updates, and a modular codebase for easy expansion.

## Features

### Core Gameplay
- Dynamic staff, recipes, equipment, achievements, and challenges loaded from external JSON files
- Real-time dashboard with interactive cards for orders, staff, inventory, satisfaction, achievements, and more
- Weekly and monthly challenges, employee of the month, and achievement tracking
- Responsive UI with tooltips and accessibility features
- Modular code for easy updates and new content

### NEW: Perfect Loop Game Systems 🔄

#### Prestige & New Game+ System 👑
- **5 Prestige Levels** with permanent bonuses that carry across runs
- Track lifetime revenue and days played across all restaurant runs
- Each prestige level unlocks new starting bonuses: extra revenue, staff, recipe discovery rates, and more
- Build your culinary empire across multiple lifetimes!

#### Seasonal Cycles 🌸☀️🍂❄️
- **4 Dynamic Seasons** that rotate every 7 in-game days
- Each season affects ingredient availability and customer preferences
- Spring: Fresh vegetables, berries flourish
- Summer: Seafood abundance, light dishes preferred
- Autumn: Mushrooms, pasta, comfort food season
- Winter: Rich meats, desserts, hot drinks popular

#### Recipe Mastery System ✨
- Recipes improve with practice - cook the same dish repeatedly to master it
- **6 Mastery Levels**: Novice → Familiar → Competent → Skilled → Expert → Master
- Higher mastery = faster cooking, better quality, higher prices, fewer ingredients used
- Master-level recipes unlock special variations

#### Multi-Resource Economy ⭐
- **Reputation System**: Gain fame through successful orders and perfect days
- **6 Reputation Tiers**: Unknown → Local Favorite → Well Known → Acclaimed → Renowned → Legendary
- Reputation unlocks VIP customers, food critics, better prices, and new locations
- **Staff Loyalty**: Track individual staff devotion for teamwork bonuses

#### Dynamic Events System 🎪
- **10+ Random Events**: Health inspections, food critics, supply shortages, competitions, VIP reservations
- Events bring challenges and opportunities with rewards or penalties
- Seasonal events exclusive to specific seasons
- Adaptive difficulty based on your progression

#### Regular Customers 💼
- Build relationships with 5+ regular customer types
- Each has unique preferences, loyalty tiers, and special orders
- Regulars bring friends, write reviews, and unlock new features
- Customer loyalty grows with repeated visits

#### Restaurant Locations 🏙️
- **5 Unique Locations**: Downtown, Upscale District, Suburban, Waterfront, University Campus
- Each location has different customer types, price multipliers, and competition levels
- Unlock new locations through prestige and reputation

## How to Play
1. Start the game from the dashboard.
2. Manage orders, assign staff, track inventory, and keep customers happy.
3. Unlock achievements, upgrade equipment, and compete in challenges.
4. Use the dashboard cards to view details and manage each aspect of your restaurant.
5. **NEW**: Watch your reputation grow, master recipes, and unlock prestige levels!
6. **NEW**: Adapt to seasonal changes and tackle dynamic events for bonus rewards.

## Data Structure
- All game data (staff roles, recipes, achievements, equipment, challenges, UI strings) is loaded from the `/data` folder as JSON.
- No gameplay data is hardcoded in the HTML; everything updates dynamically.
- **NEW**: Additional data files for prestige, seasons, events, locations, recipe mastery, customers, skill trees, and relationships.

## Patch Notes

### v3.0.0 - Complete Game Loop Redesign (Latest) 🎮

**Perfect Loop Architecture:**
- **Prestige System**: 5 prestige levels with permanent bonuses across runs
- **Run History**: Track all restaurant runs with lifetime statistics
- **Season Cycles**: 4 seasons rotating every 7 days with unique modifiers
- **Recipe Mastery**: 6 levels of recipe progression through practice
- **Reputation Economy**: Multi-resource system beyond just money
- **Dynamic Events**: 10+ random events with challenges and rewards
- **Regular Customers**: 5+ customer types with loyalty progression
- **Location System**: 5 unique restaurant locations to unlock

**New Game Systems:**
- Recipe mastery improves with each completion (faster cooking, higher prices)
- Reputation gains from successful orders unlock new features
- Staff loyalty tracking with bonuses for devoted team members
- Perfect day bonuses for 100% satisfaction (reputation + loyalty rewards)
- Reputation-based revenue multipliers
- Seasonal ingredient modifiers affect prices and availability
- Random event triggers each day based on conditions

**UI Enhancements:**
- New header stats: Season, Reputation (with prestige when earned)
- 3 new overview cards: Active Events, Recipe Mastery, Prestige Progress
- Comprehensive tooltips for all new systems
- Dynamic visibility for prestige elements
- Season icons and modifier displays

**Data Architecture:**
- 9 new JSON configuration files for expanded systems
- Modular, event-driven architecture
- Clean state management for new resources
- Preserved prestige data across game restarts

*Files added:* `data/prestige.json`, `data/seasons.json`, `data/skill_trees.json`, `data/events.json`, `data/locations.json`, `data/resources.json`, `data/relationships.json`, `data/customers.json`, `data/recipe_mastery.json`

*Files modified:* `game.js`, `index.html`

---

### v2.0.0 - Major Gameplay & UX Overhaul

**Gameplay Balance:**
- **Staff Fatigue Rebalance:** Changed fatigue-to-performance ratio from 1:2 to 1:5, reducing max performance penalty from 50% to 20%. Staff now maintain better efficiency even when fatigued, making the game more forgiving while still encouraging rest management.

**Staff of the Day System:**
- **Score Calculation Fixed:** Staff of the Day scores are now only calculated at the end of each day, preventing score fluctuations during gameplay and providing more stable leaderboard rankings.
- **Visual Improvements:** Changed efficiency bonus displays from large bars to compact badge-style boxes for cleaner presentation.

**Customer Satisfaction Dashboard:**
- **Complete Overhaul:** Redesigned the satisfaction page into a comprehensive dashboard with:
  - Large visual satisfaction meter with emoji feedback
  - 8 key metrics in grid layout: Happy Customers, Unhappy Customers, VIP Served, Avg Wait Time, Success Rate, Today's Orders, Avg Order Value, and Performance Rating
  - Dynamic performance ratings (Excellent/Good/Average/Poor) based on multiple factors
  - Enhanced visual hierarchy and easier data scanning
  
**User Experience:**
- **Notification Management:** Toasts/notifications are now disabled when viewing menus or modals, preventing distractions during important decisions.
- **Reduced Visual Clutter:** Removed hover animations on cards for a calmer, more static interface while keeping button animations for interactive feedback.
- **Mobile Optimization:** 
  - Improved satisfaction dashboard layout for small screens (single column on mobile, 2 columns on tablets)
  - Better touch targets and readability
  - Streamlined menu system to avoid popup clutter

*Files modified:* `game.js`, `index.html`, `styles.css`

---

### v1.9.1 Bugfix
- **Staff Order History Not Initialized:** Fixed missing `orderHistory` arrays for initial staff, preventing errors and ensuring recent orders display correctly.
- **Incorrect Achievement Count Display:** Updated achievement badge to show the correct total (18 achievements).
- *Files modified:* `game.js`, `index.html`