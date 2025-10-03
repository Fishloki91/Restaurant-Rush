# Restaurant Rush - v2.0.0 Update

## Major Feature: Expanded Menu & Recipe System

Your restaurant just got a massive menu expansion! Discover 10 new premium ingredients and unlock over 40 new dishes and drinks as you grow your business.

**New Ingredients Added:**
- 🍄 Mushrooms - Perfect for risottos and gourmet dishes
- 🥬 Spinach - Fresh and healthy for salads and sides
- 🦐 Shrimp - Premium seafood for upscale entrees
- 🥓 Bacon - Everyone's favorite! Great for breakfast and burgers
- 🥑 Avocado - Trendy and delicious for modern cuisine
- 🫐 Berries - Sweet and colorful for desserts and drinks
- 🍫 Chocolate - Rich and decadent for desserts
- 🫘 Beans - Hearty and filling for comfort food
- 🌶️ Chilies - Spicy kick for bold flavors
- 🥛 Cream - Essential for desserts and specialty drinks

**New Food Categories:**

### Appetizers (5 new dishes)
Start your customers off right with delicious starters:
- Bruschetta ($12) - Classic Italian starter
- Stuffed Mushrooms ($14) - Savory and indulgent
- Shrimp Cocktail ($16) - Elegant seafood appetizer
- Spinach Artichoke Dip ($13) - Creamy crowd-pleaser
- Bacon-Wrapped Dates ($15) - Sweet and savory combo

### Mains (14 new dishes)
Expand your menu with exciting new entrees:
- Mushroom Risotto ($22) - Creamy Italian comfort food
- Spinach Stuffed Chicken ($26) - Healthy and delicious
- Garlic Butter Shrimp ($24) - Quick and flavorful seafood
- Bacon Cheeseburger ($19) - Classic American favorite
- Avocado Toast Deluxe ($17) - Modern breakfast/brunch hit
- Spicy Chili Con Carne ($21) - Hearty Mexican classic
- Shrimp Pad Thai ($23) - Popular Asian noodle dish
- Mushroom Bacon Pasta ($20) - Rich and satisfying
- Plus more premium options!

### Desserts (5 new treats)
Sweet endings for every meal:
- Chocolate Lava Cake ($12) - Warm, gooey, irresistible
- Berry Cheesecake ($14) - Classic creamy dessert
- Chocolate Mousse ($11) - Light and elegant
- Berry Tart ($13) - Fresh and fruity
- Chocolate Strawberry Parfait ($15) - Layered perfection

### Drinks (15 new beverages)
Quench your customers' thirst with variety:

**Smoothies** - Healthy and refreshing
- Berry Blast Smoothie ($8)
- Tropical Smoothie ($8)
- Green Power Smoothie ($9)

**Specialty Coffees** - Premium café experience
- Cappuccino ($6)
- Mocha ($7)
- Caramel Macchiato ($7)

**Bubble Tea** - Trendy Asian-inspired drinks
- Classic Bubble Tea ($7)
- Taro Bubble Tea ($8)
- Matcha Bubble Tea ($8)

**Milkshakes** - Classic American treats
- Chocolate Milkshake ($9)
- Berry Milkshake ($9)
- Cookies & Cream Shake ($10)

**Mocktails** - Sophisticated non-alcoholic beverages
- Virgin Mojito ($7)
- Strawberry Lemonade ($6)
- Tropical Paradise ($8)

**Data Management:**
All recipes and ingredients are now stored in a centralized `data/recipes.json` file for easier management and future updates!

## Quality of Life Improvements

### 1. Smooth Dashboard Experience (QOL1)
Say goodbye to jumpy cards! Dashboard cards now feature a subtle glow effect when you hover over them instead of bouncing on every screen refresh.

**What Changed:**
- Replaced bouncing animation with smooth glow and brightness effect
- Cards now glow with warm terracotta lighting on hover
- Background brightens slightly for better focus
- Smoother, more professional feel with cubic-bezier transitions
- No more distracting movement during game updates

The new effect is calmer and more elegant, letting you focus on the stats without visual distractions!

### 2. Smart Auto-Rest System (QOL2)
Your staff now knows when they need a break! When auto-assign mode is enabled, fatigued staff will automatically rest after completing or failing an order.

**How It Works:**
- Enable auto-assign mode (🤖 Auto button)
- Staff with high fatigue (>70%) automatically rest after finishing orders
- Once rested, they automatically return to work
- No more micromanaging tired employees!
- Keeps your team efficient and prevents burnout

You'll see messages like "😴 [Staff Name] is auto-resting due to high fatigue..." when the system kicks in!

### 3. Enhanced Dashboard Cards (QOL3)
Dashboard overview cards now show multiple stats at a glance with helpful tooltips explaining each section.

**New Multi-Stat Display:**

**Orders Card:**
- Total active orders
- Urgent orders (time < 30%)
- VIP orders (premium customers)

**Staff Card:**
- Available staff (ready to work)
- Busy staff (cooking orders)
- Resting staff (recovering fatigue)

**Inventory Card:**
- Total items (18 ingredients!)
- Low stock items (<30%)
- Empty items (0%)

**Satisfaction Card:**
- Current rating percentage
- Happy customers count
- Unhappy customers count

**Detailed Tooltips:**
Hover over any dashboard card to see a helpful tooltip explaining what that section does and how it affects your restaurant. Perfect for new players and quick reminders!

---

Restaurant Rush v2.0.0 brings massive content expansion and quality of life improvements that make managing your restaurant more intuitive and enjoyable. With 10 new ingredients, 40+ new recipes, and smarter automation, your restaurant empire can grow bigger than ever!
