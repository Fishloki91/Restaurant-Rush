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

## Major Feature 2: Fresh Start Each Day with Smart Penalties

Every new day brings a clean slate for your restaurant, but unfinished work has consequences!

**What Changed:**
- **Staff needs reset** - Fatigue, morale, and hunger all reset to fresh levels at the start of each day
- **All orders cleared** - The order queue clears completely when a new day begins
- **Staff status reset** - All staff return to 'available' status, ready to work the new shift
- **Progress-based penalties** - Unfinished assigned orders incur penalties based on incomplete work:
  - If an order is 25% complete, you pay 75% of the order total
  - If an order is 75% complete, you pay only 25% of the order total
  - Unassigned orders are cleared without penalty
- **Game over protection** - Penalties are applied before day advancement, triggering game over if revenue reaches $0

This adds strategic depth: assign orders wisely and ensure your team can complete their work before the day ends, or face financial consequences!

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
