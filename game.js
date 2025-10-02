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
        
        this.initializeInventory();
        this.initializeStaff();
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
                maxUpgradeLevel: 3 // Maximum upgrade level
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
            maxUpgradeLevel: 3
        };
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
        this.addFeedback(`✅ Hired ${newStaff.name} (${newStaff.role}) - Efficiency: ${(newStaff.efficiency * 100).toFixed(0)}%`, true);
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
        
        this.initializeInventory();
        this.initializeStaff();
        
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
        // Apply bonus
        const bonus = Math.floor(this.revenue * 0.1);
        this.revenue += bonus;
        
        // Advance to next day
        this.day++;
        this.dayTimer = 0;
        
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
        
        const dishes = [
            { name: 'Beef Steak', ingredients: ['Beef', 'Vegetables'], price: 25, time: 180 },
            { name: 'Chicken Pasta', ingredients: ['Chicken', 'Pasta', 'Tomatoes'], price: 18, time: 120 },
            { name: 'Grilled Fish', ingredients: ['Fish', 'Vegetables'], price: 22, time: 150 },
            { name: 'Vegetable Stir Fry', ingredients: ['Vegetables', 'Rice'], price: 15, time: 90 },
            { name: 'Chicken Rice Bowl', ingredients: ['Chicken', 'Rice', 'Vegetables'], price: 16, time: 100 },
            { name: 'Cheese Pizza', ingredients: ['Cheese', 'Tomatoes'], price: 14, time: 120 },
            { name: 'Pasta Primavera', ingredients: ['Pasta', 'Vegetables', 'Cheese'], price: 17, time: 110 }
        ];
        
        // Determine if this is a VIP order (15% chance)
        const isVIP = Math.random() < 0.15;
        
        const numItems = Math.floor(Math.random() * 3) + 1; // 1-3 items per order
        const orderItems = [];
        let totalPrice = 0;
        let maxTime = 0;
        
        for (let i = 0; i < numItems; i++) {
            const dish = dishes[Math.floor(Math.random() * dishes.length)];
            orderItems.push(dish);
            totalPrice += dish.price;
            maxTime = Math.max(maxTime, dish.time);
        }
        
        // VIP orders get price boost and time reduction
        if (isVIP) {
            totalPrice = Math.floor(totalPrice * 1.5); // 50% price bonus
            maxTime = Math.floor(maxTime * 0.8); // 20% less time
        }
        
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
            isVIP: isVIP
        };
        
        this.orders.push(order);
        
        if (isVIP) {
            this.addFeedback('⭐ VIP Customer arrived! High reward, strict deadline!', true);
        }
        
        this.render();
    }
    
    assignOrderToStaff(orderId) {
        const order = this.orders.find(o => o.id === orderId);
        if (!order || order.status !== 'pending') return;
        
        // Find available staff
        const availableStaff = this.staff.filter(s => s.status === 'available');
        if (availableStaff.length === 0) {
            this.addFeedback('⚠️ No available staff to assign order!', false);
            return;
        }
        
        // Pick the most efficient available staff
        const staffMember = availableStaff.sort((a, b) => b.efficiency - a.efficiency)[0];
        
        // Deduct ingredients from inventory
        for (const [ingredient, amount] of Object.entries(order.requiredIngredients)) {
            this.inventory[ingredient].current -= amount;
        }
        
        order.status = 'in-progress';
        order.assignedStaff = staffMember.id;
        staffMember.status = 'busy';
        staffMember.currentOrder = orderId;
        
        this.render();
    }
    
    updateOrders() {
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
            } else if (order.status === 'in-progress') {
                order.timeRemaining--;
                
                const staff = this.staff.find(s => s.id === order.assignedStaff);
                if (staff) {
                    // Progress based on staff efficiency
                    order.progress += staff.efficiency * 1.5; // Progress per second
                    
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
            
            if (order.isVIP) {
                this.vipCustomers++;
            }
            
            if (staff) {
                staff.ordersCompleted++;
                staff.performance = Math.min(100, staff.performance + 2);
                staff.status = 'available';
                staff.currentOrder = null;
            }
            
            this.customerSatisfaction = Math.min(100, this.customerSatisfaction + satisfactionChange);
            const vipLabel = order.isVIP ? ' ⭐ VIP' : '';
            this.addFeedback(`✅ Order #${order.id}${vipLabel} completed! Customer is happy! +$${order.totalPrice}`, true);
        } else {
            order.status = 'failed';
            this.unhappyCustomers++;
            
            if (staff) {
                staff.performance = Math.max(0, staff.performance - 5);
                staff.status = 'available';
                staff.currentOrder = null;
            }
            
            const penaltyChange = order.isVIP ? 20 : 10; // VIP failures hurt more
            this.customerSatisfaction = Math.max(0, this.customerSatisfaction - penaltyChange);
            const vipLabel = order.isVIP ? ' ⭐ VIP' : '';
            this.addFeedback(`❌ Order #${order.id}${vipLabel} failed! Customer is unhappy!`, false);
        }
        
        this.completedOrders.push(order);
    }
    
    updateStaff() {
        // Gradually recover performance for available staff
        this.staff.forEach(staff => {
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
        
        document.getElementById('revenue').textContent = `$${this.revenue}`;
        
        const avgRating = this.calculateAverageRating();
        document.getElementById('overall-rating').textContent = avgRating.toFixed(1);
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
        
        // Sort orders: pending urgent first, then by time remaining
        const sortedOrders = [...this.orders].sort((a, b) => {
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
            if (order.isVIP) {
                orderCard.classList.add('vip-order');
            }
            
            orderCard.innerHTML = `
                <div class="order-header">
                    <span class="order-number">Order #${order.id} ${vipBadge}</span>
                    <span class="order-timer ${timerClass}">${order.timeRemaining}s</span>
                </div>
                <div class="order-items">${itemsList}</div>
                <div style="margin: 5px 0; font-weight: bold; color: #28a745;">Total: $${order.totalPrice}</div>
                ${assignedStaffInfo}
                <div class="order-status">
                    <div class="order-progress">
                        <div class="order-progress-bar" style="width: ${order.progress}%"></div>
                    </div>
                    ${order.status === 'pending' ? 
                        `<button class="assign-btn" onclick="game.assignOrderToStaff(${order.id})">Assign</button>` :
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
            
            staffCard.innerHTML = `
                <div class="staff-header">
                    <div>
                        <div class="staff-name">${staff.name} ${upgradeStars}</div>
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
                <div class="performance-bar-container">
                    <div class="performance-bar" style="width: ${staff.performance}%; background-color: ${performanceColor};"></div>
                </div>
                ${canUpgrade ? `
                    <button class="upgrade-btn" onclick="game.upgradeStaff(${staff.id})" ${this.revenue < upgradeCost ? 'disabled' : ''}>
                        ⬆️ Upgrade ($${upgradeCost})
                    </button>
                ` : '<div style="text-align: center; margin-top: 10px; color: #28a745; font-weight: bold;">✓ MAX LEVEL</div>'}
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
            
            item.innerHTML = `
                <div class="inventory-header">
                    <span class="ingredient-name">${name}</span>
                    <span class="stock-level ${levelClass}">${stock.current}/${stock.max}</span>
                </div>
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
        const avgWaitTime = document.getElementById('avg-wait-time');
        
        satisfactionBar.style.width = `${this.customerSatisfaction}%`;
        happyCustomers.textContent = this.happyCustomers;
        unhappyCustomers.textContent = this.unhappyCustomers;
        
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
}

// Initialize game
let game;

document.addEventListener('DOMContentLoaded', () => {
    game = new RestaurantGame();
    
    // Button event listeners
    document.getElementById('start-game-btn').addEventListener('click', () => {
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
