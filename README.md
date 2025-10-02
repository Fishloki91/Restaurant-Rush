# Restaurant Rush 🍽️

A fast-paced restaurant management game where you oversee multiple aspects of a busy restaurant from a central dashboard. Make quick decisions to keep customers happy, staff efficient, and profits up!

## Game Overview

Players are the manager of a busy restaurant. They must oversee multiple aspects of the operation from a central dashboard, making decisions quickly to keep customers happy, staff efficient, and profits up. As the game progresses, the restaurant grows more complex, with more tables, orders, and challenges.

## Features

### 🎮 Core Game Mechanics

- **Real-time Order Management**: Handle incoming customer orders with countdown timers
- **Staff Assignment System**: Assign orders to available staff members based on their efficiency
- **Dynamic Inventory Tracking**: Monitor ingredient stock levels that update as orders are fulfilled
- **Customer Satisfaction Metrics**: Track happy/unhappy customers and overall restaurant rating
- **Performance Monitoring**: View staff efficiency, performance, and order completion stats

### 📊 Interactive Dashboard

The dashboard provides real-time visibility into all aspects of restaurant operations:

#### Active Orders Section
- View all pending and in-progress orders
- Order countdown timers with visual warnings (yellow < 60%, red < 30%)
- Order details including items and total price
- Progress bars showing order completion status
- One-click order assignment to staff

#### Staff Management Section
- 4 staff members with varying efficiency levels:
  - Chef Mario (Head Chef) - 90% efficiency
  - Chef Lisa (Sous Chef) - 80% efficiency
  - Cook Tom (Line Cook) - 70% efficiency
  - Cook Sarah (Line Cook) - 70% efficiency
- Real-time status indicators (Available/Busy)
- Performance tracking (0-100%)
- Order completion counters

#### Inventory Section
- 8 ingredient types tracked in real-time:
  - Beef, Chicken, Fish, Vegetables, Pasta, Rice, Cheese, Tomatoes
- Color-coded stock levels:
  - Green (High): > 60%
  - Yellow (Medium): 30-60%
  - Red (Low): < 30%
- Visual stock bars
- One-click restock functionality ($50 cost)

#### Customer Satisfaction Section
- Gradient satisfaction meter (100% to 0%)
- Happy vs Unhappy customer counts
- Average wait time tracking
- Real-time feedback messages with star ratings
- Visual alerts for issues (staff shortages, order failures)

### 🎯 Game Systems

#### Order System
- Orders generate automatically during gameplay (40% chance every 5 seconds)
- Each order contains 1-3 dishes from a menu of 7 items:
  - Beef Steak ($25, 180s)
  - Chicken Pasta ($18, 120s)
  - Grilled Fish ($22, 150s)
  - Vegetable Stir Fry ($15, 90s)
  - Chicken Rice Bowl ($16, 100s)
  - Cheese Pizza ($14, 120s)
  - Pasta Primavera ($17, 110s)
- Orders have time limits with buffer time added
- Failed orders (timeout) decrease satisfaction by 10 points
- Completed orders increase revenue and satisfaction by 2 points

#### Staff Performance System
- Efficiency affects order completion speed
- Performance degrades with failed orders (-5%)
- Performance improves with completed orders (+2%)
- Performance gradually recovers when idle (+0.5%/second)
- Staff can only handle one order at a time

#### Inventory Management
- Ingredients consumed when orders are assigned
- System prevents orders when insufficient stock
- Restock costs $50 and replenishes all ingredients to max
- Different max capacities for different ingredients

#### Customer Satisfaction System
- Starts at 100%
- Decreases with failed orders (-10 points)
- Increases with completed orders (+2 points)
- Gradually decreases when queue exceeds 5 orders (-0.5%/second)
- Overall rating calculated from happy/unhappy customer ratio (0.0 - 5.0)

## How to Play

### Getting Started
1. Open `index.html` in a web browser
2. Click **"Start Game"** to begin
3. Orders will start appearing automatically

### Managing Orders
1. **Assign Orders**: Click the "Assign" button on any pending order
   - System automatically assigns to the most efficient available staff
   - Ingredients are deducted from inventory immediately
   - Order status changes to "In Progress"

2. **Auto-Assignment**: Orders nearing timeout (< 30% time remaining) are automatically assigned if staff is available

3. **Monitor Progress**: Watch the progress bar fill as staff works on orders

### Managing Resources
- **Restock Inventory**: Click "Restock All" button when ingredients run low (costs $50)
- **Balance Workload**: Try to keep all staff busy but don't overwhelm them
- **Watch Timers**: Prioritize orders with less time remaining

### Game Controls
- **Start Game**: Begin the simulation
- **Pause**: Freeze the game (or Resume to continue)
- **Generate Order**: Manually create a new order for testing

### Winning Strategy
- Assign orders quickly to avoid timeouts
- Keep staff busy to maximize revenue
- Monitor inventory levels and restock proactively
- Balance order assignment across all staff members
- Prioritize orders with shorter time limits

## Technical Details

### Files Structure
```
Restaurant-Rush/
├── index.html      # Main HTML structure and dashboard layout
├── styles.css      # Responsive styling and animations
├── game.js         # Game logic, state management, and mechanics
└── README.md       # This file
```

### Technologies Used
- Pure HTML5, CSS3, and JavaScript (no external dependencies)
- Responsive design with CSS Grid and Flexbox
- Real-time DOM updates for interactive gameplay
- Event-driven architecture

### Browser Compatibility
- Modern browsers (Chrome, Firefox, Safari, Edge)
- Requires JavaScript enabled
- Responsive design adapts to different screen sizes

## Game Metrics Tracked

- **Day**: Current game day (placeholder for future progression)
- **Revenue**: Total money earned from completed orders
- **Overall Rating**: 0.0 - 5.0 based on customer satisfaction
- **Active Orders**: Number of orders currently pending or in-progress
- **Staff Count**: Total staff members (4)
- **Happy/Unhappy Customers**: Running totals
- **Average Wait Time**: Mean order completion time

## Future Enhancements

Potential additions for expanded gameplay:
- Day/night cycle progression
- Difficulty levels
- Staff hiring and upgrades
- Restaurant expansion
- Special events and challenges
- Leaderboards and achievements
- Save/load game state
- Sound effects and music

## License

This project is open source and available for educational purposes.
