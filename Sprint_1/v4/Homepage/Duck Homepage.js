document.addEventListener('DOMContentLoaded', function() {
    // Duck Pet Section - Redirect to duck pet HTML on click
    const duckPetSection = document.getElementById('duckPetSection');
    duckPetSection.addEventListener('click', function() {
        window.location.href = 'Duck Virtual Pet.html';
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
    
    // To-Do List functionality
    const todoInput = document.getElementById('todoInput');
    const addTodoBtn = document.getElementById('addTodo');
    const todoList = document.getElementById('todoList');
    
    // Load saved todos from localStorage
    let todos = JSON.parse(localStorage.getItem('todos')) || [];
    
    function renderTodos() {
        todoList.innerHTML = '';
        todos.forEach((todo, index) => {
            const li = document.createElement('li');
            li.innerHTML = `
                <span class="${todo.completed ? 'completed' : ''}">${todo.text}</span>
                <div>
                    <button class="toggle-btn" data-index="${index}">
                        ${todo.completed ? 'Undo' : 'Done'}
                    </button>
                    <button class="delete-btn" data-index="${index}">Delete</button>
                </div>
            `;
            todoList.appendChild(li);
        });
        
        // Save todos to localStorage
        localStorage.setItem('todos', JSON.stringify(todos));
    }
    
    addTodoBtn.addEventListener('click', function() {
        const todoText = todoInput.value.trim();
        if (todoText) {
            todos.push({ text: todoText, completed: false });
            todoInput.value = '';
            renderTodos();
        }
    });
    
    todoInput.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            addTodoBtn.click();
        }
    });
    
    todoList.addEventListener('click', function(e) {
        if (e.target.classList.contains('toggle-btn')) {
            const index = e.target.dataset.index;
            todos[index].completed = !todos[index].completed;
            renderTodos();
        } else if (e.target.classList.contains('delete-btn')) {
            const index = e.target.dataset.index;
            todos.splice(index, 1);
            renderTodos();
        }
    });
    
    // Initialize
    renderCalendar();
    renderTodos();
});