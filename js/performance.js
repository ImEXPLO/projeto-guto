document.addEventListener('DOMContentLoaded', () => {

    // --- SELEÇÃO DE ELEMENTOS DO DOM ---
    const kpiMetasEl = document.getElementById('kpi-metas');
    const kpiProjetosEl = document.getElementById('kpi-projetos');
    const kpiTarefasEl = document.getElementById('kpi-tarefas');
    const kpiEficienciaEl = document.getElementById('kpi-eficiencia');

    const periodFilter = document.getElementById('period-filter');
    const goalsTableBody = document.getElementById('goals-table-body');
    
    const btnNovaMeta = document.getElementById('btnNovaMeta');
    const modalNovaMeta = document.getElementById('modalNovaMeta');
    const formNovaMeta = document.getElementById('formNovaMeta');

    const btnVerHistorico = document.getElementById('btnVerHistorico');
    const modalConfirmarExclusao = document.getElementById('modalConfirmarExclusao');
    const modalHistorico = document.getElementById('modalHistorico');
    const btnConfirmarExclusao = document.getElementById('btnConfirmarExclusao');
    const btnCancelarExclusao = document.getElementById('btnCancelarExclusao');
    const historyTableBody = document.getElementById('history-table-body');
    
    let lineChart, pieChart, barChart, gaugeChart;
    let metaParaExcluirId = null;

    // --- DADOS E LOCALSTORAGE ---
    let metas = JSON.parse(localStorage.getItem('metasAtivas')) || [
        { id: 1, nome: 'Reduzir custos operacionais', area: 'Financeiro', progresso: 75, status: 'Em andamento', responsavel: 'Ana' },
        { id: 2, nome: 'Digitalizar 100% dos processos', area: 'TI', progresso: 100, status: 'Concluído', responsavel: 'Marcos' },
        { id: 3, nome: 'Aumentar satisfação do cidadão', area: 'Operacional', progresso: 40, status: 'Atrasado', responsavel: 'Julia' }
    ];
    let metasArquivadas = JSON.parse(localStorage.getItem('metasArquivadas')) || [];

    // --- FUNÇÕES DO MODAL ---
    const openModal = (modalElement) => modalElement.style.display = 'flex';
    const closeModal = (modalElement) => modalElement.style.display = 'none';

    // --- FUNÇÕES DE GRÁFICOS E DADOS (RESTAURADAS) ---
    const generateFakeData = (period) => {
        const randomFactor = Math.random() + 0.5;
        switch (period) {
            case 'trimestre': return { kpis: { metas: '45/60', projetos: '88%', tarefas: 450, eficiencia: '91%' }, lineData: [15, 18, 22], pieData: [45, 25, 30], barData: [120, 90, 150, 90], gaugeData: [91, 9] };
            case 'semestre': return { kpis: { metas: '90/110', projetos: '90%', tarefas: 980, eficiencia: '88%' }, lineData: [40, 45, 55, 60, 70, 85], pieData: [150, 110, 130], barData: [250, 180, 310, 240], gaugeData: [88, 12] };
            case 'ano': return { kpis: { metas: '180/200', projetos: '94%', tarefas: 2100, eficiencia: '93%' }, lineData: [10, 15, 20, 25, 35, 45, 55, 65, 75, 85, 95, 110], pieData: [300, 250, 280], barData: [500, 400, 600, 450], gaugeData: [93, 7] };
            default: return { kpis: { metas: '18/25', projetos: '92%', tarefas: 180, eficiencia: '85%' }, lineData: [4, 7, 5, 9, 6], pieData: [12, 19, 9], barData: [40, 25, 60, 32], gaugeData: [85, 15] };
        }
    };

    const initCharts = () => {
        // Gráfico de Linha
        lineChart = new Chart(document.getElementById("lineChart"), { type: 'line', data: { labels: ['Sem 1', 'Sem 2', 'Sem 3', 'Sem 4', 'Sem 5'], datasets: [{ label: 'Projetos Finalizados', data: [], borderColor: '#007bff', tension: 0.3, fill: false }] }, options: { responsive: true, interaction: { mode: 'index', intersect: false }, plugins: { legend: { display: false } } } });
        // Gráfico de Pizza
        pieChart = new Chart(document.getElementById("pieChart"), { type: 'pie', data: { labels: ['Equipe A', 'Equipe B', 'Equipe C'], datasets: [{ data: [], backgroundColor: ['#28a745', '#fd7e14', '#6f42c1'] }] }, options: { responsive: true, plugins: { legend: { position: 'top' } } } });
        // Gráfico de Barras
        barChart = new Chart(document.getElementById("barChart"), { type: 'bar', data: { labels: ['Financeiro', 'RH', 'TI', 'Operacional'], datasets: [{ label: 'Tarefas Concluídas', data: [], backgroundColor: '#17a2b8' }] }, options: { responsive: true, plugins: { legend: { display: false } }, scales: { y: { beginAtZero: true } } } });
        // Gráfico de "Velocímetro"
        gaugeChart = new Chart(document.getElementById("gaugeChart"), { type: 'doughnut', data: { labels: ['Atingido', 'Restante'], datasets: [{ data: [], backgroundColor: ['#ffc107', '#e9ecef'], borderWidth: 0 }] }, options: { responsive: true, circumference: 180, rotation: -90, cutout: '70%', plugins: { tooltip: { enabled: false } } } });
    };

    const updateDashboard = (period) => {
        const data = generateFakeData(period);
        kpiMetasEl.textContent = data.kpis.metas;
        kpiProjetosEl.textContent = data.kpis.projetos;
        kpiTarefasEl.textContent = data.kpis.tarefas;
        kpiEficienciaEl.textContent = data.kpis.eficiencia;
        kpiEficienciaEl.style.color = parseInt(data.kpis.eficiencia) > 90 ? 'var(--cor-verde-receita)' : '#ffc107';
        lineChart.data.datasets[0].data = data.lineData;
        lineChart.update();
        pieChart.data.datasets[0].data = data.pieData;
        pieChart.update();
        barChart.data.datasets[0].data = data.barData;
        barChart.update();
        gaugeChart.data.datasets[0].data = data.gaugeData;
        gaugeChart.update();
    };

    // --- FUNÇÕES DA TABELA E HISTÓRICO ---
    const renderGoalsTable = () => {
        goalsTableBody.innerHTML = '';
        if (metas.length === 0) {
            goalsTableBody.innerHTML = `<tr><td colspan="6" style="text-align:center;">Nenhuma meta ativa cadastrada.</td></tr>`;
            return;
        }
        metas.forEach(meta => {
            const statusClass = `status-${meta.status.toLowerCase().replace(' ', '-')}`;
            const row = document.createElement('tr');
            row.innerHTML = `<td>${meta.nome}</td><td>${meta.area}</td><td><span class="status-tag ${statusClass}">${meta.status}</span></td><td><div class="progress-bar-container" title="${meta.progresso}%"><div class="progress-bar" style="width: ${meta.progresso}%;"></div></div></td><td>${meta.responsavel}</td><td><button class="action-button btn-excluir" data-id="${meta.id}" title="Arquivar Meta"><span class="material-icons-outlined">delete_outline</span></button></td>`;
            goalsTableBody.appendChild(row);
        });
    };
    
    const renderHistoryTable = () => {
        historyTableBody.innerHTML = '';
        if (metasArquivadas.length === 0) {
            historyTableBody.innerHTML = `<tr><td colspan="5" style="text-align:center;">O histórico está vazio.</td></tr>`;
            return;
        }
        metasArquivadas.forEach(meta => {
            const row = document.createElement('tr');
            row.innerHTML = `<td>${meta.nome}</td><td>${meta.area}</td><td>${meta.responsavel}</td><td>${new Date(meta.arquivadoEm).toLocaleDateString('pt-BR')}</td><td><button class="action-button btn-restaurar" data-id="${meta.id}" title="Restaurar Meta"><span class="material-icons-outlined">history</span></button></td>`;
            historyTableBody.appendChild(row);
        });
    };
    
    const arquivarMeta = (id) => { const index = metas.findIndex(m => m.id === id); if (index > -1) { const [metaArquivada] = metas.splice(index, 1); metaArquivada.arquivadoEm = new Date().toISOString(); metasArquivadas.push(metaArquivada); updateLocalStorage(); renderGoalsTable(); } };
    const restaurarMeta = (id) => { const index = metasArquivadas.findIndex(m => m.id === id); if (index > -1) { const [metaRestaurada] = metasArquivadas.splice(index, 1); delete metaRestaurada.arquivadoEm; metas.push(metaRestaurada); updateLocalStorage(); renderGoalsTable(); renderHistoryTable(); } };
    
    // --- PERSISTÊNCIA ---
    const updateLocalStorage = () => { localStorage.setItem('metasAtivas', JSON.stringify(metas)); localStorage.setItem('metasArquivadas', JSON.stringify(metasArquivadas)); };
    const saveMeta = (event) => { event.preventDefault(); const progresso = document.getElementById('metaProgresso').value; const novaMeta = { id: Date.now(), nome: document.getElementById('metaNome').value, area: document.getElementById('metaArea').value, progresso: progresso, status: progresso == 100 ? 'Concluído' : 'Em andamento', responsavel: document.getElementById('metaResponsavel').value, }; metas.push(novaMeta); updateLocalStorage(); renderGoalsTable(); formNovaMeta.reset(); closeModal(modalNovaMeta); };

    // --- EVENT LISTENERS ---
    periodFilter.addEventListener('change', (e) => updateDashboard(e.target.value));
    btnNovaMeta.addEventListener('click', () => openModal(modalNovaMeta));
    btnVerHistorico.addEventListener('click', () => { renderHistoryTable(); openModal(modalHistorico); });
    document.querySelectorAll('.modal').forEach(modalEl => { const closeBtn = modalEl.querySelector('.close-button'); if (closeBtn) { closeBtn.addEventListener('click', () => closeModal(modalEl)); } modalEl.addEventListener('click', (event) => { if (event.target === modalEl) closeModal(modalEl); }); });
    formNovaMeta.addEventListener('submit', saveMeta);
    goalsTableBody.addEventListener('click', (event) => { const archiveButton = event.target.closest('.btn-excluir'); if (archiveButton) { metaParaExcluirId = parseInt(archiveButton.dataset.id, 10); openModal(modalConfirmarExclusao); } });
    btnCancelarExclusao.addEventListener('click', () => closeModal(modalConfirmarExclusao));
    btnConfirmarExclusao.addEventListener('click', () => { if (metaParaExcluirId) { arquivarMeta(metaParaExcluirId); metaParaExcluirId = null; } closeModal(modalConfirmarExclusao); });
    historyTableBody.addEventListener('click', (event) => { const restoreButton = event.target.closest('.btn-restaurar'); if (restoreButton) { restaurarMeta(parseInt(restoreButton.dataset.id, 10)); } });
    
    // --- INICIALIZAÇÃO ---
    initCharts();
    updateDashboard('30d');
    renderGoalsTable();
});