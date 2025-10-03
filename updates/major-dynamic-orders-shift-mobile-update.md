# Restaurant Rush - v2.1.0 Update

## Major Feature 1: Dynamic Order System

Your restaurant now adapts to the flow of business throughout the day! Orders arrive at different rates depending on the time of day and your available staff.

**What Changed:**
- **Early shift (0-33% of day)** - Fewer orders arrive as customers are just starting to come in
- **Mid shift (33-66% of day)** - Steady flow of orders keeps your kitchen busy
- **Rush hour (66-100% of day)** - High volume of orders as the dinner rush hits!
- **Staff scaling** - More available staff = slightly more orders (each extra staff adds 8% to order frequency)
- **Day progression** - Each new day brings slightly more customers (up to a maximum)
- **Configurable** - All spawn rates and multipliers are controlled via `data/orders.json` for easy tuning

The game now feels more realistic with natural ebbs and flows throughout each business day, rewarding you for keeping staff available and ready to work!

## Major Feature 2: Shift Transition Behavior

End-of-day transitions now have real consequences! Your management decisions carry over between shifts.

**What Changed:**
- **Staff needs carry over** - Fatigue, morale, and hunger persist between days, so take care of your team!
- **Unfinished assigned orders** - Any orders that were assigned to staff but not completed incur a **5% revenue penalty per order**
- **Unassigned orders cleared** - Orders that were never assigned don't carry penalties and are cleared at end of day
- **Strategic management** - You must now balance accepting orders with your team's capacity to complete them

This adds a layer of strategy: assign orders carefully and ensure your staff can handle their workload before the day ends!

## Major Feature 3: Mobile Gameplay QOL Improvements

Restaurant Rush is now more mobile-friendly than ever!

**What's New:**
- **Tap tooltips** - On mobile devices, tap any card with a tooltip to view helpful information (tap outside to close)
- **No horizontal scrolling** - Main dashboard is now locked to prevent annoying horizontal scrolling on mobile
- **Achievement toasts** - Beautiful golden toast notifications slide in from the top-right when you unlock achievements
- **Haptic feedback** - Feel the game respond on supported mobile devices:
  - Light haptic when assigning orders
  - Medium haptic when completing orders, hiring staff, or upgrading
  - Heavy haptic when orders fail

These improvements make the mobile experience smooth, intuitive, and satisfying!

---

**Version:** v2.1.0
**Release Date:** January 2025
**Files Modified:** `game.js`, `styles.css`, `data/orders.json` (new)
