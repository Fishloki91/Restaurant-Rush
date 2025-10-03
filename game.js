// Game State Management
class RestaurantGame {
    constructor() {
        this.isRunning = false;
        this.isPaused = false;
        this.day = 1;
        this.revenue = 200; // Starting revenue
        this.orders = [];
        this.staff = [];
        this.inventory = {};
        this.customerSatisfaction = 100;
        this.happyCustomers = 0;
        this.unhappyCustomers = 0;
        this.completedOrders = [];
        this.nextOrderId = 1;
        this.nextStaffId = 1;
        this.dayTimer = 0;
        this.dayDuration = 180; // 3 minutes per day
        this.orderGenerationChance = 0.4; // Base chance
        this.soundEnabled = true;
        this.autoAssignEnabled = false; // Auto-assign toggle
        this.currentView = 'overview'; // Track current view
        this.dayStartRevenue = 200; // Track revenue at day start
        this.dayStartHappyCustomers = 0; // Track happy customers at day start
        this.dayStartUnhappyCustomers = 0; // Track unhappy customers at day start
        this.isGameOver = false; // Track game over state
        this.vipCustomers = 0; // Track VIP customers served
        this.maxActiveOrders = 8; // Maximum active orders at once
        this.unlockedRecipes = []; // Track unlocked recipes
        this.totalOrdersCompleted = 0; // Track total orders completed for unlocks
        this.previousDayRevenue = 0; // Track previous day's revenue for trend
        this.revenueTrend = 0; // Revenue trend (positive or negative)
        this.equipment = {}; // Track equipment upgrades
        this.achievements = []; // Track unlocked achievements
        this.totalStaffHired = 0; // Track total staff hired for achievements
        this.highestRevenue = 200; // Track highest revenue reached
        this.totalRestocks = 0; // Track total inventory restocks
        this.perfectDays = 0; // Track days with 100% satisfaction
        
        // Initialize Audio Context for sound effects
        this.audioContext = null;
        this.initializeAudio();
        
        this.initializeInventory();
        this.initializeStaff();
        this.initializeRecipes();
        this.initializeEquipment();
        this.initializeAchievements();
    }
    
    initializeAudio() {
        try {
            // Create AudioContext on user interaction (required by browsers)
            this.audioContext = new (window.AudioContext || window.webkitAudioContext)();
        } catch (e) {
            console.warn('Web Audio API not supported', e);
        }
    }
    
    playSuccessSound() {
        if (!this.soundEnabled || !this.audioContext) return;
        
        const now = this.audioContext.currentTime;
        const oscillator = this.audioContext.createOscillator();
        const gainNode = this.audioContext.createGain();
        
        oscillator.connect(gainNode);
        gainNode.connect(this.audioContext.destination);
        
        // Play a pleasant success chime (C-E-G chord)
        oscillator.frequency.setValueAtTime(523.25, now); // C5
        oscillator.frequency.setValueAtTime(659.25, now + 0.1); // E5
        oscillator.frequency.setValueAtTime(783.99, now + 0.2); // G5
        
        gainNode.gain.setValueAtTime(0.2, now);
        gainNode.gain.exponentialRampToValueAtTime(0.01, now + 0.4);
        
        oscillator.start(now);
        oscillator.stop(now + 0.4);
    }
    
    playFailSound() {
        if (!this.soundEnabled || !this.audioContext) return;
        
        const now = this.audioContext.currentTime;
        const oscillator = this.audioContext.createOscillator();
        const gainNode = this.audioContext.createGain();
        
        oscillator.connect(gainNode);
        gainNode.connect(this.audioContext.destination);
        
        // Play a descending error sound
        oscillator.frequency.setValueAtTime(400, now);
        oscillator.frequency.exponentialRampToValueAtTime(200, now + 0.3);
        oscillator.type = 'sawtooth';
        
        gainNode.gain.setValueAtTime(0.15, now);
        gainNode.gain.exponentialRampToValueAtTime(0.01, now + 0.3);
        
        oscillator.start(now);
        oscillator.stop(now + 0.3);
    }
    
    initializeInventory() {
        const ingredients = [
            { name: 'Beef', max: 100, current: 100 },
            { name: 'Chicken', max: 100, current: 100 },
            { name: 'Fish', max: 100, current: 100 },
            { name: 'Vegetables', max: 100, current: 100 },
            { name: 'Pasta', max: 100, current: 100 },
            { name: 'Rice', max: 100, current: 100 },
            { name: 'Cheese', max: 80, current: 80 },
            { name: 'Tomatoes', max: 80, current: 80 }
        ];
        
        ingredients.forEach(ingredient => {
            this.inventory[ingredient.name] = {
                current: ingredient.current,
                max: ingredient.max
            };
        });
    }
    
    initializeStaff() {
        const staffMembers = [
            { name: 'Chef Mario', role: 'Head Chef', speciality: 'Italian' },
            { name: 'Chef Lisa', role: 'Sous Chef', speciality: 'Asian' },
            { name: 'Cook Tom', role: 'Line Cook', speciality: 'Grill' },
            { name: 'Cook Sarah', role: 'Line Cook', speciality: 'Prep' }
        ];
        
        staffMembers.forEach(member => {
            const randomEfficiency = 0.6 + Math.random() * 0.3; // Random efficiency between 0.6 and 0.9
            this.staff.push({
                id: this.nextStaffId++,
                name: member.name,
                role: member.role,
                efficiency: randomEfficiency,
                baseEfficiency: randomEfficiency, // Store base efficiency
                speciality: member.speciality,
                status: 'available',
                ordersCompleted: 0,
                currentOrder: null,
                performance: 100,
                upgradeLevel: 0, // Track upgrade level
                maxUpgradeLevel: 3, // Maximum upgrade level
                fatigue: 0, // Fatigue level (0-100)
                morale: 100, // Morale level (0-100)
                lastRestTime: 0 // Track when staff last rested
            });
        });
    }
    
    generateRandomStaff() {
        const firstNames = ['Alex', 'Jordan', 'Sam', 'Taylor', 'Morgan', 'Casey', 'Jamie', 'Riley', 'Quinn', 'Blake'];
        const lastNames = ['Smith', 'Johnson', 'Brown', 'Davis', 'Wilson', 'Martinez', 'Garcia', 'Lee', 'Wang', 'Chen'];
        const roles = ['Line Cook', 'Prep Cook', 'Sous Chef', 'Head Chef'];
        const specialities = ['Italian', 'Asian', 'Grill', 'Prep', 'Mexican', 'French', 'Pastry', 'Seafood'];
        
        const firstName = firstNames[Math.floor(Math.random() * firstNames.length)];
        const lastName = lastNames[Math.floor(Math.random() * lastNames.length)];
        const role = roles[Math.floor(Math.random() * roles.length)];
        const speciality = specialities[Math.floor(Math.random() * specialities.length)];
        const randomEfficiency = 0.6 + Math.random() * 0.3; // Random efficiency between 0.6 and 0.9
        
        return {
            id: this.nextStaffId++,
            name: `${firstName} ${lastName}`,
            role: role,
            efficiency: randomEfficiency,
            baseEfficiency: randomEfficiency,
            speciality: speciality,
            status: 'available',
            ordersCompleted: 0,
            currentOrder: null,
            performance: 100,
            upgradeLevel: 0,
            maxUpgradeLevel: 3,
            fatigue: 0, // Fatigue level (0-100)
            morale: 100, // Morale level (0-100)
            lastRestTime: 0, // Track when staff last rested
            orderHistory: [] // QOL3: Track last 5 orders
        };
    }
    
    initializeRecipes() {
        // Define all recipes with unlock requirements
        this.allRecipes = [
            // Starting recipes (unlocked by default)
            { id: 1, name: 'Beef Steak', category: 'Grill', ingredients: ['Beef', 'Vegetables'], price: 25, time: 180, unlockAt: 0 },
            { id: 2, name: 'Chicken Pasta', category: 'Italian', ingredients: ['Chicken', 'Pasta', 'Tomatoes'], price: 18, time: 120, unlockAt: 0 },
            { id: 3, name: 'Grilled Fish', category: 'Seafood', ingredients: ['Fish', 'Vegetables'], price: 22, time: 150, unlockAt: 0 },
            { id: 4, name: 'Vegetable Stir Fry', category: 'Asian', ingredients: ['Vegetables', 'Rice'], price: 15, time: 90, unlockAt: 0 },
            { id: 5, name: 'Chicken Rice Bowl', category: 'Asian', ingredients: ['Chicken', 'Rice', 'Vegetables'], price: 16, time: 100, unlockAt: 0 },
            { id: 6, name: 'Cheese Pizza', category: 'Italian', ingredients: ['Cheese', 'Tomatoes'], price: 14, time: 120, unlockAt: 0 },
            { id: 7, name: 'Pasta Primavera', category: 'Italian', ingredients: ['Pasta', 'Vegetables', 'Cheese'], price: 17, time: 110, unlockAt: 0 },
            
            // Unlockable recipes
            { id: 8, name: 'Premium Ribeye', category: 'Grill', ingredients: ['Beef', 'Vegetables', 'Cheese'], price: 35, time: 200, unlockAt: 10 },
            { id: 9, name: 'Seafood Linguine', category: 'Italian', ingredients: ['Fish', 'Pasta', 'Tomatoes'], price: 28, time: 160, unlockAt: 15 },
            { id: 10, name: 'Sushi Platter', category: 'Asian', ingredients: ['Fish', 'Rice', 'Vegetables'], price: 32, time: 180, unlockAt: 20 },
            { id: 11, name: 'Beef Tacos', category: 'Mexican', ingredients: ['Beef', 'Cheese', 'Tomatoes'], price: 20, time: 100, unlockAt: 25 },
            { id: 12, name: 'French Onion Soup', category: 'French', ingredients: ['Vegetables', 'Cheese'], price: 18, time: 140, unlockAt: 30 },
            { id: 13, name: 'Lobster Thermidor', category: 'Seafood', ingredients: ['Fish', 'Cheese', 'Vegetables'], price: 45, time: 220, unlockAt: 40 },
            { id: 14, name: 'Chicken Tikka Masala', category: 'Asian', ingredients: ['Chicken', 'Rice', 'Tomatoes'], price: 24, time: 140, unlockAt: 35 },
            { id: 15, name: 'Filet Mignon', category: 'French', ingredients: ['Beef', 'Vegetables'], price: 40, time: 200, unlockAt: 50 }
        ];
        
        // Start with basic recipes unlocked
        this.unlockedRecipes = this.allRecipes.filter(r => r.unlockAt === 0).map(r => r.id);
    }
    
    checkRecipeUnlocks() {
        // Check if any new recipes should be unlocked
        this.allRecipes.forEach(recipe => {
            if (!this.unlockedRecipes.includes(recipe.id) && this.totalOrdersCompleted >= recipe.unlockAt) {
                this.unlockedRecipes.push(recipe.id);
                this.addFeedback(`🎉 New recipe unlocked: ${recipe.name}! ($${recipe.price})`, true);
            }
        });
    }
    
    getAvailableRecipes() {
        return this.allRecipes.filter(r => this.unlockedRecipes.includes(r.id));
    }
    
    initializeEquipment() {
        // Define all equipment types with their upgrade levels
        this.equipmentTypes = [
            {
                id: 'stove',
                name: 'Industrial Stove',
                icon: '🔥',
                description: 'Faster cooking times',
                maxLevel: 3,
                baseCost: 200,
                effect: 'cooking_speed',
                effectPerLevel: 0.1 // 10% faster per level
            },
            {
                id: 'fridge',
                name: 'Commercial Fridge',
                icon: '❄️',
                description: 'Reduced ingredient waste',
                maxLevel: 3,
                baseCost: 250,
                effect: 'ingredient_efficiency',
                effectPerLevel: 0.15 // 15% chance to not consume ingredients per level
            },
            {
                id: 'counter',
                name: 'Premium Counter',
                icon: '🔲',
                description: 'Increased dish prices',
                maxLevel: 3,
                baseCost: 300,
                effect: 'price_boost',
                effectPerLevel: 0.08 // 8% price increase per level
            },
            {
                id: 'dishwasher',
                name: 'Auto Dishwasher',
                icon: '🧽',
                description: 'Staff fatigue reduction',
                maxLevel: 3,
                baseCost: 180,
                effect: 'fatigue_reduction',
                effectPerLevel: 0.2 // 20% less fatigue gain per level
            }
        ];
        
        // Initialize all equipment at level 0
        this.equipmentTypes.forEach(type => {
            this.equipment[type.id] = {
                level: 0,
                type: type
            };
        });
    }
    
    upgradeEquipment(equipmentId) {
        const equipment = this.equipment[equipmentId];
        if (!equipment) return;
        
        const equipType = equipment.type;
        
        if (equipment.level >= equipType.maxLevel) {
            this.addFeedback(`⚠️ ${equipType.name} is already at maximum level!`, false);
            return;
        }
        
        // Calculate cost (increases with each level)
        const upgradeCost = equipType.baseCost + (equipment.level * equipType.baseCost * 0.5);
        
        if (this.revenue < upgradeCost) {
            this.addFeedback(`⚠️ Not enough revenue to upgrade ${equipType.name}! Cost: $${upgradeCost}`, false);
            return;
        }
        
        // Apply upgrade
        this.revenue -= upgradeCost;
        equipment.level++;
        
        this.addFeedback(`${equipType.icon} ${equipType.name} upgraded to Level ${equipment.level}!`, true);
        this.checkAchievements();
        this.render();
    }
    
    getEquipmentBonus(effectType) {
        let totalBonus = 0;
        Object.values(this.equipment).forEach(eq => {
            if (eq.type.effect === effectType) {
                totalBonus += eq.level * eq.type.effectPerLevel;
            }
        });
        return totalBonus;
    }
    
    initializeAchievements() {
        // Define all achievements with unlock conditions
        this.allAchievements = [
            // Getting Started
            { id: 'first_order', name: 'First Steps', icon: '🎯', description: 'Complete your first order', requirement: 1, category: 'orders', unlocked: false },
            { id: 'ten_orders', name: 'Gaining Momentum', icon: '📈', description: 'Complete 10 orders', requirement: 10, category: 'orders', unlocked: false },
            { id: 'fifty_orders', name: 'Experienced Chef', icon: '👨‍🍳', description: 'Complete 50 orders', requirement: 50, category: 'orders', unlocked: false },
            { id: 'hundred_orders', name: 'Master Chef', icon: '⭐', description: 'Complete 100 orders', requirement: 100, category: 'orders', unlocked: false },
            
            // Revenue Milestones
            { id: 'revenue_500', name: 'Small Business', icon: '💵', description: 'Reach $500 in revenue', requirement: 500, category: 'revenue', unlocked: false },
            { id: 'revenue_1000', name: 'Growing Business', icon: '💰', description: 'Reach $1,000 in revenue', requirement: 1000, category: 'revenue', unlocked: false },
            { id: 'revenue_2500', name: 'Thriving Restaurant', icon: '🏆', description: 'Reach $2,500 in revenue', requirement: 2500, category: 'revenue', unlocked: false },
            { id: 'revenue_5000', name: 'Restaurant Empire', icon: '👑', description: 'Reach $5,000 in revenue', requirement: 5000, category: 'revenue', unlocked: false },
            
            // Staff Management
            { id: 'hire_first', name: 'Team Builder', icon: '👥', description: 'Hire your first employee', requirement: 1, category: 'staff', unlocked: false },
            { id: 'hire_five', name: 'Growing Team', icon: '🤝', description: 'Hire 5 employees', requirement: 5, category: 'staff', unlocked: false },
            { id: 'hire_ten', name: 'HR Manager', icon: '📋', description: 'Hire 10 employees', requirement: 10, category: 'staff', unlocked: false },
            
            // Days Survived
            { id: 'survive_5', name: 'First Week', icon: '📅', description: 'Survive 5 days', requirement: 5, category: 'days', unlocked: false },
            { id: 'survive_10', name: 'Established', icon: '🗓️', description: 'Survive 10 days', requirement: 10, category: 'days', unlocked: false },
            { id: 'survive_20', name: 'Restaurant Veteran', icon: '🎖️', description: 'Survive 20 days', requirement: 20, category: 'days', unlocked: false },
            
            // Customer Satisfaction
            { id: 'perfect_day', name: 'Perfect Service', icon: '😊', description: 'Complete a day with 100% satisfaction', requirement: 1, category: 'perfect_days', unlocked: false },
            { id: 'vip_ten', name: 'VIP Favorite', icon: '⭐', description: 'Serve 10 VIP customers', requirement: 10, category: 'vip', unlocked: false },
            
            // Equipment
            { id: 'first_upgrade', name: 'Modernizing', icon: '🔧', description: 'Upgrade any equipment to Level 1', requirement: 1, category: 'equipment', unlocked: false },
            { id: 'all_max', name: 'Fully Equipped', icon: '🏭', description: 'Max out all equipment to Level 3', requirement: 12, category: 'equipment', unlocked: false }
        ];
        
        this.achievements = [];
    }
    
    checkAchievements() {
        // Check for newly unlocked achievements
        this.allAchievements.forEach(achievement => {
            if (achievement.unlocked) return;
            
            let currentValue = 0;
            
            switch(achievement.category) {
                case 'orders':
                    currentValue = this.totalOrdersCompleted;
                    break;
                case 'revenue':
                    currentValue = this.highestRevenue;
                    break;
                case 'staff':
                    currentValue = this.totalStaffHired;
                    break;
                case 'days':
                    currentValue = this.day;
                    break;
                case 'perfect_days':
                    currentValue = this.perfectDays;
                    break;
                case 'vip':
                    currentValue = this.vipCustomers;
                    break;
                case 'equipment':
                    currentValue = Object.values(this.equipment).reduce((sum, eq) => sum + eq.level, 0);
                    break;
            }
            
            if (currentValue >= achievement.requirement) {
                achievement.unlocked = true;
                this.achievements.push(achievement);
                this.addFeedback(`🎉 Achievement Unlocked: ${achievement.icon} ${achievement.name}!`, true);
                this.playSuccessSound();
            }
        });
    }
    
    hireStaff() {
        const hireCost = 150;
        if (this.revenue < hireCost) {
            this.addFeedback('⚠️ Not enough revenue to hire new staff! Cost: $150', false);
            return;
        }
        
        this.revenue -= hireCost;
        const newStaff = this.generateRandomStaff();
        this.staff.push(newStaff);
        this.totalStaffHired++;
        this.addFeedback(`✅ Hired ${newStaff.name} (${newStaff.role}) - Efficiency: ${(newStaff.efficiency * 100).toFixed(0)}%`, true);
        this.checkAchievements();
        this.render();
    }
    
    start() {
        this.isRunning = true;
        this.isPaused = false;
        this.dayStartRevenue = this.revenue;
        this.dayStartHappyCustomers = this.happyCustomers;
        this.dayStartUnhappyCustomers = this.unhappyCustomers;
        this.startGameLoop();
    }
    
    pause() {
        this.isPaused = !this.isPaused;
    }
    
    startGameLoop() {
        // Update game state every second
        this.gameInterval = setInterval(() => {
            if (!this.isPaused && this.isRunning) {
                this.checkGameOver();
                this.updateOrders();
                this.updateStaff();
                this.checkCustomerSatisfaction();
                this.updateDayProgression();
                this.render();
            }
        }, 1000);
        
        // Generate orders periodically
        this.orderInterval = setInterval(() => {
            if (!this.isPaused && this.isRunning) {
                if (Math.random() < this.orderGenerationChance) {
                    this.generateOrder();
                }
            }
        }, 5000); // Check every 5 seconds
    }
    
    checkGameOver() {
        if (this.revenue <= 0 && !this.isGameOver) {
            this.isGameOver = true;
            this.isPaused = true;
            this.showGameOver();
        }
    }
    
    showGameOver() {
        const modal = document.getElementById('game-over-modal');
        document.getElementById('gameover-day-reached').textContent = this.day;
        document.getElementById('gameover-total-customers').textContent = this.happyCustomers + this.unhappyCustomers;
        document.getElementById('gameover-happy-customers').textContent = this.happyCustomers;
        document.getElementById('gameover-rating').textContent = this.calculateAverageRating().toFixed(1);
        modal.classList.add('modal-active');
    }
    
    restartGame() {
        // Clear intervals
        if (this.gameInterval) clearInterval(this.gameInterval);
        if (this.orderInterval) clearInterval(this.orderInterval);
        
        // Reset game state
        this.isRunning = false;
        this.isPaused = false;
        this.isGameOver = false;
        this.day = 1;
        this.revenue = 200;
        this.orders = [];
        this.staff = [];
        this.inventory = {};
        this.customerSatisfaction = 100;
        this.happyCustomers = 0;
        this.unhappyCustomers = 0;
        this.completedOrders = [];
        this.nextOrderId = 1;
        this.nextStaffId = 1;
        this.dayTimer = 0;
        this.orderGenerationChance = 0.4;
        this.dayStartRevenue = 200;
        this.dayStartHappyCustomers = 0;
        this.dayStartUnhappyCustomers = 0;
        this.vipCustomers = 0;
        this.totalOrdersCompleted = 0;
        this.achievements = [];
        this.totalStaffHired = 0;
        this.highestRevenue = 200;
        this.totalRestocks = 0;
        this.perfectDays = 0;
        
        this.initializeInventory();
        this.initializeStaff();
        this.initializeRecipes();
        this.initializeEquipment();
        this.initializeAchievements();
        
        // Hide modal
        const modal = document.getElementById('game-over-modal');
        modal.classList.remove('modal-active');
        
        // Reset UI
        document.getElementById('start-game-btn').disabled = false;
        document.getElementById('pause-game-btn').disabled = true;
        document.getElementById('new-order-btn').disabled = true;
        
        this.switchView('overview');
        this.render();
    }
    
    updateDayProgression() {
        this.dayTimer++;
        
        if (this.dayTimer >= this.dayDuration) {
            // Show end of day summary
            this.showDaySummary();
        }
    }
    
    showDaySummary() {
        this.isPaused = true;
        
        // Calculate day statistics
        const revenueEarned = this.revenue - this.dayStartRevenue;
        const customersServed = (this.happyCustomers - this.dayStartHappyCustomers) + 
                                (this.unhappyCustomers - this.dayStartUnhappyCustomers);
        const happyToday = this.happyCustomers - this.dayStartHappyCustomers;
        const unhappyToday = this.unhappyCustomers - this.dayStartUnhappyCustomers;
        const successRate = customersServed > 0 ? ((happyToday / customersServed) * 100).toFixed(1) : '100.0';
        
        // End of day bonus
        const bonus = Math.floor(this.revenue * 0.1);
        
        // Show modal
        const modal = document.getElementById('day-summary-modal');
        document.getElementById('summary-day-number').textContent = this.day;
        document.getElementById('next-day-number').textContent = this.day + 1;
        document.getElementById('summary-revenue-earned').textContent = `$${revenueEarned}`;
        document.getElementById('summary-bonus').textContent = `$${bonus}`;
        document.getElementById('summary-total-revenue').textContent = `$${this.revenue + bonus}`;
        document.getElementById('summary-customers-served').textContent = customersServed;
        document.getElementById('summary-happy-customers').textContent = happyToday;
        document.getElementById('summary-unhappy-customers').textContent = unhappyToday;
        document.getElementById('summary-success-rate').textContent = `${successRate}%`;
        
        modal.classList.add('modal-active');
    }
    
    continueToNextDay() {
        // Check if day was perfect (100% satisfaction maintained)
        if (this.customerSatisfaction === 100) {
            this.perfectDays++;
        }
        
        // Calculate revenue trend
        const currentRevenue = this.revenue;
        if (this.previousDayRevenue > 0) {
            this.revenueTrend = ((currentRevenue - this.previousDayRevenue) / this.previousDayRevenue) * 100;
        } else {
            this.revenueTrend = 0;
        }
        this.previousDayRevenue = currentRevenue;
        
        // Apply bonus
        const bonus = Math.floor(this.revenue * 0.1);
        this.revenue += bonus;
        
        // Track highest revenue for achievements
        if (this.revenue > this.highestRevenue) {
            this.highestRevenue = this.revenue;
        }
        
        // Advance to next day
        this.day++;
        this.dayTimer = 0;
        
        // Check achievements after day progression
        this.checkAchievements();
        
        // Store starting values for next day
        this.dayStartRevenue = this.revenue;
        this.dayStartHappyCustomers = this.happyCustomers;
        this.dayStartUnhappyCustomers = this.unhappyCustomers;
        
        // Increase difficulty gradually
        this.orderGenerationChance = Math.min(0.8, 0.4 + (this.day - 1) * 0.05);
        
        // Hide modal
        const modal = document.getElementById('day-summary-modal');
        modal.classList.remove('modal-active');
        
        this.isPaused = false;
        this.addFeedback(`🌅 Day ${this.day} begins! Difficulty increased.`, true);
        this.render();
    }
    
    generateOrder() {
        // Check order queue limit
        if (this.orders.length >= this.maxActiveOrders) {
            this.addFeedback('⚠️ Order queue is full! Complete orders before accepting new ones.', false);
            return;
        }
        
        // Use unlocked recipes
        const availableRecipes = this.getAvailableRecipes();
        
        // Determine if this is a VIP order (15% chance)
        const isVIP = Math.random() < 0.15;
        
        const numItems = Math.floor(Math.random() * 3) + 1; // 1-3 items per order
        const orderItems = [];
        let totalPrice = 0;
        let maxTime = 0;
        
        for (let i = 0; i < numItems; i++) {
            const recipe = availableRecipes[Math.floor(Math.random() * availableRecipes.length)];
            const dish = {
                name: recipe.name,
                category: recipe.category,
                ingredients: recipe.ingredients,
                price: recipe.price,
                time: recipe.time
            };
            orderItems.push(dish);
            totalPrice += dish.price;
            maxTime = Math.max(maxTime, dish.time);
        }
        
        // VIP orders get price boost and time reduction
        if (isVIP) {
            totalPrice = Math.floor(totalPrice * 1.5); // 50% price bonus
            maxTime = Math.floor(maxTime * 0.8); // 20% less time
        }
        
        // Apply equipment price boost
        const priceBoost = this.getEquipmentBonus('price_boost');
        totalPrice = Math.floor(totalPrice * (1 + priceBoost));
        
        // Apply equipment cooking speed bonus
        const speedBonus = this.getEquipmentBonus('cooking_speed');
        maxTime = Math.floor(maxTime * (1 - speedBonus));
        
        // Check if we have enough ingredients
        const requiredIngredients = {};
        orderItems.forEach(item => {
            item.ingredients.forEach(ing => {
                requiredIngredients[ing] = (requiredIngredients[ing] || 0) + 1;
            });
        });
        
        // Check inventory
        let canFulfill = true;
        for (const [ingredient, amount] of Object.entries(requiredIngredients)) {
            if (!this.inventory[ingredient] || this.inventory[ingredient].current < amount) {
                canFulfill = false;
                break;
            }
        }
        
        if (!canFulfill) {
            this.addFeedback('❌ Cannot accept order - insufficient ingredients!', false);
            return;
        }
        
        const order = {
            id: this.nextOrderId++,
            items: orderItems,
            totalPrice: totalPrice,
            timeLimit: maxTime + 30, // Add buffer time
            timeRemaining: maxTime + 30,
            status: 'pending', // pending, in-progress, completed, failed
            assignedStaff: null,
            progress: 0,
            requiredIngredients: requiredIngredients,
            isVIP: isVIP,
            isPriority: false // Player can mark orders as priority
        };
        
        this.orders.push(order);
        
        if (isVIP) {
            this.addFeedback('⭐ VIP Customer arrived! High reward, strict deadline!', true);
        }
        
        this.render();
    }
    
    toggleOrderPriority(orderId) {
        const order = this.orders.find(o => o.id === orderId);
        if (order) {
            order.isPriority = !order.isPriority;
            this.render();
        }
    }
    
    assignOrderToStaff(orderId) {
        const order = this.orders.find(o => o.id === orderId);
        if (!order || order.status !== 'pending') return;
        
        // Find available staff
        const availableStaff = this.staff.filter(s => s.status === 'available');
        
        let staffMember;
        
        if (availableStaff.length === 0) {
            // If this is a priority order and no staff available, reassign from current work
            if (order.isPriority) {
                // Find busy staff with the highest morale
                const busyStaff = this.staff.filter(s => s.status === 'busy');
                if (busyStaff.length === 0) {
                    this.addFeedback('⚠️ No available staff to assign order!', false);
                    return;
                }
                
                // Sort by morale (highest first)
                staffMember = busyStaff.sort((a, b) => b.morale - a.morale)[0];
                
                // Pause the current order they're working on
                const currentOrder = this.orders.find(o => o.id === staffMember.currentOrder);
                if (currentOrder) {
                    currentOrder.status = 'paused';
                    currentOrder.assignedStaff = null;
                    this.addFeedback(`⏸️ ${staffMember.name} paused Order #${currentOrder.id} to handle priority order!`, true);
                }
            } else {
                this.addFeedback('⚠️ No available staff to assign order!', false);
                return;
            }
        } else {
            // Pick the most efficient available staff
            staffMember = availableStaff.sort((a, b) => b.efficiency - a.efficiency)[0];
        }
        
        // Deduct ingredients from inventory (with possible efficiency bonus)
        const ingredientEfficiency = this.getEquipmentBonus('ingredient_efficiency');
        for (const [ingredient, amount] of Object.entries(order.requiredIngredients)) {
            // Chance to not consume ingredient based on efficiency
            for (let i = 0; i < amount; i++) {
                if (Math.random() > ingredientEfficiency) {
                    this.inventory[ingredient].current -= 1;
                }
            }
        }
        
        order.status = 'in-progress';
        order.assignedStaff = staffMember.id;
        staffMember.status = 'busy';
        staffMember.currentOrder = orderId;
        
        this.render();
    }
    
    updateOrders() {
        // First, try to reassign paused orders to available staff
        const pausedOrders = this.orders.filter(o => o.status === 'paused');
        if (pausedOrders.length > 0) {
            const availableStaff = this.staff.filter(s => s.status === 'available');
            if (availableStaff.length > 0) {
                // Sort paused orders by time remaining (most urgent first)
                const sortedPausedOrders = pausedOrders.sort((a, b) => a.timeRemaining - b.timeRemaining);
                
                for (const pausedOrder of sortedPausedOrders) {
                    const availableStaffNow = this.staff.filter(s => s.status === 'available');
                    if (availableStaffNow.length > 0) {
                        // Pick the most efficient available staff
                        const staffMember = availableStaffNow.sort((a, b) => b.efficiency - a.efficiency)[0];
                        
                        pausedOrder.status = 'in-progress';
                        pausedOrder.assignedStaff = staffMember.id;
                        staffMember.status = 'busy';
                        staffMember.currentOrder = pausedOrder.id;
                        
                        this.addFeedback(`▶️ ${staffMember.name} resumed Order #${pausedOrder.id}!`, true);
                    }
                }
            }
        }
        
        this.orders.forEach(order => {
            if (order.status === 'pending') {
                order.timeRemaining--;
                
                // Auto-assign if enabled and staff available
                if (this.autoAssignEnabled && order.status === 'pending') {
                    const availableStaff = this.staff.filter(s => s.status === 'available');
                    if (availableStaff.length > 0) {
                        this.assignOrderToStaff(order.id);
                    }
                }
                
                // Auto-assign if time is running out
                if (order.timeRemaining < order.timeLimit * 0.3 && order.status === 'pending') {
                    this.assignOrderToStaff(order.id);
                }
            } else if (order.status === 'paused') {
                // Paused orders still count down
                order.timeRemaining--;
            } else if (order.status === 'in-progress') {
                order.timeRemaining--;
                
                const staff = this.staff.find(s => s.id === order.assignedStaff);
                if (staff) {
                    // Check for specialization bonus
                    let efficiencyBonus = 1.0;
                    const hasMatchingSpecialty = order.items.some(item => 
                        item.category === staff.speciality
                    );
                    if (hasMatchingSpecialty) {
                        efficiencyBonus = 1.15; // 15% bonus for matching specialty
                    }
                    
                    // Progress based on staff efficiency with specialty bonus
                    order.progress += staff.efficiency * 1.5 * efficiencyBonus;
                    
                    if (order.progress >= 100) {
                        this.completeOrder(order.id, true);
                    }
                }
            }
            
            // Check for failed orders
            if (order.timeRemaining <= 0 && order.status !== 'completed') {
                this.completeOrder(order.id, false);
            }
        });
        
        // Remove completed/failed orders after tracking
        this.orders = this.orders.filter(o => o.status !== 'completed' && o.status !== 'failed');
    }
    
    completeOrder(orderId, success) {
        const order = this.orders.find(o => o.id === orderId);
        if (!order) return;
        
        const staff = this.staff.find(s => s.id === order.assignedStaff);
        const satisfactionChange = order.isVIP ? 5 : 2; // VIP orders affect satisfaction more
        
        if (success) {
            order.status = 'completed';
            this.revenue += order.totalPrice;
            this.happyCustomers++;
            this.totalOrdersCompleted++; // Track for recipe unlocks
            
            // Track highest revenue for achievements
            if (this.revenue > this.highestRevenue) {
                this.highestRevenue = this.revenue;
            }
            
            // Check for recipe unlocks
            this.checkRecipeUnlocks();
            
            // Check for achievements
            this.checkAchievements();
            
            if (order.isVIP) {
                this.vipCustomers++;
            }
            
            if (staff) {
                staff.ordersCompleted++;
                staff.performance = Math.min(100, staff.performance + 2);
                staff.status = 'available';
                staff.currentOrder = null;
                
                // QOL3: Add to order history (keep last 5)
                staff.orderHistory.unshift({
                    orderId: order.id,
                    dishName: order.items.map(i => i.name).join(', '),
                    success: true,
                    price: order.totalPrice,
                    timestamp: Date.now()
                });
                if (staff.orderHistory.length > 5) {
                    staff.orderHistory = staff.orderHistory.slice(0, 5);
                }
            }
            
            this.customerSatisfaction = Math.min(100, this.customerSatisfaction + satisfactionChange);
            const vipLabel = order.isVIP ? ' ⭐ VIP' : '';
            this.addFeedback(`✅ Order #${order.id}${vipLabel} completed! Customer is happy! +$${order.totalPrice}`, true);
            
            // Play success sound
            this.playSuccessSound();
        } else {
            order.status = 'failed';
            this.unhappyCustomers++;
            
            if (staff) {
                staff.performance = Math.max(0, staff.performance - 5);
                staff.status = 'available';
                staff.currentOrder = null;
                
                // QOL3: Add to order history (keep last 5)
                staff.orderHistory.unshift({
                    orderId: order.id,
                    dishName: order.items.map(i => i.name).join(', '),
                    success: false,
                    price: 0,
                    timestamp: Date.now()
                });
                if (staff.orderHistory.length > 5) {
                    staff.orderHistory = staff.orderHistory.slice(0, 5);
                }
            }
            
            const penaltyChange = order.isVIP ? 20 : 10; // VIP failures hurt more
            this.customerSatisfaction = Math.max(0, this.customerSatisfaction - penaltyChange);
            const vipLabel = order.isVIP ? ' ⭐ VIP' : '';
            this.addFeedback(`❌ Order #${order.id}${vipLabel} failed! Customer is unhappy!`, false);
            
            // Play fail sound
            this.playFailSound();
        }
        
        this.completedOrders.push(order);
    }
    
    updateStaff() {
        // Get fatigue reduction bonus from equipment
        const fatigueReduction = this.getEquipmentBonus('fatigue_reduction');
        
        // Gradually recover performance for available staff
        this.staff.forEach(staff => {
            // Update fatigue
            if (staff.status === 'busy') {
                // Increase fatigue while working (reduced by equipment)
                const fatigueGain = 0.5 * (1 - fatigueReduction);
                staff.fatigue = Math.min(100, staff.fatigue + fatigueGain);
            } else if (staff.status === 'available') {
                // Decrease fatigue while idle (0.3 per second)
                staff.fatigue = Math.max(0, staff.fatigue - 0.3);
            } else if (staff.status === 'resting') {
                // Rapid fatigue recovery while resting (2.0 per second)
                staff.fatigue = Math.max(0, staff.fatigue - 2.0);
                
                // Return to available status when fatigue is low enough
                if (staff.fatigue <= 10) {
                    staff.status = 'available';
                    this.addFeedback(`${staff.name} has finished resting and is back to work!`, true);
                }
            }
            
            // Update morale based on fatigue and performance
            if (staff.fatigue > 80) {
                // High fatigue decreases morale
                staff.morale = Math.max(0, staff.morale - 0.3);
            } else if (staff.fatigue < 20 && staff.performance > 80) {
                // Low fatigue and good performance increases morale
                staff.morale = Math.min(100, staff.morale + 0.2);
            }
            
            // Adjust efficiency based on fatigue and morale
            const fatigueMultiplier = 1 - (staff.fatigue / 200); // Max 50% reduction
            const moraleMultiplier = 0.5 + (staff.morale / 200); // Between 50% and 100%
            
            // Calculate effective efficiency including upgrades
            const upgradeBonus = staff.upgradeLevel * 0.05;
            staff.efficiency = staff.baseEfficiency * (1 + upgradeBonus) * fatigueMultiplier * moraleMultiplier;
            
            // Gradually recover performance for available staff
            if (staff.status === 'available' && staff.performance < 100) {
                staff.performance = Math.min(100, staff.performance + 0.5);
            }
        });
    }
    
    checkCustomerSatisfaction() {
        // Gradually decrease satisfaction to create pressure
        if (this.orders.length > 5) {
            this.customerSatisfaction = Math.max(0, this.customerSatisfaction - 0.5);
        }
    }
    
    restockInventory() {
        const restockCost = 50;
        if (this.revenue >= restockCost) {
            this.revenue -= restockCost;
            for (const ingredient in this.inventory) {
                this.inventory[ingredient].current = this.inventory[ingredient].max;
            }
            this.totalRestocks++; // Track for achievements (QOL2)
            this.addFeedback(`📦 Inventory restocked! Cost: $${restockCost}`, true);
            this.render();
        } else {
            this.addFeedback('⚠️ Not enough revenue to restock!', false);
        }
    }
    
    restockSingleItem(ingredientName) {
        const restockCost = 10;
        if (this.revenue >= restockCost) {
            if (this.inventory[ingredientName]) {
                this.revenue -= restockCost;
                this.inventory[ingredientName].current = this.inventory[ingredientName].max;
                this.totalRestocks++; // Track for achievements (QOL2)
                this.addFeedback(`📦 ${ingredientName} restocked! Cost: $${restockCost}`, true);
                this.render();
            }
        } else {
            this.addFeedback('⚠️ Not enough revenue to restock!', false);
        }
    }
    
    toggleSound() {
        this.soundEnabled = !this.soundEnabled;
        const btn = document.getElementById('sound-toggle-btn');
        btn.textContent = this.soundEnabled ? '🔊 Sound On' : '🔇 Sound Off';
        this.addFeedback(`Sound ${this.soundEnabled ? 'enabled' : 'disabled'}`, true);
    }
    
    toggleAutoAssign() {
        this.autoAssignEnabled = !this.autoAssignEnabled;
        const btn = document.getElementById('auto-assign-btn');
        btn.textContent = this.autoAssignEnabled ? '🤖 Auto: ON' : '🤖 Auto: OFF';
        btn.classList.toggle('btn-success', this.autoAssignEnabled);
        btn.classList.toggle('btn-secondary', !this.autoAssignEnabled);
        this.addFeedback(`Auto-assign ${this.autoAssignEnabled ? 'enabled' : 'disabled'}`, true);
    }
    
    upgradeStaff(staffId) {
        const staff = this.staff.find(s => s.id === staffId);
        if (!staff) return;
        
        if (staff.upgradeLevel >= staff.maxUpgradeLevel) {
            this.addFeedback('⚠️ Staff is already at maximum upgrade level!', false);
            return;
        }
        
        // Calculate upgrade cost (increases with level)
        const upgradeCost = 100 + (staff.upgradeLevel * 50);
        
        if (this.revenue < upgradeCost) {
            this.addFeedback('⚠️ Not enough revenue to upgrade staff!', false);
            return;
        }
        
        // Apply upgrade
        this.revenue -= upgradeCost;
        staff.upgradeLevel++;
        staff.efficiency = staff.baseEfficiency + (staff.upgradeLevel * 0.05); // +5% per level
        
        this.addFeedback(`⭐ ${staff.name} upgraded to Level ${staff.upgradeLevel}! Efficiency: ${(staff.efficiency * 100).toFixed(0)}%`, true);
        this.render();
    }
    
    sendStaffToRest(staffId) {
        const staff = this.staff.find(s => s.id === staffId);
        if (!staff) return;
        
        if (staff.status === 'busy') {
            this.addFeedback('⚠️ Staff is currently working on an order!', false);
            return;
        }
        
        if (staff.status === 'resting') {
            this.addFeedback('⚠️ Staff is already resting!', false);
            return;
        }
        
        staff.status = 'resting';
        staff.lastRestTime = this.dayTimer;
        this.addFeedback(`😴 ${staff.name} is taking a break to recover...`, true);
        this.render();
    }
    
    toggleShortcutsModal() {
        const modal = document.getElementById('shortcuts-modal');
        modal.classList.toggle('modal-active');
    }
    
    addFeedback(message, isPositive) {
        const feedbackContainer = document.getElementById('feedback-container');
        const feedbackItem = document.createElement('div');
        feedbackItem.className = `feedback-item ${isPositive ? 'positive' : 'negative'}`;
        feedbackItem.innerHTML = `
            <span class="feedback-rating">${isPositive ? '⭐⭐⭐⭐⭐' : '⭐'}</span>
            ${message}
        `;
        feedbackContainer.insertBefore(feedbackItem, feedbackContainer.firstChild);
        
        // Keep only last 5 feedback items
        while (feedbackContainer.children.length > 5) {
            feedbackContainer.removeChild(feedbackContainer.lastChild);
        }
    }
    
    render() {
        this.renderOrders();
        this.renderStaff();
        this.renderInventory();
        this.renderSatisfaction();
        this.renderGameStats();
        this.renderOverview();
        this.renderRecipes();
        this.renderEquipment();
        this.renderAchievements();
    }
    
    renderOverview() {
        // Update overview cards with current stats
        const ordersCount = this.orders.length;
        const urgentOrders = this.orders.filter(o => o.timeRemaining <= 30 && o.status === 'pending').length;
        const availableStaff = this.staff.filter(s => s.status === 'available').length;
        const lowStockItems = Object.values(this.inventory).filter(item => 
            (item.current / item.max) < 0.3
        ).length;
        
        document.getElementById('overview-orders-count').textContent = ordersCount;
        document.getElementById('overview-orders-urgent').textContent = `${urgentOrders} Urgent`;
        document.getElementById('overview-staff-available').textContent = availableStaff;
        document.getElementById('overview-inventory-low').textContent = lowStockItems;
        document.getElementById('overview-satisfaction').textContent = `${Math.round(this.customerSatisfaction)}%`;
        
        // Update recipes overview
        const recipesUnlockedEl = document.getElementById('overview-recipes-unlocked');
        if (recipesUnlockedEl) {
            recipesUnlockedEl.textContent = this.unlockedRecipes.length;
        }
        
        // Update equipment overview
        const equipmentUpgradesEl = document.getElementById('overview-equipment-upgrades');
        if (equipmentUpgradesEl) {
            const totalUpgrades = Object.values(this.equipment).reduce((sum, eq) => sum + eq.level, 0);
            equipmentUpgradesEl.textContent = totalUpgrades;
        }
        
        // Update achievements overview
        const achievementsCountEl = document.getElementById('overview-achievements-count');
        if (achievementsCountEl) {
            achievementsCountEl.textContent = this.achievements.length;
        }
        
        // Update achievements badge
        const achievementsBadgeEl = document.getElementById('achievements-badge');
        if (achievementsBadgeEl) {
            achievementsBadgeEl.textContent = `${this.achievements.length} / ${this.allAchievements.length} Unlocked`;
        }
        
        // Add notification badges
        const ordersCard = document.getElementById('orders-overview-card');
        const inventoryCard = document.getElementById('inventory-overview-card');
        
        if (urgentOrders > 0) {
            ordersCard.setAttribute('data-has-notification', 'true');
        } else {
            ordersCard.removeAttribute('data-has-notification');
        }
        
        if (lowStockItems > 0) {
            inventoryCard.setAttribute('data-has-notification', 'true');
        } else {
            inventoryCard.removeAttribute('data-has-notification');
        }
    }
    
    switchView(viewName) {
        // Hide all views
        document.querySelectorAll('.dashboard-content').forEach(view => {
            view.classList.remove('view-active');
        });
        
        // Show selected view
        const targetView = document.getElementById(`${viewName}-view`);
        if (targetView) {
            targetView.classList.add('view-active');
            this.currentView = viewName;
        }
    }
    
    renderGameStats() {
        const dayProgress = (this.dayTimer / this.dayDuration) * 100;
        document.getElementById('game-day').textContent = this.day;
        document.getElementById('game-day').title = `Day ${this.day} - ${Math.floor(dayProgress)}% complete`;
        
        // Update day progress bar
        const progressBar = document.getElementById('day-progress-bar');
        if (progressBar) {
            progressBar.style.width = `${dayProgress}%`;
        }
        
        // Update day tooltip (QOL1)
        const dayTooltip = document.querySelector('#day-tooltip .tooltip-content');
        if (dayTooltip) {
            const timeRemaining = this.dayDuration - this.dayTimer;
            const minutes = Math.floor(timeRemaining / 60);
            const seconds = timeRemaining % 60;
            dayTooltip.innerHTML = `
                <strong>Day ${this.day}</strong><br>
                Progress: ${Math.floor(dayProgress)}%<br>
                Time Remaining: ${minutes}:${seconds.toString().padStart(2, '0')}<br>
                Order Chance: ${(this.orderGenerationChance * 100).toFixed(0)}%
            `;
        }
        
        // Update revenue display with trend indicator
        const revenueEl = document.getElementById('revenue');
        let trendIndicator = '';
        if (this.day > 1 && this.previousDayRevenue > 0) {
            const trendValue = Math.abs(this.revenueTrend).toFixed(1);
            if (this.revenueTrend > 0) {
                trendIndicator = ` <span style="color: #28a745; font-size: 0.8rem;">▲ ${trendValue}%</span>`;
            } else if (this.revenueTrend < 0) {
                trendIndicator = ` <span style="color: #666; font-size: 0.8rem;">▼ ${trendValue}%</span>`;
            } else {
                trendIndicator = ` <span style="color: #666; font-size: 0.8rem;">━ 0%</span>`;
            }
        }
        revenueEl.innerHTML = `$${this.revenue}${trendIndicator}`;
        
        // Update revenue tooltip (QOL1 - Revenue forecast indicator)
        const revenueTooltip = document.querySelector('#revenue-tooltip .tooltip-content');
        if (revenueTooltip) {
            const staffCost = this.staff.length * 50; // Estimated upkeep
            const netRevenue = this.revenue - this.dayStartRevenue;
            const dayProgress = this.dayTimer / this.dayDuration;
            
            // Calculate projected end-of-day revenue based on current pace
            let projectedRevenue = this.revenue;
            if (dayProgress > 0) {
                const revenuePerSecond = netRevenue / this.dayTimer;
                const remainingTime = this.dayDuration - this.dayTimer;
                const projectedGain = revenuePerSecond * remainingTime;
                projectedRevenue = Math.floor(this.revenue + projectedGain);
            }
            
            // Add 10% bonus
            const bonusRevenue = Math.floor(projectedRevenue * 0.1);
            const finalProjected = projectedRevenue + bonusRevenue;
            
            const projectionColor = projectedRevenue > this.revenue ? '#28a745' : '#666';
            
            revenueTooltip.innerHTML = `
                <strong>Revenue Details</strong><br>
                Total: $${this.revenue}<br>
                Today's Gain: $${netRevenue}<br>
                <span style="color: ${projectionColor};">📊 Projected EOD: $${finalProjected}</span><br>
                <span style="font-size: 0.85rem; color: #888;">(includes 10% bonus)</span><br>
                Staff Count: ${this.staff.length}<br>
                ${this.day > 1 ? `Previous Day: $${this.previousDayRevenue}<br>` : ''}
            `;
        }
        
        const avgRating = this.calculateAverageRating();
        document.getElementById('overall-rating').textContent = avgRating.toFixed(1);
        
        // Update rating tooltip (QOL1)
        const ratingTooltip = document.querySelector('#rating-tooltip .tooltip-content');
        if (ratingTooltip) {
            const total = this.happyCustomers + this.unhappyCustomers;
            const successRate = total > 0 ? ((this.happyCustomers / total) * 100).toFixed(1) : '100.0';
            ratingTooltip.innerHTML = `
                <strong>Customer Feedback</strong><br>
                Happy: ${this.happyCustomers} 😊<br>
                Unhappy: ${this.unhappyCustomers} 😞<br>
                Success Rate: ${successRate}%<br>
                VIP Served: ${this.vipCustomers} ⭐
            `;
        }
    }
    
    calculateAverageRating() {
        const total = this.happyCustomers + this.unhappyCustomers;
        if (total === 0) return 5.0;
        return (this.happyCustomers / total) * 5;
    }
    
    renderOrders() {
        const container = document.getElementById('orders-container');
        const count = document.getElementById('orders-count');
        
        count.textContent = this.orders.length;
        container.innerHTML = '';
        
        if (this.orders.length === 0) {
            container.innerHTML = '<p style="text-align: center; color: #666; padding: 20px;">No active orders</p>';
            return;
        }
        
        // Sort orders: priority first, then pending urgent, then by time remaining
        const sortedOrders = [...this.orders].sort((a, b) => {
            // Priority orders come first
            if (a.isPriority && !b.isPriority) return -1;
            if (!a.isPriority && b.isPriority) return 1;
            
            const aTimePercent = (a.timeRemaining / a.timeLimit) * 100;
            const bTimePercent = (b.timeRemaining / b.timeLimit) * 100;
            
            // Prioritize pending orders over in-progress
            if (a.status === 'pending' && b.status !== 'pending') return -1;
            if (a.status !== 'pending' && b.status === 'pending') return 1;
            
            // Then sort by urgency (time remaining percentage)
            return aTimePercent - bTimePercent;
        });
        
        sortedOrders.forEach(order => {
            const orderCard = document.createElement('div');
            orderCard.className = 'order-card';
            
            const timePercent = (order.timeRemaining / order.timeLimit) * 100;
            if (timePercent < 30) {
                orderCard.classList.add('urgent');
            }
            
            let timerClass = '';
            if (timePercent < 30) {
                timerClass = 'critical';
            } else if (timePercent < 60) {
                timerClass = 'warning';
            }
            
            const itemsList = order.items.map(item => `• ${item.name}`).join('<br>');
            
            // Get assigned staff name
            let assignedStaffInfo = '';
            if (order.assignedStaff) {
                const assignedStaff = this.staff.find(s => s.id === order.assignedStaff);
                if (assignedStaff) {
                    assignedStaffInfo = `<div style="margin: 5px 0; font-size: 0.85rem; color: #667eea;">👨‍🍳 ${assignedStaff.name}</div>`;
                }
            }
            
            // Add VIP styling and badge
            const vipBadge = order.isVIP ? '<span class="vip-badge">⭐ VIP</span>' : '';
            const priorityBadge = order.isPriority ? '<span class="priority-badge">⚡ Priority</span>' : '';
            if (order.isVIP) {
                orderCard.classList.add('vip-order');
            }
            if (order.isPriority) {
                orderCard.classList.add('priority-order');
            }
            
            // Check for staff specialization match
            let specializationHint = '';
            if (order.status === 'pending') {
                const matchingStaff = this.staff.filter(s => 
                    s.status === 'available' && 
                    order.items.some(item => item.category === s.speciality)
                );
                if (matchingStaff.length > 0) {
                    const staffNames = matchingStaff.slice(0, 2).map(s => s.name.split(' ')[0]).join(', ');
                    specializationHint = `<div style="margin: 5px 0; font-size: 0.8rem; color: #28a745;">✨ Best: ${staffNames}</div>`;
                }
            }
            
            orderCard.innerHTML = `
                <div class="order-header">
                    <span class="order-number">Order #${order.id} ${vipBadge}${priorityBadge}</span>
                    <span class="order-timer ${timerClass}">${order.timeRemaining}s</span>
                </div>
                <div class="order-items">${itemsList}</div>
                <div style="margin: 5px 0; font-weight: bold; color: #28a745;">Total: $${order.totalPrice}</div>
                ${assignedStaffInfo}
                ${specializationHint}
                <div class="order-status">
                    <div class="order-progress">
                        <div class="order-progress-bar" style="width: ${order.progress}%"></div>
                    </div>
                    ${order.status === 'pending' ? 
                        `<div style="display: flex; gap: 5px;">
                            <button class="assign-btn" onclick="game.assignOrderToStaff(${order.id})">Assign</button>
                            <button class="priority-btn ${order.isPriority ? 'active' : ''}" onclick="game.toggleOrderPriority(${order.id})" title="Mark as priority">⚡</button>
                        </div>` :
                        order.status === 'paused' ?
                        `<span style="font-size: 0.85rem; color: #ff9800;">⏸️ Paused</span>` :
                        `<span style="font-size: 0.85rem; color: #666;">In Progress</span>`
                    }
                </div>
            `;
            
            container.appendChild(orderCard);
        });
    }
    
    renderStaff() {
        const container = document.getElementById('staff-container');
        const count = document.getElementById('staff-count');
        
        count.textContent = this.staff.length;
        container.innerHTML = '';
        
        this.staff.forEach(staff => {
            const staffCard = document.createElement('div');
            staffCard.className = 'staff-card';
            staffCard.title = `Speciality: ${staff.speciality} | Orders Completed: ${staff.ordersCompleted}`;
            
            const upgradeCost = 100 + (staff.upgradeLevel * 50);
            const canUpgrade = staff.upgradeLevel < staff.maxUpgradeLevel;
            const upgradeStars = '⭐'.repeat(staff.upgradeLevel);
            
            // Performance bar color
            let performanceColor = '#28a745'; // green
            if (staff.performance < 50) {
                performanceColor = '#dc3545'; // red
            } else if (staff.performance < 75) {
                performanceColor = '#ffc107'; // yellow
            }
            
            // Fatigue bar color
            let fatigueColor = '#28a745'; // green (low fatigue is good)
            if (staff.fatigue > 70) {
                fatigueColor = '#dc3545'; // red
            } else if (staff.fatigue > 40) {
                fatigueColor = '#ffc107'; // yellow
            }
            
            // Morale bar color
            let moraleColor = '#28a745'; // green
            if (staff.morale < 50) {
                moraleColor = '#dc3545'; // red
            } else if (staff.morale < 75) {
                moraleColor = '#ffc107'; // yellow
            }
            
            const canRest = staff.status === 'available' && staff.fatigue > 30;
            
            // QOL3: Efficiency badge based on current performance
            let efficiencyBadge = '';
            const effPercent = staff.efficiency * 100;
            if (effPercent >= 90) {
                efficiencyBadge = '<span class="efficiency-badge excellent" title="Excellent Performance">⭐⭐⭐</span>';
            } else if (effPercent >= 75) {
                efficiencyBadge = '<span class="efficiency-badge good" title="Good Performance">⭐⭐</span>';
            } else if (effPercent >= 60) {
                efficiencyBadge = '<span class="efficiency-badge average" title="Average Performance">⭐</span>';
            } else {
                efficiencyBadge = '<span class="efficiency-badge poor" title="Needs Rest">⚠️</span>';
            }
            
            staffCard.innerHTML = `
                <div class="staff-header">
                    <div>
                        <div class="staff-name">${staff.name} ${upgradeStars} ${efficiencyBadge}</div>
                        <div class="staff-role">${staff.role} ${canUpgrade ? `(Level ${staff.upgradeLevel}/${staff.maxUpgradeLevel})` : '(MAX)'}</div>
                    </div>
                    <span class="staff-status ${staff.status}">${staff.status.toUpperCase()}</span>
                </div>
                <div class="staff-metrics">
                    <div class="metric">
                        <span class="metric-label">Efficiency</span>
                        <span class="metric-value">${(staff.efficiency * 100).toFixed(0)}%</span>
                    </div>
                    <div class="metric">
                        <span class="metric-label">Performance</span>
                        <span class="metric-value">${staff.performance.toFixed(0)}%</span>
                    </div>
                    <div class="metric">
                        <span class="metric-label">Orders Done</span>
                        <span class="metric-value">${staff.ordersCompleted}</span>
                    </div>
                </div>
                <div class="performance-bar-container" title="Performance">
                    <div class="performance-bar" style="width: ${staff.performance}%; background-color: ${performanceColor};"></div>
                </div>
                <div class="staff-wellbeing">
                    <div class="wellbeing-item">
                        <span class="wellbeing-label">😴 Fatigue: ${staff.fatigue.toFixed(0)}%</span>
                        <div class="wellbeing-bar-container">
                            <div class="wellbeing-bar" style="width: ${staff.fatigue}%; background-color: ${fatigueColor};"></div>
                        </div>
                    </div>
                    <div class="wellbeing-item">
                        <span class="wellbeing-label">😊 Morale: ${staff.morale.toFixed(0)}%</span>
                        <div class="wellbeing-bar-container">
                            <div class="wellbeing-bar" style="width: ${staff.morale}%; background-color: ${moraleColor};"></div>
                        </div>
                    </div>
                </div>
                <div style="display: flex; gap: 5px; margin-top: 10px;">
                    ${canUpgrade ? `
                        <button class="upgrade-btn" onclick="game.upgradeStaff(${staff.id})" ${this.revenue < upgradeCost ? 'disabled' : ''}>
                            ⬆️ Upgrade ($${upgradeCost})
                        </button>
                    ` : '<div style="flex: 1; text-align: center; padding: 8px; color: #28a745; font-weight: bold; font-size: 0.9rem;">✓ MAX LEVEL</div>'}
                    ${canRest ? `
                        <button class="rest-btn" onclick="game.sendStaffToRest(${staff.id})" title="Send staff to rest">
                            😴 Rest
                        </button>
                    ` : ''}
                </div>
                ${staff.orderHistory && staff.orderHistory.length > 0 ? `
                    <div class="order-history">
                        <div class="order-history-header">📊 Recent Orders</div>
                        ${staff.orderHistory.map(order => `
                            <div class="order-history-item ${order.success ? 'success' : 'failed'}">
                                <span class="order-history-icon">${order.success ? '✓' : '✗'}</span>
                                <span class="order-history-dish">${order.dishName.length > 25 ? order.dishName.substring(0, 25) + '...' : order.dishName}</span>
                                ${order.success ? `<span class="order-history-price">+$${order.price}</span>` : ''}
                            </div>
                        `).join('')}
                    </div>
                ` : ''}
            `;
            
            container.appendChild(staffCard);
        });
        
        // Add hire staff button
        const hireCard = document.createElement('div');
        hireCard.className = 'staff-card hire-staff-card';
        const hireCost = 150;
        hireCard.innerHTML = `
            <div style="text-align: center; padding: 20px;">
                <div style="font-size: 3rem; margin-bottom: 10px;">➕</div>
                <div style="font-size: 1.2rem; font-weight: bold; margin-bottom: 10px;">Hire New Staff</div>
                <div style="color: #666; margin-bottom: 15px;">Expand your team with random stats</div>
                <button class="upgrade-btn" onclick="game.hireStaff()" ${this.revenue < hireCost ? 'disabled' : ''}>
                    💼 Hire ($${hireCost})
                </button>
            </div>
        `;
        container.appendChild(hireCard);
    }
    
    renderInventory() {
        const container = document.getElementById('inventory-container');
        container.innerHTML = '';
        
        // QOL2: Calculate ingredient usage in active orders
        const ingredientUsage = {};
        this.orders.forEach(order => {
            Object.keys(order.requiredIngredients).forEach(ing => {
                ingredientUsage[ing] = (ingredientUsage[ing] || 0) + 1;
            });
        });
        
        for (const [name, stock] of Object.entries(this.inventory)) {
            const percentage = (stock.current / stock.max) * 100;
            let levelClass = 'high';
            if (percentage < 30) {
                levelClass = 'low';
            } else if (percentage < 60) {
                levelClass = 'medium';
            }
            
            const item = document.createElement('div');
            item.className = 'inventory-item';
            item.title = `${name}: ${stock.current}/${stock.max} (${percentage.toFixed(0)}%)`;
            
            const restockCost = 10;
            const canRestock = this.revenue >= restockCost && stock.current < stock.max;
            
            // QOL2: Show usage badge
            const usageCount = ingredientUsage[name] || 0;
            const usageBadge = usageCount > 0 ? `<span class="usage-badge" title="Used in ${usageCount} active order(s)">🍽️ ${usageCount}</span>` : '';
            
            item.innerHTML = `
                <div class="inventory-header">
                    <span class="ingredient-name">${name}</span>
                    <span class="stock-level ${levelClass}">${stock.current}/${stock.max}</span>
                </div>
                ${usageBadge}
                <div class="stock-bar">
                    <div class="stock-bar-fill ${levelClass}" style="width: ${percentage}%"></div>
                </div>
                <button class="restock-btn" onclick="game.restockSingleItem('${name}')" 
                    ${!canRestock ? 'disabled' : ''}>
                    📦 Restock ($${restockCost})
                </button>
            `;
            
            container.appendChild(item);
        }
    }
    
    renderSatisfaction() {
        const satisfactionBar = document.getElementById('satisfaction-bar');
        const happyCustomers = document.getElementById('happy-customers');
        const unhappyCustomers = document.getElementById('unhappy-customers');
        const vipCustomers = document.getElementById('vip-customers');
        const avgWaitTime = document.getElementById('avg-wait-time');
        
        satisfactionBar.style.width = `${this.customerSatisfaction}%`;
        happyCustomers.textContent = this.happyCustomers;
        unhappyCustomers.textContent = this.unhappyCustomers;
        vipCustomers.textContent = this.vipCustomers;
        
        // Calculate average wait time from completed orders
        if (this.completedOrders.length > 0) {
            const totalWaitTime = this.completedOrders.reduce((sum, order) => {
                return sum + (order.timeLimit - order.timeRemaining);
            }, 0);
            const avgTime = Math.floor(totalWaitTime / this.completedOrders.length);
            avgWaitTime.textContent = `${avgTime}s`;
        } else {
            avgWaitTime.textContent = '0s';
        }
    }
    
    renderRecipes() {
        const container = document.getElementById('recipes-container');
        if (!container) return; // Recipe view might not exist in HTML yet
        
        container.innerHTML = '';
        
        // Group recipes by unlocked/locked
        const unlocked = this.allRecipes.filter(r => this.unlockedRecipes.includes(r.id));
        const locked = this.allRecipes.filter(r => !this.unlockedRecipes.includes(r.id));
        
        // Render unlocked recipes
        if (unlocked.length > 0) {
            const unlockedSection = document.createElement('div');
            unlockedSection.innerHTML = '<h3 style="color: #28a745; margin: 10px 0;">✅ Unlocked Recipes</h3>';
            container.appendChild(unlockedSection);
            
            unlocked.forEach(recipe => {
                const recipeCard = document.createElement('div');
                recipeCard.className = 'recipe-card unlocked';
                recipeCard.innerHTML = `
                    <div class="recipe-header">
                        <span class="recipe-name">${recipe.name}</span>
                        <span class="recipe-price">$${recipe.price}</span>
                    </div>
                    <div class="recipe-category">${recipe.category}</div>
                    <div class="recipe-ingredients">
                        ${recipe.ingredients.map(ing => `<span class="ingredient-tag">${ing}</span>`).join(' ')}
                    </div>
                    <div class="recipe-time">⏱️ ${recipe.time}s</div>
                `;
                container.appendChild(recipeCard);
            });
        }
        
        // Render locked recipes
        if (locked.length > 0) {
            const lockedSection = document.createElement('div');
            lockedSection.innerHTML = '<h3 style="color: #666; margin: 20px 0 10px 0;">🔒 Locked Recipes</h3>';
            container.appendChild(lockedSection);
            
            locked.forEach(recipe => {
                const recipeCard = document.createElement('div');
                recipeCard.className = 'recipe-card locked';
                recipeCard.innerHTML = `
                    <div class="recipe-header">
                        <span class="recipe-name">${recipe.name}</span>
                        <span class="recipe-price">$${recipe.price}</span>
                    </div>
                    <div class="recipe-category">${recipe.category}</div>
                    <div class="recipe-unlock">
                        🔒 Unlock at ${recipe.unlockAt} completed orders
                        <div class="unlock-progress">
                            <div class="unlock-progress-bar" style="width: ${Math.min(100, (this.totalOrdersCompleted / recipe.unlockAt) * 100)}%"></div>
                        </div>
                        <div style="font-size: 0.8rem; color: #666; margin-top: 5px;">
                            ${this.totalOrdersCompleted} / ${recipe.unlockAt} orders
                        </div>
                    </div>
                `;
                container.appendChild(recipeCard);
            });
        }
    }
    
    renderEquipment() {
        const container = document.getElementById('equipment-container');
        if (!container) return;
        
        container.innerHTML = '';
        
        this.equipmentTypes.forEach(type => {
            const equipment = this.equipment[type.id];
            const currentLevel = equipment.level;
            const maxLevel = type.maxLevel;
            const upgradeCost = type.baseCost + (currentLevel * type.baseCost * 0.5);
            const canUpgrade = this.revenue >= upgradeCost && currentLevel < maxLevel;
            
            const equipCard = document.createElement('div');
            equipCard.className = 'equipment-card';
            
            const stars = '⭐'.repeat(currentLevel);
            const emptyStars = '☆'.repeat(maxLevel - currentLevel);
            
            const bonusPerLevel = (type.effectPerLevel * 100).toFixed(0);
            const currentBonus = (currentLevel * type.effectPerLevel * 100).toFixed(0);
            
            equipCard.innerHTML = `
                <div class="equipment-header">
                    <span class="equipment-icon">${type.icon}</span>
                    <div class="equipment-info">
                        <div class="equipment-name">${type.name}</div>
                        <div class="equipment-level">${stars}${emptyStars} Level ${currentLevel}/${maxLevel}</div>
                    </div>
                </div>
                <div class="equipment-description">${type.description}</div>
                <div class="equipment-stats">
                    <div class="stat-item">
                        <span class="stat-label">Current Bonus:</span>
                        <span class="stat-value">${currentBonus}%</span>
                    </div>
                    <div class="stat-item">
                        <span class="stat-label">Per Level:</span>
                        <span class="stat-value">+${bonusPerLevel}%</span>
                    </div>
                </div>
                <button 
                    class="upgrade-equipment-btn ${canUpgrade ? '' : 'disabled'}" 
                    data-equipment-id="${type.id}"
                    ${!canUpgrade ? 'disabled' : ''}
                >
                    ${currentLevel >= maxLevel ? 'Max Level' : `Upgrade ($${upgradeCost})`}
                </button>
            `;
            
            container.appendChild(equipCard);
        });
        
        // Add event listeners to upgrade buttons
        document.querySelectorAll('.upgrade-equipment-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const equipmentId = e.target.getAttribute('data-equipment-id');
                this.upgradeEquipment(equipmentId);
            });
        });
    }
    
    renderAchievements() {
        const container = document.getElementById('achievements-container');
        if (!container) return;
        
        container.innerHTML = '';
        
        // Group achievements by category
        const categories = {
            'orders': { name: 'Order Completion', icon: '📋' },
            'revenue': { name: 'Revenue Milestones', icon: '💰' },
            'staff': { name: 'Staff Management', icon: '👥' },
            'days': { name: 'Survival', icon: '📅' },
            'perfect_days': { name: 'Excellence', icon: '😊' },
            'vip': { name: 'VIP Service', icon: '⭐' },
            'equipment': { name: 'Equipment', icon: '🔧' }
        };
        
        Object.keys(categories).forEach(categoryKey => {
            const categoryAchievements = this.allAchievements.filter(a => a.category === categoryKey);
            if (categoryAchievements.length === 0) return;
            
            const categoryDiv = document.createElement('div');
            categoryDiv.className = 'achievement-category';
            
            const categoryHeader = document.createElement('div');
            categoryHeader.className = 'achievement-category-header';
            categoryHeader.innerHTML = `
                <span class="category-icon">${categories[categoryKey].icon}</span>
                <span class="category-name">${categories[categoryKey].name}</span>
            `;
            categoryDiv.appendChild(categoryHeader);
            
            const achievementsGrid = document.createElement('div');
            achievementsGrid.className = 'achievements-grid';
            
            categoryAchievements.forEach(achievement => {
                const achievementCard = document.createElement('div');
                achievementCard.className = `achievement-card ${achievement.unlocked ? 'unlocked' : 'locked'}`;
                
                // Calculate progress
                let currentValue = 0;
                switch(achievement.category) {
                    case 'orders':
                        currentValue = this.totalOrdersCompleted;
                        break;
                    case 'revenue':
                        currentValue = this.highestRevenue;
                        break;
                    case 'staff':
                        currentValue = this.totalStaffHired;
                        break;
                    case 'days':
                        currentValue = this.day;
                        break;
                    case 'perfect_days':
                        currentValue = this.perfectDays;
                        break;
                    case 'vip':
                        currentValue = this.vipCustomers;
                        break;
                    case 'equipment':
                        currentValue = Object.values(this.equipment).reduce((sum, eq) => sum + eq.level, 0);
                        break;
                }
                
                const progress = Math.min(100, (currentValue / achievement.requirement) * 100);
                
                achievementCard.innerHTML = `
                    <div class="achievement-icon ${achievement.unlocked ? '' : 'grayscale'}">${achievement.icon}</div>
                    <div class="achievement-info">
                        <div class="achievement-name">${achievement.name}</div>
                        <div class="achievement-description">${achievement.description}</div>
                        <div class="achievement-progress">
                            <div class="progress-bar-container">
                                <div class="progress-bar-fill" style="width: ${progress}%"></div>
                            </div>
                            <div class="progress-text">${currentValue} / ${achievement.requirement}</div>
                        </div>
                    </div>
                `;
                
                achievementsGrid.appendChild(achievementCard);
            });
            
            categoryDiv.appendChild(achievementsGrid);
            container.appendChild(categoryDiv);
        });
    }
}

// Initialize game
let game;

document.addEventListener('DOMContentLoaded', () => {
    game = new RestaurantGame();
    
    // Button event listeners
    document.getElementById('start-game-btn').addEventListener('click', () => {
        // Resume AudioContext on user interaction
        if (game.audioContext && game.audioContext.state === 'suspended') {
            game.audioContext.resume();
        }
        
        game.start();
        document.getElementById('start-game-btn').disabled = true;
        document.getElementById('pause-game-btn').disabled = false;
        document.getElementById('new-order-btn').disabled = false;
        game.render();
    });
    
    document.getElementById('pause-game-btn').addEventListener('click', () => {
        game.pause();
        const btn = document.getElementById('pause-game-btn');
        btn.textContent = game.isPaused ? 'Resume' : 'Pause';
    });
    
    document.getElementById('new-order-btn').addEventListener('click', () => {
        game.generateOrder();
    });
    
    document.getElementById('restock-btn').addEventListener('click', () => {
        game.restockInventory();
    });
    
    document.getElementById('sound-toggle-btn').addEventListener('click', () => {
        game.toggleSound();
    });
    
    document.getElementById('auto-assign-btn').addEventListener('click', () => {
        game.toggleAutoAssign();
    });
    
    document.getElementById('shortcuts-help-btn').addEventListener('click', () => {
        game.toggleShortcutsModal();
    });
    
    // Keyboard shortcuts
    document.addEventListener('keydown', (e) => {
        // Only handle shortcuts if game is running
        if (!game.isRunning) return;
        
        // Prevent shortcuts when typing in input fields
        if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') return;
        
        switch(e.key.toLowerCase()) {
            case 'p': // Pause/Resume
                document.getElementById('pause-game-btn').click();
                break;
            case 'o': // Generate Order
                if (!game.isPaused) {
                    document.getElementById('new-order-btn').click();
                }
                break;
            case 'r': // Restock
                if (!game.isPaused) {
                    document.getElementById('restock-btn').click();
                }
                break;
            case 'a': // Toggle Auto-assign
                document.getElementById('auto-assign-btn').click();
                break;
            case 's': // Toggle Sound
                document.getElementById('sound-toggle-btn').click();
                break;
            case '?': // Show help
                game.addFeedback('⌨️ Shortcuts: P=Pause, O=Order, R=Restock, A=Auto-assign, S=Sound, Esc=Overview', true);
                break;
            case 'escape': // Return to overview
                game.switchView('overview');
                break;
        }
    });
    
    // View switching functionality
    document.querySelectorAll('.view-details-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const viewName = e.target.getAttribute('data-view');
            game.switchView(viewName);
        });
    });
    
    document.querySelectorAll('.back-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const backView = e.target.getAttribute('data-back');
            game.switchView(backView);
        });
    });
    
    // Initial render
    game.render();
});
