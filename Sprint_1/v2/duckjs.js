document.addEventListener("DOMContentLoaded", function () {
  // First, ensure the initial task is not marked as completed
  const firstTask = document.querySelector(".task-card.completed");
  if (firstTask) {
    firstTask.classList.remove("completed");
  }

  // Track XP and level
  let currentXP = 30;
  const xpPerTask = 10; // Each task adds 10% XP

  // Add XP counter element to the DOM
  const xpLevel = document.querySelector(".xp-level");
  const xpCounter = document.createElement("div");
  xpCounter.className = "xp-counter";
  xpCounter.style.fontSize = "10px";
  xpCounter.style.color = "#555";
  xpCounter.style.textAlign = "right";
  xpCounter.style.paddingRight = "5px";
  xpCounter.style.marginBottom = "2px";
  xpCounter.textContent = currentXP + "/100 XP";

  // Insert counter before the progress bar
  xpLevel.insertBefore(xpCounter, xpLevel.querySelector(".progress-bar"));

  // Set initial progress bar width
  const initialProgressBar = document.querySelector(".progress");
  initialProgressBar.style.width = currentXP + "%";

  // Store original task order
  let taskOrder = [];
  const existingTasksForOrder = document.querySelectorAll(".task-card");
  existingTasksForOrder.forEach((task, index) => {
    // Add a data attribute to store original position
    task.dataset.originalPosition = index;
    taskOrder.push(task);
  });

  // Update the XP display function
  function updateXPDisplay() {
    const progressBar = document.querySelector(".progress");
    const xpIcon = document.querySelector(".xp-icon");
    const xpCounter = document.querySelector(".xp-counter");

    // Update XP counter text
    xpCounter.textContent = Math.round(currentXP) + "/100 XP";

    // Update progress bar width
    progressBar.style.width = currentXP + "%";

    // Level up if XP reaches 100%
    if (currentXP >= 100) {
      currentXP = currentXP - 100; // Reset XP but keep overflow
      progressBar.style.width = currentXP + "%";
      xpCounter.textContent = Math.round(currentXP) + "/100 XP";

      // Show level up animation
      const duck = document.querySelector(".duck");
      duck.style.transform = "scale(1.2)";
      setTimeout(() => {
        duck.style.transform = "";
      }, 500);
    }
  }

  // Function to rearrange tasks (incomplete at original positions, complete at bottom)
  function rearrangeTasks() {
    const tasksContainer = document.querySelector(".tasks-container");
    const tasks = Array.from(document.querySelectorAll(".task-card"));

    // Sort tasks: incomplete by original position, then completed at the bottom
    tasks.sort((a, b) => {
      const aCompleted = a.classList.contains("completed");
      const bCompleted = b.classList.contains("completed");

      if (aCompleted && bCompleted) {
        // Both completed, maintain their relative order
        return (
          parseInt(a.dataset.originalPosition) -
          parseInt(b.dataset.originalPosition)
        );
      } else if (!aCompleted && !bCompleted) {
        // Both incomplete, sort by original position
        return (
          parseInt(a.dataset.originalPosition) -
          parseInt(b.dataset.originalPosition)
        );
      } else {
        // One is complete and one is incomplete, incomplete first
        return aCompleted ? 1 : -1;
      }
    });

    // Reappend tasks in the new order
    tasks.forEach((task) => tasksContainer.appendChild(task));
  }

  // Modify the toggleTask function to update XP and rearrange tasks
  function toggleTask(event) {
    if (event) {
      event.stopPropagation();
    }

    const taskCard = this.closest(".task-card");
    const wasCompleted = taskCard.classList.contains("completed");

    // Toggle completion status
    taskCard.classList.toggle("completed");

    // Update XP based on task completion status
    if (!wasCompleted) {
      // Task was just completed
      currentXP += xpPerTask;
      updateXPDisplay();

      // Show flying checkmark animation
      const bird = document.createElement("span");
      bird.className = "bird";
      bird.textContent = "✓";
      bird.style.position = "absolute";
      bird.style.left = Math.random() * 60 + 20 + "%";
      bird.style.top = "60%";
      bird.style.transform = "scaleX(-1)";
      document.querySelector(".birds").appendChild(bird);

      // Remove extra birds if there are too many
      const birds = document.querySelectorAll(".birds .bird");
      if (birds.length > 8) {
        birds[0].remove();
      }
    } else {
      // Task was unchecked
      currentXP = Math.max(0, currentXP - xpPerTask);
      updateXPDisplay();
    }

    // Rearrange tasks immediately
    rearrangeTasks();
  }

  // Function to create and add delete button to tasks
  function addDeleteButtonToTask(taskCard) {
    // Check if delete button already exists
    if (taskCard.querySelector(".delete-task")) return;

    const deleteButton = document.createElement("div");
    deleteButton.className = "delete-task";
    deleteButton.innerHTML = "❌";
    deleteButton.style.marginLeft = "10px";
    deleteButton.style.cursor = "pointer";
    deleteButton.style.fontSize = "14px";
    deleteButton.style.opacity = "0.7";

    const taskContent = taskCard.querySelector(".task-content");
    taskContent.appendChild(deleteButton);

    // Add event listener to delete button
    deleteButton.addEventListener("click", function (e) {
      e.stopPropagation();
      if (confirm("Are you sure you want to delete this task?")) {
        // If the task is completed, decrease XP when deleted
        const isCompleted = taskCard.classList.contains("completed");
        if (isCompleted) {
          currentXP = Math.max(0, currentXP - xpPerTask);
          updateXPDisplay();
        }
        taskCard.remove();
      }
    });
  }

  // Add event listeners to existing checkboxes
  const checkboxes = document.querySelectorAll(".task-checkbox");
  checkboxes.forEach((checkbox) =>
    checkbox.addEventListener("click", toggleTask)
  );

  // Add delete buttons to existing tasks
  const existingTasks = document.querySelectorAll(".task-card");
  existingTasks.forEach((task) => {
    addDeleteButtonToTask(task);
  });

  // Rearrange tasks initially
  rearrangeTasks();

  // SINGLE event listener for add button
  const addButton = document.querySelector(".add-button");
  addButton.addEventListener("click", function () {
    const tasksContainer = document.querySelector(".tasks-container");
    const taskCount = document.querySelectorAll(".task-card").length + 1;

    const newTask = document.createElement("div");
    newTask.className = "task-card";
    newTask.innerHTML = `
              <div class="task-number">Task ${taskCount}</div>
              <div class="task-content">
                  <div class="task-text">New Task</div>
                  <div class="task-checkbox"></div>
              </div>
          `;

    // Set original position for new task
    newTask.dataset.originalPosition = taskCount - 1;

    // Insert new task at the top if there are completed tasks
    const firstCompletedTask = document.querySelector(".task-card.completed");
    if (firstCompletedTask) {
      tasksContainer.insertBefore(newTask, firstCompletedTask);
    } else {
      tasksContainer.appendChild(newTask);
    }

    // Add delete button to new task
    addDeleteButtonToTask(newTask);

    const newCheckbox = newTask.querySelector(".task-checkbox");
    if (newCheckbox) {
      newCheckbox.addEventListener("click", toggleTask);
    }

    const taskText = newTask.querySelector(".task-text");
    taskText.contentEditable = true;
    taskText.focus();
  });

  // Handle task text editing
  const taskTexts = document.querySelectorAll(".task-text");
  taskTexts.forEach((text) => {
    text.addEventListener("click", function (e) {
      if (!this.closest(".task-card").classList.contains("completed")) {
        this.contentEditable = true;
        this.focus();
        e.stopPropagation();
      }
    });

    text.addEventListener("blur", function () {
      this.contentEditable = false;
    });

    text.addEventListener("keydown", function (e) {
      if (e.key === "Enter") {
        e.preventDefault();
        this.contentEditable = false;
      }
    });
  });

  // Add search functionality
  const searchInput = document.querySelector(".search-bar input");
  searchInput.addEventListener("input", function () {
    const searchTerm = this.value.toLowerCase();
    const taskCards = document.querySelectorAll(".task-card");

    taskCards.forEach((card) => {
      const taskText = card
        .querySelector(".task-text")
        .textContent.toLowerCase();

      if (taskText.includes(searchTerm)) {
        card.style.display = "flex";
      } else {
        card.style.display = "none";
      }
    });
  });

  // Clear search when clicking the search icon
  const searchIcon = document.querySelector(".search-icon");
  searchIcon.addEventListener("click", function () {
    searchInput.value = "";
    const taskCards = document.querySelectorAll(".task-card");
    taskCards.forEach((card) => {
      card.style.display = "flex";
    });
    searchInput.focus();
  });

  // Animate the duck slightly
  const duck = document.querySelector(".duck");
  let up = true;
  setInterval(() => {
    duck.style.transform = up ? "translateY(-5px)" : "translateY(0)";
    up = !up;
  }, 1500);

  // Make birds fly
  const birds = document.querySelector(".birds");
  setInterval(() => {
    let currentRight = parseFloat(birds.style.right) || 20;
    birds.style.right = currentRight + 1 + "%";
    if (currentRight > 100) {
      birds.style.right = "-20%";
    }
  }, 200);
});
