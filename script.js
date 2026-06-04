document.addEventListener('DOMContentLoaded', () => {
    const taskInput = document.getElementById('taskInput');
    const tagSelect = document.getElementById('tagSelect');
    const searchInput = document.getElementById('searchInput');
    const addBtn = document.getElementById('addBtn');
    const taskList = document.getElementById('taskList');
    const filterBtns = document.querySelectorAll('.filter-btn');
    const statsText = document.getElementById('statsText');
    const progressBarFill = document.getElementById('progressBarFill');

    let tasks = JSON.parse(localStorage.getItem('pro_tasks')) || [];
    let currentFilter = 'all';
    let searchQuery = '';

    function updateStats() {
        const total = tasks.length;
        const completed = tasks.filter(t => t.completed).length;
        const percentage = total === 0 ? 0 : Math.round((completed / total) * 100);
        
        statsText.innerText = `${completed} / ${total} tâches terminées (${percentage}%)`;
        progressBarFill.style.width = `${percentage}%`;
    }

    function getTagClass(tag) {
        if (tag.includes('Travail')) return 'tag-travail';
        if (tag.includes('Perso')) return 'tag-perso';
        return 'tag-urgent'; // Par défaut Urgent
    }

    function saveAndRender() {
        localStorage.setItem('pro_tasks', JSON.stringify(tasks));
        taskList.innerHTML = '';

        // 1. Appliquer le filtre d'état ET la recherche par texte ou tag
        const filteredTasks = tasks.filter(task => {
            const matchesFilter = currentFilter === 'all' || 
                                 (currentFilter === 'active' && !task.completed) || 
                                 (currentFilter === 'completed' && task.completed);
            
            const matchesSearch = task.text.toLowerCase().includes(searchQuery.toLowerCase()) || 
                                  task.tag.toLowerCase().includes(searchQuery.toLowerCase());

            return matchesFilter && matchesSearch;
        });

        // 2. Générer le HTML
        filteredTasks.forEach((task) => {
            const originalIndex = tasks.indexOf(task);
            const li = document.createElement('li');
            if (task.completed) li.classList.add('completed');

            li.innerHTML = `
                <div class="task-content">
                    <input type="checkbox" class="task-checkbox" ${task.completed ? 'checked' : ''} onclick="toggleTask(${originalIndex})">
                    <span class="task-text" title="${task.text}">${task.text}</span>
                    <span class="tag ${getTagClass(task.tag)}">${task.tag}</span>
                </div>
                <button class="delete-btn" onclick="deleteTask(${originalIndex})">🗑️</button>
            `;
            taskList.appendChild(li);
        });

        updateStats();
    }

    // Événement d'ajout
    addBtn.addEventListener('click', () => {
        const text = taskInput.value.trim();
        const tag = tagSelect.value;
        
        if (text !== '') {
            tasks.push({ text: text, tag: tag, completed: false });
            taskInput.value = '';
            saveAndRender();
        }
    });

    // Événement de recherche en temps réel
    searchInput.addEventListener('input', (e) => {
        searchQuery = e.target.value;
        saveAndRender();
    });

    window.toggleTask = (index) => {
        tasks[index].completed = !tasks[index].completed;
        saveAndRender();
    };

    window.deleteTask = (index) => {
        tasks.splice(index, 1);
        saveAndRender();
    };

    // Filtres d'état (Toutes, En cours, Terminées)
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