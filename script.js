let tasks = []; // Array to hold tasks

// Function to save tasks to LocalStorage
function saveTasks() {
    localStorage.setItem('todos', JSON.stringify(tasks));
}

// Function to load tasks from LocalStorage or use initial data
function loadTasks() {
    const storedTasks = localStorage.getItem('todos');
    if (storedTasks) {
        tasks = JSON.parse(storedTasks);
    } else {
        // Use the initialTasks.json data if no tasks in localStorage
        tasks = [
            { "id": 1, "text": "Pay Weekly Bills", "completed": false },
            { "id": 2, "text": "Daily Standup Meeting", "completed": true }
        ];
        saveTasks(); // Save initial tasks to localStorage
    }
    renderTasks();
}

// Function to render all tasks
function renderTasks() {
    const todoList = document.getElementById('todo-list');
    todoList.innerHTML = ''; // Clear existing tasks
    tasks.forEach(task => {
        const listItem = createTaskElement(task);
        todoList.appendChild(listItem);
    });
}

// Function to create a single task list item element
function createTaskElement(task) {
    const listItem = document.createElement('li');
    listItem.className = 'todo-item'; // Add class for styling

    const checkbox = document.createElement('input');
    checkbox.type = 'checkbox';
    checkbox.checked = task.completed;
    checkbox.addEventListener('change', () => toggleTaskCompletion(task.id));

    const taskTextSpan = document.createElement('span');
    taskTextSpan.textContent = task.text;
    taskTextSpan.className = 'task-text';
    if (task.completed) {
        taskTextSpan.classList.add('completed');
    }
    taskTextSpan.addEventListener('click', () => window.editTask(task.id, taskTextSpan)); // Make editTask globally accessible

    const deleteBtn = document.createElement('button');
    deleteBtn.textContent = 'X';
    deleteBtn.className = 'delete-btn';
    deleteBtn.addEventListener('click', () => deleteTask(task.id));

    listItem.appendChild(checkbox);
    listItem.appendChild(taskTextSpan);
    listItem.appendChild(deleteBtn);

    return listItem;
}

// Function to add a new task
function addTask() {
    const newTaskInput = document.getElementById('new-task-input');
    const text = newTaskInput.value.trim();
    if (text) {
        const newTask = {
            id: Date.now(), // Simple unique ID
            text: text,
            completed: false
        };
        tasks.push(newTask);
        saveTasks();
        renderTasks();
        newTaskInput.value = '';
    }
}

// Function to toggle task completion
function toggleTaskCompletion(id) {
    const taskIndex = tasks.findIndex(task => task.id === id);
    if (taskIndex > -1) {
        tasks[taskIndex].completed = !tasks[taskIndex].completed;
        saveTasks();
        renderTasks(); // Re-render to apply/remove CSS class
    }
}

// Function to delete a task
function deleteTask(id) {
    tasks = tasks.filter(task => task.id !== id);
    saveTasks();
    renderTasks();
}

// Globally accessible function for editing a task
window.editTask = function(id, spanElement) {
    const taskIndex = tasks.findIndex(task => task.id === id);
    if (taskIndex === -1) return;

    const originalText = spanElement.textContent;
    const input = document.createElement('input');
    input.type = 'text';
    input.value = originalText;
    input.className = 'edit-input';

    // Replace the span with the input
    spanElement.parentNode.replaceChild(input, spanElement);
    input.focus();

    const saveChanges = () => {
        const newText = input.value.trim();
        if (newText && newText !== originalText) {
            tasks[taskIndex].text = newText;
            saveTasks();
        }
        // Replace the input back with a span
        const newSpan = document.createElement('span');
        newSpan.textContent = tasks[taskIndex].text; // Use updated text if saved, else original
        newSpan.className = 'task-text';
        if (tasks[taskIndex].completed) {
            newSpan.classList.add('completed');
        }
        newSpan.addEventListener('click', () => window.editTask(id, newSpan));
        input.parentNode.replaceChild(newSpan, input);
    };

    input.addEventListener('blur', saveChanges);
    input.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            input.blur(); // Trigger blur to save changes
        }
    });
};


// Initialize the app
document.addEventListener('DOMContentLoaded', () => {
    document.getElementById('add-task-btn').addEventListener('click', addTask);
    loadTasks();
});
