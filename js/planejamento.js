// Dados de exemplo para simular projetos de uma prefeitura
const projetosPadrao = [
    { id: 'proj1', nome: 'Reforma da Praça Central', secretaria: 'obras', status: 'em-andamento', progresso: 75, dataInicio: '2024-03-01', dataFim: '2025-07-30' },
    { id: 'proj2', nome: 'Campanha de Vacinação COVID-19', secretaria: 'saude', status: 'concluido', progresso: 100, dataInicio: '2024-01-10', dataFim: '2024-05-20' },
    { id: 'proj3', nome: 'Implantação de Ciclovia Urbana', secretaria: 'obras', status: 'atrasado', progresso: 40, dataInicio: '2024-02-15', dataFim: '2024-08-30' },
    { id: 'proj4', nome: 'Digitalização de Processos Administrativos', secretaria: 'educacao', status: 'em-andamento', progresso: 60, dataInicio: '2024-04-01', dataFim: '2025-12-31' },
    { id: 'proj5', nome: 'Reunião do Orçamento Participativo', secretaria: 'saude', status: 'pendente', progresso: 0, dataInicio: '2025-06-10', dataFim: '2025-06-10' },
];

// Função para carregar projetos do localStorage ou usar dados padrão
function carregarProjetos() {
    const projetosSalvos = localStorage.getItem('projetosPrefeitura');
    return projetosSalvos ? JSON.parse(projetosSalvos) : projetosPadrao;
}

// ADICIONADO: Função para carregar o histórico do localStorage
function carregarHistorico() {
    const historicoSalvo = localStorage.getItem('historicoProjetos');
    return historicoSalvo ? JSON.parse(historicoSalvo) : [];
}

// MODIFICADO: Função para salvar ambos os arrays no localStorage
function salvarDados() {
    localStorage.setItem('projetosPrefeitura', JSON.stringify(projetos));
    localStorage.setItem('historicoProjetos', JSON.stringify(projetosArquivados));
}

let projetos = carregarProjetos();
let projetosArquivados = carregarHistorico(); // ADICIONADO

const statusMap = { 'em-andamento': 'Em Andamento', 'concluido': 'Concluído', 'atrasado': 'Atrasado', 'pendente': 'Pendente' };
const secretariaMap = { 'obras': 'Obras e Urbanismo', 'saude': 'Saúde', 'educacao': 'Educação' };

// Elementos do DOM
const listaProjetosDiv = document.getElementById('listaProjetos');
const buscaProjetosInput = document.getElementById('buscaProjetos');
const filtroStatusSelect = document.getElementById('filtroStatus');
const filtroSecretariaSelect = document.getElementById('filtroSecretaria');
const totalProjetosAtivosSpan = document.getElementById('totalProjetosAtivos');
const totalProjetosAtrasadosSpan = document.getElementById('totalProjetosAtrasados');
const totalProjetosConcluidosMesSpan = document.getElementById('totalProjetosConcluidosMes');
const btnNovoProjeto = document.getElementById('btnNovoProjeto');
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

// ADICIONADO: Elementos do DOM para o histórico
const btnHistoricoProjetos = document.getElementById('btnHistoricoProjetos');
const modalHistoricoOverlay = document.getElementById('modalHistoricoOverlay');
const historicoTbody = document.getElementById('historico-tbody');
const btnFecharHistorico = document.getElementById('btnFecharHistorico');

let statusProjetosChart;
let cronogramaProjetosChart;

function renderizarProjetos(projetosToRender) {
    listaProjetosDiv.innerHTML = ''; 
    if (projetosToRender.length === 0) {
        listaProjetosDiv.innerHTML = '<p>Nenhum projeto encontrado com os filtros aplicados.</p>';
        return;
    }
    projetosToRender.forEach(projeto => {
        const card = document.createElement('div');
        card.classList.add('card-projeto', `status-${projeto.status}`);
        const dataInicio = new Date(projeto.dataInicio);
        const dataFim = new Date(projeto.dataFim);
        const dataInicioFormatada = dataInicio.toLocaleDateString('pt-BR', { timeZone: 'UTC' });
        const dataFimFormatada = dataFim.toLocaleDateString('pt-BR', { timeZone: 'UTC' });
        card.innerHTML = `<h3>${projeto.nome}</h3><p>${secretariaMap[projeto.secretaria] || projeto.secretaria}</p><div class="progresso"><div class="barra-progresso" style="width: ${projeto.progresso}%;"></div><span>${projeto.progresso}% Concluído</span></div><p class="datas">Início: ${dataInicioFormatada} - Fim: ${dataFimFormatada}</p><p class="status-texto">Status: ${statusMap[projeto.status] || projeto.status}</p><div class="acoes-projeto"><button class="btn-detalhes" data-id="${projeto.id}">Detalhes</button><button class="btn-editar" data-id="${projeto.id}">Editar</button><button class="btn-excluir" data-id="${projeto.id}"><span class="material-icons-outlined">delete</span></button></div>`;
        listaProjetosDiv.appendChild(card);
    });

    // MODIFICADO: Delegação de evento para os botões de ação
    listaProjetosDiv.addEventListener('click', (event) => {
        const target = event.target.closest('button');
        if (!target) return;

        const projectId = target.dataset.id;
        if (target.classList.contains('btn-detalhes')) {
            const projeto = projetos.find(p => p.id === projectId);
            if (projeto) abrirModalProjeto('Detalhes do Projeto', projeto, true);
        } else if (target.classList.contains('btn-editar')) {
            const projeto = projetos.find(p => p.id === projectId);
            if (projeto) abrirModalProjeto('Editar Projeto', projeto);
        } else if (target.classList.contains('btn-excluir')) {
            arquivarProjeto(projectId); // MODIFICADO: chama arquivar em vez de excluir
        }
    });
}

function atualizarEstatisticas() {
    const ativos = projetos.filter(p => p.status === 'em-andamento' || p.status === 'pendente').length;
    const atrasados = projetos.filter(p => p.status === 'atrasado').length;
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

function renderizarStatusProjetosChart() {
    const ctx = document.getElementById('statusProjetosChart').getContext('2d');
    const statusCounts = projetos.reduce((acc, projeto) => {
        acc[projeto.status] = (acc[projeto.status] || 0) + 1;
        return acc;
    }, {});
    const labels = Object.keys(statusCounts).map(status => statusMap[status] || status);
    const data = Object.values(statusCounts);
    const backgroundColors = ['#4CAF50', '#2196F3', '#FF5252', '#FFC107'];
    if (statusProjetosChart) statusProjetosChart.destroy();
    statusProjetosChart = new Chart(ctx, { type: 'pie', data: { labels, datasets: [{ data, backgroundColor: backgroundColors, borderColor: 'var(--cor-card-fundo)', borderWidth: 2 }] }, options: { responsive: true, maintainAspectRatio: false, plugins: { legend: { position: 'top', labels: { color: 'var(--cor-card-texto)' } }, title: { display: false } } } });
}

// ... (função renderizarCronogramaProjetosChart não precisa ser alterada)

function aplicarFiltros() {
    const termoBusca = buscaProjetosInput.value.toLowerCase();
    const statusFiltro = filtroStatusSelect.value;
    const secretariaFiltro = filtroSecretariaSelect.value;
    const projetosFiltrados = projetos.filter(projeto => {
        const matchBusca = projeto.nome.toLowerCase().includes(termoBusca) || (secretariaMap[projeto.secretaria] || '').toLowerCase().includes(termoBusca);
        const matchStatus = statusFiltro === '' || projeto.status === statusFiltro;
        const matchSecretaria = secretariaFiltro === '' || projeto.secretaria === secretariaFiltro;
        return matchBusca && matchStatus && matchSecretaria;
    });
    renderizarProjetos(projetosFiltrados);
}

function abrirModalProjeto(title, projetoData = {}, isViewMode = false) {
    modalProjetoTitle.textContent = title;
    formProjeto.reset();
    if (projetoData.id) {
        projectIdInput.value = projetoData.id;
        projectNameInput.value = projetoData.nome;
        projectSecretariaInput.value = projetoData.secretaria;
        projectStatusInput.value = projetoData.status;
        projectProgressoInput.value = projetoData.progresso;
        projectDataInicioInput.value = projetoData.dataInicio;
        projectDataFimInput.value = projetoData.dataFim;
    } else {
        projectIdInput.value = '';
    }
    const inputs = formProjeto.querySelectorAll('input, select');
    inputs.forEach(input => { input.readOnly = isViewMode; input.disabled = isViewMode; });
    formProjeto.querySelector('button[type="submit"]').style.display = isViewMode ? 'none' : 'block';
    modalProjetoOverlay.style.display = 'flex';
}

function fecharModalProjeto() {
    modalProjetoOverlay.style.display = 'none';
}

// MODIFICADO: Função para arquivar projeto
function arquivarProjeto(projectId) {
    const projetoIndex = projetos.findIndex(p => p.id === projectId);
    if (projetoIndex > -1) {
        const confirmacao = confirm(`Tem certeza que deseja mover o projeto "${projetos[projetoIndex].nome}" para o histórico?`);
        if (confirmacao) {
            const [projetoArquivado] = projetos.splice(projetoIndex, 1);
            projetoArquivado.arquivadoEm = new Date().toISOString();
            projetosArquivados.push(projetoArquivado);
            salvarDados();
            aplicarFiltros();
            atualizarEstatisticas();
            renderizarStatusProjetosChart();
        }
    }
}

// ADICIONADO: Todas as funções de histórico
function renderizarHistorico() {
    historicoTbody.innerHTML = '';
    if (projetosArquivados.length === 0) {
        historicoTbody.innerHTML = '<tr><td colspan="3" style="text-align: center;">O histórico está vazio.</td></tr>';
        return;
    }
    projetosArquivados.sort((a, b) => new Date(b.arquivadoEm) - new Date(a.arquivadoEm)).forEach(projeto => {
        const dataArquivamento = new Date(projeto.arquivadoEm).toLocaleString('pt-BR');
        const row = `<tr><td>${projeto.nome}</td><td>${dataArquivamento}</td><td><button class="btn-restaurar" data-id="${projeto.id}">Restaurar</button><button class="btn-excluir-perm" data-id="${projeto.id}">Excluir</button></td></tr>`;
        historicoTbody.innerHTML += row;
    });
}

function restaurarProjeto(projectId) {
    const projetoIndex = projetosArquivados.findIndex(p => p.id === projectId);
    if (projetoIndex > -1) {
        const [projetoRestaurado] = projetosArquivados.splice(projetoIndex, 1);
        delete projetoRestaurado.arquivadoEm;
        projetos.push(projetoRestaurado);
        salvarDados();
        aplicarFiltros();
        atualizarEstatisticas();
        renderizarStatusProjetosChart();
        renderizarHistorico();
    }
}

function excluirPermanentemente(projectId) {
    const projetoIndex = projetosArquivados.findIndex(p => p.id === projectId);
    if (projetoIndex > -1) {
        const confirmacao = confirm(`Esta ação é irreversível. Deseja excluir permanentemente o projeto "${projetosArquivados[projetoIndex].nome}"?`);
        if (confirmacao) {
            projetosArquivados.splice(projetoIndex, 1);
            salvarDados();
            renderizarHistorico();
        }
    }
}

// Event Listeners
buscaProjetosInput.addEventListener('input', aplicarFiltros);
filtroStatusSelect.addEventListener('change', aplicarFiltros);
filtroSecretariaSelect.addEventListener('change', aplicarFiltros);
btnNovoProjeto.addEventListener('click', () => abrirModalProjeto('Novo Projeto'));
btnCancelarProjeto.addEventListener('click', fecharModalProjeto);

formProjeto.addEventListener('submit', (event) => {
    event.preventDefault();
    const id = projectIdInput.value;
    const nome = projectNameInput.value;
    const secretaria = projectSecretariaInput.value;
    const status = projectStatusInput.value;
    const progresso = parseInt(projectProgressoInput.value);
    const dataInicio = projectDataInicioInput.value;
    const dataFim = projectDataFimInput.value;
    if (id) {
        const index = projetos.findIndex(p => p.id === id);
        if (index > -1) projetos[index] = { id, nome, secretaria, status, progresso, dataInicio, dataFim };
    } else {
        const newId = 'proj' + Date.now();
        projetos.push({ id: newId, nome, secretaria, status, progresso, dataInicio, dataFim });
    }
    salvarDados(); // MODIFICADO para usar a nova função
    aplicarFiltros();
    atualizarEstatisticas();
    renderizarStatusProjetosChart();
    fecharModalProjeto();
});

// ADICIONADO: Listeners do histórico
btnHistoricoProjetos.addEventListener('click', () => {
    renderizarHistorico();
    modalHistoricoOverlay.style.display = 'flex';
});
btnFecharHistorico.addEventListener('click', () => modalHistoricoOverlay.style.display = 'none');
historicoTbody.addEventListener('click', (event) => {
    const target = event.target;
    const projectId = target.dataset.id;
    if (target.classList.contains('btn-restaurar')) restaurarProjeto(projectId);
    if (target.classList.contains('btn-excluir-perm')) excluirPermanentemente(projectId);
});

// Inicialização da página
document.addEventListener('DOMContentLoaded', () => {
    aplicarFiltros();
    atualizarEstatisticas();
    renderizarStatusProjetosChart();
});