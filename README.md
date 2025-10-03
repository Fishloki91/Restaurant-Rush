# Restaurant Rush - Game Summary

**Restaurant Rush** is a real-time restaurant management simulation game where players act as a restaurant manager, overseeing all operations from a central dashboard to keep customers satisfied and profits flowing.

## 🎯 Core Gameplay
- **Real-time management**: Handle incoming orders with countdown timers
- **Staff coordination**: Hire and manage staff members with random efficiency levels (60-90%)
- **Resource management**: Monitor and restock 8 ingredient types when supplies run low
- **Customer satisfaction**: Maintain high ratings by completing orders on time
- **Daily progression**: Complete 3-minute business days with performance summaries

## 🎮 Key Features
- **Achievement System** with 18 unique milestones tracking orders, revenue, staff, survival, and excellence
- **Dynamic Staff Hiring** system to expand your team with randomly-generated employees
- **Equipment Upgrades** to boost cooking speed, reduce waste, increase prices, and lower fatigue
- **End-of-Day Summaries** with detailed performance metrics and bonus rewards
- **Multi-View Navigation** with dedicated screens for each management area and smooth transitions
- **Interactive Dashboard** with quick-stat overview cards and visual notification alerts
- **Order System** with automatic generation, time-sensitive completion, and assigned staff tracking
- **Staff Performance** tracking with efficiency ratings, workload management, upgrades, and order history
- **Inventory Management** with color-coded stock levels, usage tracking, and one-click restocking
- **Satisfaction Metrics** including customer feedback and restaurant ratings
- **Game Over Detection** when funds run out with final statistics display

## 🎲 Game Mechanics
- Starting revenue of $200 to begin your restaurant journey
- Orders auto-generate every 5 seconds (40% base chance, increases with each day)
- 7 different dishes ranging from $14-$25 with varying completion times
- Staff efficiency affects order speed; performance changes based on success/failure
- Failed orders hurt satisfaction (-10 points), completed orders boost it (+2 points)
- Ingredients are consumed when orders are assigned, requiring strategic restocking ($50 cost)
- Hire new staff members for $150 with random efficiency stats (60-90%)
- Upgrade staff up to Level 3 for increased efficiency
- Upgrade equipment (Stove, Fridge, Counter, Dishwasher) to boost restaurant performance
- Each day lasts 3 minutes with 10% end-of-day revenue bonus
- Game over occurs when revenue reaches $0 or below

## 🎯 Objective
Balance quick order fulfillment, staff workload, inventory management, and customer satisfaction to maximize revenue and maintain a high restaurant rating. Strategically hire and upgrade staff to handle increasing difficulty. Invest in equipment upgrades to boost your restaurant's efficiency. Survive as many days as possible while growing your restaurant empire!

**Tech Stack**: Pure HTML5/CSS3/JavaScript with responsive design
**Play Style**: Real-time strategy with resource management elements
**Display**: Optimized for 1920x1080 screens with no scrolling

## Updates

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
