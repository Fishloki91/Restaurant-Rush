# Restaurant Rush

Restaurant Rush is a fast-paced restaurant management game where you oversee staff, inventory, customer satisfaction, and more. The game features dynamic data loading, real-time updates, and a modular codebase for easy expansion.

## Features
- Dynamic staff, recipes, equipment, achievements, and challenges loaded from external JSON files
- Real-time dashboard with interactive cards for orders, staff, inventory, satisfaction, achievements, and more
- Weekly and monthly challenges, employee of the month, and achievement tracking
- Responsive UI with tooltips and accessibility features
- Modular code for easy updates and new content

## How to Play
1. Start the game from the dashboard.
2. Manage orders, assign staff, track inventory, and keep customers happy.
3. Unlock achievements, upgrade equipment, and compete in challenges.
4. Use the dashboard cards to view details and manage each aspect of your restaurant.

## Data Structure
- All game data (staff roles, recipes, achievements, equipment, challenges, UI strings) is loaded from the `/data` folder as JSON.
- No gameplay data is hardcoded in the HTML; everything updates dynamically.

## Patch Notes

### v2.0.0 - Major Gameplay & UX Overhaul (Latest)

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