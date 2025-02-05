const toggleModeButton = document.getElementById('toggleMode');
const addTodoButton = document.getElementById('addTodoButton');
const clearCompletedButton = document.getElementById('clearCompleted');
const todoInput = document.getElementById('todoInput');
const todoList = document.getElementById('todoList');
const filterButtons = document.querySelectorAll('.filter-btn');

// Get stored todos from localStorage (if any)
const storedTodos = JSON.parse(localStorage.getItem('todos')) || [];

// Set initial todos
let todos = [...storedTodos];
let currentFilter = 'all';  // Default filter is "all"

// Load todos to the UI based on the current filter
function loadTodos() {
  // Filter todos based on the selected filter
  let filteredTodos;
  if (currentFilter === 'active') {
    filteredTodos = todos.filter(todo => !todo.completed);
  } else if (currentFilter === 'completed') {
    filteredTodos = todos.filter(todo => todo.completed);
  } else {
    filteredTodos = todos;
  }

  todoList.innerHTML = '';
  filteredTodos.forEach(todo => {
    const todoItem = document.createElement('li');
    todoItem.classList.add('todo-item', 'bg-white', 'dark:bg-gray-700', 'p-3', 'my-2', 'rounded-md', 'flex', 'justify-between', 'items-center', 'shadow-md');
    todoItem.innerHTML = `
      <span class="todo-text">${todo.text}</span>
      <button class="remove-btn text-red-500">Remove</button>
    `;
    if (todo.completed) {
      todoItem.classList.add('completed');
    }
    todoList.appendChild(todoItem);

    // Toggle completed state when clicked
    todoItem.addEventListener('click', function () {
      todo.completed = !todo.completed;
      saveTodos();
      loadTodos();
    });

    // Remove Todo Item
    const removeButton = todoItem.querySelector('.remove-btn');
    removeButton.addEventListener('click', function (e) {
      e.stopPropagation(); // Prevent triggering the click event
      todos = todos.filter(t => t !== todo);
      saveTodos();
      loadTodos();
    });
  });
}

// Save todos to localStorage
function saveTodos() {
  localStorage.setItem('todos', JSON.stringify(todos));
}

// Toggle Dark/Light Mode
toggleModeButton.addEventListener('click', function () {
  document.body.classList.toggle('dark-mode');
});

// Add Todo Item
addTodoButton.addEventListener('click', function () {
  const todoText = todoInput.value.trim();
  if (todoText === '') return;

  const newTodo = { text: todoText, completed: false };
  todos.push(newTodo);
  saveTodos();
  loadTodos();
  todoInput.value = '';
});

// Clear Completed Todos
clearCompletedButton.addEventListener('click', function () {
  todos = todos.filter(todo => !todo.completed);
  saveTodos();
  loadTodos();
});

// Filter Todos
filterButtons.forEach(button => {
  button.addEventListener('click', function () {
    filterButtons.forEach(b => b.classList.remove('active'));
    this.classList.add('active');
    currentFilter = this.dataset.filter;

    // Update todos based on the filter
    loadTodos();
  });
});

// Initial load
loadTodos();
