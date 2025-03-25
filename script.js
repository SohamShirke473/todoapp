const inputBox = document.querySelector(".input");
const addButton = document.querySelector(".addBtn");
const todosListWrapper = document.querySelector(".todos-list-wrapper");
const errorMessageText = document.querySelector(".error-message-text");

let currentEditedTodo = null;

// Creating/adding new todo
function createNewTodoItem(getCurrentTodo) {
  const li = document.createElement("li");
  const p = document.createElement("p");

  p.textContent = getCurrentTodo;
  li.appendChild(p);

  const editBtn = document.createElement("button");
  editBtn.innerText = "Edit";
  editBtn.classList.add("btn", "editBtn");
  li.appendChild(editBtn);

  const deleteBtn = document.createElement("button");
  deleteBtn.innerText = "Delete";
  deleteBtn.classList.add("btn", "deleteBtn");
  li.appendChild(deleteBtn);

  return li;
}

function saveTodosToStorage(getCurrentTodo) {
  let todosList = JSON.parse(localStorage.getItem("todos")) || [];

  todosList.push(getCurrentTodo);
  localStorage.setItem("todos", JSON.stringify(todosList));
}

function addNewTodo() {
  const extractInputText = inputBox.value.trim();
  if (extractInputText.length === 0) {
    errorMessageText.textContent =
      "Input cannot be empty! You must write some TODO to proceed.";
    return false;
  }

  if (addButton.innerText === "Edit todo") {
    handleEditCurrentTodo(currentEditedTodo.target.previousElementSibling.innerHTML);
    currentEditedTodo.target.previousElementSibling.innerHTML = extractInputText;
    addButton.innerText = "Add todo";
    currentEditedTodo = null;
  } else {
    const newTodoItem = createNewTodoItem(extractInputText);
    todosListWrapper.appendChild(newTodoItem);
    saveTodosToStorage(extractInputText);
  }

  inputBox.value = "";
  errorMessageText.textContent = "";
}

function fetchAllTodos() {
  let todosList = JSON.parse(localStorage.getItem("todos")) || [];

  todosList.forEach((todoItem) => {
    const extractLi = createNewTodoItem(todoItem);
    todosListWrapper.appendChild(extractLi);
  });
}

function handleEditCurrentTodo(currentTodo) {
  let todos = JSON.parse(localStorage.getItem("todos")) || [];
  let index = todos.indexOf(currentTodo);

  if (index !== -1) {
    todos[index] = inputBox.value;
    localStorage.setItem("todos", JSON.stringify(todos));
  }
}

function handleDeleteTodos(currentTodo) {
  let todosList = JSON.parse(localStorage.getItem("todos")) || [];

  let currentTodoText = currentTodo.children[0].innerHTML;
  let index = todosList.indexOf(currentTodoText);

  if (index !== -1) {
    todosList.splice(index, 1);
    localStorage.setItem("todos", JSON.stringify(todosList));
  }
}

function handleEditOrDeleteTodo(event) {
  if (event.target.classList.contains("deleteBtn")) {
    todosListWrapper.removeChild(event.target.parentElement);
    handleDeleteTodos(event.target.parentElement);
  }

  if (event.target.classList.contains("editBtn")) {
    inputBox.value = event.target.previousElementSibling.innerHTML;
    inputBox.focus();
    addButton.innerText = "Edit todo";
    currentEditedTodo = event;
  }
}

document.addEventListener("DOMContentLoaded", fetchAllTodos);
addButton.addEventListener("click", addNewTodo);
todosListWrapper.addEventListener("click", handleEditOrDeleteTodo);
