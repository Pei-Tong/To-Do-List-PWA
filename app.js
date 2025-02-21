const taskInput = document.getElementByIdById("taskInput");
const addTaskBtn = document.getElementByIdById("addTaskBtn");
const taskList = document.getElementByIdById("taskList");

// Add Task
addTaskBtn.addEventListener("click", () => {
  const task = taskInput.value.trim();
  if (task) {
    const li = document.createElement("li");
    li.textContent = task;
    taskList.appendChild(li);
    taskInput.value = " ";
  }
});

// Remove task on Click
taskList.addEventListener("click", (e) => {
  if (e.target.tagName === "LI") {
    e.target.remove();
  }
});
