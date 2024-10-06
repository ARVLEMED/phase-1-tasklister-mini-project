document.addEventListener("DOMContentLoaded", () => {
  const taskForm = document.getElementById("create-task-form");
  const taskInput = document.getElementById("new-task-description");
  const prioritySelect = document.getElementById("priority");
  const userInput = document.getElementById("user");
  const durationInput = document.getElementById("duration");
  const taskList = document.getElementById("tasks");
  const clearCompletedButton = document.getElementById("clear-completed");
  const sortAscButton = document.getElementById("sort-asc");
  const sortDescButton = document.getElementById("sort-desc");

  
  loadTasks();

  
  taskForm.addEventListener("submit", (event) => {
    event.preventDefault();

    const taskText = taskInput.value.trim();
    const priority = prioritySelect.value;
    const user = userInput.value.trim();
    const duration = durationInput.value.trim();

    if (taskText === "" || duration <= 0) return;

    addTask({ text: taskText, priority, user, duration });
    resetForm();
  });

  
  function addTask(task) {
    const li = document.createElement("li");
    li.classList.add(task.priority);
    li.innerHTML = `
      <input type="checkbox" class="complete">
      ${task.text} (Priority: ${task.priority}, User: ${task.user}, Duration: ${task.duration})
      <button class="edit">✏️</button>
      <span class="delete">❌</span>
    `;

    
    li.querySelector(".complete").onclick = () => {
      li.classList.toggle("completed"); 
      saveTasks();
    };

    
    li.querySelector(".edit").onclick = () => {
      editTask(li, task);
    };

  
    li.querySelector(".delete").onclick = () => {
      li.remove();
      saveTasks();
    };

    taskList.appendChild(li);
    saveTasks(); 
  }

  
  function loadTasks() {
    const tasks = JSON.parse(localStorage.getItem("tasks")) || [];
    tasks.forEach(task => addTask(task));
  }

  
  function saveTasks() {
    const tasks = [];
    document.querySelectorAll("#tasks li").forEach(li => {
      const text = li.childNodes[1].textContent.split(" (Priority:")[0].trim();
      const priority = li.className;
      const user = li.textContent.split("User: ")[1]?.split(",")[0].trim();
      const duration = li.textContent.split("Duration: ")[1]?.split(")")[0].trim();
      const completed = li.classList.contains("completed");

      tasks.push({
        text,
        priority,
        user,
        duration,
        completed
      });
    });
    localStorage.setItem("tasks", JSON.stringify(tasks));
  }

  
  clearCompletedButton.addEventListener("click", () => {
    document.querySelectorAll("#tasks li.completed").forEach(li => li.remove());
    saveTasks();
  });

  
  sortAscButton.addEventListener("click", () => {
    sortTasks(true);
  });

  
  sortDescButton.addEventListener("click", () => {
    sortTasks(false);
  });

  
  function sortTasks(ascending) {
    const tasks = Array.from(document.querySelectorAll("#tasks li"));
    tasks.sort((a, b) => {
      const priorityA = getPriorityValue(a.className);
      const priorityB = getPriorityValue(b.className);
      return ascending ? priorityA - priorityB : priorityB - priorityA;
    });
    taskList.innerHTML = ""; 
    tasks.forEach(task => taskList.appendChild(task)); 
    saveTasks();
  }

  
  function getPriorityValue(priority) {
    switch (priority) {
      case 'high': return 3;
      case 'medium': return 2;
      case 'low': return 1;
      default: return 0;
    }
  }

  
  function editTask(li, task) {
    taskInput.value = task.text;
    prioritySelect.value = task.priority;
    userInput.value = task.user;
    durationInput.value = task.duration;

    
    li.remove();
    saveTasks();
  }

  
  function resetForm() {
    taskInput.value = ""; 
    userInput.value = ""; 
    durationInput.value = ""; 
  }
});
