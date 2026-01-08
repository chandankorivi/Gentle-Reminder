// ---------- Audio ----------
const beep = new Audio("https://www.soundjay.com/button/beep-07.mp3");

// ---------- Load tasks from localStorage ----------
window.onload = function() {
    let tasks = JSON.parse(localStorage.getItem("tasks")) || [];
    tasks.forEach(task => addTaskFromStorage(task.text, task.completed, task.time));
}

// ---------- Add task ----------
function addTask() {
    let input = document.getElementById("taskInput");
    let text = input.value.trim();
    if(text === "") return;

    let timeInput = document.getElementById("taskTime").value;
    addTaskFromStorage(text, false, timeInput);

    saveTasksToStorage();
    input.value = "";
    document.getElementById("taskTime").value = "";
}

// ---------- Create li and schedule alarm ----------
function addTaskFromStorage(text, completed, timeInput) {
    let li = document.createElement("li");
    li.innerHTML = `
        <span onclick="toggleDone(this)">${text}</span>
        <button onclick="removeTask(this)">✖</button>
    `;
    if(completed) li.classList.add("completed");

    document.getElementById("taskList").appendChild(li);

    // ---------- Schedule alarm if time is set ----------
    if(timeInput){
        scheduleAlarm(text, timeInput);
    }
}

// ---------- Schedule alarm ----------
function scheduleAlarm(text, timeInput){
    let now = new Date();
    let [hour, min] = timeInput.split(":").map(Number);

    let alarmTime = new Date();
    alarmTime.setHours(hour, min, 0, 0);

    let timeout = alarmTime.getTime() - now.getTime();
    if(timeout < 0) timeout += 24*60*60*1000; // next day

    setTimeout(() => {
        alert("Gentle Reminder: " + text);
        playBeep(2);
    }, timeout);
}

// ---------- Play beep ----------
function playBeep(times) {
    let count = 0;
    let interval = setInterval(() => {
        beep.play();
        count++;
        if(count >= times) clearInterval(interval);
    }, 700);
}

// ---------- Mark task done ----------
function toggleDone(el) {
    el.parentElement.classList.toggle("completed");
    saveTasksToStorage();
}

// ---------- Remove task ----------
function removeTask(btn) {
    btn.parentElement.remove();
    saveTasksToStorage();
}

// ---------- Save tasks ----------
function saveTasksToStorage() {
    let tasks = [];
    document.querySelectorAll("#taskList li").forEach(li => {
        let taskText = li.querySelector("span").innerText;
        let completed = li.classList.contains("completed");
        let time = li.querySelector("span").getAttribute("data-time") || "";
        tasks.push({text: taskText, completed: completed, time: time});
    });
    localStorage.setItem("tasks", JSON.stringify(tasks));
}
