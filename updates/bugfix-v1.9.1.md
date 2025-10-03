# Restaurant Rush - v1.9.1 Bugfix

## Fixed Issues

### Bug #1: Staff Order History Not Initialized
Fixed a critical bug where the initial four staff members (Chef Mario, Chef Lisa, Cook Tom, and Cook Sarah) did not have their order history arrays initialized. This caused JavaScript errors when orders were completed, preventing the recent orders feature from working properly for the starting staff.

**Impact:** Players would see console errors and the "Recent Orders" section would not display for initial staff members when they completed orders.

**Solution:** Added `orderHistory: []` initialization to all staff members created in the `initializeStaff()` function to match the initialization in `generateRandomStaff()`.

### Bug #2: Incorrect Achievement Count Display
Fixed a minor display inconsistency where the achievements badge showed "0 / 19 Unlocked" but the game only has 18 achievements defined.

**Impact:** Cosmetic issue that could confuse players about the total number of achievements available.

**Solution:** Updated the hardcoded achievement count in index.html from 19 to 18 to match the actual number of achievements in the game.

## Technical Details

**Files Modified:**
- `game.js` - Added orderHistory initialization to initializeStaff() function
- `index.html` - Updated achievement count from 19 to 18

**Testing:**
Both fixes have been tested and verified:
- Staff members now properly track their recent orders without errors
- Achievement badge displays the correct total count
- All existing functionality remains intact
