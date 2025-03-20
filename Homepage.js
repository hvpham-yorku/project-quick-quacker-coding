document.addEventListener('DOMContentLoaded', function() {
    // Duck Pet Section - Redirect to duck pet HTML on click
    const duckPetSection = document.getElementById('duckPetSection');
    duckPetSection.addEventListener('click', function() {
        window.location.href = 'Virtual_Pet.html';
    });

    // Duck Animation
    const duck = document.querySelector('.duck');
    let direction = 1;
    let position = 0;
    
    function animateDuck() {
        position += direction * 0.5;
        
        if (position > 100 || position < 0) {
            direction *= -1;
            // Flip the duck when changing direction
            duck.style.transform = direction > 0 ? 'scaleX(1)' : 'scaleX(-1)';
        }
        
        duck.style.left = `${position}px`;
        requestAnimationFrame(animateDuck);
    }
    
    animateDuck();

    // Calendar functionality
    const calendarDays = document.getElementById('calendarDays');
    const currentMonthDisplay = document.getElementById('currentMonth');
    const prevMonthBtn = document.getElementById('prevMonth');
    const nextMonthBtn = document.getElementById('nextMonth');
    
    let currentDate = new Date();
    let currentYear = currentDate.getFullYear();
    let currentMonth = currentDate.getMonth();
    
    function renderCalendar() {
        // Clear previous calendar days
        calendarDays.innerHTML = '';
        
        // Update month and year display
        const monthNames = ['January', 'February', 'March', 'April', 'May', 'June', 
                            'July', 'August', 'September', 'October', 'November', 'December'];
        currentMonthDisplay.textContent = `${monthNames[currentMonth]} ${currentYear}`;
        
        // Get first day of the month
        const firstDayOfMonth = new Date(currentYear, currentMonth, 1).getDay();
        
        // Get number of days in the month
        const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
        
        // Create empty cells for days before the first day of the month
        for (let i = 0; i < firstDayOfMonth; i++) {
            const emptyDay = document.createElement('div');
            calendarDays.appendChild(emptyDay);
        }
        
        // Create cells for each day of the month
        for (let day = 1; day <= daysInMonth; day++) {
            const dayElement = document.createElement('div');
            dayElement.textContent = day;
            
            // Highlight current day
            if (day === currentDate.getDate() && 
                currentMonth === currentDate.getMonth() && 
                currentYear === currentDate.getFullYear()) {
                dayElement.classList.add('current-day');
            }
            
            calendarDays.appendChild(dayElement);
        }
    }
    
    prevMonthBtn.addEventListener('click', function() {
        currentMonth--;
        if (currentMonth < 0) {
            currentMonth = 11;
            currentYear--;
        }
        renderCalendar();
    });
    
    nextMonthBtn.addEventListener('click', function() {
        currentMonth++;
        if (currentMonth > 11) {
            currentMonth = 0;
            currentYear++;
        }
        renderCalendar();
    });
    
    // To-Do List functionality with rewards system
    const todoInput = document.getElementById('todoInput');
    const prioritySelect = document.getElementById('prioritySelect');
    const addTodoBtn = document.getElementById('addTodo');
    const todoList = document.getElementById('todoList');
    
    let taskCount = 0;
    
    // Initialize or get duck rewards from localStorage
    let duckRewards = JSON.parse(localStorage.getItem('duckRewards')) || {
        feedCount: 0,
        drinkCount: 0
    };
    
    // Function to update duck rewards in localStorage
    function updateDuckRewards() {
        localStorage.setItem('duckRewards', JSON.stringify(duckRewards));
    }
    
    addTodoBtn.addEventListener('click', addTask);
    todoInput.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            addTask();
        }
    });
    
    function addTask() {
        const taskText = todoInput.value.trim();
        if (taskText === '') return;
        
        taskCount++;
        const priority = prioritySelect.value;
        
        const taskCard = document.createElement('div');
        taskCard.className = `task-card priority-${priority}`;
        
        taskCard.innerHTML = `
            <div class="task-content">
                <span class="task-priority priority-${priority}">${priority}</span>
                <span class="task-text">${taskText}</span>
            </div>
            <button class="icon-button check-icon" title="Mark as done">
                <i class="fas fa-check"></i>
            </button>
            <button class="icon-button trash-icon" title="Delete task">
                <i class="fas fa-trash"></i>
            </button>
        `;
        
        todoList.appendChild(taskCard);
        todoInput.value = '';
        
        // Toggle completed state and give rewards when completed
        const checkButton = taskCard.querySelector('.check-icon');
        checkButton.addEventListener('click', function() {
            if (!taskCard.classList.contains('completed')) {
                taskCard.classList.add('completed');
                
                // Add rewards - 2 feed and 2 drink counts per task
                duckRewards.feedCount += 2;
                duckRewards.drinkCount += 2;
                updateDuckRewards();
                
                // Show reward notification
                showRewardNotification();
            }
        });
        
        // Delete task
        const deleteBtn = taskCard.querySelector('.trash-icon');
        deleteBtn.addEventListener('click', function() {
            // Add a fade-out animation before removing
            taskCard.style.transition = 'opacity 0.3s ease';
            taskCard.style.opacity = '0';
            setTimeout(() => {
                taskCard.remove();
            }, 300);
        });
    }
    
    // Function to show reward notification
    function showRewardNotification() {
        const notification = document.createElement('div');
        notification.className = 'reward-notification';
        notification.innerHTML = `
            <div>Task Completed!</div>
            <div>Reward: <span class="reward-icon">🍞</span> +2 <span class="reward-icon">💧</span> +2</div>
        `;
        
        document.body.appendChild(notification);
        
        // Animate notification appearance
        setTimeout(() => {
            notification.style.opacity = '1';
            notification.style.transform = 'translateY(0)';
        }, 10);
        
        // Remove notification after a delay
        setTimeout(() => {
            notification.style.opacity = '0';
            notification.style.transform = 'translateY(-20px)';
            setTimeout(() => {
                document.body.removeChild(notification);
            }, 300);
        }, 3000);
    }
    
    // Duck interactivity
    duckPetSection.addEventListener('click', function(e) {
        // Make duck "jump" with animation
        duck.style.transition = 'transform 0.3s ease-out';
        duck.style.transform = 'translateY(-20px)';
        
        // Create ripple effect in the pond
        const ripple = document.createElement('div');
        ripple.style.position = 'absolute';
        ripple.style.width = '40px';
        ripple.style.height = '40px';
        ripple.style.backgroundColor = 'rgba(255, 255, 255, 0.3)';
        ripple.style.borderRadius = '50%';
        ripple.style.zIndex = '1';
        ripple.style.animation = 'ripple 1s ease-out';
        
        // Position ripple near the duck
        const duckRect = duck.getBoundingClientRect();
        const sectionRect = duckPetSection.getBoundingClientRect();
        ripple.style.left = `${(duckRect.left + duckRect.width/2) - sectionRect.left - 20}px`;
        ripple.style.top = `${(duckRect.bottom) - sectionRect.top - 10}px`;
        
        duckPetSection.appendChild(ripple);
        
        // Return duck to original position
        setTimeout(() => {
            duck.style.transform = 'translateY(0)';
        }, 300);
        
        // Remove ripple after animation
        setTimeout(() => {
            duckPetSection.removeChild(ripple);
        }, 1000);
    });
    
    // Add sample tasks for demonstration
    function addSampleTasks() {
        const sampleTasks = [
            { text: "Complete homework", priority: "high" },
            { text: "Walk the dog", priority: "medium" },
            { text: "Read a book", priority: "low" }
        ];
        
        sampleTasks.forEach(task => {
            todoInput.value = task.text;
            prioritySelect.value = task.priority;
            addTask();
        });
    }
    
    // Initialize calendar
    renderCalendar();
    
    // Uncomment to add sample tasks when page loads
    // addSampleTasks();
});
