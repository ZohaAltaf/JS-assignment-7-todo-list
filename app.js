const todoForm = document.getElementById("todoForm");
const todoInput = document.getElementById("todoInput");
const todoList = document.getElementById("todoList");
const filterButtons = document.querySelectorAll(".filter-btn");
const clearCompletedBtn = document.getElementById("clearCompletedBtn");
const remainingCount = document.getElementById("remainingCount");

let todos = JSON.parse(localStorage.getItem("todo_list_items") || "[]");
let currentFilter = "all";

function saveTodos() {
  localStorage.setItem("todo_list_items", JSON.stringify(todos));
}

function getFilteredTodos() {
  if (currentFilter === "active") {
    return todos.filter((todo) => !todo.completed);
  }
  if (currentFilter === "completed") {
    return todos.filter((todo) => todo.completed);
  }
  return todos;
}

function renderTodos() {
  const items = getFilteredTodos();
  todoList.innerHTML = "";

  if (items.length === 0) {
    const empty = document.createElement("li");
    empty.className = "empty-msg";
    empty.textContent = "No tasks found.";
    todoList.appendChild(empty);
  } else {
    items.forEach((todo) => {
      const li = document.createElement("li");
      li.className = `todo-item ${todo.completed ? "completed" : ""}`;

      const left = document.createElement("div");
      left.className = "todo-left";

      const checkbox = document.createElement("input");
      checkbox.type = "checkbox";
      checkbox.checked = todo.completed;
      checkbox.addEventListener("change", () => {
        todo.completed = checkbox.checked;
        saveTodos();
        renderTodos();
      });

      const span = document.createElement("span");
      span.className = "todo-text";
      span.textContent = todo.text;

      left.appendChild(checkbox);
      left.appendChild(span);

      const delBtn = document.createElement("button");
      delBtn.type = "button";
      delBtn.className = "delete-btn";
      delBtn.textContent = "✕";
      delBtn.addEventListener("click", () => {
        todos = todos.filter((item) => item.id !== todo.id);
        saveTodos();
        renderTodos();
      });

      li.appendChild(left);
      li.appendChild(delBtn);
      todoList.appendChild(li);
    });
  }

  const leftTasks = todos.filter((t) => !t.completed).length;
  remainingCount.textContent = `${leftTasks} ${leftTasks === 1 ? "task" : "tasks"} left`;
}

todoForm.addEventListener("submit", (e) => {
  e.preventDefault();
  const text = todoInput.value.trim();
  if (!text) return;

  todos.unshift({
    id: Date.now(),
    text,
    completed: false,
  });

  saveTodos();
  renderTodos();
  todoInput.value = "";
  todoInput.focus();
});

filterButtons.forEach((btn) => {
  btn.addEventListener("click", () => {
    filterButtons.forEach((b) => b.classList.remove("active"));
    btn.classList.add("active");
    currentFilter = btn.dataset.filter;
    renderTodos();
  });
});

clearCompletedBtn.addEventListener("click", () => {
  todos = todos.filter((t) => !t.completed);
  saveTodos();
  renderTodos();
});

renderTodos();