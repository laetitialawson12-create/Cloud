document.addEventListener('DOMContentLoaded', () => {
    const taskInput = document.getElementById('taskInput');
    const addBtn = document.getElementById('addBtn');
    const taskList = document.getElementById('taskList');

    // Charger les tâches depuis le LocalStorage
    let tasks = JSON.parse(localStorage.getItem('web_tasks')) || [];

    function saveAndRender() {
        localStorage.setItem('web_tasks', JSON.stringify(tasks));
        taskList.innerHTML = '';
        tasks.forEach((task, index) => {
            const li = document.createElement('li');
            li.innerHTML = `
                <span>${task}</span>
                <button class="delete-btn" onclick="deleteTask(${index})">❌</button>
            `;
            taskList.appendChild(li);
        });
    }

    addBtn.addEventListener('click', () => {
        if (taskInput.value.trim() !== '') {
            tasks.push(taskInput.value.trim());
            taskInput.value = '';
            saveAndRender();
        }
    });

    window.deleteTask = (index) => {
        tasks.splice(index, 1);
        saveAndRender();
    };

    saveAndRender();
});