document.addEventListener('DOMContentLoaded', () => {

    // --- SELEÇÃO DE ELEMENTOS DO DOM ---
    const btnNovoRisco = document.getElementById('btnNovoRisco');
    const modalNovoRisco = document.getElementById('modalNovoRisco');
    const formNovoRisco = document.getElementById('formNovoRisco');
    const riskTableBody = document.getElementById('risk-table-body');
    const gutMatrix = document.querySelector('.gut-matrix');
    const btnVerHistorico = document.getElementById('btnVerHistorico');
    const modalConfirmarExclusao = document.getElementById('modalConfirmarExclusao');
    const modalHistorico = document.getElementById('modalHistorico');
    const btnConfirmarExclusao = document.getElementById('btnConfirmarExclusao');
    const btnCancelarExclusao = document.getElementById('btnCancelarExclusao');
    const historyTableBody = document.getElementById('history-table-body');
    const filterCategoria = document.getElementById('filter-categoria');
    const filterNivel = document.getElementById('filter-nivel');
    const filterResponsavel = document.getElementById('filter-responsavel');
    const gutGravidade = document.getElementById('gutGravidade');
    const gutUrgencia = document.getElementById('gutUrgencia');
    const gutTendencia = document.getElementById('gutTendencia');
    const gravidadeValue = document.getElementById('gravidadeValue');
    const urgenciaValue = document.getElementById('urgenciaValue');
    const tendenciaValue = document.getElementById('tendenciaValue');
    const gutScoreEl = document.getElementById('gutScore');
    const gutClassificationEl = document.getElementById('gutClassification');

    let riscoParaExcluirId = null;
    let chart;

    // --- DADOS INICIAIS E LOCALSTORAGE ---
    let riscos = JSON.parse(localStorage.getItem('riscos')) || [
        { id: 1, nome: 'Falha de conformidade', categoria: 'Legal', probabilidade: 'Alta', impacto: 'Alto', status: 'Em andamento', responsavel: 'Laura', prazo: '2024-05-10', g: 5, u: 4, t: 5 },
        { id: 2, nome: 'Instabilidade do mercado', categoria: 'Estratégico', probabilidade: 'Média', impacto: 'Média', status: 'Pendente', responsavel: 'Carlos', prazo: '2024-04-23', g: 4, u: 3, t: 4 },
        { id: 3, nome: 'Atrasos no projeto', categoria: 'Operacional', probabilidade: 'Baixa', impacto: 'Alto', status: 'Concluído', responsavel: 'Fernanda', prazo: '2024-04-09', g: 3, u: 5, t: 2 },
        { id: 4, nome: 'Segurança de dados', categoria: 'TI', probabilidade: 'Média', impacto: 'Médio', status: 'Em andamento', responsavel: 'Rafael', prazo: '2024-05-31', g: 5, u: 5, t: 3 }
    ];
    let riscosArquivados = JSON.parse(localStorage.getItem('riscosArquivados')) || [];

    // --- FUNÇÕES DO MODAL ---
    const openModal = (modalElement) => modalElement.style.display = 'flex';
    const closeModal = (modalElement) => modalElement.style.display = 'none';

    // --- FUNÇÕES DE LÓGICA E CÁLCULO ---
    const getRiskLevel = (score) => {
        if (score >= 100) return 'Crítico';
        if (score >= 60) return 'Alto';
        if (score >= 20) return 'Médio';
        return 'Baixo';
    };

    const calcularGUT = () => {
        const g = parseInt(gutGravidade.value, 10);
        const u = parseInt(gutUrgencia.value, 10);
        const t = parseInt(gutTendencia.value, 10);
        gravidadeValue.textContent = g;
        urgenciaValue.textContent = u;
        tendenciaValue.textContent = t;
        const score = g * u * t;
        gutScoreEl.textContent = score;
        const classification = getRiskLevel(score);
        gutClassificationEl.textContent = classification;
        gutClassificationEl.className = `tag legend-item ${classification.toLowerCase()}`;
    };

    // --- FUNÇÕES DE RENDERIZAÇÃO ---
    const renderTable = () => {
        riskTableBody.innerHTML = '';
        const dataToRender = riscos;
        if (dataToRender.length === 0) {
            riskTableBody.innerHTML = `<tr><td colspan="10" style="text-align:center;">Nenhum risco ativo no momento.</td></tr>`;
            return;
        }
        dataToRender.forEach(risco => {
            const score = risco.g * risco.u * risco.t;
            const nivel = getRiskLevel(score);
            const row = document.createElement('tr');
            row.dataset.categoria = risco.categoria;
            row.dataset.nivel = nivel;
            row.dataset.responsavel = risco.responsavel;
            row.innerHTML = `
                <td>${risco.nome}</td>
                <td>${risco.categoria}</td>
                <td><span class="tag prob-${risco.probabilidade.toLowerCase()}">${risco.probabilidade}</span></td>
                <td><span class="tag impacto-${risco.impacto.toLowerCase()}">${risco.impacto}</span></td>
                <td><span class="legend-item ${nivel.toLowerCase()}">${nivel}</span></td>
                <td><span class="tag status-${risco.status.replace(' ', '').toLowerCase()}">${risco.status}</span></td>
                <td>${risco.responsavel}</td>
                <td>${new Date(risco.prazo + 'T00:00:00').toLocaleDateString('pt-BR')}</td>
                <td>${score}</td>
                <td>
                    <button class="action-button btn-excluir" data-id="${risco.id}" title="Excluir Risco">
                        <span class="material-icons-outlined">delete_outline</span>
                    </button>
                </td>
            `;
            riskTableBody.appendChild(row);
        });
    };
    
    const renderHistoryTable = () => {
        historyTableBody.innerHTML = '';
        if (riscosArquivados.length === 0) {
            historyTableBody.innerHTML = `<tr><td colspan="5" style="text-align:center;">O histórico está vazio.</td></tr>`;
            return;
        }
        riscosArquivados.forEach(risco => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${risco.nome}</td>
                <td>${risco.categoria}</td>
                <td>${risco.responsavel}</td>
                <td>${new Date(risco.arquivadoEm).toLocaleDateString('pt-BR')}</td>
                <td>
                    <button class="action-button btn-restaurar" data-id="${risco.id}" title="Restaurar Risco">
                        <span class="material-icons-outlined">history</span>
                    </button>
                </td>
            `;
            historyTableBody.appendChild(row);
        });
    };

    const populateFilters = () => {
        const categorias = [...new Set(riscos.map(r => r.categoria))];
        const niveis = [...new Set(riscos.map(r => getRiskLevel(r.g * r.u * r.t)))];
        const responsaveis = [...new Set(riscos.map(r => r.responsavel))];
        [filterCategoria, filterNivel, filterResponsavel].forEach(filter => {
            const firstOption = filter.firstElementChild.outerHTML;
            filter.innerHTML = firstOption;
        });
        categorias.forEach(c => filterCategoria.innerHTML += `<option value="${c}">${c}</option>`);
        niveis.forEach(n => filterNivel.innerHTML += `<option value="${n}">${n}</option>`);
        responsaveis.forEach(resp => filterResponsavel.innerHTML += `<option value="${resp}">${resp}</option>`);
    };

    const renderGutMatrix = () => {
        gutMatrix.innerHTML = '';
        for (let i = 0; i < 25; i++) {
            gutMatrix.innerHTML += `<div class="gut-cell" id="gut-cell-${i}"></div>`;
        }
        riscos.forEach(risco => {
            const gIndex = risco.g - 1;
            const uIndex = risco.u - 1;
            const cellIndex = gIndex * 5 + uIndex;
            const cell = document.getElementById(`gut-cell-${cellIndex}`);
            if (cell) {
                const dot = document.createElement('div');
                dot.className = 'gut-risk-dot';
                const score = risco.g * risco.u * risco.t;
                dot.style.backgroundColor = { 'Baixo': '#4CAF50', 'Médio': '#FFC107', 'Alto': '#F44336', 'Crítico': '#9C27B0' }[getRiskLevel(score)];
                dot.title = `${risco.nome} (GUT: ${score})`;
                cell.appendChild(dot);
            }
        });
    };

const renderChart = () => {
        const ctx = document.getElementById('risksChart').getContext('2d');
        const categorias = [...new Set(riscos.map(r => r.categoria))];
        const data = categorias.map(cat => riscos.filter(r => r.categoria === cat).length);
        if (chart) { chart.destroy(); }
        chart = new Chart(ctx, {
            type: 'bar',
            data: {
                labels: categorias,
                datasets: [{
                    label: 'Nº de Riscos',
                    data: data,
                    backgroundColor: ['rgba(255, 99, 132, 0.5)', 'rgba(54, 162, 235, 0.5)', 'rgba(255, 206, 86, 0.5)', 'rgba(75, 192, 192, 0.5)', 'rgba(153, 102, 255, 0.5)'],
                    borderColor: ['rgba(255, 99, 132, 1)', 'rgba(54, 162, 235, 1)', 'rgba(255, 206, 86, 1)', 'rgba(75, 192, 192, 1)', 'rgba(153, 102, 255, 1)'],
                    borderWidth: 1
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                scales: {
                    y: {
                        beginAtZero: true,
                        ticks: {
                            stepSize: 1
                        }
                    }
                },
                plugins: {
                    legend: {
                        display: false
                    }
                },
                // ADIÇÃO PARA CORRIGIR O ESPAÇAMENTO
                layout: {
                    padding: {
                        bottom: 20
                    }
                }
            }
        });
    };
    
    // --- LÓGICA DE AÇÕES E FILTROS ---
    const applyFilters = () => {
        const categoria = filterCategoria.value;
        const nivel = filterNivel.value;
        const responsavel = filterResponsavel.value;
        document.querySelectorAll('#risk-table-body tr').forEach(row => {
            const matchesCategoria = categoria === 'todos' || row.dataset.categoria === categoria;
            const matchesNivel = nivel === 'todos' || row.dataset.nivel === nivel;
            const matchesResponsavel = responsavel === 'todos' || row.dataset.responsavel === responsavel;
            row.style.display = (matchesCategoria && matchesNivel && matchesResponsavel) ? '' : 'none';
        });
    };

    const arquivarRisco = (id) => {
        const index = riscos.findIndex(r => r.id === id);
        if (index > -1) {
            const [riscoArquivado] = riscos.splice(index, 1);
            riscoArquivado.arquivadoEm = new Date().toISOString();
            riscosArquivados.push(riscoArquivado);
            updateLocalStorage();
            renderAll();
        }
    };

    const restaurarRisco = (id) => {
        const index = riscosArquivados.findIndex(r => r.id === id);
        if (index > -1) {
            const [riscoRestaurado] = riscosArquivados.splice(index, 1);
            delete riscoRestaurado.arquivadoEm;
            riscos.push(riscoRestaurado);
            updateLocalStorage();
            renderAll();
            renderHistoryTable();
        }
    };

    const updateLocalStorage = () => {
        localStorage.setItem('riscos', JSON.stringify(riscos));
        localStorage.setItem('riscosArquivados', JSON.stringify(riscosArquivados));
    };

    // --- EVENT LISTENERS ---
    btnNovoRisco.addEventListener('click', () => openModal(modalNovoRisco));
    btnVerHistorico.addEventListener('click', () => {
        renderHistoryTable();
        openModal(modalHistorico);
    });

    document.querySelectorAll('.modal').forEach(modalEl => {
        const closeBtn = modalEl.querySelector('.close-button');
        if (closeBtn) {
            closeBtn.addEventListener('click', () => closeModal(modalEl));
        }
        modalEl.addEventListener('click', (event) => {
            if (event.target === modalEl) closeModal(modalEl);
        });
    });

    [gutGravidade, gutUrgencia, gutTendencia].forEach(input => input.addEventListener('input', calcularGUT));

    formNovoRisco.addEventListener('submit', (event) => {
        event.preventDefault();
        const novoRisco = {
            id: Date.now(),
            nome: document.getElementById('riscoNome').value,
            categoria: document.getElementById('riscoCategoria').value,
            probabilidade: document.getElementById('riscoProbabilidade').value,
            impacto: document.getElementById('riscoImpacto').value,
            status: document.getElementById('riscoStatus').value,
            responsavel: document.getElementById('riscoResponsavel').value,
            prazo: document.getElementById('riscoPrazo').value,
            g: parseInt(gutGravidade.value, 10),
            u: parseInt(gutUrgencia.value, 10),
            t: parseInt(gutTendencia.value, 10)
        };
        riscos.push(novoRisco);
        updateLocalStorage();
        renderAll();
        formNovoRisco.reset();
        calcularGUT();
        closeModal(modalNovoRisco);
    });

    riskTableBody.addEventListener('click', (event) => {
        const deleteButton = event.target.closest('.btn-excluir');
        if (deleteButton) {
            riscoParaExcluirId = parseInt(deleteButton.dataset.id, 10);
            openModal(modalConfirmarExclusao);
        }
    });

    btnCancelarExclusao.addEventListener('click', () => closeModal(modalConfirmarExclusao));
    btnConfirmarExclusao.addEventListener('click', () => {
        if (riscoParaExcluirId) {
            arquivarRisco(riscoParaExcluirId);
            riscoParaExcluirId = null;
        }
        closeModal(modalConfirmarExclusao);
    });

    historyTableBody.addEventListener('click', (event) => {
        const restoreButton = event.target.closest('.btn-restaurar');
        if (restoreButton) {
            restaurarRisco(parseInt(restoreButton.dataset.id, 10));
        }
    });

    [filterCategoria, filterNivel, filterResponsavel].forEach(filter => filter.addEventListener('change', applyFilters));
    
    // --- INICIALIZAÇÃO ---
    const renderAll = () => {
        renderTable();
        populateFilters();
        renderGutMatrix();
        renderChart();
        applyFilters();
    };
    
    renderAll();
});