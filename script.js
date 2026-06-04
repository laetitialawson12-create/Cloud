document.addEventListener('DOMContentLoaded', () => {
    const taskInput = document.getElementById('taskInput');
    const tagSelect = document.getElementById('tagSelect');
    const addBtn = document.getElementById('addBtn');
    const taskList = document.getElementById('taskList');
    const filterBtns = document.querySelectorAll('.filter-btn');

    let tasks = JSON.parse(localStorage.getItem('advanced_tasks')) || [];
    let currentFilter = 'all';

    function saveAndRender() {
        localStorage.setItem('advanced_tasks', JSON.stringify(tasks));
        taskList.innerHTML = '';

        // Filtrer les tâches avant de les afficher
        const filteredTasks = tasks.filter(task => {
            if (currentFilter === 'active') return !task.completed;
            if (currentFilter === 'completed') return task.completed;
            return true; // 'all'
        });

        filteredTasks.forEach((task) => {
            // Retrouver l'index réel dans le tableau d'origine
            const originalIndex = tasks.indexOf(task);

            const li = document.createElement('li');
            if (task.completed) li.classList.add('completed');

            li.innerHTML = `
                <div class="task-content">
                    <input type="checkbox" class="task-checkbox" ${task.completed ? 'checked' : ''} onclick="toggleTask(${originalIndex})">
                    <span class="task-text">${task.text}</span>
                    <span class="tag">${task.tag}</span>
                </div>
                <button class="delete-btn" onclick="deleteTask(${originalIndex})">🗑️</button>
            `;
            taskList.appendChild(li);
        });
    }

    // Ajouter une tâche
    addBtn.addEventListener('click', () => {
        const text = taskInput.value.trim();
        const tag = tagSelect.value;
        
        if (text !== '') {
            tasks.push({ text: text, tag: tag, completed: false });
            taskInput.value = '';
            saveAndRender();
        }
    });

    // Inverser le statut d'une tâche (Fait / En cours)
    window.toggleTask = (index) => {
        tasks[index].completed = !tasks[index].completed;
        saveAndRender();
    };

    // Supprimer une tâche
    window.deleteTask = (index) => {
        tasks.splice(index, 1);
        saveAndRender();
    };

    // Gestion des filtres
    filterBtns.forEach(btn => {
        btn.addEventListener('click', (e) => {
            filterBtns.forEach(b => b.classList.remove('active'));
            e.target.classList.add('active');
            currentFilter = e.target.getAttribute('data-filter');
            saveAndRender();
        });
    });

    saveAndRender();
});