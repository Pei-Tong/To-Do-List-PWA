const taskInput = documentById("taskInput");
const addTaskBtn = documentById("addTaskBtn");
const taskList = documentById("taskList");

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
