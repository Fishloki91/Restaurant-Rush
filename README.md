# Restaurant Rush - Game Summary

**Restaurant Rush** is a real-time restaurant management simulation game where players act as a restaurant manager, overseeing all operations from a central dashboard to keep customers satisfied and profits flowing.

## 🎯 Core Gameplay
- **Real-time management**: Handle incoming orders with countdown timers
- **Staff coordination**: Hire and manage staff members with random efficiency levels (60-90%)
- **Resource management**: Monitor and restock 8 ingredient types when supplies run low
- **Customer satisfaction**: Maintain high ratings by completing orders on time
- **Daily progression**: Complete 3-minute business days with performance summaries

## 🎮 Key Features
- **Dynamic Staff Hiring** system to expand your team with randomly-generated employees
- **End-of-Day Summaries** with detailed performance metrics and bonus rewards
- **Multi-View Navigation** with dedicated screens for each management area and smooth transitions
- **Interactive Dashboard** with quick-stat overview cards and visual notification alerts
- **Order System** with automatic generation, time-sensitive completion, and assigned staff tracking
- **Staff Performance** tracking with efficiency ratings, workload management, and upgrades
- **Inventory Management** with color-coded stock levels and one-click restocking
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
- Each day lasts 3 minutes with 10% end-of-day revenue bonus
- Game over occurs when revenue reaches $0 or below

## 🎯 Objective
Balance quick order fulfillment, staff workload, inventory management, and customer satisfaction to maximize revenue and maintain a high restaurant rating. Strategically hire and upgrade staff to handle increasing difficulty. Survive as many days as possible while growing your restaurant empire!

**Tech Stack**: Pure HTML5/CSS3/JavaScript with responsive design
**Play Style**: Real-time strategy with resource management elements
**Display**: Optimized for 1920x1080 screens with no scrolling

## Updates

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
