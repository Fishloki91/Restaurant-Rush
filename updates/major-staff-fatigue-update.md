# Restaurant Rush - v1.7.0 Update

## Major Feature: Staff Fatigue & Morale System

Keep your team happy and rested! Staff now experience fatigue as they work and their morale affects their performance. Manage your team's well-being to maintain peak efficiency.

**What Changed:**
- **Fatigue mechanics** - Staff build up fatigue (0-100%) while working on orders, reducing their efficiency
- **Morale system** - Staff morale (0-100%) is affected by fatigue and performance, creating a feedback loop
- **Rest functionality** - Send tired staff on breaks to rapidly recover fatigue and prevent burnout
- **Dynamic efficiency** - Staff efficiency adjusts in real-time based on fatigue and morale levels
- **Visual indicators** - Color-coded fatigue and morale bars on each staff card (green/yellow/red)

**How It Works:**
- Working staff gain 0.5% fatigue per second (30% per minute)
- Idle staff lose 0.3% fatigue per second (passive recovery)
- Resting staff lose 2.0% fatigue per second (rapid recovery - returns to work at 10% fatigue)
- High fatigue (>80%) decreases morale over time
- Low fatigue (<20%) with good performance (>80%) increases morale
- Fatigue can reduce efficiency by up to 50%
- Morale affects efficiency between 50-100% of base value

**Strategy Tips:**
- Monitor staff fatigue levels and send them to rest before they burn out
- Balance workload across your team to prevent any one staff member from overworking
- High morale staff work more efficiently, helping complete orders faster
- Exhausted staff with low morale can significantly slow down your restaurant

The new system adds depth to team management while encouraging strategic rest breaks!

## Quality of Life Improvements

### 1. Keyboard Shortcuts Display Panel (QOL1)
Never forget your shortcuts again! A dedicated help panel shows all available keyboard controls at a glance.

**Features:**
- New "⌨️ Shortcuts" button in the control panel
- Beautiful modal with all 7 keyboard shortcuts listed
- Clean grid layout with visual key indicators
- Styled keyboard keys in warm theme colors
- Easy to access, easy to dismiss
- Perfect for new players and quick reference

**Available Shortcuts:**
- **P** - Pause/Resume game
- **O** - Generate new order
- **R** - Restock all inventory
- **A** - Toggle auto-assign
- **S** - Toggle sound
- **ESC** - Return to overview
- **?** - Show shortcuts hint

Makes learning the game faster and more intuitive!

### 2. Order Completion Sound Effects (QOL2)
Hear your success! Audio feedback now plays when orders are completed or failed, adding satisfying sensory confirmation to your actions.

**Features:**
- Pleasant three-note ascending chime (C-E-G) for successful order completion
- Descending error tone for failed orders
- Built with Web Audio API for crisp, low-latency sounds
- Respects the existing sound toggle setting
- No external audio files required
- Lightweight and performant

**Sound Details:**
- Success: 0.4s ascending chord at moderate volume
- Failure: 0.3s descending sawtooth wave
- Both sounds fade out smoothly
- AudioContext automatically resumes on game start

Adds immediate feedback and makes order completion more rewarding!

### 3. Revenue Trend Indicator (QOL3)
Track your performance day-to-day! The revenue display now shows trend arrows and percentage changes from the previous day.

**Features:**
- Green ▲ arrow with percentage for revenue increases
- Red ▼ arrow with percentage for revenue decreases
- Gray ━ indicator for no change
- Automatically calculated between days
- Displayed right next to your revenue in the header
- Compact 0.8rem font size to not clutter the UI

**How It Works:**
- Compares current day's starting revenue to previous day's
- Calculates percentage change: ((current - previous) / previous) × 100
- Shows starting from Day 2 onwards
- Updates when continuing to the next day
- Helps identify performance trends over time

Know immediately if you're improving or need to adjust strategy!

---

These updates make Restaurant Rush more strategic and engaging while providing better feedback and quality of life improvements for managing your growing restaurant empire!
