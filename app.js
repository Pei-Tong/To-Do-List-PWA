const taskInput = document.getElementById("taskInput");
const addTaskBtn = document.getElementById("addTaskBtn");
const taskList = document.getElementById("taskList");

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


// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyAIG7xk6369LrCe0OIiDoPZHZuMcUikuc4",
  authDomain: "todo-list-a5d26.firebaseapp.com",
  projectId: "todo-list-a5d26",
  storageBucket: "todo-list-a5d26.firebasestorage.app",
  messagingSenderId: "668975418178",
  appId: "1:668975418178:web:34c993da77dd83c116d6db",
  measurementId: "G-EM5RQTDPS8"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getAnalytics(app);