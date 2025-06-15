// integrar.js

document.addEventListener('DOMContentLoaded', () => {
    // Container principal onde os cards estão ou serão inseridos
    const integrationsGrid = document.getElementById('integrations-grid');

    // --- Lógica do Modal de Adicionar Integração ---
    const modalAdd = document.getElementById('modalNovaIntegracao');
    const btnAbrirModalAdd = document.getElementById('btnAbrirModalAdd');
    const btnFecharModalAdd = modalAdd.querySelector('.close-button');
    const suggestionList = document.getElementById('suggestion-list');

    // Lista de sugestões de apps para o modal
    const suggestedApps = [
        { id: 'trello', name: 'Trello', description: 'Gerencie tarefas e projetos com quadros Kanban.', iconUrl: 'img/integrar/trello.png' },
        { id: 'powerbi', name: 'Microsoft Power BI', description: 'Crie dashboards e relatórios de dados interativos.', iconUrl: 'img/integrar/bi.png' },
        { id: 'docusign', name: 'DocuSign', description: 'Envie e assine documentos de forma eletrônica e segura.', iconUrl: 'img/integrar/docusign.png' },
        { id: 'sap', name: 'SAP', description: 'Integre com o sistema de gestão empresarial (ERP).', iconUrl: 'img/integrar/sap.png' },
        { id: 'mailchimp', name: 'Mailchimp', description: 'Gerencie campanhas de e-mail e comunicação em massa.', iconUrl: 'img/integrar/mailchimp.png' }
    ];

    // Popula o modal com as sugestões
    const populateSuggestions = () => {
        suggestionList.innerHTML = '';
        const existingIds = Array.from(integrationsGrid.children).map(card => card.dataset.integrationId);

        suggestedApps.forEach(app => {
            const isAdded = existingIds.includes(app.id);
            const item = `
                <div class="suggestion-item">
                    <img src="${app.iconUrl}" alt="${app.name}">
                    <div class="suggestion-info">
                        <h5>${app.name}</h5>
                        <p>${app.description}</p>
                    </div>
                    <button class="btn-add-suggestion" data-id="${app.id}" ${isAdded ? 'disabled' : ''}>
                        ${isAdded ? 'Adicionado' : 'Adicionar'}
                    </button>
                </div>
            `;
            suggestionList.innerHTML += item;
        });
    };

    // Abre o modal
    btnAbrirModalAdd.addEventListener('click', () => {
        populateSuggestions();
        modalAdd.style.display = 'flex';
    });

    // Fecha o modal
    const closeModal = () => modalAdd.style.display = 'none';
    btnFecharModalAdd.addEventListener('click', closeModal);
    window.addEventListener('click', (event) => {
        if (event.target == modalAdd) closeModal();
    });

    // Lógica para adicionar uma nova integração a partir do modal
    suggestionList.addEventListener('click', (event) => {
        if (event.target.matches('.btn-add-suggestion')) {
            const button = event.target;
            const appId = button.dataset.id;
            const appData = suggestedApps.find(app => app.id === appId);

            if (appData) {
                // Cria e adiciona o novo card na página principal
                const newCardHTML = `
                    <div id="integration-${appData.id}" class="integration-card disconnected" data-integration-id="${appData.id}">
                        <div class="card-header"><img src="${appData.iconUrl}" alt="${appData.name}"><h3>${appData.name}</h3></div>
                        <p class="card-description">${appData.description}</p>
                        <div class="card-footer">
                            <div class="status-badge"><div class="status-indicator"></div><span>Não Conectado</span></div>
                            <div class="card-actions"><button class="btn-action btn-connect" data-action="connect">Conectar</button></div>
                        </div>
                    </div>
                `;
                integrationsGrid.insertAdjacentHTML('beforeend', newCardHTML);
                
                // Desabilita o botão no modal e muda o texto
                button.disabled = true;
                button.textContent = 'Adicionado';
            }
        }
    });


    // --- Lógica para Conectar/Desconectar Cards (Refatorada) ---
    const connectedButtonsHTML = `<button class="btn-action btn-configure" data-action="configure">Configurar</button><button class="btn-action btn-disconnect" data-action="disconnect">Desconectar</button>`;
    const disconnectedButtonHTML = `<button class="btn-action btn-connect" data-action="connect">Conectar</button>`;

    const updateCardState = (card, isConnected) => {
        const statusText = card.querySelector('.status-badge span');
        const actionsContainer = card.querySelector('.card-actions');

        card.classList.toggle('connected', isConnected);
        card.classList.toggle('disconnected', !isConnected);
        statusText.textContent = isConnected ? 'Conectado' : 'Não Conectado';
        actionsContainer.innerHTML = isConnected ? connectedButtonsHTML : disconnectedButtonHTML;
    };

    // Usa delegação de eventos no grid principal para manipular todos os cards
    integrationsGrid.addEventListener('click', (event) => {
        const target = event.target;
        const action = target.dataset.action;
        const card = target.closest('.integration-card');

        if (!action || !card) return;

        switch (action) {
            case 'connect':
                updateCardState(card, true);
                break;
            case 'disconnect':
                updateCardState(card, false);
                break;
            case 'configure':
                alert(`Simulação: Abrindo configurações para ${card.querySelector('h3').textContent}...`);
                break;
        }
    });
});