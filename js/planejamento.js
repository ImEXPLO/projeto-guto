// Dados de exemplo para simular projetos de uma prefeitura
const projetosPadrao = [
    {
        id: 'proj1',
        nome: 'Reforma da Praça Central',
        secretaria: 'obras',
        status: 'em-andamento',
        progresso: 75,
        dataInicio: '2024-03-01',
        dataFim: '2025-07-30'
    },
    {
        id: 'proj2',
        nome: 'Campanha de Vacinação COVID-19',
        secretaria: 'saude',
        status: 'concluido',
        progresso: 100,
        dataInicio: '2024-01-10',
        dataFim: '2024-05-20'
    },
    {
        id: 'proj3',
        nome: 'Implantação de Ciclovia Urbana',
        secretaria: 'obras',
        status: 'atrasado',
        progresso: 40,
        dataInicio: '2024-02-15',
        dataFim: '2024-08-30'
    },
    {
        id: 'proj4',
        nome: 'Digitalização de Processos Administrativos',
        secretaria: 'educacao',
        status: 'em-andamento',
        progresso: 60,
        dataInicio: '2024-04-01',
        dataFim: '2025-12-31'
    },
    {
        id: 'proj5',
        nome: 'Reunião do Orçamento Participativo',
        secretaria: 'saude',
        status: 'pendente',
        progresso: 0,
        dataInicio: '2025-06-10',
        dataFim: '2025-06-10'
    },
    {
        id: 'proj6',
        nome: 'Recapeamento Asfáltico - Bairro X',
        secretaria: 'obras',
        status: 'em-andamento',
        progresso: 90,
        dataInicio: '2024-11-01',
        dataFim: '2025-01-31'
    },
    {
        id: 'proj7',
        nome: 'Construção de Creche Municipal',
        secretaria: 'educacao',
        status: 'em-andamento',
        progresso: 20,
        dataInicio: '2025-02-01',
        dataFim: '2026-06-30'
    },
    {
        id: 'proj8',
        nome: 'Fiscalização de Posturas Urbanas',
        secretaria: 'obras',
        status: 'concluido',
        progresso: 100,
        dataInicio: '2024-09-01',
        dataFim: '2024-12-15'
    }
];

// Função para carregar projetos do localStorage ou usar dados padrão
function carregarProjetos() {
    const projetosSalvos = localStorage.getItem('projetosPrefeitura'); // Busca no localStorage
    return projetosSalvos ? JSON.parse(projetosSalvos) : projetosPadrao; // Se existir, parseia e retorna; senão, usa os dados padrão
}

// Função para salvar projetos no localStorage
function salvarProjetos() {
    localStorage.setItem('projetosPrefeitura', JSON.stringify(projetos)); // Converte para string JSON e salva
}

// Inicializa a variável projetos com dados carregados ou padrão
let projetos = carregarProjetos();

// Mapeamento de status para texto amigável
const statusMap = {
    'em-andamento': 'Em Andamento',
    'concluido': 'Concluído',
    'atrasado': 'Atrasado',
    'pendente': 'Pendente'
};

// Mapeamento de secretaria para texto amigável
const secretariaMap = {
    'obras': 'Obras e Urbanismo',
    'saude': 'Saúde',
    'educacao': 'Educação'
};

// Elementos do DOM
const listaProjetosDiv = document.getElementById('listaProjetos');
const buscaProjetosInput = document.getElementById('buscaProjetos');
const filtroStatusSelect = document.getElementById('filtroStatus');
const filtroSecretariaSelect = document.getElementById('filtroSecretaria');
const totalProjetosAtivosSpan = document.getElementById('totalProjetosAtivos');
const totalProjetosAtrasadosSpan = document.getElementById('totalProjetosAtrasados');
const totalProjetosConcluidosMesSpan = document.getElementById('totalProjetosConcluidosMes');
const btnNovoProjeto = document.getElementById('btnNovoProjeto');

// Novos elementos do DOM para o modal de projeto
const modalProjetoOverlay = document.getElementById('modalProjetoOverlay');
const modalProjetoTitle = document.getElementById('modalProjetoTitle');
const formProjeto = document.getElementById('formProjeto');
const projectIdInput = document.getElementById('projectId');
const projectNameInput = document.getElementById('projectName');
const projectSecretariaInput = document.getElementById('projectSecretaria');
const projectStatusInput = document.getElementById('projectStatus');
const projectProgressoInput = document.getElementById('projectProgresso');
const projectDataInicioInput = document.getElementById('projectDataInicio');
const projectDataFimInput = document.getElementById('projectDataFim');
const btnCancelarProjeto = document.getElementById('btnCancelarProjeto');

// Variáveis para os gráficos Chart.js
let statusProjetosChart;
let cronogramaProjetosChart;

/**
 * Função para renderizar os cards de projetos.
 * @param {Array} projetosToRender - Array de projetos a serem exibidos.
 */
function renderizarProjetos(projetosToRender) {
    listaProjetosDiv.innerHTML = ''; // Limpa a lista existente

    if (projetosToRender.length === 0) {
        listaProjetosDiv.innerHTML = '<p>Nenhum projeto encontrado com os filtros aplicados.</p>';
        return;
    }

    projetosToRender.forEach(projeto => {
        const card = document.createElement('div');
        card.classList.add('card-projeto', `status-${projeto.status}`);

        const dataInicio = new Date(projeto.dataInicio);
        const dataFim = new Date(projeto.dataFim);

        // Formata as datas para exibição
        const dataInicioFormatada = dataInicio.toLocaleDateString('pt-BR');
        const dataFimFormatada = dataFim.toLocaleDateString('pt-BR');

        card.innerHTML = `
            <h3>${projeto.nome}</h3>
            <p>${secretariaMap[projeto.secretaria] || projeto.secretaria}</p>
            <div class="progresso">
                <div class="barra-progresso" style="width: ${projeto.progresso}%;"></div>
                <span>${projeto.progresso}% Concluído</span>
            </div>
            <p class="datas">Início: ${dataInicioFormatada} - Fim: ${dataFimFormatada}</p>
            <p class="status-texto">Status: ${statusMap[projeto.status] || projeto.status}</p>
            <div class="acoes-projeto">
                <button class="btn-detalhes" data-id="${projeto.id}">Detalhes</button>
                <button class="btn-editar" data-id="${projeto.id}">Editar</button>
                <button class="btn-excluir" data-id="${projeto.id}"><span class="material-icons-outlined">delete</span></button>
            </div>
        `;
        listaProjetosDiv.appendChild(card);
    });

    // Adiciona event listeners para os botões Detalhes e Editar
    listaProjetosDiv.querySelectorAll('.btn-detalhes').forEach(button => {
        button.addEventListener('click', (event) => {
            const projectId = event.target.dataset.id;
            const projeto = projetos.find(p => p.id === projectId);
            if (projeto) {
                abrirModalProjeto('Detalhes do Projeto', projeto, true); // True para modo de visualização
            }
        });
    });

    listaProjetosDiv.querySelectorAll('.btn-editar').forEach(button => {
        button.addEventListener('click', (event) => {
            const projectId = event.target.dataset.id;
            const projeto = projetos.find(p => p.id === projectId);
            if (projeto) {
                abrirModalProjeto('Editar Projeto', projeto);
            }
        });
    });

    // Adiciona event listener para os botões de Excluir
    listaProjetosDiv.querySelectorAll('.btn-excluir').forEach(button => {
        button.addEventListener('click', (event) => {
            const projectId = event.target.dataset.id;
            excluirProjeto(projectId);
        });
    });
}

/**
 * Função para atualizar os cards de estatísticas rápidas.
 */
function atualizarEstatisticas() {
    const ativos = projetos.filter(p => p.status === 'em-andamento' || p.status === 'pendente').length;
    const atrasados = projetos.filter(p => p.status === 'atrasado').length;
    
    // Contar projetos concluídos no mês atual
    const hoje = new Date();
    const mesAtual = hoje.getMonth();
    const anoAtual = hoje.getFullYear();

    const concluidosMes = projetos.filter(p => {
        if (p.status === 'concluido' && p.dataFim) {
            const dataFim = new Date(p.dataFim);
            return dataFim.getMonth() === mesAtual && dataFim.getFullYear() === anoAtual;
        }
        return false;
    }).length;

    totalProjetosAtivosSpan.textContent = ativos;
    totalProjetosAtrasadosSpan.textContent = atrasados;
    totalProjetosConcluidosMesSpan.textContent = concluidosMes;
}

/**
 * Função para renderizar o gráfico de status de projetos (Pizza).
 */
function renderizarStatusProjetosChart() {
    const ctx = document.getElementById('statusProjetosChart').getContext('2d');

    // Contar projetos por status
    const statusCounts = projetos.reduce((acc, projeto) => {
        acc[projeto.status] = (acc[projeto.status] || 0) + 1;
        return acc;
    }, {});

    const labels = Object.keys(statusCounts).map(status => statusMap[status] || status);
    const data = Object.values(statusCounts);
    // Cores mais vibrantes ou ajustadas para os status
    const backgroundColors = [
        '#4CAF50', // Em Andamento (Verde vibrante)
        '#2196F3', // Concluído (Azul)
        '#FF5252', // Atrasado (Vermelho vibrante)
        '#FFC107'  // Pendente (Amarelo)
    ];

    if (statusProjetosChart) {
        statusProjetosChart.destroy(); // Destrói o gráfico anterior se existir
    }

    statusProjetosChart = new Chart(ctx, {
        type: 'pie',
        data: {
            labels: labels,
            datasets: [{
                data: data,
                backgroundColor: backgroundColors,
                borderColor: 'var(--cor-card-fundo)',
                borderWidth: 2
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    position: 'top',
                    labels: {
                        color: 'var(--cor-card-texto)' // Cor do texto da legenda
                    }
                },
                title: {
                    display: false, // O título já está no H4
                }
            }
        }
    });
}

/**
 * Função para renderizar o gráfico de cronograma (Barras empilhadas para simular Gantt).
 */
function renderizarCronogramaProjetosChart() {
    const ctx = document.getElementById('cronogramaProjetosChart').getContext('2d');

    const projetosOrdenados = [...projetos].sort((a, b) => new Date(a.dataInicio) - new Date(b.dataInicio));

    const labels = projetosOrdenados.map(p => p.nome);
    const datasets = [];

    // Dataset para o "offset" (tempo antes do início do projeto)
    const offsets = projetosOrdenados.map(p => {
        const startDate = new Date(p.dataInicio);
        const firstDate = new Date(Math.min(...projetosOrdenados.map(p => new Date(p.dataInicio)))); // Pega a menor data de início
        const diffTime = Math.abs(startDate - firstDate);
        return diffTime / (1000 * 60 * 60 * 24); // Diferença em dias
    });

    datasets.push({
        label: 'Offset',
        data: offsets,
        backgroundColor: 'rgba(0, 0, 0, 0)', // Transparente para não aparecer
        borderColor: 'rgba(0, 0, 0, 0)',
        borderWidth: 0,
        stack: 'stack0' // Usado para empilhar
    });

    // Dataset para a duração do projeto
    const durations = projetosOrdenados.map(p => {
        const startDate = new Date(p.dataInicio);
        const endDate = new Date(p.dataFim);
        const diffTime = Math.abs(endDate - startDate);
        return diffTime / (1000 * 60 * 60 * 24); // Duração em dias
    });

    // Cores ajustadas para o cronograma
    const durationColors = projetosOrdenados.map(p => {
        switch (p.status) {
            case 'em-andamento': return '#4CAF50'; // Verde vibrante
            case 'concluido': return '#2196F3';    // Azul
            case 'atrasado': return '#FF5252';     // Vermelho vibrante
            case 'pendente': return '#FFC107';     // Amarelo
            default: return 'gray';
        }
    });

    datasets.push({
        label: 'Duração do Projeto',
        data: durations,
        backgroundColor: durationColors,
        borderColor: durationColors.map(c => c.replace('rgb', 'rgba').replace(')', ', 0.8)')), // Um pouco mais escuro
        borderWidth: 1,
        stack: 'stack0' // Usado para empilhar
    });

    if (cronogramaProjetosChart) {
        cronogramaProjetosChart.destroy(); // Destrói o gráfico anterior se existir
    }

    cronogramaProjetosChart = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: labels,
            datasets: datasets
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            indexAxis: 'y', // Eixo Y para os projetos (barras horizontais)
            scales: {
                x: {
                    stacked: true,
                    title: {
                        display: true,
                        text: 'Dias desde o início do primeiro projeto',
                        color: 'var(--cor-card-texto)'
                    },
                    ticks: {
                        color: 'var(--cor-card-texto)'
                    },
                    grid: {
                        color: 'var(--cor-borda-clara)'
                    }
                },
                y: {
                    stacked: true,
                    ticks: {
                        color: 'var(--cor-card-texto)'
                    },
                    grid: {
                        color: 'var(--cor-borda-clara)'
                    }
                }
            },
            plugins: {
                legend: {
                    display: false // Não exibir legendas para offset e duração
                },
                tooltip: {
                    callbacks: {
                        label: function(context) {
                            if (context.dataset.label === 'Duração do Projeto') {
                                const projetoNome = labels[context.dataIndex];
                                const projeto = projetosOrdenados.find(p => p.nome === projetoNome);
                                if (projeto) {
                                    const dataInicio = new Date(projeto.dataInicio).toLocaleDateString('pt-BR');
                                    const dataFim = new Date(projeto.dataFim).toLocaleDateString('pt-BR');
                                    return `Duração: ${context.parsed.x} dias (${dataInicio} - ${dataFim})`;
                                }
                            }
                            return null;
                        }
                    }
                },
                title: {
                    display: false
                }
            }
        }
    });
}


/**
 * Função para aplicar filtros e busca nos projetos.
 */
function aplicarFiltros() {
    const termoBusca = buscaProjetosInput.value.toLowerCase();
    const statusFiltro = filtroStatusSelect.value;
    const secretariaFiltro = filtroSecretariaSelect.value;

    const projetosFiltrados = projetos.filter(projeto => {
        const matchBusca = projeto.nome.toLowerCase().includes(termoBusca) ||
                           projeto.secretaria.toLowerCase().includes(termoBusca);
        const matchStatus = statusFiltro === '' || projeto.status === statusFiltro;
        const matchSecretaria = secretariaFiltro === '' || projeto.secretaria === secretariaFiltro;

        return matchBusca && matchStatus && matchSecretaria;
    });

    renderizarProjetos(projetosFiltrados);
}

/**
 * Abre o modal de projeto para criação, edição ou visualização de detalhes.
 * @param {string} title - Título do modal.
 * @param {object} [projetoData] - Dados do projeto para preencher o formulário (para edição/detalhes).
 * @param {boolean} [isViewMode=false] - Se true, o modal é apenas para visualização de detalhes.
 */
function abrirModalProjeto(title, projetoData = {}, isViewMode = false) {
    modalProjetoTitle.textContent = title;
    formProjeto.reset(); // Limpa o formulário

    // Preenche o formulário se houver dados de projeto
    if (projetoData.id) {
        projectIdInput.value = projetoData.id;
        projectNameInput.value = projetoData.nome;
        projectSecretariaInput.value = projetoData.secretaria;
        projectStatusInput.value = projetoData.status;
        projectProgressoInput.value = projetoData.progresso;
        projectDataInicioInput.value = projetoData.dataInicio;
        projectDataFimInput.value = projetoData.dataFim;
    } else {
        projectIdInput.value = ''; // Garante que o ID esteja vazio para novos projetos
    }

    // Define o estado dos campos com base no modo (visualização ou edição/novo)
    const inputs = formProjeto.querySelectorAll('input, select');
    inputs.forEach(input => {
        input.readOnly = isViewMode;
        input.disabled = isViewMode; // Desabilita selects também
    });

    // O botão de submit só deve ser visível se não for modo de visualização
    formProjeto.querySelector('button[type="submit"]').style.display = isViewMode ? 'none' : 'block';

    modalProjetoOverlay.style.display = 'flex'; // Mostra o modal
}

/**
 * Fecha o modal de projeto.
 */
function fecharModalProjeto() {
    modalProjetoOverlay.style.display = 'none';
}

/**
 * Exclui um projeto do array e atualiza a interface.
 * @param {string} projectId - O ID do projeto a ser excluído.
 */
function excluirProjeto(projectId) {
    const projetoIndex = projetos.findIndex(p => p.id === projectId);
    if (projetoIndex !== -1) {
        const confirmacao = confirm(`Tem certeza que deseja excluir o projeto "${projetos[projetoIndex].nome}"?`);
        if (confirmacao) {
            projetos.splice(projetoIndex, 1); // Remove o projeto do array
            salvarProjetos(); // Salva as alterações no localStorage
            aplicarFiltros(); // Re-renderiza a lista
            atualizarEstatisticas(); // Atualiza as estatísticas
            renderizarStatusProjetosChart(); // Atualiza o gráfico de status
            renderizarCronogramaProjetosChart(); // Atualiza o gráfico de cronograma
        }
    }
}


// Event Listeners
buscaProjetosInput.addEventListener('input', aplicarFiltros);
filtroStatusSelect.addEventListener('change', aplicarFiltros);
filtroSecretariaSelect.addEventListener('change', aplicarFiltros);

// Botão "Novo Projeto" - Abre o modal para adicionar um novo projeto
btnNovoProjeto.addEventListener('click', () => {
    abrirModalProjeto('Novo Projeto');
});

// Botão "Cancelar" do modal
btnCancelarProjeto.addEventListener('click', fecharModalProjeto);

// Envio do formulário do modal
formProjeto.addEventListener('submit', (event) => {
    event.preventDefault(); // Evita o recarregamento da página

    const id = projectIdInput.value;
    const nome = projectNameInput.value;
    const secretaria = projectSecretariaInput.value;
    const status = projectStatusInput.value;
    const progresso = parseInt(projectProgressoInput.value);
    const dataInicio = projectDataInicioInput.value;
    const dataFim = projectDataFimInput.value;

    if (id) {
        // Editar projeto existente
        const index = projetos.findIndex(p => p.id === id);
        if (index !== -1) {
            projetos[index] = { id, nome, secretaria, status, progresso, dataInicio, dataFim };
        }
    } else {
        // Adicionar novo projeto
        const newId = 'proj' + (projetos.length + 1); // Gera um ID simples
        projetos.push({ id: newId, nome, secretaria, status, progresso, dataInicio, dataFim });
    }

    salvarProjetos(); // Salva as alterações no localStorage
    aplicarFiltros(); // Re-renderiza a lista com o novo/atualizado projeto
    atualizarEstatisticas(); // Atualiza as estatísticas
    renderizarStatusProjetosChart(); // Atualiza o gráfico de status
    renderizarCronogramaProjetosChart(); // Atualiza o gráfico de cronograma
    fecharModalProjeto(); // Fecha o modal
});


// Inicialização da página
document.addEventListener('DOMContentLoaded', () => {
    renderizarProjetos(projetos);
    atualizarEstatisticas();
    renderizarStatusProjetosChart();
    renderizarCronogramaProjetosChart();
});

// Opcional: Atualizar gráficos e estatísticas ao redimensionar a janela
// window.addEventListener('resize', () => {
//     renderizarStatusProjetosChart();
//     renderizarCronogramaProjetosChart();
// });