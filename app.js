// 頁面元素選取
const taskInput = document.getElementById("taskInput");
const addTaskBtn = document.getElementById("addTaskBtn");
const taskList = document.getElementById("taskList");


// 初始化 Firebase
import { initializeApp } from "firebase/app";
import { getDocs, addDoc, getFirestore, collection, deleteDoc, doc, getDoc } from "firebase/firestore";

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


import { GoogleGenerativeAI } from '@google/generative-ai';

// Call in the event listener for page load
async function getApiKey() {
  let snapshot = await getDoc(doc(db, "apikey", "googlegenai"));
  apiKey = snapshot.data().key;
  genAI = new GoogleGenerativeAI(apiKey);
  model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
}

async function askChatBot(request) {
  return await model.generateContent(request);
}



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



function ruleChatBot(request) {
  if (request.startsWith("add task")) {
    let task = request.replace("add task", "").trim();
    if (task) {
      addTask(task);
      appendMessage('Task ' + task + ' added!');
    } else {
      appendMessage("Please specify a task to add.");
    }
    return true;
  } else if (request.startsWith("complete")) {
    let taskName = request.replace("complete", "").trim();
    if (taskName) {
      if (removeFromTaskName(taskName)) {
        appendMessage('Task ' + taskName + ' marked as complete.');
      } else {
        appendMessage("Task not found!");
      }
    }
  } else {
    appendMessage("Please specify a task to complete.");
  }
  return true;
}


aiButton.addEventListener('click', async () => {
  let prompt = aiInput.value.trim().toLowerCase();
  if (prompt) {
    if (!ruleChatBot(prompt)) {
      askChatBot(prompt);
    }
  } else {
    appendMessage("Please enter a prompt");
  }
});


function appendMessage(message) {
  let history = document.createElement("div");
  history.textContent = message;
  history.className = 'history';
  chatHistory.appendChild(history);
  aiInput.value = "";
}

function removeFromTaskName(task) {
  let ele = document.getElementsByName(task);
  if (ele.length == 0) {
    return false;
  }
  ele.forEach(e => {
    removeTask(e.id);
    removeVisualTask(e.id);
  })
  return true;
}


async function removeTask(taskId) {
  // 使用 Firestore 的 API 刪除任務
  const taskRef = doc(db, "todos", taskId);  // 根據 taskId 找到對應的 Firestore 文檔
  try {
    await deleteDoc(taskRef);  // 刪除文檔
    log.info(`Task with id ${taskId} has been deleted from Firestore.`);
  } catch (error) {
    log.error("Error removing task: ", error);
  }
}


function removeVisualTask(taskId) {
  // 根據 taskId 查找 DOM 中對應的任務元素
  const taskElement = document.getElementById(taskId);  // 假設每個任務的 id 是一個唯一的 taskId
  if (taskElement) {
    taskElement.remove();  // 從頁面中移除該任務
    log.info(`Task with id ${taskId} removed from the visual interface.`);
  } else {
    log.warn(`Task with id ${taskId} not found on the page.`);
  }
}

