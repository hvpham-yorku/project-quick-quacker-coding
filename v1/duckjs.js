const { useState, useEffect } = React;

// QuackerApp Component
const QuackerApp = () => {
  // State for tasks
  const [tasks, setTasks] = useState([]);
  const [taskInput, setTaskInput] = useState("");
  const [priority, setPriority] = useState("medium");
  const [currentFilter, setCurrentFilter] = useState("all");
  const [searchText, setSearchText] = useState("");
  const [currentEditId, setCurrentEditId] = useState(null);
  const [editTaskInput, setEditTaskInput] = useState("");
  const [editPriority, setEditPriority] = useState("medium");
  const [showAddTask, setShowAddTask] = useState(false);

  // Load tasks from localStorage on initial render
  useEffect(() => {
    const savedTasks = JSON.parse(localStorage.getItem("quackerTasks")) || [];
    setTasks(savedTasks);
  }, []);

  // Save tasks to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem("quackerTasks", JSON.stringify(tasks));
  }, [tasks]);

  // Calculate XP level based on completed tasks
  const xpLevel = Math.min(
    100,
    Math.floor(
      (tasks.filter((task) => task.completed).length /
        Math.max(1, tasks.length)) *
        100
    ) || 0
  );

  // Filter and sort tasks
  const getFilteredTasks = () => {
    let filteredTasks = [...tasks];

    // Apply search filter
    if (searchText) {
      filteredTasks = filteredTasks.filter((task) =>
        task.text.toLowerCase().includes(searchText.toLowerCase())
      );
    }

    // Apply status filter
    if (currentFilter === "active") {
      filteredTasks = filteredTasks.filter((task) => !task.completed);
    } else if (currentFilter === "completed") {
      filteredTasks = filteredTasks.filter((task) => task.completed);
    }

    // Sort by priority and date
    filteredTasks.sort((a, b) => {
      const priorityOrder = { high: 0, medium: 1, low: 2 };
      return (
        priorityOrder[a.priority] - priorityOrder[b.priority] ||
        new Date(b.date) - new Date(a.date)
      );
    });

    return filteredTasks;
  };

  // Task Actions
  const addTask = () => {
    if (taskInput.trim() === "") return;

    const newTask = {
      id: Date.now(),
      text: taskInput,
      completed: false,
      priority: priority,
      date: new Date().toLocaleDateString(),
    };

    setTasks([...tasks, newTask]);
    setTaskInput("");
    setShowAddTask(false);
  };

  const toggleTaskComplete = (id) => {
    setTasks(
      tasks.map((task) =>
        task.id === id ? { ...task, completed: !task.completed } : task
      )
    );
  };

  const deleteTask = (id) => {
    setTasks(tasks.filter((task) => task.id !== id));
  };

  const startEditTask = (id) => {
    const task = tasks.find((task) => task.id === id);
    setCurrentEditId(id);
    setEditTaskInput(task.text);
    setEditPriority(task.priority);
  };

  const updateTask = () => {
    if (editTaskInput.trim() === "" || !currentEditId) return;

    setTasks(
      tasks.map((task) =>
        task.id === currentEditId
          ? { ...task, text: editTaskInput, priority: editPriority }
          : task
      )
    );

    setCurrentEditId(null);
  };

  const cancelEdit = () => {
    setCurrentEditId(null);
  };

  const clearCompleted = () => {
    setTasks(tasks.filter((task) => !task.completed));
  };

  const filteredTasks = getFilteredTasks();

  // Handle Enter key in the input field
  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      addTask();
    }
  };

  // Get task background color based on priority
  const getTaskBgColor = (priority, isCompleted) => {
    if (isCompleted) return "bg-green-200";
    
    switch(priority) {
      case "high": return "bg-red-100";
      case "medium": return "bg-yellow-100";
      case "low": return "bg-white";
      default: return "bg-white";
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen w-full bg-gray-100 p-0 m-0">
      <div className="w-full h-full md:max-w-md lg:max-w-lg rounded-none md:rounded-3xl overflow-hidden shadow-xl border-0 md:border-8 border-black bg-gradient-to-b from-yellow-200 to-green-100 flex flex-col">
        {/* Header */}
        <div className="p-4 bg-yellow-300 shadow-md">
          <h1 className="text-3xl font-bold text-center">
            Quac<span className="text-yellow-500">k</span>er
          </h1>
          
          {/* XP Level Display */}
          <div className="mt-2">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">Duck XP Level: {xpLevel}%</span>
            </div>
            <div className="w-full h-2 bg-gray-200 rounded-full">
              <div 
                className="h-full bg-yellow-400 rounded-full transition-all duration-500"
                style={{ width: `${xpLevel}%` }}
              ></div>
            </div>
          </div>
        </div>

        {/* Filter Tabs */}
        <div className="flex justify-between p-2 bg-white">
          <button
            className={`flex-1 mx-1 py-1 rounded-lg ${
              currentFilter === "all" ? "bg-blue-500 text-white" : "bg-gray-200"
            }`}
            onClick={() => setCurrentFilter("all")}
          >
            All
          </button>
          <button
            className={`flex-1 mx-1 py-1 rounded-lg ${
              currentFilter === "active" ? "bg-blue-500 text-white" : "bg-gray-200"
            }`}
            onClick={() => setCurrentFilter("active")}
          >
            Active
          </button>
          <button
            className={`flex-1 mx-1 py-1 rounded-lg ${
              currentFilter === "completed" ? "bg-blue-500 text-white" : "bg-gray-200"
            }`}
            onClick={() => setCurrentFilter("completed")}
          >
            Completed
          </button>
        </div>

        {/* Main Content Area */}
        <div className="flex-1 overflow-y-auto p-4">
          {/* Search Bar */}
          <div className="relative mb-2">
            <input
              type="text"
              className="w-full p-2 pl-8 border rounded-lg"
              placeholder="Search tasks..."
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
            />
            <span className="absolute left-2 top-2 text-gray-400">🔍</span>
          </div>

          {/* Add Task Button */}
          <button
            className="w-full mb-4 bg-blue-500 text-white p-2 rounded-lg"
            onClick={() => setShowAddTask(!showAddTask)}
          >
            {showAddTask ? "Cancel" : "Add New Task"}
          </button>

          {/* Add Task Section */}
          {showAddTask && (
            <div className="mb-4 bg-white p-3 rounded-lg shadow-md">
              <input
                type="text"
                className="w-full p-2 border rounded-lg"
                placeholder="Enter new task"
                value={taskInput}
                onChange={(e) => setTaskInput(e.target.value)}
                onKeyDown={handleKeyDown}
                autoFocus
              />
              <select
                className="w-full p-2 mt-2 border rounded-lg"
                value={priority}
                onChange={(e) => setPriority(e.target.value)}
              >
                <option value="high">High Priority</option>
                <option value="medium">Medium Priority</option>
                <option value="low">Low Priority</option>
              </select>
              <button
                className="w-full mt-2 bg-blue-500 text-white p-2 rounded-lg"
                onClick={addTask}
              >
                Add Task
              </button>
            </div>
          )}

          {/* Task List */}
          {filteredTasks.length > 0 ? (
            <ul>
              {filteredTasks.map((task) => (
                <li
                  key={task.id}
                  className={`p-3 mb-2 border rounded-lg flex justify-between shadow-sm ${
                    getTaskBgColor(task.priority, task.completed)
                  }`}
                >
                  <div 
                    className="flex items-center cursor-pointer flex-1 pr-2" 
                    onClick={() => toggleTaskComplete(task.id)}
                  >
                    <span 
                      className={`inline-block w-4 h-4 mr-2 border rounded-sm flex-shrink-0 ${
                        task.completed ? "bg-green-500" : ""
                      }`} 
                    />
                    <span className={`${
                      task.completed ? "line-through text-gray-500" : ""
                    }`}>
                      {task.text}
                    </span>
                  </div>
                  <div className="flex-shrink-0">
                    <button
                      className="bg-yellow-500 text-white px-2 py-1 rounded-lg mr-1"
                      onClick={() => startEditTask(task.id)}
                    >
                      Edit
                    </button>
                    <button
                      className="bg-red-500 text-white px-2 py-1 rounded-lg"
                      onClick={() => deleteTask(task.id)}
                    >
                      Delete
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          ) : (
            <div className="text-center p-8 bg-white rounded-lg shadow-sm">
              <p className="text-xl text-gray-500">No tasks found!</p>
              <p className="text-gray-500 mt-2">Add some tasks to get started.</p>
            </div>
          )}

          {/* Clear Completed Button */}
          {tasks.some(task => task.completed) && (
            <button
              className="w-full mt-4 bg-red-500 text-white p-2 rounded-lg"
              onClick={clearCompleted}
            >
              Clear Completed
            </button>
          )}
        </div>

        {/* Edit Task Modal */}
        {currentEditId && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white p-4 rounded-lg w-4/5 max-w-md">
              <h3 className="font-bold mb-2 text-lg">Edit Task</h3>
              <input
                type="text"
                className="w-full p-2 border rounded-lg"
                value={editTaskInput}
                onChange={(e) => setEditTaskInput(e.target.value)}
                autoFocus
              />
              <select
                className="w-full p-2 mt-2 border rounded-lg"
                value={editPriority}
                onChange={(e) => setEditPriority(e.target.value)}
              >
                <option value="high">High Priority</option>
                <option value="medium">Medium Priority</option>
                <option value="low">Low Priority</option>
              </select>
              <div className="flex justify-between mt-4">
                <button
                  className="w-full mr-1 bg-green-500 text-white p-2 rounded-lg"
                  onClick={updateTask}
                >
                  Update
                </button>
                <button
                  className="w-full ml-1 bg-gray-400 text-white p-2 rounded-lg"
                  onClick={cancelEdit}
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

// Render the QuackerApp component
ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <QuackerApp />
  </React.StrictMode>
);