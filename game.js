// Game State Management
class RestaurantGame {
    constructor() {
        this.isRunning = false;
        this.isPaused = false;
        this.day = 1;
        this.revenue = 0;
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
            { name: 'Chef Mario', role: 'Head Chef', efficiency: 0.9, speciality: 'Italian' },
            { name: 'Chef Lisa', role: 'Sous Chef', efficiency: 0.8, speciality: 'Asian' },
            { name: 'Cook Tom', role: 'Line Cook', efficiency: 0.7, speciality: 'Grill' },
            { name: 'Cook Sarah', role: 'Line Cook', efficiency: 0.7, speciality: 'Prep' }
        ];
        
        staffMembers.forEach(member => {
            this.staff.push({
                id: this.nextStaffId++,
                name: member.name,
                role: member.role,
                efficiency: member.efficiency,
                speciality: member.speciality,
                status: 'available',
                ordersCompleted: 0,
                currentOrder: null,
                performance: 100
            });
        });
    }
    
    start() {
        this.isRunning = true;
        this.isPaused = false;
        this.startGameLoop();
    }
    
    pause() {
        this.isPaused = !this.isPaused;
    }
    
    startGameLoop() {
        // Update game state every second
        this.gameInterval = setInterval(() => {
            if (!this.isPaused && this.isRunning) {
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
    
    updateDayProgression() {
        this.dayTimer++;
        
        if (this.dayTimer >= this.dayDuration) {
            // Advance to next day
            this.day++;
            this.dayTimer = 0;
            
            // Increase difficulty gradually
            this.orderGenerationChance = Math.min(0.8, 0.4 + (this.day - 1) * 0.05);
            
            // End of day bonus
            const bonus = Math.floor(this.revenue * 0.1);
            this.revenue += bonus;
            
            this.addFeedback(`🌅 Day ${this.day} begins! Difficulty increased. Bonus: $${bonus}`, true);
        }
    }
    
    generateOrder() {
        const dishes = [
            { name: 'Beef Steak', ingredients: ['Beef', 'Vegetables'], price: 25, time: 180 },
            { name: 'Chicken Pasta', ingredients: ['Chicken', 'Pasta', 'Tomatoes'], price: 18, time: 120 },
            { name: 'Grilled Fish', ingredients: ['Fish', 'Vegetables'], price: 22, time: 150 },
            { name: 'Vegetable Stir Fry', ingredients: ['Vegetables', 'Rice'], price: 15, time: 90 },
            { name: 'Chicken Rice Bowl', ingredients: ['Chicken', 'Rice', 'Vegetables'], price: 16, time: 100 },
            { name: 'Cheese Pizza', ingredients: ['Cheese', 'Tomatoes'], price: 14, time: 120 },
            { name: 'Pasta Primavera', ingredients: ['Pasta', 'Vegetables', 'Cheese'], price: 17, time: 110 }
        ];
        
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
            requiredIngredients: requiredIngredients
        };
        
        this.orders.push(order);
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
        
        if (success) {
            order.status = 'completed';
            this.revenue += order.totalPrice;
            this.happyCustomers++;
            
            if (staff) {
                staff.ordersCompleted++;
                staff.performance = Math.min(100, staff.performance + 2);
                staff.status = 'available';
                staff.currentOrder = null;
            }
            
            this.customerSatisfaction = Math.min(100, this.customerSatisfaction + 2);
            this.addFeedback(`✅ Order #${order.id} completed! Customer is happy! +$${order.totalPrice}`, true);
        } else {
            order.status = 'failed';
            this.unhappyCustomers++;
            
            if (staff) {
                staff.performance = Math.max(0, staff.performance - 5);
                staff.status = 'available';
                staff.currentOrder = null;
            }
            
            this.customerSatisfaction = Math.max(0, this.customerSatisfaction - 10);
            this.addFeedback(`❌ Order #${order.id} failed! Customer is unhappy!`, false);
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
    
    toggleSound() {
        this.soundEnabled = !this.soundEnabled;
        const btn = document.getElementById('sound-toggle-btn');
        btn.textContent = this.soundEnabled ? '🔊 Sound On' : '🔇 Sound Off';
        this.addFeedback(`Sound ${this.soundEnabled ? 'enabled' : 'disabled'}`, true);
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
    }
    
    renderGameStats() {
        const dayProgress = (this.dayTimer / this.dayDuration) * 100;
        document.getElementById('game-day').textContent = this.day;
        document.getElementById('game-day').title = `Day ${this.day} - ${Math.floor(dayProgress)}% complete`;
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
            
            orderCard.innerHTML = `
                <div class="order-header">
                    <span class="order-number">Order #${order.id}</span>
                    <span class="order-timer ${timerClass}">${order.timeRemaining}s</span>
                </div>
                <div class="order-items">${itemsList}</div>
                <div style="margin: 5px 0; font-weight: bold; color: #28a745;">Total: $${order.totalPrice}</div>
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
            
            staffCard.innerHTML = `
                <div class="staff-header">
                    <div>
                        <div class="staff-name">${staff.name}</div>
                        <div class="staff-role">${staff.role}</div>
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
            `;
            
            container.appendChild(staffCard);
        });
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
            
            item.innerHTML = `
                <div class="inventory-header">
                    <span class="ingredient-name">${name}</span>
                    <span class="stock-level ${levelClass}">${stock.current}/${stock.max}</span>
                </div>
                <div class="stock-bar">
                    <div class="stock-bar-fill ${levelClass}" style="width: ${percentage}%"></div>
                </div>
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
    
    // Initial render
    game.render();
});
