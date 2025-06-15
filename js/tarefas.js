// INÍCIO: Configuração Inicial e DOM
document.addEventListener('DOMContentLoaded', () => {
    loadState();
    setupEventListeners();
    updateDisplay();
    // Garante que os modais comecem escondidos
    if (addTaskModal) addTaskModal.style.display = 'none';
    if (historyModal) historyModal.style.display = 'none';
});

// Dados de exemplo
const sampleTasks = [
    { id: 1, title: "Criar apresentação de resultados", responsible: "Anna", dueDate: "2025-06-20", isCompleted: false, priority: "Alta", status: "Em Andamento" },
    { id: 2, title: "Revisar especificações técnicas", responsible: "Bruno", dueDate: "2025-06-25", isCompleted: false, priority: "Média", status: "Pendente" },
    { id: 3, title: "Atualizar layout da página principal", responsible: "Carlos", dueDate: "2025-06-18", isCompleted: true, priority: "Baixa", status: "Concluída" },
    { id: 4, title: "Planejar sprint de Julho", responsible: "Diana", dueDate: "2025-06-28", isCompleted: false, priority: "Alta", status: "Pendente" }
];
const sampleDeletedTasks = [];

// Variáveis de estado
let tasks = [];
let deletedTasks = [];
let filters = { search: '', status: 'todos', priority: 'todas' };
let sortState = { key: 'dueDate', order: 'asc' };
let tasksChart;

// Elementos do DOM
const taskTableBody = document.getElementById('taskTableBody');
const taskSearchInput = document.getElementById('taskSearch');
const addTaskBtn = document.getElementById('addTaskBtn');
const addTaskModal = document.getElementById('addTaskModal');
const closeModalButton = document.querySelector('.close-button');
const addTaskForm = document.getElementById('addTaskForm');
const statusFilter = document.getElementById('statusFilter');
const priorityFilter = document.getElementById('priorityFilter');
const taskCountersContainer = document.getElementById('taskCounters');
const historyBtn = document.getElementById('historyBtn');
const historyModal = document.getElementById('historyModal');
const closeHistoryModalButton = document.querySelector('.history-close-button');
const historyListContainer = document.getElementById('historyList');
const clearHistoryBtn = document.getElementById('clearHistoryBtn');


// Gerenciamento de Estado
function saveState() {
    localStorage.setItem('tasks', JSON.stringify(tasks));
    localStorage.setItem('deletedTasks', JSON.stringify(deletedTasks));
    localStorage.setItem('filters', JSON.stringify(filters));
    localStorage.setItem('sortState', JSON.stringify(sortState));
}

function loadState() {
    const storedTasks = localStorage.getItem('tasks');
    const parsedTasks = storedTasks ? JSON.parse(storedTasks) : null;
    tasks = (Array.isArray(parsedTasks) && parsedTasks.length > 0) ? parsedTasks : sampleTasks;
    const storedDeletedTasks = localStorage.getItem('deletedTasks');
    deletedTasks = storedDeletedTasks ? JSON.parse(storedDeletedTasks) : sampleDeletedTasks;
    const storedFilters = localStorage.getItem('filters');
    if (storedFilters) filters = JSON.parse(storedFilters);
    const storedSortState = localStorage.getItem('sortState');
    if(storedSortState) sortState = JSON.parse(storedSortState);
    taskSearchInput.value = filters.search;
    statusFilter.value = filters.status;
    priorityFilter.value = filters.priority;
}


// Renderização e Atualização da UI
function updateDisplay() {
    renderCounters();
    renderTasks();
    updateTasksChart();
    updateSortIcons();
}

function renderTasks() {
    taskTableBody.innerHTML = '';
    let filteredAndSortedTasks = tasks.filter(task => (task.title.toLowerCase().includes(filters.search) || task.responsible.toLowerCase().includes(filters.search)) && (filters.status === 'todos' || task.status === filters.status) && (filters.priority === 'todas' || task.priority === filters.priority)).sort((a, b) => {
        const priorityValues = { 'Baixa': 1, 'Média': 2, 'Alta': 3 };
        let valA = sortState.key === 'priority' ? priorityValues[a.priority] : a.dueDate;
        let valB = sortState.key === 'priority' ? priorityValues[b.priority] : b.dueDate;
        if (valA < valB) return sortState.order === 'asc' ? -1 : 1;
        if (valA > valB) return sortState.order === 'asc' ? 1 : -1;
        return 0;
    });
    filteredAndSortedTasks.forEach(task => {
        const row = document.createElement('tr');
        if (task.isCompleted) row.classList.add('task-completed');
        const priorityClass = `priority-${task.priority.toLowerCase()}`;
        row.innerHTML = `<td><input type="checkbox" class="task-checkbox" data-task-id="${task.id}" ${task.isCompleted ? 'checked' : ''}></td><td>${task.title}</td><td>${task.responsible}</td><td>${formatDate(task.dueDate)}</td><td class="priority-cell"><span class="${priorityClass}">${task.priority}</span></td><td>${task.status}</td><td><button class="delete-btn" data-task-id="${task.id}"><span class="material-icons-outlined">delete_outline</span></button></td>`;
        taskTableBody.appendChild(row);
    });
}

function renderCounters() {
    const counts = tasks.reduce((acc, task) => {
        acc[task.status] = (acc[task.status] || 0) + 1;
        return acc;
    }, { 'Pendente': 0, 'Em Andamento': 0, 'Concluída': 0 });
    taskCountersContainer.innerHTML = `<span class="counter pending">Pendente: ${counts['Pendente']}</span><span class="counter in-progress">Em Andamento: ${counts['Em Andamento']}</span><span class="counter completed">Concluída: ${counts['Concluída']}</span>`;
}

function updateSortIcons() {
    document.querySelectorAll('.task-table th.sortable').forEach(th => {
        th.classList.remove('sorted');
        th.querySelector('.sort-arrow').textContent = '↕️';
    });
    const activeTh = document.querySelector(`.task-table th[data-sort="${sortState.key}"]`);
    if (activeTh) {
        activeTh.classList.add('sorted');
        activeTh.querySelector('.sort-arrow').textContent = sortState.order === 'asc' ? '🔼' : '🔽';
    }
}

function updateTasksChart() {
    if (typeof Chart === 'undefined') {
        console.error('Chart.js não foi carregado.');
        return;
    }
    const statusCounts = tasks.reduce((acc, task) => {
        acc[task.status] = (acc[task.status] || 0) + 1;
        return acc;
    }, {});
    const labels = Object.keys(statusCounts);
    const data = Object.values(statusCounts);
    const backgroundColors = labels.map(label => {
        if (label === 'Pendente') return '#FFC107';
        if (label === 'Em Andamento') return '#17A2B8';
        if (label === 'Concluída') return '#28A745';
        return '#6C757D';
    });
    const ctx = document.getElementById('tasksChart')?.getContext('2d');
    if (!ctx) return;
    if (tasksChart) {
        tasksChart.data.labels = labels;
        tasksChart.data.datasets[0].data = data;
        tasksChart.data.datasets[0].backgroundColor = backgroundColors;
        tasksChart.update();
    } else {
        tasksChart = new Chart(ctx, {
            type: 'pie',
            data: {
                labels: labels,
                datasets: [{ data: data, backgroundColor: backgroundColors, borderColor: '#fff', borderWidth: 1 }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: { legend: { position: 'top' } }
            }
        });
    }
}

// Lógica do Histórico
function renderHistory() {
    historyListContainer.innerHTML = '';
    if (deletedTasks.length === 0) {
        historyListContainer.innerHTML = '<p style="text-align:center; color: #6c757d;">O histórico está vazio.</p>';
        return;
    }
    deletedTasks.forEach(task => {
        const item = document.createElement('div');
        item.className = 'history-item';
        item.innerHTML = `<div class="history-item-info"><p class="task-title">${task.title}</p><p class="deleted-date">Excluída em: ${formatDate(task.deletedAt)}</p></div><div class="history-item-buttons"><button class="history-btn-action restore" data-task-id="${task.id}"><span class="material-icons-outlined">restore_from_trash</span> Restaurar</button><button class="history-btn-action delete-perm" data-task-id="${task.id}"><span class="material-icons-outlined">delete_forever</span> Excluir</button></div>`;
        historyListContainer.appendChild(item);
    });
}

// Manipuladores de Eventos
function setupEventListeners() {
    taskSearchInput.addEventListener('keyup', (e) => { filters.search = e.target.value.toLowerCase(); updateDisplay(); });
    statusFilter.addEventListener('change', (e) => { filters.status = e.target.value; updateDisplay(); });
    priorityFilter.addEventListener('change', (e) => { filters.priority = e.target.value; updateDisplay(); });
    document.querySelectorAll('.task-table th.sortable').forEach(th => {
        th.addEventListener('click', () => {
            const key = th.dataset.sort;
            if (sortState.key === key) { sortState.order = sortState.order === 'asc' ? 'desc' : 'asc'; } else { sortState.key = key; sortState.order = 'asc'; }
            updateDisplay();
        });
    });
    taskTableBody.addEventListener('click', (event) => {
        if (event.target.classList.contains('task-checkbox')) handleCompleteTask(event);
        if (event.target.closest('.delete-btn')) handleSoftDelete(event);
    });
    addTaskBtn.addEventListener('click', () => addTaskModal.style.display = 'flex');
    closeModalButton.addEventListener('click', () => addTaskModal.style.display = 'none');
    historyBtn.addEventListener('click', () => { renderHistory(); historyModal.style.display = 'flex'; });
    closeHistoryModalButton.addEventListener('click', () => historyModal.style.display = 'none');
    window.addEventListener('click', (e) => {
        if (e.target === addTaskModal) addTaskModal.style.display = 'none';
        if (e.target === historyModal) historyModal.style.display = 'none';
    });
    addTaskForm.addEventListener('submit', handleAddTask);
    clearHistoryBtn.addEventListener('click', handleClearHistory);
    historyListContainer.addEventListener('click', (event) => {
        const button = event.target.closest('.history-btn-action');
        if (!button) return;
        const taskId = parseInt(button.dataset.taskId);
        if (button.classList.contains('restore')) handleRestoreTask(taskId);
        if (button.classList.contains('delete-perm')) handlePermanentDelete(taskId);
    });
    window.addEventListener('beforeunload', saveState);
}

function handleCompleteTask(event) {
    const checkbox = event.target;
    const taskId = parseInt(checkbox.dataset.taskId);
    const task = tasks.find(t => t.id === taskId);
    if (task) {
        task.isCompleted = checkbox.checked;
        task.status = task.isCompleted ? 'Concluída' : 'Pendente';
        const row = checkbox.closest('tr');
        if (task.isCompleted) {
            row.classList.add('task-completed-animation');
            setTimeout(() => { row.classList.remove('task-completed-animation'); updateDisplay(); }, 500);
        } else { updateDisplay(); }
    }
}

function handleSoftDelete(event) {
    const button = event.target.closest('.delete-btn');
    const taskId = parseInt(button.dataset.taskId);
    const taskIndex = tasks.findIndex(task => task.id === taskId);
    if (taskIndex > -1) {
        const [taskToMove] = tasks.splice(taskIndex, 1);
        taskToMove.deletedAt = new Date().toISOString().split('T')[0];
        deletedTasks.push(taskToMove);
        updateDisplay();
    }
}

function handleAddTask(event) {
    event.preventDefault();
    const newTask = { id: Date.now(), title: document.getElementById('taskTitle').value, responsible: document.getElementById('taskResponsible').value, dueDate: document.getElementById('taskDueDate').value, priority: document.getElementById('taskPriority').value, isCompleted: false, status: 'Pendente' };
    tasks.push(newTask);
    updateDisplay();
    addTaskForm.reset();
    addTaskModal.style.display = 'none';
}

function handleRestoreTask(taskId) {
    const taskIndex = deletedTasks.findIndex(task => task.id === taskId);
    if (taskIndex > -1) {
        const [taskToRestore] = deletedTasks.splice(taskIndex, 1);
        delete taskToRestore.deletedAt;
        tasks.push(taskToRestore);
        updateDisplay();
        renderHistory();
    }
}

function handlePermanentDelete(taskId) {
    if (confirm('Esta ação não pode ser desfeita. Deseja excluir permanentemente?')) {
        deletedTasks = deletedTasks.filter(task => task.id !== taskId);
        renderHistory();
    }
}

function handleClearHistory() {
    if (deletedTasks.length > 0 && confirm('Tem certeza que deseja limpar todo o histórico?')) {
        deletedTasks = [];
        renderHistory();
    }
}

// Funções Utilitárias
function formatDate(dateString) {
    if (!dateString) return '';
    const date = new Date(dateString);
    const day = String(date.getUTCDate()).padStart(2, '0');
    const month = String(date.getUTCMonth() + 1).padStart(2, '0');
    const year = date.getUTCFullYear();
    return `${day}/${month}/${year}`;
}