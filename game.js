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
        this.dayStartOrdersCompleted = 0; // Track orders completed at day start
        this.dayStartVipCustomers = 0; // Track VIP customers at day start
        this.dayStartStaffLevels = 0; // Track total staff levels at day start
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
        this.recipeData = null; // Store loaded recipe data
        this.ordersConfig = null; // Store orders configuration
        
        // Toast notification queue for stacking
        this.toastQueue = [];
        this.activeToasts = [];
        this.maxVisibleToasts = 5;
        
        // Staff of the Day tracking
        this.monthlyLeaderboard = []; // Track staff daily performance
        this.currentMonthWinner = null; // Current Staff of the Day
        this.hallOfFame = []; // Past winners
        this.weeklyChallenge = null; // Current weekly challenge
        this.challengeProgress = {}; // Track challenge progress per staff
        this.monthStartDay = 1; // Track which day the current month started
        this.monthDuration = 1; // A month is 1 in-game day (Employee of the Day)
        
        // Last day summary tracking
        this.lastDaySummary = null; // Store last completed day's summary
        
        // Food statistics tracking (from day 1)
        this.foodStatistics = {
            ingredientsUsed: {}, // Track total ingredients used since day 1
            ingredientsByDay: [], // Track ingredients used per day
            categorySales: {}, // Track sales by food category
            totalFoodCost: 0, // Total food cost spent
            foodCostByDay: [] // Track food cost per day
        };
        
        // NEW: Prestige and Run History System
        this.prestigeLevel = 0; // Current prestige level
        this.currentRun = 1; // Current run number
        this.runHistory = []; // History of all previous runs
        this.totalLifetimeRevenue = 0; // Total revenue across all runs
        this.totalLifetimeDays = 0; // Total days across all runs
        this.legacyBonuses = {}; // Permanent bonuses from prestige
        this.prestigePoints = 0; // Points to spend on bonuses
        
        // NEW: Multi-Resource Economy
        this.reputation = 0; // Restaurant reputation
        this.staffLoyalty = {}; // Loyalty per staff member
        
        // NEW: Season System
        this.currentSeason = null; // Current season
        this.seasonDay = 0; // Day within current season
        this.activeSeasonalEvents = []; // Active seasonal events
        
        // NEW: Location System
        this.currentLocation = 'downtown'; // Current restaurant location
        this.unlockedLocations = ['downtown']; // Available locations
        
        // NEW: Staff Skill Trees and Relationships
        this.staffSkillTrees = {}; // Skill tree progress per staff
        this.staffRelationships = []; // Staff relationships
        this.staffSkillPoints = {}; // Available skill points per staff
        
        // NEW: Recipe Mastery System
        this.recipeMastery = {}; // Mastery level per recipe
        this.discoveredRecipes = []; // Recipes discovered through experimentation
        
        // NEW: Regular Customers
        this.regularCustomers = {}; // Regular customer visit counts
        this.activeRegularCustomers = []; // Currently active regular customers
        
        // NEW: Dynamic Events
        this.activeEvents = []; // Currently active events
        this.eventHistory = []; // Past events
        
        // Initialize Audio Context for sound effects
        this.audioContext = null;
        this.initializeAudio();
        
        // Load recipe data and initialize game
        this.loadRecipeData();
    }
    
    async loadRecipeData() {
        try {
            // Load all external data files in parallel (including new systems)
            const [
                recipeRes,
                ordersRes,
                achievementsRes,
                equipmentRes,
                challengesRes,
                staffRolesRes,
                specialtiesRes,
                stringsRes,
                moodsRes,
                orderStatesRes,
                traitsRes,
                moraleFactorsRes,
                prestigeRes,
                seasonsRes,
                skillTreesRes,
                eventsRes,
                locationsRes,
                resourcesRes,
                relationshipsRes,
                customersRes,
                recipeMasteryRes
            ] = await Promise.all([
                fetch('data/recipes.json'),
                fetch('data/orders.json'),
                fetch('data/achievements.json'),
                fetch('data/equipment.json'),
                fetch('data/challenges.json'),
                fetch('data/staff_roles.json'),
                fetch('data/specialties.json'),
                fetch('data/strings.json'),
                fetch('data/moods.json'),
                fetch('data/order_states.json'),
                fetch('data/traits.json'),
                fetch('data/morale_factors.json'),
                fetch('data/prestige.json'),
                fetch('data/seasons.json'),
                fetch('data/skill_trees.json'),
                fetch('data/events.json'),
                fetch('data/locations.json'),
                fetch('data/resources.json'),
                fetch('data/relationships.json'),
                fetch('data/customers.json'),
                fetch('data/recipe_mastery.json')
            ]);

            this.recipeData = await recipeRes.json();
            this.ordersConfig = ordersRes.ok ? await ordersRes.json() : null;
            this.achievementsData = achievementsRes.ok ? await achievementsRes.json() : [];
            this.equipmentData = equipmentRes.ok ? await equipmentRes.json() : [];
            this.challengesData = challengesRes.ok ? await challengesRes.json() : [];
            this.staffRolesData = staffRolesRes.ok ? await staffRolesRes.json() : [];
            this.specialtiesData = specialtiesRes.ok ? await specialtiesRes.json() : [];
            this.stringsData = stringsRes.ok ? await stringsRes.json() : {};
            this.moodsData = moodsRes.ok ? await moodsRes.json() : [];
            this.orderStatesData = orderStatesRes.ok ? await orderStatesRes.json() : [];
            this.traitsData = traitsRes.ok ? await traitsRes.json() : [];
            this.moraleFactorsData = moraleFactorsRes.ok ? await moraleFactorsRes.json() : null;
            
            // NEW: Load new system data
            this.prestigeData = prestigeRes.ok ? await prestigeRes.json() : null;
            this.seasonsData = seasonsRes.ok ? await seasonsRes.json() : null;
            this.skillTreesData = skillTreesRes.ok ? await skillTreesRes.json() : null;
            this.eventsData = eventsRes.ok ? await eventsRes.json() : null;
            this.locationsData = locationsRes.ok ? await locationsRes.json() : null;
            this.resourcesData = resourcesRes.ok ? await resourcesRes.json() : null;
            this.relationshipsData = relationshipsRes.ok ? await relationshipsRes.json() : null;
            this.customersData = customersRes.ok ? await customersRes.json() : null;
            this.recipeMasteryData = recipeMasteryRes.ok ? await recipeMasteryRes.json() : null;

            this.initializeInventory();
            this.initializeStaff();
            this.initializeRecipes();
            this.initializeEquipment();
            this.initializeAchievements();
            this.initializeStaffOfDay();
            
            // NEW: Initialize new systems
            this.initializePrestigeSystem();
            this.initializeSeasonSystem();
            this.initializeLocationSystem();
            this.initializeRecipeMastery();
            this.initializeRegularCustomers();

            // Render after initialization is complete
            this.render();
        } catch (error) {
            console.error('Error loading game data:', error);
            // Fallback to original initialization if file not found
            this.initializeInventoryLegacy();
            this.initializeStaff();
            this.initializeRecipesLegacy();
            this.initializeEquipment();
            this.initializeAchievements();
            this.initializeStaffOfDay();

            // Render after initialization is complete
            this.render();
        }
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
    
    triggerHaptic(intensity = 'light') {
        // Trigger haptic feedback on supported mobile devices
        if (navigator.vibrate) {
            switch(intensity) {
                case 'light':
                    navigator.vibrate(10);
                    break;
                case 'medium':
                    navigator.vibrate(25);
                    break;
                case 'heavy':
                    navigator.vibrate(50);
                    break;
                default:
                    navigator.vibrate(10);
            }
        }
    }
    
    initializeInventory() {
        if (!this.recipeData) {
            return this.initializeInventoryLegacy();
        }
        
        this.recipeData.ingredients.forEach(ingredient => {
            this.inventory[ingredient.name] = {
                current: ingredient.current,
                max: ingredient.max
            };
        });
    }
    
    initializeInventoryLegacy() {
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
        // Generate 4 random staff members instead of hardcoded ones
        for (let i = 0; i < 4; i++) {
            const randomStaff = this.generateRandomStaff();
            this.staff.push(randomStaff);
        }
    }
    
    generateRandomStaff() {
        const firstNames = ['Alex', 'Jordan', 'Sam', 'Taylor', 'Morgan', 'Casey', 'Jamie', 'Riley', 'Quinn', 'Blake'];
        const lastNames = ['Smith', 'Johnson', 'Brown', 'Davis', 'Wilson', 'Martinez', 'Garcia', 'Lee', 'Wang', 'Chen'];
        const roles = Array.isArray(this.staffRolesData) && this.staffRolesData.length ? this.staffRolesData : ['Line Cook', 'Prep Cook', 'Sous Chef', 'Head Chef'];
        const specialities = Array.isArray(this.specialtiesData) && this.specialtiesData.length ? this.specialtiesData : ['Italian', 'Asian', 'Grill', 'Prep', 'Mexican', 'French', 'Pastry', 'Seafood'];

        const firstName = firstNames[Math.floor(Math.random() * firstNames.length)];
        const lastName = lastNames[Math.floor(Math.random() * lastNames.length)];
        const role = roles[Math.floor(Math.random() * roles.length)];
        const speciality = specialities[Math.floor(Math.random() * specialities.length)];
        const randomEfficiency = 0.6 + Math.random() * 0.3; // Random efficiency between 0.6 and 0.9

        // Assign 2 random permanent traits
        const traits = this.getRandomTraits(2);
        
        // Calculate base performance from traits (additive, not multiplicative)
        const traitsModifier = traits.reduce((acc, trait) => acc + trait.modifier, 0);
        const basePerformance = 100 + traitsModifier; // Start at 100, add trait bonuses

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
            performance: basePerformance,
            basePerformance: basePerformance, // Store base performance for calculations
            traits: traits, // Store permanent traits
            upgradeLevel: 0,
            maxUpgradeLevel: 3,
            fatigue: 0, // Fatigue level (0-100)
            morale: 100, // Morale level (0-100)
            lastRestTime: 0, // Track when staff last rested
            orderHistory: [], // QOL3: Track last 5 orders
            consecutiveOrders: 0, // Track consecutive orders for morale
            lastOrderTime: 0, // Track when last order was completed
            // Mood system
            mood: this.getRandomMood(),
            moodChangeTimer: 0,
            moodChangeDuration: 60 + Math.floor(Math.random() * 60), // Mood changes every 60-120 seconds
            // Staff of the Day metrics
            monthlyScore: 0,
            monthlyOrders: 0,
            monthlyRevenue: 0,
            monthlyTips: 0,
            fastestOrder: null,
            isEmployeeOfMonth: false,
            employeeOfMonthTitle: '',
            employeeOfMonthBonus: 0,
            hallOfFameCount: 0
        };
    }
    
    getRandomTraits(count) {
        const availableTraits = Array.isArray(this.traitsData) && this.traitsData.length ? this.traitsData : [];
        if (availableTraits.length === 0) {
            // Fallback if traits not loaded
            return [];
        }
        
        // Shuffle and pick random traits
        const shuffled = [...availableTraits].sort(() => Math.random() - 0.5);
        return shuffled.slice(0, count);
    }
    
    getRandomMood(currentMood = null, staff = null) {
        const moods = Array.isArray(this.moodsData) && this.moodsData.length ? this.moodsData : [
            { name: 'Happy', emoji: '😊', performanceModifier: 1.15, description: '+15% performance' },
            { name: 'Focused', emoji: '😎', performanceModifier: 1.10, description: '+10% performance' },
            { name: 'Neutral', emoji: '😐', performanceModifier: 1.0, description: 'Normal performance' },
            { name: 'Tired', emoji: '😴', performanceModifier: 0.90, description: '-10% performance' },
            { name: 'Stressed', emoji: '😰', performanceModifier: 0.85, description: '-15% performance' },
            { name: 'Energized', emoji: '🤩', performanceModifier: 1.20, description: '+20% performance' }
        ];
        
        // Filter out logically inconsistent moods based on staff state
        let availableMoods = [...moods];
        if (staff) {
            // Don't allow "Tired" mood if fatigue is low (< 40)
            if (staff.fatigue < 40) {
                availableMoods = availableMoods.filter(m => m.name !== 'Tired');
            }
            // Don't allow "Energized" mood if fatigue is very high (> 70)
            if (staff.fatigue > 70) {
                availableMoods = availableMoods.filter(m => m.name !== 'Energized');
            }
            // Don't allow "Stressed" mood if morale is high (> 80) and fatigue is low (< 30)
            if (staff.morale > 80 && staff.fatigue < 30) {
                availableMoods = availableMoods.filter(m => m.name !== 'Stressed');
            }
        }
        
        // Filter out current mood to ensure mood always changes
        if (currentMood) {
            availableMoods = availableMoods.filter(m => m.name !== currentMood.name);
        }
        
        // If filtering resulted in no moods, use all moods except current
        if (availableMoods.length === 0) {
            availableMoods = currentMood ? moods.filter(m => m.name !== currentMood.name) : moods;
        }
        
        return availableMoods[Math.floor(Math.random() * availableMoods.length)];
    }
    
    applyMoraleFactor(staff, factorId, eventData = {}) {
        if (!this.moraleFactorsData || !this.moraleFactorsData.moraleFactors) return;
        
        const factors = this.moraleFactorsData.moraleFactors;
        const allFactors = [...factors.positiveFactors, ...factors.negativeFactors];
        const factor = allFactors.find(f => f.id === factorId);
        
        if (!factor) return;
        
        // Check if factor conditions are met
        let shouldApply = true;
        if (factor.fatigueThreshold !== undefined) {
            if (factor.moraleChange > 0) {
                shouldApply = staff.fatigue <= factor.fatigueThreshold;
            } else {
                shouldApply = staff.fatigue >= factor.fatigueThreshold;
            }
        }
        if (factor.performanceThreshold !== undefined) {
            if (factor.moraleChange > 0) {
                shouldApply = staff.performance >= factor.performanceThreshold;
            } else {
                shouldApply = staff.performance <= factor.performanceThreshold;
            }
        }
        if (factor.consecutiveOrdersThreshold !== undefined) {
            shouldApply = (eventData.consecutiveOrders || 0) >= factor.consecutiveOrdersThreshold;
        }
        if (factor.idleTimeThreshold !== undefined) {
            shouldApply = (eventData.idleTime || 0) >= factor.idleTimeThreshold;
        }
        
        if (shouldApply) {
            const oldMorale = staff.morale;
            staff.morale = Math.max(0, Math.min(100, staff.morale + factor.moraleChange));
            
            // Show feedback for significant morale changes
            if (Math.abs(factor.moraleChange) >= 5) {
                const emoji = factor.moraleChange > 0 ? '📈' : '📉';
                this.showToast({
                    icon: emoji,
                    title: `${staff.name} Morale ${factor.moraleChange > 0 ? 'Increased' : 'Decreased'}`,
                    message: factor.description,
                    type: factor.moraleChange > 0 ? 'success' : 'warning',
                    duration: 2500
                });
            }
        }
    }
    
    getMoralePerformanceModifier(morale) {
        if (!this.moraleFactorsData || !this.moraleFactorsData.moraleFactors) {
            // Fallback to simple calculation
            return 0.5 + (morale / 200);
        }
        
        const modifiers = this.moraleFactorsData.moraleFactors.performanceModifiers;
        const thresholds = this.moraleFactorsData.moraleFactors.moraleThresholds;
        
        if (morale >= thresholds.veryHigh) return modifiers.veryHighMorale;
        if (morale >= thresholds.high) return modifiers.highMorale;
        if (morale >= thresholds.medium) return modifiers.mediumMorale;
        if (morale >= thresholds.low) return modifiers.lowMorale;
        return modifiers.veryLowMorale;
    }
    
    calculateOrderTimeLimit(order) {
        if (!this.moraleFactorsData || !this.moraleFactorsData.orderComplexity) {
            // Fallback to default calculation
            return 100 + (order.items.length * 20);
        }
        
        const config = this.moraleFactorsData.orderComplexity;
        const effConfig = this.moraleFactorsData.efficiencyImpact;
        
        // Calculate complexity based on items
        let complexity = config.baseComplexity + (order.items.length * config.itemCountMultiplier);
        
        // VIP orders are more complex
        if (order.isVIP) {
            complexity *= config.vipMultiplier;
        }
        
        // Calculate base time
        let timeLimit = complexity * effConfig.baseTimePerComplexity;
        
        // Clamp to min/max
        timeLimit = Math.max(effConfig.minCompletionTime, Math.min(effConfig.maxCompletionTime, timeLimit));
        
        return Math.floor(timeLimit);
    }
    
    
    getOrderState(progress) {
        const states = Array.isArray(this.orderStatesData) && this.orderStatesData.length ? this.orderStatesData : [
            { state: 'Prepping', minProgress: 0, maxProgress: 20 },
            { state: 'Cooking', minProgress: 20, maxProgress: 50 },
            { state: 'Finishing', minProgress: 50, maxProgress: 80 },
            { state: 'Plating', minProgress: 80, maxProgress: 100 }
        ];
        
        for (const stateData of states) {
            if (progress >= stateData.minProgress && progress < stateData.maxProgress) {
                return stateData.state;
            }
        }
        return states[states.length - 1].state; // Return last state if 100%
    }
    
    initializeRecipes() {
        if (!this.recipeData) {
            return this.initializeRecipesLegacy();
        }
        
        // Combine all food and drink recipes
        this.allRecipes = [];
        
        // Add appetizers
        if (this.recipeData.foods.appetizers) {
            this.allRecipes = this.allRecipes.concat(this.recipeData.foods.appetizers);
        }
        
        // Add mains
        if (this.recipeData.foods.mains) {
            this.allRecipes = this.allRecipes.concat(this.recipeData.foods.mains);
        }
        
        // Add desserts
        if (this.recipeData.foods.desserts) {
            this.allRecipes = this.allRecipes.concat(this.recipeData.foods.desserts);
        }
        
        // Add drinks
        if (this.recipeData.drinks) {
            Object.keys(this.recipeData.drinks).forEach(category => {
                this.allRecipes = this.allRecipes.concat(this.recipeData.drinks[category]);
            });
        }
        
        // Start with basic recipes unlocked
        this.unlockedRecipes = this.allRecipes.filter(r => r.unlockAt === 0).map(r => r.id);
    }
    
    initializeRecipesLegacy() {
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
        // Use external equipment data if available
        this.equipmentTypes = Array.isArray(this.equipmentData) && this.equipmentData.length ? this.equipmentData : [];
        // Initialize all equipment at level 0
        this.equipment = {};
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
        this.showToast({
            icon: equipType.icon,
            title: 'Equipment Upgraded!',
            message: `${equipType.name} → Level ${equipment.level}`,
            type: 'success'
        });
        this.checkAchievements();
        this.triggerHaptic('medium');
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
        // Use external achievements data if available
        this.allAchievements = Array.isArray(this.achievementsData) && this.achievementsData.length ? this.achievementsData.map(a => ({...a, unlocked: false})) : [];
        this.achievements = [];
    }
    
    // NEW: Initialize Prestige System
    initializePrestigeSystem() {
        if (!this.prestigeData) return;
        
        // Apply prestige bonuses if any
        if (this.prestigeLevel > 0 && this.prestigeData.levels[this.prestigeLevel - 1]) {
            const prestigeBonus = this.prestigeData.levels[this.prestigeLevel - 1].bonuses;
            
            // Apply starting revenue bonus
            if (prestigeBonus.startingRevenue) {
                this.revenue += prestigeBonus.startingRevenue;
                this.dayStartRevenue = this.revenue;
            }
            
            // Store bonuses for later use
            this.legacyBonuses = prestigeBonus;
        }
    }
    
    // NEW: Initialize Season System
    initializeSeasonSystem() {
        if (!this.seasonsData || !this.seasonsData.seasons) return;
        
        // Start with spring season
        this.currentSeason = this.seasonsData.seasons[0];
        this.seasonDay = 0;
    }
    
    // NEW: Initialize Location System
    initializeLocationSystem() {
        if (!this.locationsData) return;
        
        // Set current location (default is downtown)
        const location = this.locationsData.locations.find(l => l.id === this.currentLocation);
        if (location) {
            this.currentLocationData = location;
        }
    }
    
    // NEW: Initialize Recipe Mastery
    initializeRecipeMastery() {
        if (!this.recipeMasteryData) return;
        
        // Initialize mastery levels for all recipes
        this.allRecipes.forEach(recipe => {
            if (!this.recipeMastery[recipe.id]) {
                this.recipeMastery[recipe.id] = {
                    level: 1,
                    completions: 0
                };
            }
        });
    }
    
    // NEW: Initialize Regular Customers
    initializeRegularCustomers() {
        if (!this.customersData || !this.customersData.regularCustomers) return;
        
        // Initialize visit counts for regular customers
        this.customersData.regularCustomers.forEach(customer => {
            if (!this.regularCustomers[customer.id]) {
                this.regularCustomers[customer.id] = {
                    visits: 0,
                    lastVisit: 0,
                    loyaltyTier: 0
                };
            }
        });
    }
    
    // NEW: Update Recipe Mastery after completing an order
    updateRecipeMastery(recipeId) {
        if (!this.recipeMastery[recipeId]) {
            this.recipeMastery[recipeId] = {
                level: 1,
                completions: 0
            };
        }
        
        this.recipeMastery[recipeId].completions++;
        
        // Check for level up
        if (this.recipeMasteryData && this.recipeMasteryData.mastery) {
            const masteryLevels = this.recipeMasteryData.mastery.levels;
            const currentLevel = this.recipeMastery[recipeId].level;
            
            if (currentLevel < masteryLevels.length) {
                const nextLevel = masteryLevels[currentLevel];
                if (this.recipeMastery[recipeId].completions >= nextLevel.completionsRequired) {
                    this.recipeMastery[recipeId].level++;
                    
                    const recipe = this.allRecipes.find(r => r.id === recipeId);
                    if (recipe) {
                        this.addFeedback(`${nextLevel.icon} ${recipe.name} mastery increased to ${nextLevel.name}!`, true);
                        this.showToast({
                            icon: nextLevel.icon,
                            title: 'Recipe Mastery Up!',
                            message: `${recipe.name} → ${nextLevel.name}`,
                            type: 'success'
                        });
                    }
                }
            }
        }
    }
    
    // NEW: Get Recipe Mastery Bonus
    getRecipeMasteryBonus(recipeId) {
        if (!this.recipeMastery[recipeId] || !this.recipeMasteryData) {
            return { cookingSpeed: 1.0, qualityBonus: 1.0, priceMultiplier: 1.0 };
        }
        
        const mastery = this.recipeMastery[recipeId];
        const masteryLevel = this.recipeMasteryData.mastery.levels[mastery.level - 1];
        
        return masteryLevel ? masteryLevel.bonuses : { cookingSpeed: 1.0, qualityBonus: 1.0, priceMultiplier: 1.0 };
    }
    
    // NEW: Advance Season
    advanceSeason() {
        if (!this.seasonsData || !this.seasonsData.seasons) return;
        
        this.seasonDay++;
        
        // Check if season should change
        if (this.seasonDay >= this.currentSeason.durationDays) {
            this.seasonDay = 0;
            
            // Move to next season
            const currentIndex = this.seasonsData.seasons.findIndex(s => s.id === this.currentSeason.id);
            const nextIndex = (currentIndex + 1) % this.seasonsData.seasons.length;
            this.currentSeason = this.seasonsData.seasons[nextIndex];
            
            this.addFeedback(`${this.currentSeason.icon} ${this.currentSeason.name} has arrived!`, true);
            this.showToast({
                icon: this.currentSeason.icon,
                title: 'New Season!',
                message: this.currentSeason.name,
                type: 'info',
                duration: 5000
            });
        }
    }
    
    // NEW: Check and trigger random events
    checkAndTriggerEvents() {
        if (!this.eventsData || !this.eventsData.events) return;
        
        // Check for event triggers
        this.eventsData.events.forEach(event => {
            // Skip if event is already active
            if (this.activeEvents.find(e => e.id === event.id)) return;
            
            // Check trigger conditions
            const conditions = event.triggerConditions;
            
            // Check minimum day requirement
            if (conditions.minDay && this.day < conditions.minDay) return;
            
            // Check reputation requirement
            if (conditions.minReputation && this.reputation < conditions.minReputation) return;
            
            // Check seasonal requirement
            if (event.seasonalOnly && this.currentSeason.id !== event.seasonalOnly) return;
            
            // Check probability
            if (conditions.probability && Math.random() > conditions.probability) return;
            
            // Event triggered!
            this.activateEvent(event);
        });
    }
    
    // NEW: Activate an event
    activateEvent(eventData) {
        const event = {
            ...eventData,
            startDay: this.day,
            endDay: this.day + (eventData.duration || 1),
            active: true
        };
        
        this.activeEvents.push(event);
        
        this.addFeedback(`${event.icon} ${event.name}: ${event.description}`, true);
        this.showToast({
            icon: event.icon,
            title: event.name,
            message: event.description,
            type: 'event',
            duration: 6000
        });
        
        this.playSuccessSound();
    }
    
    // NEW: Update active events
    updateActiveEvents() {
        // Remove expired events
        this.activeEvents = this.activeEvents.filter(event => {
            if (this.day >= event.endDay) {
                // Event ended
                this.eventHistory.push({
                    ...event,
                    completed: true
                });
                return false;
            }
            return true;
        });
    }
    
    // NEW: Calculate reputation gain
    gainReputation(amount, reason = '') {
        this.reputation += amount;
        
        if (amount > 0) {
            this.addFeedback(`⭐ +${amount} Reputation${reason ? ': ' + reason : ''}`, true);
        } else {
            this.addFeedback(`⭐ ${amount} Reputation${reason ? ': ' + reason : ''}`, false);
        }
        
        // Check for reputation tier unlocks
        if (this.resourcesData && this.resourcesData.reputation) {
            const tiers = this.resourcesData.reputation.tiers;
            tiers.forEach(tier => {
                if (this.reputation >= tier.threshold && this.reputation - amount < tier.threshold) {
                    this.showToast({
                        icon: tier.icon,
                        title: 'Reputation Tier Unlocked!',
                        message: `${tier.name}: ${tier.benefits.join(', ')}`,
                        type: 'success',
                        duration: 6000
                    });
                }
            });
        }
    }
    
    // NEW: Update staff loyalty
    updateStaffLoyalty(staffId, amount, reason = '') {
        if (!this.staffLoyalty[staffId]) {
            this.staffLoyalty[staffId] = 50; // Start at 50
        }
        
        this.staffLoyalty[staffId] += amount;
        this.staffLoyalty[staffId] = Math.max(0, Math.min(500, this.staffLoyalty[staffId]));
        
        const staff = this.staff.find(s => s.id === staffId);
        if (staff && amount > 0) {
            this.addFeedback(`❤️ ${staff.name} loyalty +${amount}${reason ? ': ' + reason : ''}`, true);
        }
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
                this.showAchievementToast(achievement);
            }
        });
    }
    
    showAchievementToast(achievement) {
        // Use generic toast system with achievement styling
        this.showToast({
            icon: achievement.icon,
            title: achievement.name,
            message: achievement.description,
            type: 'achievement'
        });
    }
    
    showToast({ icon = '💬', title = '', message = '', type = 'info', duration = 4000 }) {
        // Don't show toasts if a modal is active (player is in a menu)
        const activeModal = document.querySelector('.modal.modal-active');
        if (activeModal) {
            return; // Silently skip showing toast when in a menu
        }
        
        // Context-aware notification filtering based on current view
        // Don't show order-related notifications when viewing orders
        if (this.currentView === 'orders') {
            const orderRelatedToasts = [
                'Order Started',
                'Order Complete!',
                'VIP Order Complete!',
                'VIP Customer!'
            ];
            if (orderRelatedToasts.includes(title)) {
                return; // Skip order-related notifications in orders view
            }
        }
        
        // Don't show staff-related notifications when viewing staff
        if (this.currentView === 'staff') {
            const staffRelatedToasts = [
                'Mood Changed',
                'Order Started',
                'Order Complete!',
                'VIP Order Complete!'
            ];
            // Check if title matches staff-related patterns
            if (staffRelatedToasts.some(pattern => title.includes(pattern))) {
                return; // Skip staff-related notifications in staff view
            }
        }
        
        // Add toast to queue
        this.toastQueue.push({ icon, title, message, type, duration });
        
        // Process queue
        this.processToastQueue();
    }
    
    processToastQueue() {
        // Remove expired toasts from active list
        const now = Date.now();
        this.activeToasts = this.activeToasts.filter(toast => {
            if (now >= toast.expireTime) {
                toast.element.remove();
                return false;
            }
            return true;
        });
        
        // Show new toasts if there's room, with slight delays between them
        while (this.toastQueue.length > 0 && this.activeToasts.length < this.maxVisibleToasts) {
            const toastData = this.toastQueue.shift();
            // Add a small delay (200ms) between each toast for smoother stacking
            const delay = this.activeToasts.length * 200;
            setTimeout(() => this.displayToast(toastData), delay);
        }
    }
    
    displayToast({ icon, title, message, type, duration }) {
        // Determine color variant based on title for variety within same category
        let colorVariant = '';
        if (type === 'info') {
            if (title.includes('Mood')) {
                colorVariant = 'mood';
            } else if (title.includes('Resting')) {
                colorVariant = 'rest';
            }
        } else if (type === 'success') {
            if (title.includes('VIP')) {
                colorVariant = 'vip';
            } else if (title.includes('Tip')) {
                colorVariant = 'tip';
            }
        }
        
        // Create new toast element
        const toast = document.createElement('div');
        toast.className = `game-toast toast-${type}${colorVariant ? ' toast-' + type + '-' + colorVariant : ''}`;
        toast.innerHTML = `
            <div class="toast-icon">${icon}</div>
            <div class="toast-content">
                <div class="toast-title">${title}</div>
                <div class="toast-message">${message}</div>
            </div>
        `;
        document.body.appendChild(toast);
        
        // Calculate position based on active toasts
        const index = this.activeToasts.length;
        const topPosition = 80 + (index * 110); // Stack toasts vertically
        toast.style.top = topPosition + 'px';
        
        // Show toast with animation
        setTimeout(() => toast.classList.add('show'), 100);
        
        // Track active toast
        const expireTime = Date.now() + duration;
        this.activeToasts.push({ element: toast, expireTime });
        
        // Hide after duration
        setTimeout(() => {
            toast.classList.remove('show');
            setTimeout(() => {
                toast.remove();
                this.activeToasts = this.activeToasts.filter(t => t.element !== toast);
                // Reposition remaining toasts
                this.repositionToasts();
                // Process queue again in case there are pending toasts
                this.processToastQueue();
            }, 400); // Wait for fade out animation
        }, duration);
    }
    
    repositionToasts() {
        this.activeToasts.forEach((toast, index) => {
            const topPosition = 80 + (index * 110);
            toast.element.style.top = topPosition + 'px';
        });
    }
    
    initializeStaffOfDay() {
        // Initialize daily challenges
        this.generateWeeklyChallenge();
        
        // Initialize challenge progress for existing staff
        this.staff.forEach(staff => {
            this.challengeProgress[staff.id] = {
                ordersToday: 0,
                tipsToday: 0,
                fastestOrderToday: null,
                teamworkScore: 0
            };
        });
    }
    
    generateWeeklyChallenge() {
        const challenges = Array.isArray(this.challengesData) && this.challengesData.length ? this.challengesData : [];
        if (challenges.length === 0) return;
        this.weeklyChallenge = challenges[Math.floor(Math.random() * challenges.length)];
        this.weeklyChallenge.startDay = this.day;
        this.weeklyChallenge.endDay = this.day + 7;
    }
    
    updateStaffOfDayMetrics(staff, order, completionTime) {
        // Update daily metrics
        staff.monthlyOrders++;
        staff.monthlyRevenue += order.totalPrice || 0;
        
        // Calculate tips based on speed (faster = better tips)
        const expectedTime = order.timeLimit || 100;
        if (completionTime < expectedTime * 0.75) {
            const tipAmount = (order.totalPrice || 0) * 0.15; // 15% tip for fast service
            staff.monthlyTips += tipAmount;
            this.challengeProgress[staff.id].tipsToday += tipAmount;
        }
        
        // Track fastest order
        if (!staff.fastestOrder || completionTime < staff.fastestOrder) {
            staff.fastestOrder = completionTime;
        }
        if (!this.challengeProgress[staff.id].fastestOrderToday || 
            completionTime < this.challengeProgress[staff.id].fastestOrderToday) {
            this.challengeProgress[staff.id].fastestOrderToday = completionTime;
        }
        
        // Update daily challenge progress
        this.challengeProgress[staff.id].ordersToday++;
        
        // Update teamwork score (high performance = teamwork)
        if (staff.performance > 80) {
            this.challengeProgress[staff.id].teamworkScore += 1;
        }
        
        // Check if staff completed weekly challenge
        this.checkWeeklyChallengeCompletion(staff);
        
        // Calculate overall monthly score
        this.calculateMonthlyScore(staff);
    }
    
    checkWeeklyChallengeCompletion(staff) {
        if (!this.weeklyChallenge || this.day > this.weeklyChallenge.endDay) {
            return;
        }
        
        let completed = false;
        const progress = this.challengeProgress[staff.id];
        
        switch(this.weeklyChallenge.id) {
            case 'fastest_fulfillment':
                if (progress.fastestOrderToday && progress.fastestOrderToday <= this.weeklyChallenge.target) {
                    completed = true;
                }
                break;
            case 'highest_tips':
                if (progress.tipsToday >= this.weeklyChallenge.target) {
                    completed = true;
                }
                break;
            case 'most_orders':
                if (progress.ordersToday >= this.weeklyChallenge.target) {
                    completed = true;
                }
                break;
            case 'teamwork_hero':
                if (progress.teamworkScore >= this.weeklyChallenge.target) {
                    completed = true;
                }
                break;
        }
        
        if (completed && !staff.weeklyChallengeBadge) {
            staff.weeklyChallengeBadge = this.weeklyChallenge.icon;
            staff.monthlyScore += 50; // Bonus points for completing challenge
            this.addFeedback(`🏆 ${staff.name} completed the weekly challenge: ${this.weeklyChallenge.name}!`, true);
            this.playSuccessSound();
        }
    }
    
    calculateMonthlyScore(staff) {
        // Calculate comprehensive monthly score based on multiple factors
        let score = 0;
        
        // Orders completed (5 points each)
        score += staff.monthlyOrders * 5;
        
        // Revenue generated (1 point per $10)
        score += Math.floor(staff.monthlyRevenue / 10);
        
        // Tips earned (2 points per $1)
        score += staff.monthlyTips * 2;
        
        // Efficiency bonus (up to 50 points)
        score += staff.efficiency * 50;
        
        // Performance bonus (up to 30 points)
        score += (staff.performance / 100) * 30;
        
        // Morale bonus (up to 20 points)
        score += (staff.morale / 100) * 20;
        
        // Weekly challenge completion bonus (already added in checkWeeklyChallengeCompletion)
        
        // Fastest order bonus (up to 50 points based on speed)
        if (staff.fastestOrder) {
            const speedBonus = Math.max(0, 50 - Math.floor(staff.fastestOrder / 2));
            score += speedBonus;
        }
        
        staff.monthlyScore = Math.floor(score);
    }
    
    updateMonthlyLeaderboard() {
        // Calculate scores for all staff before sorting
        this.staff.forEach(staff => {
            this.calculateMonthlyScore(staff);
        });
        
        // Sort staff by monthly score
        this.monthlyLeaderboard = [...this.staff].sort((a, b) => b.monthlyScore - a.monthlyScore);
    }
    
    checkMonthlyReset() {
        // Check if it's time for a new month (every 30 days)
        if (this.day - this.monthStartDay >= this.monthDuration) {
            this.processMonthEnd();
        }
    }
    
    processMonthEnd() {
        this.updateMonthlyLeaderboard();
        
        // Award Staff of the Day
        if (this.monthlyLeaderboard.length > 0) {
            const winner = this.monthlyLeaderboard[0];
            
            // Remove previous Staff of the Day status
            this.staff.forEach(s => {
                s.isEmployeeOfMonth = false;
                s.employeeOfMonthBonus = 0;
                s.employeeOfMonthTitle = '';
            });
            
            // Set new Staff of the Day
            winner.isEmployeeOfMonth = true;
            winner.hallOfFameCount++;
            winner.employeeOfMonthBonus = 20; // 20% bonus
            
            // Apply morale factor for being Staff of the Day
            this.applyMoraleFactor(winner, 'employee_of_day');
            
            // Assign title based on performance
            if (winner.monthlyTips > 50) {
                winner.employeeOfMonthTitle = 'Tip Master';
            } else if (winner.fastestOrder && winner.fastestOrder < 60) {
                winner.employeeOfMonthTitle = 'Speed Demon';
            } else if (winner.monthlyOrders > 50) {
                winner.employeeOfMonthTitle = 'Order Champion';
            } else {
                winner.employeeOfMonthTitle = 'Reliable Star';
            }
            
            // Add to Hall of Fame or update existing entry
            const existingEntry = this.hallOfFame.find(entry => entry.name === winner.name);
            if (existingEntry) {
                // Update existing entry
                existingEntry.prestige++;
                existingEntry.lastWinDay = this.day;
                existingEntry.score = winner.monthlyScore;
                existingEntry.title = winner.employeeOfMonthTitle;
                existingEntry.orders = winner.monthlyOrders;
                existingEntry.revenue = winner.monthlyRevenue;
                existingEntry.tips = winner.monthlyTips;
            } else {
                // Create new entry
                this.hallOfFame.push({
                    name: winner.name,
                    prestige: 1,
                    lastWinDay: this.day,
                    month: Math.floor(this.day / this.monthDuration),
                    score: winner.monthlyScore,
                    title: winner.employeeOfMonthTitle,
                    orders: winner.monthlyOrders,
                    revenue: winner.monthlyRevenue,
                    tips: winner.monthlyTips
                });
            }
            
            this.currentMonthWinner = winner;
            
            // Show announcement with toast
            this.addFeedback(`🏆 Staff of the Day: ${winner.name} - ${winner.employeeOfMonthTitle}!`, true);
            this.showToast({
                icon: '🏆',
                title: 'Staff of the Day!',
                message: `${winner.name} - ${winner.employeeOfMonthTitle}`,
                type: 'achievement',
                duration: 5000
            });
            this.playSuccessSound();
        }
        
        // Reset monthly stats
        this.staff.forEach(staff => {
            staff.monthlyOrders = 0;
            staff.monthlyRevenue = 0;
            staff.monthlyTips = 0;
            staff.fastestOrder = null;
            staff.monthlyScore = 0;
            staff.weeklyChallengeBadge = null;
        });
        
        this.monthStartDay = this.day;
        
        // Generate new weekly challenge
        this.generateWeeklyChallenge();
    }
    
    applyStaffOfDayBonus(staff) {
        // Apply temporary skill boost to Staff of the Day
        if (staff.isEmployeeOfMonth && staff.employeeOfMonthBonus > 0) {
            const bonusMultiplier = 1 + (staff.employeeOfMonthBonus / 100);
            return staff.efficiency * bonusMultiplier;
        }
        return staff.efficiency;
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
        
        // Initialize challenge progress for new hire
        this.challengeProgress[newStaff.id] = {
            ordersToday: 0,
            tipsToday: 0,
            fastestOrderToday: null,
            teamworkScore: 0
        };
        
        this.addFeedback(`✅ Hired ${newStaff.name} (${newStaff.role}) - Efficiency: ${(newStaff.efficiency * 100).toFixed(0)}%`, true);
        this.showToast({
            icon: '👨‍🍳',
            title: 'New Staff Hired!',
            message: `${newStaff.name} - ${newStaff.role}`,
            type: 'success'
        });
        this.checkAchievements();
        this.triggerHaptic('medium');
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
        
        // Generate orders periodically with dynamic calculation
        this.orderInterval = setInterval(() => {
            if (!this.isPaused && this.isRunning) {
                const dynamicChance = this.calculateOrderSpawnChance();
                if (Math.random() < dynamicChance) {
                    this.generateOrder();
                }
            }
        }, 5000); // Check every 5 seconds
    }
    
    calculateOrderSpawnChance() {
        // Use default values if config not loaded
        let baseChance = 0.4;
        let maxChance = 0.8;
        let dayMultiplier = 0.05;
        
        if (this.ordersConfig && this.ordersConfig.spawnRates) {
            baseChance = this.ordersConfig.spawnRates.baseChance;
            maxChance = this.ordersConfig.spawnRates.maxChance;
            dayMultiplier = this.ordersConfig.spawnRates.dayMultiplier;
        }
        
        // Calculate base chance with day scaling
        let chance = Math.min(maxChance, baseChance + (this.day - 1) * dayMultiplier);
        
        // Apply day progression multiplier (early/middle/rush)
        const dayProgress = this.dayTimer / this.dayDuration;
        let progressMultiplier = 1.0;
        
        if (this.ordersConfig && this.ordersConfig.dayProgression) {
            if (dayProgress < this.ordersConfig.dayProgression.early.timeRange[1]) {
                progressMultiplier = this.ordersConfig.dayProgression.early.spawnMultiplier;
            } else if (dayProgress < this.ordersConfig.dayProgression.middle.timeRange[1]) {
                progressMultiplier = this.ordersConfig.dayProgression.middle.spawnMultiplier;
            } else {
                progressMultiplier = this.ordersConfig.dayProgression.rush.spawnMultiplier;
            }
        } else {
            // Default behavior without config
            if (dayProgress < 0.33) {
                progressMultiplier = 0.6;
            } else if (dayProgress < 0.66) {
                progressMultiplier = 1.0;
            } else {
                progressMultiplier = 1.5;
            }
        }
        
        chance *= progressMultiplier;
        
        // Apply staff scaling bonus
        if (this.ordersConfig && this.ordersConfig.staffScaling && this.ordersConfig.staffScaling.enabled) {
            const availableStaff = this.staff.filter(s => s.status === 'available').length;
            const staffBonus = Math.max(0, (availableStaff - this.ordersConfig.staffScaling.minStaff) * this.ordersConfig.staffScaling.bonusPerStaff);
            chance *= (1 + staffBonus);
        } else {
            // Default staff scaling without config
            const availableStaff = this.staff.filter(s => s.status === 'available').length;
            const staffBonus = Math.max(0, (availableStaff - 1) * 0.08);
            chance *= (1 + staffBonus);
        }
        
        // Keep within reasonable bounds
        return Math.min(maxChance * 1.5, Math.max(0.1, chance));
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
        // NEW: Store run history before resetting
        const runData = {
            run: this.currentRun,
            daysCompleted: this.day,
            revenueEarned: this.revenue,
            totalOrdersCompleted: this.totalOrdersCompleted,
            happyCustomers: this.happyCustomers,
            reputation: this.reputation,
            prestigeLevelAtEnd: this.prestigeLevel
        };
        this.runHistory.push(runData);
        
        // NEW: Update lifetime totals
        this.totalLifetimeRevenue += this.revenue;
        this.totalLifetimeDays += this.day;
        
        // NEW: Check for prestige level up
        this.checkPrestigeUnlock();
        
        // Clear intervals
        if (this.gameInterval) clearInterval(this.gameInterval);
        if (this.orderInterval) clearInterval(this.orderInterval);
        
        // Reset game state (but keep prestige data)
        const preservedPrestigeLevel = this.prestigeLevel;
        const preservedRunHistory = this.runHistory;
        const preservedLifetimeRevenue = this.totalLifetimeRevenue;
        const preservedLifetimeDays = this.totalLifetimeDays;
        const preservedLegacyBonuses = this.legacyBonuses;
        
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
        this.dayStartOrdersCompleted = 0;
        this.dayStartVipCustomers = 0;
        this.dayStartStaffLevels = 0;
        this.vipCustomers = 0;
        this.totalOrdersCompleted = 0;
        this.achievements = [];
        this.totalStaffHired = 0;
        this.highestRevenue = 200;
        this.totalRestocks = 0;
        this.perfectDays = 0;
        
        // NEW: Reset new systems but preserve some data
        this.reputation = 0;
        this.staffLoyalty = {};
        this.recipeMastery = {};
        this.regularCustomers = {};
        this.activeEvents = [];
        this.eventHistory = [];
        
        // Restore prestige data
        this.prestigeLevel = preservedPrestigeLevel;
        this.runHistory = preservedRunHistory;
        this.totalLifetimeRevenue = preservedLifetimeRevenue;
        this.totalLifetimeDays = preservedLifetimeDays;
        this.legacyBonuses = preservedLegacyBonuses;
        this.currentRun++;
        
        // Re-initialize with loaded data
        this.loadRecipeData();
        
        // Hide modal
        const modal = document.getElementById('game-over-modal');
        modal.classList.remove('modal-active');
        
        // Reset UI
        document.getElementById('start-game-btn').disabled = false;
        document.getElementById('pause-game-btn').disabled = true;
        document.getElementById('new-order-btn').disabled = true;
        
        this.switchView('overview');
    }
    
    // NEW: Check if player qualifies for prestige level up
    checkPrestigeUnlock() {
        if (!this.prestigeData || !this.prestigeData.levels) return;
        
        const nextLevel = this.prestigeData.levels[this.prestigeLevel];
        if (!nextLevel) return; // Already at max prestige
        
        const requirements = nextLevel.requirements;
        
        if (this.totalLifetimeRevenue >= requirements.totalRevenue &&
            this.totalLifetimeDays >= requirements.daysCompleted) {
            
            this.prestigeLevel++;
            
            this.showToast({
                icon: '👑',
                title: 'Prestige Level Up!',
                message: `${nextLevel.name} - New bonuses unlocked!`,
                type: 'success',
                duration: 8000
            });
            
            this.addFeedback(`👑 Prestige Level ${this.prestigeLevel}: ${nextLevel.name}!`, true);
        }
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
        
        // Calculate penalties for unfinished orders
        let penaltyAmount = 0;
        const unfinishedAssignedOrders = this.orders.filter(o => 
            (o.status === 'in-progress' || o.status === 'paused') && o.assignedStaff !== null
        );
        
        if (unfinishedAssignedOrders.length > 0) {
            unfinishedAssignedOrders.forEach(order => {
                const timeElapsed = order.timeLimit - order.timeRemaining;
                const completionPercent = (order.timeLimit && order.timeLimit > 0) ? timeElapsed / order.timeLimit : 0;
                const incompletePercent = 1 - completionPercent;
                const penalty = Math.floor((order.totalPrice || 0) * incompletePercent);
                penaltyAmount += penalty;
            });
        }
        
        // Calculate additional stats
        const ordersCompletedToday = this.totalOrdersCompleted - (this.dayStartOrdersCompleted || 0);
        const vipServedToday = this.vipCustomers - (this.dayStartVipCustomers || 0);
        const staffUpgradesToday = this.staff.reduce((sum, s) => sum + s.upgradeLevel, 0) - (this.dayStartStaffLevels || 0);
        const isPerfectDay = this.customerSatisfaction === 100 && unhappyToday === 0;
        
        // Calculate staff performance breakdown
        const staffPerformance = this.staff.map(s => ({
            name: s.name,
            ordersToday: s.monthlyOrders,
            revenueToday: s.monthlyRevenue || 0,
            efficiency: (s.efficiency * 100).toFixed(0),
            fatigue: s.fatigue.toFixed(0),
            mood: s.mood ? s.mood.name : 'Neutral'
        }));
        
        // Sort staff by orders completed today
        staffPerformance.sort((a, b) => b.ordersToday - a.ordersToday);
        
        // End of day bonus
        const bonus = Math.floor(this.revenue * 0.1);
        
        // Store this day's summary for later viewing
        this.lastDaySummary = {
            day: this.day,
            revenueEarned,
            customersServed,
            happyToday,
            unhappyToday,
            successRate,
            bonus,
            penaltyAmount,
            totalRevenue: this.revenue + bonus - penaltyAmount,
            ordersCompletedToday,
            vipServedToday,
            staffUpgradesToday,
            isPerfectDay,
            staffPerformance
        };
        
        // Show modal
        const modal = document.getElementById('day-summary-modal');
        document.getElementById('summary-day-number').textContent = this.day;
        document.getElementById('next-day-number').textContent = this.day + 1;
        document.getElementById('summary-revenue-earned').textContent = `$${revenueEarned}`;
        document.getElementById('summary-bonus').textContent = `$${bonus}`;
        document.getElementById('summary-total-revenue').textContent = `$${this.revenue + bonus - penaltyAmount}`;
        document.getElementById('summary-customers-served').textContent = customersServed;
        document.getElementById('summary-happy-customers').textContent = happyToday;
        document.getElementById('summary-unhappy-customers').textContent = unhappyToday;
        document.getElementById('summary-success-rate').textContent = `${successRate}%`;
        
        // Show penalties if any
        const penaltiesItem = document.getElementById('summary-penalties-item');
        if (penaltyAmount > 0) {
            penaltiesItem.style.display = 'flex';
            document.getElementById('summary-penalties').textContent = `-$${penaltyAmount}`;
        } else {
            penaltiesItem.style.display = 'none';
        }
        
        // Additional stats
        document.getElementById('summary-orders-completed').textContent = ordersCompletedToday;
        document.getElementById('summary-vip-served').textContent = vipServedToday;
        document.getElementById('summary-staff-upgrades').textContent = staffUpgradesToday;
        document.getElementById('summary-perfect-day').textContent = isPerfectDay ? '✅ Yes' : 'No';
        document.getElementById('summary-perfect-day').className = isPerfectDay ? 'summary-value success' : 'summary-value';
        
        // Add staff performance breakdown
        const staffBreakdownEl = document.getElementById('summary-staff-breakdown');
        if (staffBreakdownEl) {
            staffBreakdownEl.innerHTML = staffPerformance.map(staff => `
                <div class="summary-staff-item">
                    <span class="staff-summary-name">${staff.name}</span>
                    <span class="staff-summary-stats">
                        Orders: ${staff.ordersToday} | 
                        Revenue: $${staff.revenueToday} | 
                        Efficiency: ${staff.efficiency}% | 
                        Mood: ${staff.mood}
                    </span>
                </div>
            `).join('');
        }
        
        modal.classList.add('modal-active');
    }
    
    showLastDaySummary() {
        if (!this.lastDaySummary) {
            this.addFeedback('⚠️ No previous day summary available yet!', false);
            return;
        }
        
        const summary = this.lastDaySummary;
        
        // Show modal with last day's data
        const modal = document.getElementById('day-summary-modal');
        document.getElementById('summary-day-number').textContent = summary.day;
        document.getElementById('next-day-number').textContent = summary.day + 1;
        document.getElementById('summary-revenue-earned').textContent = `$${summary.revenueEarned}`;
        document.getElementById('summary-bonus').textContent = `$${summary.bonus}`;
        document.getElementById('summary-total-revenue').textContent = `$${summary.totalRevenue}`;
        document.getElementById('summary-customers-served').textContent = summary.customersServed;
        document.getElementById('summary-happy-customers').textContent = summary.happyToday;
        document.getElementById('summary-unhappy-customers').textContent = summary.unhappyToday;
        document.getElementById('summary-success-rate').textContent = `${summary.successRate}%`;
        
        // Show penalties if any
        const penaltiesItem = document.getElementById('summary-penalties-item');
        if (summary.penaltyAmount > 0) {
            penaltiesItem.style.display = 'flex';
            document.getElementById('summary-penalties').textContent = `-$${summary.penaltyAmount}`;
        } else {
            penaltiesItem.style.display = 'none';
        }
        
        // Additional stats
        document.getElementById('summary-orders-completed').textContent = summary.ordersCompletedToday;
        document.getElementById('summary-vip-served').textContent = summary.vipServedToday;
        document.getElementById('summary-staff-upgrades').textContent = summary.staffUpgradesToday;
        document.getElementById('summary-perfect-day').textContent = summary.isPerfectDay ? '✅ Yes' : 'No';
        document.getElementById('summary-perfect-day').className = summary.isPerfectDay ? 'summary-value success' : 'summary-value';
        
        // Add staff performance breakdown
        const staffBreakdownEl = document.getElementById('summary-staff-breakdown');
        if (staffBreakdownEl) {
            staffBreakdownEl.innerHTML = summary.staffPerformance.map(staff => `
                <div class="summary-staff-item">
                    <span class="staff-summary-name">${staff.name}</span>
                    <span class="staff-summary-stats">
                        Orders: ${staff.ordersToday} | 
                        Revenue: $${staff.revenueToday} | 
                        Efficiency: ${staff.efficiency}% | 
                        Mood: ${staff.mood}
                    </span>
                </div>
            `).join('');
        }
        
        // Change button text to indicate it's a review
        const continueBtn = modal.querySelector('.btn-success');
        const originalText = continueBtn.textContent;
        continueBtn.textContent = 'Close Summary';
        continueBtn.onclick = () => {
            modal.classList.remove('modal-active');
            continueBtn.textContent = originalText;
            continueBtn.onclick = null;
        };
        
        modal.classList.add('modal-active');
    }
    
    continueToNextDay() {
        // Apply penalties for unfinished assigned orders based on incomplete progress
        let penaltyAmount = 0;
        const unfinishedAssignedOrders = this.orders.filter(o => 
            (o.status === 'in-progress' || o.status === 'paused') && o.assignedStaff !== null
        );
        
        if (unfinishedAssignedOrders.length > 0) {
            unfinishedAssignedOrders.forEach(order => {
                // Calculate completion percentage
                const timeElapsed = order.timeLimit - order.timeRemaining;
                const completionPercent = (order.timeLimit && order.timeLimit > 0) ? timeElapsed / order.timeLimit : 0;
                
                // Penalty is for the incomplete portion
                const incompletePercent = 1 - completionPercent;
                const penalty = Math.floor((order.totalPrice || 0) * incompletePercent);
                penaltyAmount += penalty;
            });
            
            this.revenue -= penaltyAmount;
            this.addFeedback(`⚠️ Lost $${penaltyAmount} for ${unfinishedAssignedOrders.length} unfinished assigned order(s)`, false);
        }
        
        // Check for game over after penalties but before advancing day
        if (this.revenue <= 0) {
            this.revenue = 0; // Don't go negative
            this.isGameOver = true;
            this.isPaused = true;
            this.showGameOver();
            return; // Stop here, don't advance to next day
        }
        
        // Clear all orders at end of day
        this.orders = [];
        
        // Reset all staff to available status and reset their needs
        this.staff.forEach(staff => {
            staff.status = 'available';
            staff.currentOrder = null;
            staff.fatigue = 0;
            staff.morale = 100;
            // Reset hunger if it exists
            if (staff.hasOwnProperty('hunger')) {
                staff.hunger = 0;
            }
        });
        
        // Check if day was perfect (100% satisfaction maintained)
        if (this.customerSatisfaction === 100) {
            this.perfectDays++;
            // NEW: Perfect day reputation bonus
            this.gainReputation(10, 'Perfect Day');
            
            // NEW: Perfect day loyalty bonus for all staff
            this.staff.forEach(staff => {
                this.updateStaffLoyalty(staff.id, 5, 'Perfect Day');
            });
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
        
        // NEW: Reputation-based revenue bonus
        if (this.reputation > 0) {
            const reputationBonus = Math.floor(this.revenue * (this.reputation / 10000));
            this.revenue += reputationBonus;
            if (reputationBonus > 0) {
                this.addFeedback(`⭐ Reputation bonus: +$${reputationBonus}`, true);
            }
        }
        
        // Track highest revenue for achievements
        if (this.revenue > this.highestRevenue) {
            this.highestRevenue = this.revenue;
        }
        
        // Advance to next day
        this.day++;
        this.dayTimer = 0;
        
        // NEW: Advance season system
        this.advanceSeason();
        
        // NEW: Check for random events
        this.checkAndTriggerEvents();
        
        // NEW: Update active events
        this.updateActiveEvents();
        
        // Check achievements after day progression
        this.checkAchievements();
        
        // Check for daily reset and Staff of the Day
        this.checkMonthlyReset();
        
        // Update monthly leaderboard
        this.updateMonthlyLeaderboard();
        
        // Reset daily challenge progress
        this.staff.forEach(staff => {
            if (this.challengeProgress[staff.id]) {
                this.challengeProgress[staff.id].ordersToday = 0;
                this.challengeProgress[staff.id].tipsToday = 0;
                this.challengeProgress[staff.id].fastestOrderToday = null;
                this.challengeProgress[staff.id].teamworkScore = 0;
            }
        });
        
        // Store starting values for next day
        this.dayStartRevenue = this.revenue;
        this.dayStartHappyCustomers = this.happyCustomers;
        this.dayStartUnhappyCustomers = this.unhappyCustomers;
        this.dayStartOrdersCompleted = this.totalOrdersCompleted;
        this.dayStartVipCustomers = this.vipCustomers;
        this.dayStartStaffLevels = this.staff.reduce((sum, s) => sum + s.level, 0);
        
        // Track food statistics for completed day
        const dayIngredients = {};
        Object.keys(this.foodStatistics.ingredientsUsed).forEach(ing => {
            const prevTotal = this.foodStatistics.ingredientsByDay.length > 0 
                ? this.foodStatistics.ingredientsByDay.reduce((sum, day) => sum + (day[ing] || 0), 0)
                : 0;
            dayIngredients[ing] = (this.foodStatistics.ingredientsUsed[ing] || 0) - prevTotal;
        });
        this.foodStatistics.ingredientsByDay.push(dayIngredients);
        
        const prevFoodCost = this.foodStatistics.foodCostByDay.reduce((sum, cost) => sum + cost, 0);
        const todayFoodCost = this.foodStatistics.totalFoodCost - prevFoodCost;
        this.foodStatistics.foodCostByDay.push(todayFoodCost);
        
        // Increase difficulty gradually (keep for backward compatibility)
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
        
        // Calculate dynamic time limit based on order complexity
        const calculatedTimeLimit = this.calculateOrderTimeLimit({ items: orderItems, isVIP: isVIP });
        
        const order = {
            id: this.nextOrderId++,
            items: orderItems,
            totalPrice: totalPrice,
            timeLimit: calculatedTimeLimit,
            timeRemaining: calculatedTimeLimit,
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
            this.showToast({
                icon: '⭐',
                title: 'VIP Customer!',
                message: 'High reward, strict deadline!',
                type: 'warning'
            });
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
                // Find busy staff NOT already working on priority orders
                const busyStaff = this.staff.filter(s => {
                    if (s.status !== 'busy') return false;
                    const currentOrder = this.orders.find(o => o.id === s.currentOrder);
                    return currentOrder && !currentOrder.isPriority;
                });
                
                if (busyStaff.length === 0) {
                    this.addFeedback('⚠️ No available staff to assign priority order! All staff busy with other priorities.', false);
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
        const ingredientsUsed = {};
        for (const [ingredient, amount] of Object.entries(order.requiredIngredients)) {
            // Chance to not consume ingredient based on efficiency
            let actualUsed = 0;
            for (let i = 0; i < amount; i++) {
                if (Math.random() > ingredientEfficiency) {
                    this.inventory[ingredient].current -= 1;
                    actualUsed++;
                }
            }
            if (actualUsed > 0) {
                ingredientsUsed[ingredient] = actualUsed;
                // Track ingredients used in statistics
                if (!this.foodStatistics.ingredientsUsed[ingredient]) {
                    this.foodStatistics.ingredientsUsed[ingredient] = 0;
                }
                this.foodStatistics.ingredientsUsed[ingredient] += actualUsed;
            }
        }
        
        // Auto-replenish inventory (no purchase needed)
        for (const ingredient in this.inventory) {
            if (this.inventory[ingredient].current < this.inventory[ingredient].max * 0.3) {
                this.inventory[ingredient].current = this.inventory[ingredient].max;
            }
        }
        
        // Calculate food cost (15% of order price) and deduct from revenue as expense
        const foodCost = Math.floor(order.totalPrice * 0.15);
        this.revenue -= foodCost;
        this.foodStatistics.totalFoodCost += foodCost;
        
        // Show toast notification for ingredients used
        if (Object.keys(ingredientsUsed).length > 0) {
            const ingredientsList = Object.entries(ingredientsUsed)
                .map(([ing, amt]) => `${amt}x ${ing}`)
                .join(', ');
            this.showToast({
                icon: '📦',
                title: 'Ingredients Used',
                message: `${ingredientsList} (Cost: $${foodCost})`,
                type: 'info',
                duration: 3000
            });
        }
        
        order.status = 'in-progress';
        order.assignedStaff = staffMember.id;
        staffMember.status = 'busy';
        staffMember.currentOrder = orderId;
        
        // Show toast notification for staff starting order
        this.showToast({
            icon: '👨‍🍳',
            title: 'Order Started',
            message: `${staffMember.name} started making Order #${orderId}`,
            type: 'info'
        });
        
        this.triggerHaptic('light');
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
                    
                    // Apply Staff of the Day bonus
                    const effectiveEfficiency = this.applyStaffOfDayBonus(staff);
                    
                    // Progress based on staff efficiency with specialty bonus and Staff of Day bonus
                    // Staff efficiency (0.6-0.9) provides the base speed modifier
                    // Specialty bonus (1.15x) and Staff of Day bonus (1.2x) further enhance speed
                    // Overall speed boost applied (2.5x base multiplier)
                    order.progress += effectiveEfficiency * 2.5 * efficiencyBonus;
                    
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
            
            // NEW: Apply recipe mastery bonuses to price
            let masteryBonus = { priceMultiplier: 1.0 };
            if (order.items && order.items.length > 0) {
                const mainItem = order.items[0]; // Use first item for mastery
                masteryBonus = this.getRecipeMasteryBonus(mainItem.id);
                order.totalPrice = Math.floor(order.totalPrice * masteryBonus.priceMultiplier);
                
                // Update mastery for completed recipe
                this.updateRecipeMastery(mainItem.id);
            }
            
            this.revenue += order.totalPrice;
            this.happyCustomers++;
            this.totalOrdersCompleted++; // Track for recipe unlocks
            
            // NEW: Gain reputation for successful orders
            let reputationGain = order.isVIP ? 5 : 1;
            if (order.timeRemaining > order.timeLimit * 0.5) {
                reputationGain *= 1.5; // Bonus for fast completion
            }
            this.gainReputation(Math.floor(reputationGain), 'Order completed');
            
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
                
                // Track consecutive orders and last order time
                staff.consecutiveOrders++;
                staff.lastOrderTime = this.dayTimer;
                
                // NEW: Update staff loyalty for completing order
                this.updateStaffLoyalty(staff.id, 2, 'Order completed');
                
                // Apply morale factors for completing order
                this.applyMoraleFactor(staff, 'completed_order');
                
                // Check if specialty matched for morale boost
                const hasMatchingSpecialty = order.items.some(item => 
                    item.category === staff.speciality
                );
                if (hasMatchingSpecialty) {
                    this.applyMoraleFactor(staff, 'specialty_match');
                    // NEW: Extra loyalty for specialty match
                    this.updateStaffLoyalty(staff.id, 3, 'Specialty match');
                }
                
                // Check for overworked
                this.applyMoraleFactor(staff, 'overworked', { consecutiveOrders: staff.consecutiveOrders });
                
                // Update Staff of the Day metrics
                const completionTime = order.timeLimit - order.timeRemaining;
                this.updateStaffOfDayMetrics(staff, order, completionTime);
                
                // QoL 2: Auto-rest if fatigued in auto mode
                if (this.autoAssignEnabled && staff.fatigue > 70) {
                    staff.status = 'resting';
                    staff.lastRestTime = this.dayTimer;
                    staff.consecutiveOrders = 0; // Reset consecutive orders when resting
                    this.addFeedback(`😴 ${staff.name} is auto-resting due to high fatigue...`, true);
                } else {
                    staff.status = 'available';
                }
                
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
            
            // Show toast notification for completed order
            this.showToast({
                icon: order.isVIP ? '⭐' : '✅',
                title: order.isVIP ? 'VIP Order Complete!' : 'Order Complete!',
                message: `Order #${order.id} - $${order.totalPrice}`,
                type: 'success',
                duration: 3000
            });
            
            // Play success sound and haptic feedback
            this.playSuccessSound();
            this.triggerHaptic('medium');
        } else {
            order.status = 'failed';
            this.unhappyCustomers++;
            
            if (staff) {
                staff.performance = Math.max(0, staff.performance - 5);
                
                // Apply morale factor for failed order
                this.applyMoraleFactor(staff, 'failed_order');
                staff.consecutiveOrders = 0; // Reset consecutive orders on failure
                
                // QoL 2: Auto-rest if fatigued in auto mode
                if (this.autoAssignEnabled && staff.fatigue > 70) {
                    staff.status = 'resting';
                    staff.lastRestTime = this.dayTimer;
                    this.addFeedback(`😴 ${staff.name} is auto-resting due to high fatigue...`, true);
                } else {
                    staff.status = 'available';
                }
                
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
            
            // Play fail sound and haptic feedback
            this.playFailSound();
            this.triggerHaptic('heavy');
        }
        
        this.completedOrders.push(order);
    }
    
    updateStaff() {
        // Get fatigue reduction bonus from equipment
        const fatigueReduction = this.getEquipmentBonus('fatigue_reduction');
        
        // Gradually recover performance for available staff
        this.staff.forEach(staff => {
            // Initialize traits if not present (backward compatibility)
            if (!staff.traits || staff.traits.length === 0) {
                staff.traits = this.getRandomTraits(2);
                // Recalculate base performance from traits (additive)
                const traitsModifier = staff.traits.reduce((acc, trait) => acc + trait.modifier, 0);
                staff.basePerformance = 100 + traitsModifier;
            }
            
            // Update mood timer
            if (!staff.mood) {
                staff.mood = this.getRandomMood(null, staff);
            }
            if (!staff.moodChangeTimer) {
                staff.moodChangeTimer = 0;
            }
            if (!staff.moodChangeDuration) {
                staff.moodChangeDuration = 60 + Math.floor(Math.random() * 60);
            }
            
            staff.moodChangeTimer++;
            
            // Change mood periodically
            if (staff.moodChangeTimer >= staff.moodChangeDuration) {
                const oldMood = staff.mood.name;
                staff.mood = this.getRandomMood(staff.mood, staff);
                staff.moodChangeTimer = 0;
                staff.moodChangeDuration = 60 + Math.floor(Math.random() * 60); // Next mood change in 60-120 seconds
                
                // Show toast notification for mood change
                this.showToast({
                    icon: staff.mood.emoji,
                    title: `${staff.name} Mood Changed`,
                    message: `${oldMood} → ${staff.mood.name} (${staff.mood.description})`,
                    type: 'info',
                    duration: 3000
                });
            }
            
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
            
            // Update morale based on fatigue and performance using morale factors system
            this.applyMoraleFactor(staff, 'high_fatigue');
            this.applyMoraleFactor(staff, 'low_fatigue');
            this.applyMoraleFactor(staff, 'high_performance');
            this.applyMoraleFactor(staff, 'low_performance');
            
            // Check for idle time morale factor
            if (staff.status === 'available' && staff.lastOrderTime > 0) {
                const idleTime = this.dayTimer - staff.lastOrderTime;
                this.applyMoraleFactor(staff, 'idle_too_long', { idleTime });
            }
            
            // Adjust efficiency based on fatigue, morale, and mood
            const fatigueMultiplier = 1 - (staff.fatigue / 500); // Max 20% reduction (1:5 ratio)
            const moraleMultiplier = this.getMoralePerformanceModifier(staff.morale); // Dynamic from morale factors
            const moodMultiplier = staff.mood ? staff.mood.performanceModifier : 1.0;
            
            // Calculate effective efficiency including upgrades and mood
            const upgradeBonus = staff.upgradeLevel * 0.05;
            staff.efficiency = staff.baseEfficiency * (1 + upgradeBonus) * fatigueMultiplier * moraleMultiplier * moodMultiplier;
            
            // Gradually recover performance for available staff (to their base performance)
            const targetPerformance = staff.basePerformance || 100;
            if (staff.status === 'available' && staff.performance < targetPerformance) {
                staff.performance = Math.min(targetPerformance, staff.performance + 0.5);
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
        
        // Apply morale factor for upgrade
        this.applyMoraleFactor(staff, 'upgrade');
        
        this.addFeedback(`⭐ ${staff.name} upgraded to Level ${staff.upgradeLevel}! Efficiency: ${(staff.efficiency * 100).toFixed(0)}%`, true);
        this.triggerHaptic('medium');
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
        staff.consecutiveOrders = 0; // Reset consecutive orders when resting
        
        // Apply morale factor for rest break
        this.applyMoraleFactor(staff, 'rest_break');
        
        this.addFeedback(`😴 ${staff.name} is taking a break to recover...`, true);
        this.render();
    }
    
    fireStaff(staffId) {
        const staff = this.staff.find(s => s.id === staffId);
        if (!staff) return;
        
        // Check if staff is currently working
        if (staff.status === 'busy' && staff.currentOrder) {
            this.addFeedback('⚠️ Cannot fire staff while working on an order!', false);
            return;
        }
        
        // Apply morale penalty to remaining staff
        this.staff.forEach(s => {
            if (s.id !== staffId) {
                this.applyMoraleFactor(s, 'fired_colleague');
            }
        });
        
        // Remove staff from the array
        this.staff = this.staff.filter(s => s.id !== staffId);
        
        // Remove from challenge progress
        if (this.challengeProgress[staffId]) {
            delete this.challengeProgress[staffId];
        }
        
        this.addFeedback(`👋 ${staff.name} has been let go. No penalty applied.`, true);
        this.showToast({
            icon: '👋',
            title: 'Staff Dismissed',
            message: `${staff.name} is no longer part of the team`,
            type: 'info',
            duration: 3000
        });
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
        // Skip rendering if not fully initialized
        if (!this.staff || this.staff.length === 0) {
            return;
        }
        
        this.renderOrders();
        this.renderStaff();
        this.renderInventory();
        this.renderSatisfaction();
        this.renderGameStats();
        this.renderOverview();
        this.renderRecipes();
        this.renderEquipment();
        this.renderAchievements();
        this.renderStaffOfDay();
    }
    
    renderOverview() {
        // Update overview cards with current stats
        const ordersCount = this.orders.length;
        const urgentOrders = this.orders.filter(o => o.timeRemaining <= 30 && o.status === 'pending').length;
        const availableStaff = this.staff.filter(s => s.status === 'available').length;
        const lowStockItems = Object.values(this.inventory).filter(item => 
            (item.current / item.max) < 0.3 && item.current > 0
        ).length;
        
        const emptyStockItems = Object.values(this.inventory).filter(item => 
            item.current === 0
        ).length;
        
        const totalInventoryItems = Object.keys(this.inventory).length;
        
        const vipOrders = this.orders.filter(o => o.isVIP).length;
        const busyStaff = this.staff.filter(s => s.status === 'busy').length;
        const restingStaff = this.staff.filter(s => s.status === 'resting').length;
        
        // Orders card
        document.getElementById('overview-orders-count').textContent = ordersCount;
        document.getElementById('overview-orders-urgent-count').textContent = urgentOrders;
        document.getElementById('overview-orders-vip-count').textContent = vipOrders;
        
        // Staff card
        document.getElementById('overview-staff-available').textContent = availableStaff;
        document.getElementById('overview-staff-busy').textContent = busyStaff;
        document.getElementById('overview-staff-resting').textContent = restingStaff;
        
        // Food Statistics card
        const totalFoodCost = this.foodStatistics.totalFoodCost;
        const uniqueIngredients = Object.keys(this.foodStatistics.ingredientsUsed).length;
        const categorySales = {};
        this.completedOrders.forEach(order => {
            order.items.forEach(item => {
                categorySales[item.category] = true;
            });
        });
        const categoriesCount = Object.keys(categorySales).length;
        
        document.getElementById('overview-inventory-total').textContent = `$${totalFoodCost}`;
        document.getElementById('overview-inventory-low').textContent = uniqueIngredients;
        document.getElementById('overview-inventory-empty').textContent = categoriesCount;
        
        // Satisfaction card
        document.getElementById('overview-satisfaction').textContent = `${Math.round(this.customerSatisfaction)}%`;
        document.getElementById('overview-happy-customers').textContent = this.happyCustomers;
        document.getElementById('overview-unhappy-customers').textContent = this.unhappyCustomers;
        
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
        
        // Update orders header stat
        const pendingOrders = this.orders.filter(o => o.status === 'pending').length;
        const inProgressOrders = this.orders.filter(o => o.status === 'in-progress').length;
        document.getElementById('header-orders').textContent = this.orders.length;
        
        // Update staff header stat
        const availableStaff = this.staff.filter(s => s.status === 'available').length;
        const busyStaff = this.staff.filter(s => s.status === 'busy').length;
        document.getElementById('header-staff').textContent = `${availableStaff}/${this.staff.length}`;
        
        // Update orders tooltip
        const ordersTooltip = document.querySelector('#orders-tooltip .tooltip-content');
        if (ordersTooltip) {
            const urgentOrders = this.orders.filter(o => {
                const timePercent = (o.timeRemaining / o.timeLimit) * 100;
                return timePercent < 30;
            }).length;
            ordersTooltip.innerHTML = `
                <strong>Active Orders</strong><br>
                Total: ${this.orders.length}<br>
                Pending: ${pendingOrders} 📋<br>
                In Progress: ${inProgressOrders} 🔄<br>
                ${urgentOrders > 0 ? `<span style="color: #B85450;">Urgent: ${urgentOrders} ⚠️</span>` : 'No Urgent Orders'}
            `;
        }
        
        // Update staff tooltip
        const staffTooltip = document.querySelector('#staff-tooltip .tooltip-content');
        if (staffTooltip) {
            const restingStaff = this.staff.filter(s => s.status === 'resting').length;
            const avgEfficiency = this.staff.length > 0 ? 
                (this.staff.reduce((sum, s) => sum + s.efficiency, 0) / this.staff.length * 100).toFixed(0) : 0;
            staffTooltip.innerHTML = `
                <strong>Staff Status</strong><br>
                Available: ${availableStaff} ✅<br>
                Busy: ${busyStaff} 👨‍🍳<br>
                Resting: ${restingStaff} 😴<br>
                Avg Efficiency: ${avgEfficiency}%
            `;
        }
        
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
        
        // Create column layout
        container.style.display = 'flex';
        container.style.gap = '15px';
        container.style.overflowX = 'auto';
        
        // Define stages
        const stages = [
            { name: 'Unassigned', filter: (order) => order.status === 'pending', minProgress: 0 },
            { name: 'Prepping', filter: (order) => order.status === 'in-progress' && order.progress < 20, minProgress: 0, maxProgress: 20 },
            { name: 'Cooking', filter: (order) => order.status === 'in-progress' && order.progress >= 20 && order.progress < 50, minProgress: 20, maxProgress: 50 },
            { name: 'Finishing', filter: (order) => order.status === 'in-progress' && order.progress >= 50 && order.progress < 80, minProgress: 50, maxProgress: 80 },
            { name: 'Plating', filter: (order) => order.status === 'in-progress' && order.progress >= 80, minProgress: 80, maxProgress: 100 },
            { name: 'Paused', filter: (order) => order.status === 'paused', minProgress: 0 }
        ];
        
        stages.forEach(stage => {
            const stageColumn = document.createElement('div');
            stageColumn.className = 'order-stage-column';
            stageColumn.style.flex = '1';
            stageColumn.style.minWidth = '280px';
            stageColumn.style.background = '#EDE6DF';
            stageColumn.style.borderRadius = '8px';
            stageColumn.style.padding = '15px';
            
            const stageHeader = document.createElement('div');
            stageHeader.style.fontWeight = 'bold';
            stageHeader.style.fontSize = '1.1rem';
            stageHeader.style.marginBottom = '10px';
            stageHeader.style.color = '#333';
            stageHeader.style.borderBottom = '2px solid #C17B5B';
            stageHeader.style.paddingBottom = '8px';
            
            // Filter orders for this stage
            let stageOrders = this.orders.filter(stage.filter);
            
            // Sort VIP orders first, then by priority, then by urgency
            stageOrders.sort((a, b) => {
                if (a.isVIP && !b.isVIP) return -1;
                if (!a.isVIP && b.isVIP) return 1;
                if (a.isPriority && !b.isPriority) return -1;
                if (!a.isPriority && b.isPriority) return 1;
                const aTimePercent = (a.timeRemaining / a.timeLimit) * 100;
                const bTimePercent = (b.timeRemaining / b.timeLimit) * 100;
                return aTimePercent - bTimePercent;
            });
            
            stageHeader.textContent = `${stage.name} (${stageOrders.length})`;
            stageColumn.appendChild(stageHeader);
            
            const ordersContainer = document.createElement('div');
            ordersContainer.style.display = 'flex';
            ordersContainer.style.flexDirection = 'column';
            ordersContainer.style.gap = '10px';
            
            if (stageOrders.length === 0) {
                ordersContainer.innerHTML = '<p style="text-align: center; color: #999; padding: 10px; font-size: 0.9rem;">No orders</p>';
            } else {
                stageOrders.forEach(order => {
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
                    
                    // Get assigned staff name and order state
                    let assignedStaffInfo = '';
                    let orderStateInfo = '';
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
                    
                    ordersContainer.appendChild(orderCard);
                });
            }
            
            stageColumn.appendChild(ordersContainer);
            container.appendChild(stageColumn);
        });
    }
    
    renderStaff() {
        const container = document.getElementById('staff-container');
        const count = document.getElementById('staff-count');
        
        count.textContent = this.staff.length;
        container.innerHTML = '';
        
        this.staff.forEach(staff => {
            // Build detailed tooltip with math breakdown
            const traitsModifier = staff.traits && staff.traits.length > 0 
                ? staff.traits.reduce((acc, trait) => acc + trait.modifier, 0) 
                : 0;
            const basePerf = staff.basePerformance || 100;
            
            // Calculate efficiency breakdown
            const upgradeBonus = staff.upgradeLevel * 0.05;
            const fatigueMultiplier = 1 - (staff.fatigue / 500); // 1:5 ratio - max 20% reduction
            const moraleMultiplier = this.getMoralePerformanceModifier(staff.morale);
            const moodMultiplier = staff.mood ? staff.mood.performanceModifier : 1.0;
            
            const tooltipContent = `
<strong>Performance Breakdown:</strong>
Base: 100
${staff.traits && staff.traits.length > 0 ? staff.traits.map(t => `  ${t.modifier >= 0 ? '+' : ''}${t.modifier} (${t.name})`).join('\n') : ''}
= ${basePerf} Base Performance

<strong>Efficiency Calculation:</strong>
Base Efficiency: ${(staff.baseEfficiency * 100).toFixed(0)}%
× (1 + ${(upgradeBonus * 100).toFixed(0)}% upgrade bonus) = ${((staff.baseEfficiency * (1 + upgradeBonus)) * 100).toFixed(0)}%
× ${(fatigueMultiplier * 100).toFixed(0)}% fatigue multiplier
× ${(moraleMultiplier * 100).toFixed(0)}% morale multiplier
× ${(moodMultiplier * 100).toFixed(0)}% mood multiplier
= ${(staff.efficiency * 100).toFixed(0)}% Current Efficiency

Current Mood: ${staff.mood ? staff.mood.name : 'Neutral'} ${staff.mood ? staff.mood.emoji : '😐'}
Morale: ${staff.morale.toFixed(0)}%
Fatigue: ${staff.fatigue.toFixed(0)}%
            `.trim();
            
            const staffCard = document.createElement('div');
            staffCard.className = 'staff-card';
            
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
            
            // Get current order state if staff is busy
            let currentOrderState = '';
            if (staff.status === 'busy' && staff.currentOrder) {
                const order = this.orders.find(o => o.id === staff.currentOrder);
                if (order) {
                    const state = this.getOrderState(order.progress);
                    currentOrderState = `<div style="margin-top: 8px; padding: 8px; background: rgba(216, 158, 84, 0.1); border-radius: 5px; border-left: 3px solid #D89E54;">
                        <div style="font-size: 0.85rem; color: #666; margin-bottom: 3px;">Working on Order #${order.id}</div>
                        <div style="font-size: 0.9rem; font-weight: bold; color: #D89E54;">📍 ${state}</div>
                    </div>`;
                }
            }
            
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
            
            // Staff of the Day badge
            let eotmBadge = '';
            if (staff.isEmployeeOfMonth) {
                eotmBadge = `<span class="eotm-badge" title="Staff of the Day - ${staff.employeeOfMonthTitle}">👑</span>`;
            }
            
            // Traits display
            let traitsDisplay = '';
            if (staff.traits && staff.traits.length > 0) {
                traitsDisplay = `<div class="staff-traits">
                    ${staff.traits.map(trait => 
                        `<span class="trait-badge ${trait.modifier >= 0 ? 'trait-positive' : 'trait-negative'}" title="${trait.description}">
                            ${trait.emoji} ${trait.name}
                        </span>`
                    ).join('')}
                </div>`;
            }
            
            staffCard.innerHTML = `
                <button class="fire-btn" onclick="game.fireStaff(${staff.id})" title="Dismiss staff member" ${staff.status === 'busy' ? 'disabled' : ''}>
                    ×
                </button>
                <div class="staff-header">
                    <div>
                        <div class="staff-name" title="${tooltipContent}">${staff.name} ${eotmBadge} ${upgradeStars} ${efficiencyBadge}</div>
                        <div class="staff-role">${staff.role} ${canUpgrade ? `(Level ${staff.upgradeLevel}/${staff.maxUpgradeLevel})` : '(MAX)'}</div>
                        ${staff.isEmployeeOfMonth ? `<div class="eotm-title">${staff.employeeOfMonthTitle} (+${staff.employeeOfMonthBonus}% bonus)</div>` : ''}
                        ${traitsDisplay}
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
                    <div class="metric">
                        <span class="metric-label">Daily Score</span>
                        <span class="metric-value">${staff.monthlyScore}</span>
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
                    <div class="wellbeing-item">
                        <span class="wellbeing-label">${staff.mood ? staff.mood.emoji : '😐'} Mood: ${staff.mood ? staff.mood.name : 'Neutral'}</span>
                        <span class="mood-description">${staff.mood ? staff.mood.description : 'Normal performance'}</span>
                    </div>
                </div>
                ${currentOrderState}
                <div style="display: flex; gap: 5px; margin-top: 10px; flex-wrap: wrap;">
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
        const container = document.getElementById('food-stats-container');
        if (!container) return;
        
        container.innerHTML = '';
        
        // Default to ingredients view if no view set
        if (!this.foodStatsCurrentView) {
            this.foodStatsCurrentView = 'ingredients';
        }
        
        if (this.foodStatsCurrentView === 'ingredients') {
            this.renderFoodStatsIngredients(container);
        } else if (this.foodStatsCurrentView === 'cost') {
            this.renderFoodStatsCost(container);
        } else if (this.foodStatsCurrentView === 'categories') {
            this.renderFoodStatsCategories(container);
        }
    }
    
    setFoodStatsView(view) {
        this.foodStatsCurrentView = view;
        this.renderInventory();
    }
    
    renderFoodStatsIngredients(container) {
        const ingredients = this.foodStatistics.ingredientsUsed;
        
        if (Object.keys(ingredients).length === 0) {
            container.innerHTML = '<div class="empty-state">No ingredients used yet. Start serving orders to see statistics!</div>';
            return;
        }
        
        // Find max for scaling
        const maxUsage = Math.max(...Object.values(ingredients));
        
        container.innerHTML = '<h3 style="margin-bottom: 20px; color: #333;">📊 Ingredient Usage (All Time)</h3>';
        
        Object.entries(ingredients).sort((a, b) => b[1] - a[1]).forEach(([name, count]) => {
            const percentage = maxUsage > 0 ? (count / maxUsage) * 100 : 0;
            
            const statCard = document.createElement('div');
            statCard.className = 'food-stat-card';
            statCard.innerHTML = `
                <div class="stat-header">
                    <span class="stat-name">${name}</span>
                    <span class="stat-value">${count} used</span>
                </div>
                <div class="stat-bar-container">
                    <div class="stat-bar" style="width: ${percentage}%; background: linear-gradient(90deg, #4CAF50, #45a049);"></div>
                </div>
            `;
            container.appendChild(statCard);
        });
    }
    
    renderFoodStatsCost(container) {
        const totalCost = this.foodStatistics.totalFoodCost;
        const costByDay = this.foodStatistics.foodCostByDay;
        
        if (costByDay.length === 0) {
            container.innerHTML = '<div class="empty-state">No food cost data yet. Complete your first day to see statistics!</div>';
            return;
        }
        
        const maxCost = Math.max(...costByDay);
        
        container.innerHTML = `
            <h3 style="margin-bottom: 20px; color: #333;">💰 Food Cost Analysis</h3>
            <div class="stat-summary">
                <div class="summary-box">
                    <div class="summary-label">Total Food Cost</div>
                    <div class="summary-value">$${totalCost}</div>
                </div>
                <div class="summary-box">
                    <div class="summary-label">Average Per Day</div>
                    <div class="summary-value">$${Math.floor(totalCost / costByDay.length)}</div>
                </div>
            </div>
            <h4 style="margin: 20px 0 10px 0; color: #666;">Food Cost by Day</h4>
        `;
        
        costByDay.forEach((cost, index) => {
            const percentage = maxCost > 0 ? (cost / maxCost) * 100 : 0;
            
            const statCard = document.createElement('div');
            statCard.className = 'food-stat-card';
            statCard.innerHTML = `
                <div class="stat-header">
                    <span class="stat-name">Day ${index + 1}</span>
                    <span class="stat-value">$${cost}</span>
                </div>
                <div class="stat-bar-container">
                    <div class="stat-bar" style="width: ${percentage}%; background: linear-gradient(90deg, #FF9800, #F57C00);"></div>
                </div>
            `;
            container.appendChild(statCard);
        });
    }
    
    renderFoodStatsCategories(container) {
        // Track completed orders by category
        const categorySales = {};
        this.completedOrders.forEach(order => {
            order.items.forEach(item => {
                if (!categorySales[item.category]) {
                    categorySales[item.category] = 0;
                }
                categorySales[item.category] += item.price;
            });
        });
        
        if (Object.keys(categorySales).length === 0) {
            container.innerHTML = '<div class="empty-state">No category data yet. Complete orders to see statistics!</div>';
            return;
        }
        
        const maxSales = Math.max(...Object.values(categorySales));
        
        container.innerHTML = '<h3 style="margin-bottom: 20px; color: #333;">🍽️ Sales by Category</h3>';
        
        Object.entries(categorySales).sort((a, b) => b[1] - a[1]).forEach(([category, sales]) => {
            const percentage = maxSales > 0 ? (sales / maxSales) * 100 : 0;
            
            const statCard = document.createElement('div');
            statCard.className = 'food-stat-card';
            statCard.innerHTML = `
                <div class="stat-header">
                    <span class="stat-name">${category}</span>
                    <span class="stat-value">$${sales}</span>
                </div>
                <div class="stat-bar-container">
                    <div class="stat-bar" style="width: ${percentage}%; background: linear-gradient(90deg, #2196F3, #1976D2);"></div>
                </div>
            `;
            container.appendChild(statCard);
        });
    }
    
    renderSatisfaction() {
        const satisfactionBar = document.getElementById('satisfaction-bar');
        const satisfactionPercentage = document.getElementById('satisfaction-percentage');
        const satisfactionEmoji = document.getElementById('satisfaction-emoji');
        const happyCustomers = document.getElementById('happy-customers');
        const unhappyCustomers = document.getElementById('unhappy-customers');
        const vipCustomers = document.getElementById('vip-customers');
        const avgWaitTime = document.getElementById('avg-wait-time');
        const successRate = document.getElementById('success-rate');
        const todayOrders = document.getElementById('today-orders');
        const avgOrderValue = document.getElementById('avg-order-value');
        const performanceRating = document.getElementById('performance-rating');
        
        // Update satisfaction bar and percentage
        if (satisfactionBar) {
            satisfactionBar.style.width = `${this.customerSatisfaction}%`;
        }
        if (satisfactionPercentage) {
            satisfactionPercentage.textContent = `${Math.round(this.customerSatisfaction)}%`;
        }
        
        // Update emoji based on satisfaction level
        if (satisfactionEmoji) {
            if (this.customerSatisfaction >= 90) {
                satisfactionEmoji.textContent = '😄';
            } else if (this.customerSatisfaction >= 70) {
                satisfactionEmoji.textContent = '😊';
            } else if (this.customerSatisfaction >= 50) {
                satisfactionEmoji.textContent = '😐';
            } else if (this.customerSatisfaction >= 30) {
                satisfactionEmoji.textContent = '😟';
            } else {
                satisfactionEmoji.textContent = '😢';
            }
        }
        
        // Update basic stats
        if (happyCustomers) happyCustomers.textContent = this.happyCustomers;
        if (unhappyCustomers) unhappyCustomers.textContent = this.unhappyCustomers;
        if (vipCustomers) vipCustomers.textContent = this.vipCustomers;
        
        // Calculate average wait time from completed orders
        if (avgWaitTime) {
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
        
        // Calculate success rate
        if (successRate) {
            const totalCustomers = this.happyCustomers + this.unhappyCustomers;
            if (totalCustomers > 0) {
                const rate = Math.round((this.happyCustomers / totalCustomers) * 100);
                successRate.textContent = `${rate}%`;
            } else {
                successRate.textContent = '0%';
            }
        }
        
        // Today's orders (since day start)
        if (todayOrders) {
            const ordersToday = this.totalOrdersCompleted - this.dayStartOrdersCompleted;
            todayOrders.textContent = ordersToday;
        }
        
        // Average order value
        if (avgOrderValue) {
            if (this.completedOrders.length > 0) {
                const totalValue = this.completedOrders.reduce((sum, order) => {
                    return sum + (order.totalPrice || 0);
                }, 0);
                const avg = Math.floor(totalValue / this.completedOrders.length);
                avgOrderValue.textContent = `$${avg}`;
            } else {
                avgOrderValue.textContent = '$0';
            }
        }
        
        // Performance rating based on multiple factors
        if (performanceRating) {
            const totalCustomers = this.happyCustomers + this.unhappyCustomers;
            const successRateValue = totalCustomers > 0 ? (this.happyCustomers / totalCustomers) * 100 : 100;
            
            if (successRateValue >= 90 && this.customerSatisfaction >= 80) {
                performanceRating.textContent = 'Excellent';
                performanceRating.style.color = '#5A9E6F';
            } else if (successRateValue >= 75 && this.customerSatisfaction >= 60) {
                performanceRating.textContent = 'Good';
                performanceRating.style.color = '#5A9E6F';
            } else if (successRateValue >= 50 && this.customerSatisfaction >= 40) {
                performanceRating.textContent = 'Average';
                performanceRating.style.color = '#D89E54';
            } else {
                performanceRating.textContent = 'Poor';
                performanceRating.style.color = '#B85450';
            }
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
    
    renderStaffOfDay() {
        // Update overview card
        const winnerName = document.getElementById('overview-eotm-winner');
        const topScore = document.getElementById('overview-eotm-score');
        const daysLeft = document.getElementById('overview-eotm-days');
        const monthBadge = document.getElementById('eotm-month-badge');
        
        if (winnerName && topScore && daysLeft && monthBadge) {
            const currentDay = this.day;
            const daysUntilEnd = this.monthDuration - ((this.day - this.monthStartDay) % this.monthDuration);
            
            monthBadge.textContent = `Day ${currentDay}`;
            daysLeft.textContent = daysUntilEnd;
            
            // Don't recalculate scores during the day - just display existing leaderboard
            if (this.monthlyLeaderboard.length > 0) {
                const leader = this.monthlyLeaderboard[0];
                winnerName.textContent = leader.name.split(' ')[0]; // Just first name for space
                topScore.textContent = leader.monthlyScore;
            } else {
                winnerName.textContent = 'TBD';
                topScore.textContent = '0';
            }
        }
        
        // Render leaderboard
        const leaderboardContainer = document.getElementById('leaderboard-container');
        if (!leaderboardContainer) return;
        
        leaderboardContainer.innerHTML = '';
        
        if (this.monthlyLeaderboard.length === 0) {
            leaderboardContainer.innerHTML = '<div class="empty-state">Complete some orders to see staff rankings!</div>';
            return;
        }
        
        // Show top 3
        const top3 = this.monthlyLeaderboard.slice(0, 3);
        const medals = ['🥇', '🥈', '🥉'];
        const ranks = ['1st Place', '2nd Place', '3rd Place'];
        const colors = ['#FFD700', '#C0C0C0', '#CD7F32'];
        
        top3.forEach((staff, index) => {
            const leaderCard = document.createElement('div');
            leaderCard.className = 'leaderboard-card';
            leaderCard.style.borderColor = colors[index];
            
            const isWinner = staff.isEmployeeOfMonth;
            
            leaderCard.innerHTML = `
                <div class="leaderboard-rank" style="background: ${colors[index]};">
                    <div class="rank-medal">${medals[index]}</div>
                    <div class="rank-label">${ranks[index]}</div>
                </div>
                <div class="leaderboard-info">
                    <div class="leaderboard-name">
                        ${staff.name} ${isWinner ? '👑' : ''} ${staff.weeklyChallengeBadge || ''}
                    </div>
                    ${isWinner ? `<div class="leaderboard-title">${staff.employeeOfMonthTitle}</div>` : ''}
                    <div class="leaderboard-stats">
                        <div class="leaderboard-stat">
                            <span class="stat-label">Score:</span>
                            <span class="stat-value">${staff.monthlyScore}</span>
                        </div>
                        <div class="leaderboard-stat">
                            <span class="stat-label">Orders:</span>
                            <span class="stat-value">${staff.monthlyOrders}</span>
                        </div>
                        <div class="leaderboard-stat">
                            <span class="stat-label">Revenue:</span>
                            <span class="stat-value">$${staff.monthlyRevenue.toFixed(0)}</span>
                        </div>
                        <div class="leaderboard-stat">
                            <span class="stat-label">Tips:</span>
                            <span class="stat-value">$${staff.monthlyTips.toFixed(0)}</span>
                        </div>
                    </div>
                    ${isWinner ? `<div class="leaderboard-bonus">+${staff.employeeOfMonthBonus}% Efficiency Bonus</div>` : ''}
                </div>
            `;
            
            leaderboardContainer.appendChild(leaderCard);
        });
        
        // Show remaining staff in compact list
        if (this.monthlyLeaderboard.length > 3) {
            const otherStaff = this.monthlyLeaderboard.slice(3);
            const otherList = document.createElement('div');
            otherList.className = 'leaderboard-others';
            otherList.innerHTML = '<h4>Other Staff:</h4>';
            
            otherStaff.forEach((staff, index) => {
                const rank = index + 4;
                const staffItem = document.createElement('div');
                staffItem.className = 'leaderboard-other-item';
                staffItem.innerHTML = `
                    <span class="other-rank">#${rank}</span>
                    <span class="other-name">${staff.name}</span>
                    <span class="other-score">${staff.monthlyScore} pts</span>
                `;
                otherList.appendChild(staffItem);
            });
            
            leaderboardContainer.appendChild(otherList);
        }
        
        // Render weekly challenge
        const challengeContainer = document.getElementById('weekly-challenge-container');
        if (!challengeContainer) return;
        
        challengeContainer.innerHTML = '';
        
        if (this.weeklyChallenge) {
            const challengeCard = document.createElement('div');
            challengeCard.className = 'weekly-challenge-card';
            
            const daysRemaining = Math.max(0, this.weeklyChallenge.endDay - this.day);
            
            challengeCard.innerHTML = `
                <div class="challenge-header">
                    <span class="challenge-icon">${this.weeklyChallenge.icon}</span>
                    <span class="challenge-name">${this.weeklyChallenge.name}</span>
                    <span class="challenge-timer">⏱️ ${daysRemaining} days left</span>
                </div>
                <div class="challenge-description">${this.weeklyChallenge.description}</div>
                <div class="challenge-progress-section">
                    <h4>Staff Progress:</h4>
                    <div class="challenge-staff-list">
                        ${this.staff.map(staff => {
                            const progress = this.challengeProgress[staff.id];
                            let currentProgress = 0;
                            let progressText = '';
                            
                            switch(this.weeklyChallenge.id) {
                                case 'fastest_fulfillment':
                                    currentProgress = progress.fastestOrderToday ? Math.min(100, (this.weeklyChallenge.target / progress.fastestOrderToday) * 100) : 0;
                                    progressText = progress.fastestOrderToday ? `${progress.fastestOrderToday.toFixed(0)}s` : 'N/A';
                                    break;
                                case 'highest_tips':
                                    currentProgress = (progress.tipsToday / this.weeklyChallenge.target) * 100;
                                    progressText = `$${progress.tipsToday.toFixed(0)}`;
                                    break;
                                case 'most_orders':
                                    currentProgress = (progress.ordersToday / this.weeklyChallenge.target) * 100;
                                    progressText = `${progress.ordersToday}`;
                                    break;
                                case 'teamwork_hero':
                                    currentProgress = (progress.teamworkScore / this.weeklyChallenge.target) * 100;
                                    progressText = `${progress.teamworkScore}`;
                                    break;
                            }
                            
                            const completed = staff.weeklyChallengeBadge ? '✓' : '';
                            
                            return `
                                <div class="challenge-staff-item ${staff.weeklyChallengeBadge ? 'completed' : ''}">
                                    <span class="challenge-staff-name">${staff.name} ${completed}</span>
                                    <div class="challenge-progress-bar">
                                        <div class="challenge-progress-fill" style="width: ${Math.min(100, currentProgress)}%"></div>
                                    </div>
                                    <span class="challenge-progress-text">${progressText}</span>
                                </div>
                            `;
                        }).join('')}
                    </div>
                </div>
            `;
            
            challengeContainer.appendChild(challengeCard);
        }
        
        // Render Hall of Fame
        const hofContainer = document.getElementById('hall-of-fame-container');
        if (!hofContainer) return;
        
        hofContainer.innerHTML = '';
        
        if (this.hallOfFame.length === 0) {
            hofContainer.innerHTML = '<div class="empty-state">No winners yet. Complete your first day to see the first Staff of the Day!</div>';
            return;
        }
        
        // Sort by prestige, then by last win day
        const sortedWinners = [...this.hallOfFame].sort((a, b) => {
            if (b.prestige !== a.prestige) {
                return b.prestige - a.prestige;
            }
            return b.lastWinDay - a.lastWinDay;
        });
        
        // Show top 5 winners
        const topWinners = sortedWinners.slice(0, 5);
        
        topWinners.forEach(winner => {
            const hofCard = document.createElement('div');
            hofCard.className = 'hall-of-fame-card';
            
            hofCard.innerHTML = `
                <div class="hof-header">
                    <span class="hof-icon">🌟</span>
                    <span class="hof-month">Day ${winner.lastWinDay}</span>
                </div>
                ${winner.prestige > 1 ? `<div class="hof-prestige">🏆 Prestige: ${winner.prestige}x Champion</div>` : ''}
                <div class="hof-name">${winner.name}</div>
                <div class="hof-title">${winner.title}</div>
                <div class="hof-stats">
                    <div class="hof-stat">
                        <span class="stat-label">Score:</span>
                        <span class="stat-value">${winner.score}</span>
                    </div>
                    <div class="hof-stat">
                        <span class="stat-label">Orders:</span>
                        <span class="stat-value">${winner.orders}</span>
                    </div>
                    <div class="hof-stat">
                        <span class="stat-label">Revenue:</span>
                        <span class="stat-value">$${winner.revenue.toFixed(0)}</span>
                    </div>
                    <div class="hof-stat">
                        <span class="stat-label">Tips:</span>
                        <span class="stat-value">$${(winner.tips || 0).toFixed(0)}</span>
                    </div>
                </div>
            `;
            
            hofContainer.appendChild(hofCard);
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
    
    // Mobile tooltip tap functionality
    function setupTooltipTapHandlers() {
        document.querySelectorAll('.tooltip-container, .stat-tooltip-container').forEach(container => {
            container.addEventListener('click', (e) => {
                // Only on touch devices
                if ('ontouchstart' in window) {
                    e.stopPropagation();
                    
                    const mobileTooltip = document.getElementById('mobile-tooltip');
                    const mobileTooltipContent = mobileTooltip.querySelector('.mobile-tooltip-content');
                    
                    // Get tooltip content
                    let tooltipElement = container.querySelector('.card-tooltip .tooltip-content, .stat-tooltip .tooltip-content');
                    
                    if (tooltipElement && mobileTooltip.classList.contains('active') && 
                        mobileTooltipContent.innerHTML === tooltipElement.innerHTML) {
                        // If clicking the same element, hide tooltip
                        mobileTooltip.classList.remove('active');
                    } else if (tooltipElement) {
                        // Show tooltip with content
                        mobileTooltipContent.innerHTML = tooltipElement.innerHTML;
                        mobileTooltip.classList.add('active');
                    }
                }
            });
        });
    }
    
    // Close tooltips when clicking outside
    document.addEventListener('click', (e) => {
        if ('ontouchstart' in window) {
            if (!e.target.closest('.tooltip-container') && 
                !e.target.closest('.stat-tooltip-container') &&
                !e.target.closest('.mobile-tooltip')) {
                const mobileTooltip = document.getElementById('mobile-tooltip');
                mobileTooltip.classList.remove('active');
            }
        }
    });
    
    // Setup tooltip handlers initially and after any render
    setupTooltipTapHandlers();
    const originalRender = game.render.bind(game);
    game.render = function() {
        originalRender();
        setupTooltipTapHandlers();
    };
    
    // Initial render is now handled in loadRecipeData()
});
