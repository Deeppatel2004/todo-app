function createTodo(text) {
  return { text: text, done: false };
}

function addTodo(todos, text) {
  if (text.trim() === "") {
    return todos;
  }
  return [...todos, createTodo(text)];
}

function toggleTodo(todos, originalIndex) {
  return todos.map((todo, i) => {
    if (i === originalIndex) {
      return { ...todo, done: !todo.done };
    }
    return todo;
  });
}

function deleteTodo(todos, originalIndex) {
  return todos.filter(function (_, i) {
    return i !== originalIndex;
  });
}

function filterTodos(todos, mode) {
  if (mode === 'active') {
    return todos.filter(todo => todo.done === false);
  }
  if (mode === 'done') {
    return todos.filter(todo => todo.done === true);
  }
  return [...todos];
}

function clearDone(todos) {
  return todos.filter(todo => todo.done === false);
}

function editTodo(todos, index, newText) {
  if (newText.trim() === '') {
    return todos;
  }
  return todos.map((todo, i) => {
    if (i === index) {
      return { ...todo, text: newText };
    }
    return todo;
  });
}

function countDone(todos) {
  return todos.filter(todo => todo.done === true).length;
}

function countLeft(todos) {
  return todos.filter(todo => todo.done === false).length;
}

function sortTodos(todos) {
  return [...todos].sort((a, b) => a.text.localeCompare(b.text));
}

function toText(todos) {
  return JSON.stringify(todos);
}

function fromText(text) {
  if (text === null) {
    return [];
  }
  try {
    return JSON.parse(text);
  } catch (e) {
    return [];
  }
}


const todoInput = document.querySelector('#todoInput');
const addBtn = document.querySelector('#addBtn');
const todolist = document.querySelector('#todolist');
const left = document.querySelector('#left');
const todoForm = document.querySelector('#todoForm');

const filterAll = document.querySelector('#filterAll');
const filterActive = document.querySelector('#filterActive');
const filterDone = document.querySelector('#filterDone');
const clearDoneBtn = document.querySelector('#clearDoneBtn');
const searchInput = document.querySelector('#searchInput');
const sortBtn = document.querySelector('#sortBtn');


let todos = fromText(localStorage.getItem("todos"));
let mode = 'all';
let searchWord = '';


function render() {
  todolist.innerHTML = "";


  let indexedTodos = todos.map((todo, index) => ({ todo, originalIndex: index }));
  if (mode === 'active') {
    indexedTodos = indexedTodos.filter(item => item.todo.done === false);
  } else if (mode === 'done') {
    indexedTodos = indexedTodos.filter(item => item.todo.done === true);
  }


  if (searchWord.trim() !== "") {
    indexedTodos = indexedTodos.filter(item =>
      item.todo.text.toLowerCase().includes(searchWord.toLowerCase())
    );
  }


  indexedTodos.forEach(function (item) {
    const todo = item.todo;
    const originalIndex = item.originalIndex;

    const li = document.createElement("li");

    const span = document.createElement("span");
    span.textContent = todo.text;

    if (todo.done) {
      span.classList.add("done");
    }

    const doneBtn = document.createElement("button");
    doneBtn.textContent = todo.done ? "Undo" : "Done";
    doneBtn.addEventListener("click", function () {
      todos = toggleTodo(todos, originalIndex);
      render();
    });

    const deleteBtn = document.createElement("button");
    deleteBtn.textContent = "Delete";
    deleteBtn.addEventListener("click", function () {
      todos = deleteTodo(todos, originalIndex);
      render();
    });

    li.append(span);
    li.append(doneBtn);
    li.append(deleteBtn);

    todolist.append(li);
  });


  left.textContent = countLeft(todos) + " left";
  localStorage.setItem("todos", toText(todos));
}


todoForm.addEventListener("submit", function (event) {
  event.preventDefault();
  todos = addTodo(todos, todoInput.value);
  todoInput.value = "";
  render();
});

filterAll.addEventListener("click", function () {
  mode = 'all';
  render();
});

filterActive.addEventListener("click", function () {
  mode = 'active';
  render();
});

filterDone.addEventListener("click", function () {
  mode = 'done';
  render();
});

clearDoneBtn.addEventListener("click", function () {
  todos = clearDone(todos);
  render();
});

searchInput.addEventListener("input", function () {
  searchWord = searchInput.value;
  render();
});

sortBtn.addEventListener("click", function () {
  todos = sortTodos(todos);
  render();
});

render();