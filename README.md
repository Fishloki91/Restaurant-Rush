# Restaurant Rush - Game Summary

**Restaurant Rush** is a real-time restaurant management simulation game where players act as a restaurant manager, overseeing all operations from a central dashboard to keep customers satisfied and profits flowing.

## 🎯 Core Gameplay
- **Real-time management**: Handle incoming orders with countdown timers
- **Staff coordination**: Hire and manage staff members with random efficiency levels (60-90%)
- **Resource management**: Monitor and restock 18 ingredient types when supplies run low
- **Customer satisfaction**: Maintain high ratings by completing orders on time
- **Daily progression**: Complete 3-minute business days with performance summaries

## 🎮 Key Features
- **Employee of the Month System** with dynamic leaderboards, weekly challenges, rewards, and Hall of Fame
- **Achievement System** with 18 unique milestones tracking orders, revenue, staff, survival, and excellence
- **Dynamic Order Generation** that adapts to time of day and available staff for realistic business flow
- **Toast Notification System** with colorful notifications for important events (success, warning, error, info, achievement)
- **Dynamic Staff Hiring** system to expand your team with randomly-generated employees
- **Equipment Upgrades** to boost cooking speed, reduce waste, increase prices, and lower fatigue
- **End-of-Day Summaries** with detailed performance metrics, bonus rewards, and shift transition penalties
- **Multi-View Navigation** with dedicated screens for each management area and smooth transitions
- **Interactive Dashboard** with quick-stat overview cards and visual notification alerts
- **Order System** with intelligent generation, time-sensitive completion, and assigned staff tracking
- **Staff Performance** tracking with efficiency ratings, workload management, upgrades, and order history
- **Inventory Management** with color-coded stock levels, usage tracking, and one-click restocking
- **Satisfaction Metrics** including customer feedback and restaurant ratings
- **Mobile-Optimized** with tap tooltips, centralized tooltip display, haptic feedback, and achievement toast notifications
- **Game Over Detection** when funds run out with final statistics display

## 🎲 Game Mechanics
- Starting revenue of $200 to begin your restaurant journey
- Dynamic order generation based on time of day (early/mid/rush) and available staff
- 50+ different recipes across appetizers, mains, desserts, and drinks ranging from $6-$45
- 18 unique ingredients including premium items like shrimp, avocado, and chocolate
- Staff efficiency affects order speed; performance changes based on success/failure
- Failed orders hurt satisfaction (-10 points), completed orders boost it (+2 points)
- Ingredients are consumed when orders are assigned, requiring strategic restocking ($50 cost)
- Hire new staff members for $150 with random efficiency stats (60-90%)
- Upgrade staff up to Level 3 for increased efficiency
- Upgrade equipment (Stove, Fridge, Counter, Dishwasher) to boost restaurant performance
- Auto-assign mode with smart auto-rest for fatigued staff
- Each day lasts 3 minutes with 10% end-of-day revenue bonus
- Staff needs and orders reset at the start of each new day
- Unfinished assigned orders incur penalties based on incomplete progress at day's end
- Employee of the Day crowned every in-game day with performance bonuses and Hall of Fame entry
- Weekly challenges with bonus rewards for completion
- Tips system based on order completion speed (15% bonus for fast service)
- Game over occurs when revenue reaches $0 or below

## 🎯 Objective
Balance quick order fulfillment, staff workload, inventory management, and customer satisfaction to maximize revenue and maintain a high restaurant rating. Strategically hire and upgrade staff to handle increasing difficulty. Invest in equipment upgrades to boost your restaurant's efficiency. Survive as many days as possible while growing your restaurant empire!

**Tech Stack**: Pure HTML5/CSS3/JavaScript with responsive design
**Play Style**: Real-time strategy with resource management elements
**Display**: Optimized for 1920x1080 screens with no scrolling

## Updates

### v3.1.0 - Gameplay & QOL Improvements
**Major Features:**
- **Enhanced toast notification system** - Colorful toast notifications for all important game events (success, warning, error, info, achievement) with smooth animations
- **2x faster order completion** - Order progress multiplier increased from 1.5x to 3.0x for better pacing with 4 staff members
- **Centralized mobile tooltips** - All tooltips now appear in a single centered location at the bottom of the screen on mobile devices for better readability
- **Smart priority order logic** - Staff already working on priority orders won't be reassigned to another priority order
- **Employee of the Day** - Employee recognition now updates daily instead of every 30 days for faster-paced progression
- **Dynamic starting staff** - Always start with 4 randomly-generated staff members instead of hardcoded preset team for unique gameplay every time

///

### v3.0.0 - Employee of the Month
**Major Feature:** Employee of the Month system - Transform staff management into a competitive, rewarding experience! Track staff performance through dynamic leaderboards that update in real-time. Top performers earn unique titles (Tip Master, Speed Demon, Order Champion, Reliable Star) and a +20% efficiency bonus for the month. Weekly challenges (fastest order, highest tips, most orders, perfectionist streak, team player) add variety and bonus points. Staff now earn tips based on speed (15% bonus for completing orders in under 75% of expected time). Winners are immortalized in the Hall of Fame with their achievements preserved forever. Every 30 in-game days brings a new month, new challenges, and a new champion!

**Detailed Features:**
- **Dynamic Leaderboard** - Real-time top 3 podium with gold/silver/bronze styling, full staff rankings, and comprehensive scoring based on orders, revenue, tips, efficiency, performance, morale, and speed
- **Reward System** - +20% efficiency bonus for Employee of the Month, unique titles, crown badge, and prominent display on staff cards
- **Weekly Challenges** - 5 challenge types rotating weekly with progress tracking, visual progress bars, and 50-point bonuses for completion
- **Hall of Fame** - Persistent recognition of past winners with detailed historical records displayed in golden trophy cards
- **Enhanced Metrics** - Monthly tracking for orders, revenue, tips, and fastest completion times with visual displays throughout the game

///

### v2.1.0 - Dynamic Orders & Mobile QOL
**Major Features:**
- **Dynamic order system** - Orders now flow naturally with the day: fewer in early hours, steady mid-day, and rush hour volume at the end. More available staff = more orders!
- **Fresh start each day** - Staff needs (fatigue, morale, hunger) and all orders reset at the start of each new day for a clean slate.
- **Unfinished order penalties** - Assigned orders that aren't completed by day's end incur penalties based on their incomplete progress (e.g., 25% done = 75% penalty).
- **Mobile gameplay improvements** - Tap tooltips, locked horizontal scrolling, achievement toast notifications, and haptic feedback on supported devices.

**Configuration:**
- New `data/orders.json` file controls spawn rates, day progression multipliers, and staff scaling for easy customization

///
### v2.0.0 - Expanded Menu & Recipe System
**Major Feature:** Expanded menu & recipe system - Your restaurant just got a massive upgrade! Discover 10 new premium ingredients (mushrooms, spinach, shrimp, bacon, avocado, berries, chocolate, beans, chilies, cream) and unlock 40+ new dishes across appetizers, mains, desserts, and drinks. New categories include smoothies, specialty coffees, bubble tea, milkshakes, and mocktails. All recipes and ingredients now managed through a centralized data/recipes.json file for easier updates.

**Quality of Life Improvements:**
- **Smooth dashboard cards** - Replaced bouncing hover animation with elegant glow effect for a calmer, more professional feel
- **Smart auto-rest system** - Staff with high fatigue (>70%) automatically rest after completing orders when auto-assign mode is enabled
- **Enhanced dashboard stats** - Overview cards now display multiple stats at a glance (total/urgent/VIP orders, available/busy/resting staff, total/low/empty inventory) with detailed tooltips explaining each section
///

### v1.9.1 - Bugfix Release
Fixed staff order history tracking for initial employees and corrected achievement count display. Starting staff members now properly show their recent completed orders, and the achievements screen accurately displays 18 total achievements.
///

### v1.9.0 - Achievement & Milestone System
**Major Feature:** Achievement & Milestone System - Track your restaurant management prowess with 18 unique achievements across 7 categories! Unlock badges for order completion (First Steps to Master Chef), revenue milestones ($500 to $5,000), staff hiring, survival days, perfect service, VIP customers, and equipment upgrades. Real-time progress tracking with visual progress bars and instant notifications.

**Quality of Life Improvements:**
- **Revenue forecast indicator** - See projected end-of-day revenue in the revenue tooltip based on current earning pace, including the 10% bonus
- **Staff performance history** - Track last 5 orders for each staff member with success/failure indicators and revenue earned
- **Restock tracking** - Automatic tracking of inventory restocks for future achievement integration

### v1.8.0 - Equipment Upgrade System
**Major Feature:** Equipment upgrade system - Invest in professional-grade equipment! Upgrade your Stove (faster cooking), Fridge (reduced waste), Counter (higher prices), and Dishwasher (less fatigue). Each upgrades up to Level 3 with cumulative bonuses that transform your restaurant's efficiency.

**Quality of Life Improvements:**
- **Quick stats tooltips** - Hover over header stats (Day, Revenue, Rating) for detailed breakdowns with progress, gains, and customer feedback
- **Ingredient usage tracker** - See which ingredients are currently in demand with usage badges (🍽️) showing active order count
- **Staff efficiency badges** - Visual performance indicators (⭐⭐⭐/⭐⭐/⭐/⚠️) instantly identify your best performers and staff needing rest

### v1.7.0 - Staff Fatigue & Morale System
**Major Feature:** Staff fatigue & morale system - Keep your team happy and rested! Staff now experience fatigue as they work (0-100%), and their morale affects performance. Send tired staff on breaks to rapidly recover fatigue and maintain peak efficiency.

**Quality of Life Improvements:**
- **Keyboard shortcuts display panel** - Dedicated help modal showing all 7 keyboard shortcuts with visual key indicators
- **Order completion sound effects** - Pleasant audio chimes for successful orders and error tones for failures using Web Audio API
- **Revenue trend indicator** - Track day-to-day performance with trend arrows (▲/▼) and percentage changes displayed in the header

### v1.6.0 - Warm Matte Theme Redesign
**Major Feature:** Warm matte theme redesign - A complete visual overhaul with warm earth tones (terracotta, burnt sienna, golden browns) and subtle matte texture effects for a more inviting, restaurant-like atmosphere. All UI elements now use the cohesive warm color palette with better contrast.

**Quality of Life Improvements:**
- **Smooth interactive transitions** - All buttons and interactive elements feature silky 0.3s ease transitions with seamless color shifts
- **Enhanced depth perception** - Multi-layered warm-toned shadows (2-8px range) that respond to interactions for better visual hierarchy
- **Hover scale animations** - Cards subtly lift (translateY -2px) with enhanced shadows on hover for immediate visual feedback

### v1.5.0 - Recipe Variety & Specialization System
**Major Feature:** Recipe unlock system - Expand your menu by unlocking 8 premium recipes (up to $45 value!) as you complete orders. Staff gain a 15% efficiency bonus when cooking dishes matching their specialty category (Italian, Asian, Grill, etc.).

**Quality of Life Improvements:**
- **Recipe Book view** - Browse all available and locked recipes with unlock requirements and progress tracking
- **Staff specialization indicators** - "✨ Best:" hints on orders show which staff have matching specialties for optimal assignments
- **Order priority marking** - Flag important orders with ⚡ priority button to keep them at the top of your queue

### v1.4.0 - VIP Customer System
**Major Feature:** VIP customer system - Serve high-value VIP customers with 50% higher rewards but 20% stricter deadlines! VIP orders are visually distinct with gold styling and ⭐ badges, and have greater impact on satisfaction.

**Quality of Life Improvements:**
- **Order queue management** - Maximum of 8 active orders to prevent overwhelming situations
- **Staff performance indicators** - Color-coded performance bars (green/yellow/red) on staff cards for instant visual feedback
- **Individual item restocking** - Restock specific ingredients for $10 instead of buying everything for $50

### v1.3.0 - Staff Hiring & Daily Progression System
**Major Features:**
- **Staff hiring system** - Hire new employees for $150 with randomly-generated names, roles, and efficiency stats (60-90%)
- **Random staff stats** - All staff now start with randomized efficiency for variety and replay value
- **End-of-day summaries** - Detailed performance reports at the end of each 3-minute day with revenue breakdown, customer statistics, and continue button

**Quality of Life Improvements:**
- **Assigned staff display** - Active orders now show which staff member is working on them
- **Game over detection** - Proper game over screen when revenue reaches $0 with final statistics
- **1920x1080 optimization** - Dashboard perfectly fits full HD screens with no scrolling required

### v1.2.0 - Multi-View Navigation System
**Major Feature:** Multi-view navigation system - No more scrolling! Navigate between dedicated views for Orders, Staff, Inventory, and Customer Satisfaction with smooth transitions and an overview dashboard.

**Quality of Life Improvements:**
- Quick stats overview cards - See key metrics at a glance on the main dashboard
- Visual notification badges - Prominent alerts for urgent orders and low inventory
- ESC key quick navigation - Press ESC to instantly return to overview from any view

### v1.1.0 - Staff Upgrade System
**Major Feature:** Staff upgrade system - Invest in your team! Upgrade staff members up to Level 3 to boost their efficiency by 5% per level, helping you handle busier days.

**Quality of Life Improvements:**
- Auto-assign toggle - Automatically assign orders to available staff with one click
- Day progress bar - Visual indicator showing progress through the current day
- Keyboard shortcuts - Quick access to all major actions (P=Pause, O=Order, R=Restock, A=Auto-assign, S=Sound, ?=Help)

### v1.0.0 - Day Progression System
**Major Feature:** Day progression system with increasing difficulty - Your restaurant now advances through 3-minute business days with increasing order frequency and end-of-day bonuses.

**Quality of Life Improvements:**
- Sound control toggle button (framework ready for future audio features)
- Smart order sorting - urgent orders automatically prioritized at the top
- Enhanced visual feedback with hover tooltips on staff and inventory items
