// JavaScript for To-Do List
const todoForm = document.getElementById('todo-form');
const todoInput = document.getElementById('todo-input');
const todoList = document.getElementById('todo-list');

// Load todos from localStorage
function loadTodos() {
    const todos = JSON.parse(localStorage.getItem('todos')) || [];
    todos.forEach(todo => {
        const listItem = createTodoItem(todo.text, todo.completed);
        todoList.appendChild(listItem);
    });
}

// Save todos to localStorage
function saveTodos() {
    const todos = [];
    todoList.querySelectorAll('li').forEach(listItem => {
        todos.push({
            text: listItem.firstChild.textContent,
            completed: listItem.classList.contains('completed')
        });
    });
    localStorage.setItem('todos', JSON.stringify(todos));
}

// Create a new todo item
function createTodoItem(text, completed = false) {
    const listItem = document.createElement('li');
    listItem.textContent = text;

    if (completed) {
        listItem.classList.add('completed');
    }

    const completeButton = document.createElement('button');
    completeButton.textContent = 'Selesai';
    completeButton.addEventListener('click', () => {
        listItem.classList.toggle('completed');
        saveTodos();
    });

    const deleteButton = document.createElement('button');
    deleteButton.textContent = 'Hapus';
    deleteButton.addEventListener('click', () => {
        todoList.removeChild(listItem);
        saveTodos();
    });

    listItem.appendChild(completeButton);
    listItem.appendChild(deleteButton);

    return listItem;
}

// Add a new todo item
function addTodoItem(event) {
    event.preventDefault();

    const todoText = todoInput.value.trim();
    if (todoText === '') return;

    const listItem = createTodoItem(todoText);
    todoList.appendChild(listItem);

    todoInput.value = '';
    saveTodos();
}

todoForm.addEventListener('submit', addTodoItem);
window.addEventListener('load', loadTodos);