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

## Updates & Bugfixes

### v1.9.1 Bugfix (Latest)
- **Staff Order History Not Initialized:** Fixed missing `orderHistory` arrays for initial staff, preventing errors and ensuring recent orders display correctly.
- **Incorrect Achievement Count Display:** Updated achievement badge to show the correct total (18 achievements).
- *Files modified:* `game.js`, `index.html`