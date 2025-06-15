document.addEventListener('DOMContentLoaded', () => {

 // --- NOVA FUNCIONALIDADE: INTEGRAÇÃO COM LOCALSTORAGE ---
    const STORAGE_KEY_MENSAGENS = 'mensagensChat';
    // --- FIM DA NOVA FUNCIONALIDADE ---

    // --- SELETORES DO DOM ---
    const chatBox = document.getElementById('chatBox');
    const chatInput = document.getElementById('chatInput');
    const chatSetorSelect = document.getElementById('chatSetor');
    const btnEnviarMensagem = document.getElementById('btnEnviarMensagem');

    const listaAvisos = document.getElementById('listaAvisos');
    const listaInbox = document.getElementById('listaInbox');
    const statusCanais = document.getElementById('statusCanais');

    const btnCanalConfidencial = document.getElementById('btnCanalConfidencial');
    const modalConfidencial = document.getElementById('modalConfidencial');
    const fecharModal = document.getElementById('fecharModal');
    const formConfidencial = document.getElementById('formConfidencial');
    const mensagemConfidencialInput = document.getElementById('mensagemConfidencial');
    
    let mensagensChart = null;

    // --- DADOS E LOCALSTORAGE ---
    // Pega dados do localStorage ou usa dados padrão
    let mensagensChat = JSON.parse(localStorage.getItem('mensagensChat')) || [
        { autor: 'Ana', texto: 'Bom dia! A pauta da reunião já está disponível.', setor: 'Geral', hora: '09:05' },
        { autor: 'Carlos', texto: 'Preciso do relatório de ponto do mês passado.', setor: 'RH', hora: '09:15' }
    ];
    let avisos = JSON.parse(localStorage.getItem('avisos')) || [
        { texto: 'Manutenção do sistema agendada para sexta-feira à noite.', prioridade: 'media' },
        { texto: 'Atualização obrigatória de senhas até o final do dia.', prioridade: 'alta' },
        { texto: 'Campanha de doação de agasalhos na recepção.', prioridade: 'baixa' }
    ];
    let inbox = JSON.parse(localStorage.getItem('inbox')) || [
        { id: 1, de: 'RH', texto: 'Plano de benefícios 2025', lido: false },
        { id: 2, de: 'Financeiro', texto: 'Orçamento liberado para o projeto X', lido: true },
        { id: 3, de: 'Jurídico', texto: 'Revisão do contrato de fornecedor Y', lido: false }
    ];

    // Função para salvar no localStorage
    const salvarDados = () => {
        localStorage.setItem(STORAGE_KEY_MENSAGENS, JSON.stringify(mensagensChat));
        localStorage.setItem('mensagensChat', JSON.stringify(mensagensChat));
        localStorage.setItem('avisos', JSON.stringify(avisos));
        localStorage.setItem('inbox', JSON.stringify(inbox));
    };

    // --- FUNÇÕES DE RENDERIZAÇÃO ---

    // 1. RENDERIZAR CHAT
    const renderizarChat = () => {
        chatBox.innerHTML = '';
        const mensagensAgrupadas = mensagensChat.reduce((acc, msg) => {
            if (!acc[msg.setor]) {
                acc[msg.setor] = [];
            }
            acc[msg.setor].push(msg);
            return acc;
        }, {});

        for (const setor in mensagensAgrupadas) {
            const header = document.createElement('div');
            header.className = 'chat-setor-header';
            header.textContent = setor;
            chatBox.appendChild(header);

            mensagensAgrupadas[setor].forEach(msg => {
                const msgElement = document.createElement('div');
                msgElement.className = 'chat-message';
                msgElement.innerHTML = `<span class="chat-message-author">${msg.autor}:</span> ${msg.texto} <span class="chat-message-time">${msg.hora}</span>`;
                chatBox.appendChild(msgElement);
            });
        }
        chatBox.scrollTop = chatBox.scrollHeight;
    };
    
    // 2. RENDERIZAR AVISOS
    const renderizarAvisos = () => {
        listaAvisos.innerHTML = '';
        const prioridadeOrdem = { 'alta': 1, 'media': 2, 'baixa': 3 };
        
        avisos.sort((a, b) => prioridadeOrdem[a.prioridade] - prioridadeOrdem[b.prioridade]);
        
        avisos.forEach(aviso => {
            const item = document.createElement('li');
            item.className = `aviso-item aviso-prioridade-${aviso.prioridade}`;
            const icon = aviso.prioridade === 'alta' ? 'error' : (aviso.prioridade === 'media' ? 'warning' : 'info');
            item.innerHTML = `<span class="material-icons-outlined">${icon}</span> ${aviso.texto}`;
            listaAvisos.appendChild(item);
        });
    };

    // 3. RENDERIZAR CAIXA DE ENTRADA
    const renderizarInbox = () => {
        listaInbox.innerHTML = '';
        inbox.forEach(msg => {
            const item = document.createElement('li');
            item.className = 'inbox-item';
            if (msg.lido) {
                item.classList.add('lido');
            }
            item.innerHTML = `
                <span><strong>${msg.de}:</strong> ${msg.texto}</span>
                <button class="btn-marcar-lido" data-id="${msg.id}">Lido</button>
            `;
            listaInbox.appendChild(item);
        });
    };

    // 4. RENDERIZAR STATUS E GRÁFICO
    const renderizarStatus = () => {
        // Status dos canais
        const canais = ['Chat Geral', 'RH', 'Jurídico', 'Obras', 'Saúde'];
        statusCanais.innerHTML = `<p><strong>Canais Ativos (${canais.length}):</strong> ${canais.join(', ')}</p>`;
        
        // Dados para o gráfico
        const msgsPorSetor = mensagensChat.reduce((acc, msg) => {
            acc[msg.setor] = (acc[msg.setor] || 0) + 1;
            return acc;
        }, {});

        const labels = Object.keys(msgsPorSetor);
        const data = Object.values(msgsPorSetor);

        // Renderiza o gráfico
        const ctx = document.getElementById('mensagensChart').getContext('2d');
        if(mensagensChart) {
            mensagensChart.destroy();
        }
        mensagensChart = new Chart(ctx, {
            type: 'bar',
            data: {
                labels: labels,
                datasets: [{
                    label: 'Volume de Mensagens por Setor',
                    data: data,
                    backgroundColor: [
                        'rgba(255, 99, 132, 0.5)',
                        'rgba(54, 162, 235, 0.5)',
                        'rgba(255, 206, 86, 0.5)',
                        'rgba(75, 192, 192, 0.5)',
                        'rgba(153, 102, 255, 0.5)',
                    ],
                    borderColor: [
                        'rgba(255, 99, 132, 1)',
                        'rgba(54, 162, 235, 1)',
                        'rgba(255, 206, 86, 1)',
                        'rgba(75, 192, 192, 1)',
                        'rgba(153, 102, 255, 1)',
                    ],
                    borderWidth: 1
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                scales: {
                    y: {
                        beginAtZero: true
                    }
                },
                plugins: {
                    legend: {
                        display: false
                    }
                }
            }
        });
    };
    
    // --- LÓGICA DE EVENTOS ---

    // Enviar mensagem no chat
     const enviarMensagemChat = () => {
        const texto = chatInput.value.trim();
        const setor = chatSetorSelect.value;
        if (texto) {
            const agora = new Date();
            const novaMensagem = {
                autor: 'Você',
                texto: texto,
                setor: setor,
                hora: `${agora.getHours().toString().padStart(2, '0')}:${agora.getMinutes().toString().padStart(2, '0')}`,
                data: agora.toISOString() // ATUALIZADO: Adiciona a data completa para filtragem
            };
            mensagensChat.push(novaMensagem);
            salvarDados(); // <--- SALVA A MUDANÇA
            renderizarChat();
            renderizarStatus();
            chatInput.value = '';
        }
    };
    
    btnEnviarMensagem.addEventListener('click', enviarMensagemChat);
    chatInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            enviarMensagemChat();
        }
    });

    // Marcar como lido na caixa de entrada
    listaInbox.addEventListener('click', (e) => {
        if (e.target.classList.contains('btn-marcar-lido')) {
            const id = parseInt(e.target.dataset.id, 10);
            const msgIndex = inbox.findIndex(m => m.id === id);
            if (msgIndex !== -1) {
                inbox[msgIndex].lido = true;
                salvarDados();
                renderizarInbox();
            }
        }
    });
    
    // Modal do Canal Confidencial
    btnCanalConfidencial.addEventListener('click', () => {
        modalConfidencial.style.display = 'flex';
    });

    fecharModal.addEventListener('click', () => {
        modalConfidencial.style.display = 'none';
    });
    
    window.addEventListener('click', (e) => {
        if (e.target === modalConfidencial) {
            modalConfidencial.style.display = 'none';
        }
    });

    formConfidencial.addEventListener('submit', (e) => {
        e.preventDefault();
        const mensagem = mensagemConfidencialInput.value.trim();
        if(mensagem) {
            let mensagensConfidenciais = JSON.parse(localStorage.getItem('mensagensConfidenciais')) || [];
            mensagensConfidenciais.push({ texto: mensagem, data: new Date().toISOString() });
            localStorage.setItem('mensagensConfidenciais', JSON.stringify(mensagensConfidenciais));
            
            alert('Sua mensagem confidencial foi enviada com sucesso.');
            mensagemConfidencialInput.value = '';
            modalConfidencial.style.display = 'none';
        }
    });

    // --- CHAMADA INICIAL ---
    const renderizarTudo = () => {
        renderizarChat();
        renderizarAvisos();
        renderizarInbox();
        renderizarStatus();
    };

    renderizarTudo();
});