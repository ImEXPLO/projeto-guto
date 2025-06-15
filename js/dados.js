document.addEventListener('DOMContentLoaded', () => {

    // --- FUNÇÃO PARA RENDERIZAR OS INDICADORES COM DADOS SIMULADOS ---
    function renderizarIndicadores() {
        const container = document.getElementById('indicadoresGerais');
        if (!container) return;

        // Dados simulados para os cards principais
        const indicadores = [
            { icone: 'account_balance_wallet', titulo: 'Gastos do Mês', valor: 'R$ 5.320,50', link: 'financa.html' },
            { icone: 'groups', titulo: 'Equipes Ativas', valor: '6', link: 'equipes.html' },
            { icone: 'folder_managed', titulo: 'Projetos Ativos', valor: '36', link: 'index.html' },
            { icone: 'chat', titulo: 'Mensagens (Semana)', valor: '20', link: 'comunicar.html' },
            { icone: 'badge', titulo: 'Servidores Ativos', valor: '19', link: 'equipes.html' }
        ];

        container.innerHTML = '';
        indicadores.forEach(indicador => {
            const cardHtml = `
                <div class="card-indicador">
                    <div class="card-header">
                        <span class="material-icons-outlined">${indicador.icone}</span>
                        <h4>${indicador.titulo}</h4>
                    </div>
                    <p class="card-valor">${indicador.valor}</p>
                    <div class="card-link">
                        <a href="${indicador.link}">Ver detalhes &rarr;</a>
                    </div>
                </div>
            `;
            container.innerHTML += cardHtml;
        });
    }

    // --- FUNÇÃO PARA RENDERIZAR O GRÁFICO COM DADOS SIMULADOS ---
    function renderizarGrafico() {
        const ctx = document.getElementById('graficoProjetosEquipe');
        if (!ctx) return;

        // Dados simulados para o gráfico
        const labels = ['Saúde', 'Educação', 'Obras', 'Jurídico', 'Meio Ambiente', 'Transporte'];
        const data = [5, 8, 12, 3, 4, 6];

        new Chart(ctx, {
            type: 'bar',
            data: {
                labels: labels,
                datasets: [{
                    label: 'Nº de Projetos Ativos',
                    data: data,
                    backgroundColor: 'rgba(75, 192, 192, 0.6)',
                    borderColor: 'rgba(75, 192, 192, 1)',
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
                            stepSize: 2 // Define o intervalo do eixo Y
                        }
                    }
                },
                plugins: {
                    legend: {
                        display: false
                    }
                }
            }
        });
    }

    // --- FUNÇÃO PARA RENDERIZAR ALERTAS COM DADOS SIMULADOS ---
    function renderizarAlertas() {
        const container = document.getElementById('listaAlertas');
        if (!container) return;
        
        const alertas = [
            { texto: 'Projeto "Reforma da Praça Central" está 15 dias atrasado.' },
            { texto: 'Risco de estouro de orçamento em "Campanha de Vacinação".' },
            { texto: 'Canal de comunicação "Obras" com tempo de resposta acima de 24h.' }
        ];
        
        container.innerHTML = ''; // Limpa antes de adicionar
        alertas.forEach(alerta => {
            const alertaHtml = `
                <li class="alerta-item">
                    <span class="material-icons-outlined">notification_important</span>
                    <p>${alerta.texto}</p>
                </li>
            `;
            container.innerHTML += alertaHtml;
        });
    }

    // --- FUNÇÃO PARA RENDERIZAR ATUALIZAÇÕES COM DADOS SIMULADOS ---
    function renderizarAtualizacoes() {
        const container = document.getElementById('listaAtualizacoes');
        if (!container) return;
        
        const atualizacoes = [
            { icone: 'person_add', setor: 'RH', setorClass: 'rh', texto: 'Novo colaborador cadastrado na equipe de Saúde.', data: 'Hoje, 10:30' },
            { icone: 'flag', setor: 'Projetos', setorClass: 'projetos', texto: 'Fase 2 do projeto "Asfalto Novo" foi finalizada.', data: 'Hoje, 09:15' },
            { icone: 'paid', setor: 'Financeiro', setorClass: 'financeiro', texto: 'Verba de R$ 250.000 liberada para a Escola Municipal ABC.', data: 'Ontem, 17:45' },
            { icone: 'add_task', setor: 'Projetos', setorClass: 'projetos', texto: 'Nova tarefa "Comprar materiais" adicionada ao projeto da UPA.', data: 'Ontem, 15:00' },
            { icone: 'badge', setor: 'RH', setorClass: 'rh', texto: 'Contrato de servidor atualizado no sistema.', data: '2 dias atrás' }
        ];
        
        container.innerHTML = ''; // Limpa antes de adicionar
        atualizacoes.forEach(item => {
            const logHtml = `
                <li class="log-item">
                    <div class="log-icone"><span class="material-icons-outlined">${item.icone}</span></div>
                    <div class="log-conteudo">
                        <p><span class="tag-setor ${item.setorClass}">[${item.setor}]</span> ${item.texto}</p>
                        <p class="log-data">${item.data}</p>
                    </div>
                </li>
            `;
            container.innerHTML += logHtml;
        });
    }

    // --- CHAMADA INICIAL PARA RENDERIZAR TUDO ---
    renderizarIndicadores();
    renderizarGrafico();
    renderizarAlertas();
    renderizarAtualizacoes();
});