// 頁面元素選取
const taskInput = document.getElementById("taskInput");
const addTaskBtn = document.getElementById("addTaskBtn");
const taskList = document.getElementById("taskList");


// 初始化 Firebase
import { initializeApp } from "firebase/app";
import { getDocs, addDoc, getFirestore, collection, deleteDoc, doc} from "firebase/firestore";

import log from "loglevel";
// Set the log level (trace, debug, info, warn, error)
log.setLevel("info");
// Example logs
log.info("Application started");
log.debug("Debugging information");
log.error("An error occurred");


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
const db = getFirestore(app);


// Service Worker 註冊
const sw = new URL('./service-worker.js', import.meta.url);

if ('serviceWorker' in navigator) {
  const s = navigator.serviceWorker;

  s.register(sw.href, {
    scope: '/To-Do-List-PWA/',
  })
    .then(() => 
      console.log('Service Worker Registered for scope:', sw.href, 'with', import.meta.url)
    )
    .catch((err) => 
      console.error('Service Worker Error:', err)
    );
}

taskInput.addEventListener("keypress", function(event) {
  if (event.key === "Enter") {
    addTaskBtn.click();
  }
});


// Add Task
addTaskBtn.addEventListener("click", async () => {
  const task = taskInput.value.trim();
  if (task) {
    const taskText = sanitizeInput(taskInput.value.trim());

    if (taskText) {
      try {
        // Log user action
        log.info(`Task added: ${taskText}`);
        await addTaskToFirestore(taskText);
        renderTasks();
        taskInput.value = "";
      } catch (error) {
        // Log error
        log.error("Error adding task", error);
      }
    }
  } else {
    alert("Please enter a task");
  }

});

async function addTaskToFirestore(taskText) {
  await addDoc(collection(db, "todos"), {
    text: taskText,
    completed: false
  });
}

// Remove task on Click
taskList.addEventListener("click", async (e) => {
  if (e.target.tagName === 'LI') {
    await deleteDoc(doc(db, "todos", e.target.id), {
      completed: true
    });
    e.target.remove();
    renderTasks();
  }
});


taskList.addEventListener("keypress", async function(e) {
  if (e.target.tagName === 'LI' && e.key === "Enter") {
    await deleteDoc(doc(db, "todos", e.target.id), {
      completed: true
    });
    e.target.remove();
    renderTasks();
  }
});



async function renderTasks() {
  var tasks = await getTasksFromFirestore();
  taskList.innerHTML = "";
  
  tasks.forEach((task) => {
    if (!task.data().completed) {
      const taskItem = document.createElement("li");
      taskItem.id = task.id;
      taskItem.tabIndex = 0;
      taskItem.textContent = task.data().text;
      taskList.appendChild(taskItem);
    }
  });
}

async function getTasksFromFirestore() {
  var data = await getDocs(collection(db, "todos"));
  let userData = [];
  
  data.forEach((doc) => {
    userData.push(doc);
  });
  
  return userData;
}


// Sanitize Input
function sanitizeInput(input) {
  const div = document.createElement("div");
  div.textContent = input;
  return div.innerHTML;
}





