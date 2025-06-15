document.addEventListener('DOMContentLoaded', () => {

    // --- NOVA FUNCIONALIDADE: INTEGRAÇÃO COM LOCALSTORAGE ---
    const STORAGE_KEY_EQUIPES = 'organization-equipes';
    const STORAGE_KEY_HISTORICO = 'organization-equipes-historico';

    function carregarDados() {
        const equipesSalvas = localStorage.getItem(STORAGE_KEY_EQUIPES);
        const historicoSalvo = localStorage.getItem(STORAGE_KEY_HISTORICO);

        const equipesPadrao = [
            { id: 1, nome: "Saúde", descricao: "Gestão de postos de saúde, hospitais e campanhas de vacinação.", lider: "Dra. Helena Costa", membros: ["Carlos", "Mariana", "Roberto", "Beatriz", "Fernando"], projetosAtivos: 4, icone: "https://img.icons8.com/fluency/48/heart-with-pulse.png" },
            { id: 2, nome: "Educação", descricao: "Administração de escolas, creches e programas educacionais.", lider: "Prof. Ricardo Alves", membros: ["Ana", "João", "Lúcia", "Pedro"], projetosAtivos: 3, icone: "https://img.icons8.com/fluency/48/school.png" },
            { id: 3, nome: "Obras", descricao: "Responsável pela infraestrutura urbana, pavimentação e construções.", lider: "Eng. Marcos Lima", membros: ["Júlia", "Fábio", "Sandro"], projetosAtivos: 5, icone: "https://img.icons8.com/external-justicon-lineal-color-justicon/64/external-cone-construction-justicon-lineal-color-justicon.png" },
            { id: 4, nome: "Jurídico", descricao: "Assessoria jurídica para a prefeitura e processos legais.", lider: "Dr. Paulo Mendes", membros: ["Gabriela", "Vinícius"], projetosAtivos: 1, icone: "https://img.icons8.com/fluency/48/scales.png" },
            { id: 5, nome: "Meio Ambiente", descricao: "Fiscalização, licenciamento e projetos de sustentabilidade.", lider: "Bióloga Sofia Dias", membros: ["Lucas", "Camila"], projetosAtivos: 2, icone: "https://img.icons8.com/fluency/48/forest.png" },
            { id: 6, nome: "Transporte", descricao: "Gestão do transporte público e trânsito municipal.", lider: "Cláudio Moreira", membros: ["Rafael", "Tatiane", "Diego"], projetosAtivos: 3, icone: "https://img.icons8.com/fluency/48/bus.png" }
        ];

        let equipes = equipesSalvas ? JSON.parse(equipesSalvas) : equipesPadrao;
        let equipesExcluidas = historicoSalvo ? JSON.parse(historicoSalvo) : [];
        
        // Se não houver dados no localStorage, salva os dados padrão
        if (!equipesSalvas) {
            salvarDados(equipes, equipesExcluidas);
        }

        return { equipes, equipesExcluidas };
    }

    function salvarDados(equipesAtivas, equipesExcluidas) {
        localStorage.setItem(STORAGE_KEY_EQUIPES, JSON.stringify(equipesAtivas));
        localStorage.setItem(STORAGE_KEY_HISTORICO, JSON.stringify(equipesExcluidas));
    }

    // --- DADOS INICIAIS ---
    let equipes = [
        {
            id: 1,
            nome: "Saúde",
            descricao: "Gestão de postos de saúde, hospitais e campanhas de vacinação.",
            lider: "Dra. Helena Costa",
            membros: ["Carlos", "Mariana", "Roberto", "Beatriz", "Fernando"],
            projetosAtivos: 4,
            icone: "https://img.icons8.com/fluency/48/heart-with-pulse.png"
        },
        {
            id: 2,
            nome: "Educação",
            descricao: "Administração de escolas, creches e programas educacionais.",
            lider: "Prof. Ricardo Alves",
            membros: ["Ana", "João", "Lúcia", "Pedro"],
            projetosAtivos: 3,
            icone: "https://img.icons8.com/fluency/48/school.png"
        },
        {
            id: 3,
            nome: "Obras",
            descricao: "Responsável pela infraestrutura urbana, pavimentação e construções.",
            lider: "Eng. Marcos Lima",
            membros: ["Júlia", "Fábio", "Sandro"],
            projetosAtivos: 5,
            icone: "https://img.icons8.com/external-justicon-lineal-color-justicon/64/external-cone-construction-justicon-lineal-color-justicon.png"
        },
        {
            id: 4,
            nome: "Jurídico",
            descricao: "Assessoria jurídica para a prefeitura e processos legais.",
            lider: "Dr. Paulo Mendes",
            membros: ["Gabriela", "Vinícius"],
            projetosAtivos: 1,
            icone: "https://img.icons8.com/fluency/48/scales.png"
        },
        {
            id: 5,
            nome: "Meio Ambiente",
            descricao: "Fiscalização, licenciamento e projetos de sustentabilidade.",
            lider: "Bióloga Sofia Dias",
            membros: ["Lucas", "Camila"],
            projetosAtivos: 2,
            icone: "https://img.icons8.com/fluency/48/forest.png"
        },
        {
            id: 6,
            nome: "Transporte",
            descricao: "Gestão do transporte público e trânsito municipal.",
            lider: "Cláudio Moreira",
            membros: ["Rafael", "Tatiane", "Diego"],
            projetosAtivos: 3,
            icone: "https://img.icons8.com/fluency/48/bus.png"
        }
    ];

    let equipesExcluidas = []; // Novo array para exclusão suave

    // --- ELEMENTOS DO DOM ---
    const equipesContainer = document.getElementById('equipesContainer');
    const searchEquipeInput = document.getElementById('searchEquipe');
    const btnCriarEquipe = document.getElementById('btnCriarEquipe');

    const modalEquipe = document.getElementById('modalEquipe');
    const modalEquipeTitle = document.getElementById('modalEquipeTitle');
    const formEquipe = document.getElementById('formEquipe');
    const equipeIdInput = document.getElementById('equipeId');
    const equipeNomeInput = document.getElementById('equipeNome');
    const equipeDescricaoInput = document.getElementById('equipeDescricao');
    const equipeLiderInput = document.getElementById('equipeLider');
    const equipeMembrosInput = document.getElementById('equipeMembros');
    const cancelarEquipeModalBtn = document.getElementById('cancelarEquipeModal');

    const modalDetalhesEquipe = document.getElementById('modalDetalhesEquipe');
    const detalhesEquipeNome = document.getElementById('detalhesEquipeNome');
    const detalhesEquipeDescricao = document.getElementById('detalhesEquipeDescricao');
    const detalhesEquipeLider = document.getElementById('detalhesEquipeLider');
    const detalhesEquipeMembros = document.getElementById('detalhesEquipeMembros');
    const detalhesEquipeProjetos = document.getElementById('detalhesEquipeProjetos');
    const fecharDetalhesEquipeModalBtn = document.getElementById('fecharDetalhesEquipeModal');

    const modalConfirmacaoExclusao = document.getElementById('modalConfirmacaoExclusao');
    const confirmarExclusaoBtn = document.getElementById('confirmarExclusao');
    const cancelarExclusaoBtn = document.getElementById('cancelarExclusao');
    
    // Novos elementos para histórico
    const btnVerHistorico = document.getElementById('btnVerHistorico');
    const historicoContainer = document.getElementById('historicoContainer');
    const historicoCards = document.getElementById('historicoCards');

    let equipeParaExcluirId = null;

    // --- FUNÇÕES ---

    // Função para obter a classe CSS com base na carga de trabalho
    const getWorkloadClass = (projetosAtivos) => {
        if (projetosAtivos <= 1) return 'workload-low'; // Baixa
        if (projetosAtivos <= 3) return 'workload-medium'; // Média
        return 'workload-high'; // Alta
    };

    // Função para renderizar equipes ATIVAS
    const renderEquipes = (filtro = '') => {
        equipesContainer.innerHTML = '';
        const equipesFiltradas = equipes.filter(equipe =>
            equipe.nome.toLowerCase().includes(filtro.toLowerCase())
        );

        if (equipesFiltradas.length === 0) {
            equipesContainer.innerHTML = '<p class="empty-message">Nenhuma equipe ativa encontrada.</p>';
            return;
        }

        equipesFiltradas.forEach(equipe => {
            const workloadClass = getWorkloadClass(equipe.projetosAtivos);
            const card = document.createElement('div');
            card.className = `card ${workloadClass}`;
            card.innerHTML = `
                <img src="${equipe.icone || 'https://img.icons8.com/fluency/48/group.png'}" alt="Ícone da Equipe ${equipe.nome}"/>
                <h2>${equipe.nome}</h2>
                <p>Membros: ${equipe.membros ? equipe.membros.length : 0}</p>
                <p>Projetos Ativos: ${equipe.projetosAtivos}</p>
                <div class="equipe-actions">
                    <button class="btn-detalhes" data-id="${equipe.id}">Detalhes</button>
                    <button class="btn-editar" data-id="${equipe.id}">Editar</button>
                    <button class="btn-excluir" data-id="${equipe.id}">
                        <span class="material-icons-outlined">delete</span>
                    </button>
                </div>
            `;
            equipesContainer.appendChild(card);
        });
    };
    
    // Função para renderizar equipes no HISTÓRICO
    const renderHistorico = () => {
        historicoCards.innerHTML = '';

        if (equipesExcluidas.length === 0) {
            historicoCards.innerHTML = '<p class="empty-message">O histórico de equipes está vazio.</p>';
            return;
        }
        
        equipesExcluidas.forEach(equipe => {
            const card = document.createElement('div');
            card.className = 'card'; // Sem workload class no histórico
            card.innerHTML = `
                <img src="${equipe.icone || 'https://img.icons8.com/fluency/48/group.png'}" alt="Ícone da Equipe ${equipe.nome}"/>
                <h2>${equipe.nome}</h2>
                <p>Líder: ${equipe.lider}</p>
                <div class="equipe-actions">
                    <button class="btn-restaurar" data-id="${equipe.id}">Restaurar</button>
                </div>
            `;
            historicoCards.appendChild(card);
        });
    }

     // ATUALIZADO: Salva os dados após a ação
    const excluirEquipeSuave = (id) => {
        const index = equipes.findIndex(e => e.id === id);
        if (index > -1) {
            const [equipeExcluida] = equipes.splice(index, 1);
            equipesExcluidas.push(equipeExcluida);
            salvarDados(equipes, equipesExcluidas); // <--- SALVA A MUDANÇA
            renderEquipes(searchEquipeInput.value);
            renderHistorico();
        }
    };
    
   // ATUALIZADO: Salva os dados após a ação
    const restaurarEquipe = (id) => {
        const index = equipesExcluidas.findIndex(e => e.id === id);
        if (index > -1) {
            const [equipeRestaurada] = equipesExcluidas.splice(index, 1);
            equipes.push(equipeRestaurada);
            equipes.sort((a, b) => a.id - b.id);
            salvarDados(equipes, equipesExcluidas); // <--- SALVA A MUDANÇA
            renderEquipes(searchEquipeInput.value);
            renderHistorico();
        }
    };

    // Abre o modal para edição
    const openEquipeModalForEdit = (id) => {
        const equipe = equipes.find(e => e.id === id);
        if (equipe) {
            modalEquipeTitle.textContent = 'Editar Equipe';
            equipeIdInput.value = equipe.id;
            equipeNomeInput.value = equipe.nome;
            equipeDescricaoInput.value = equipe.descricao;
            equipeLiderInput.value = equipe.lider;
            equipeMembrosInput.value = equipe.membros ? equipe.membros.join(', ') : '';
            modalEquipe.style.display = 'flex';
        }
    };

    // Abre o modal de detalhes
    const openDetalhesEquipeModal = (id) => {
        const equipe = equipes.find(e => e.id === id);
        if (equipe) {
            detalhesEquipeNome.textContent = equipe.nome;
            detalhesEquipeDescricao.textContent = equipe.descricao;
            detalhesEquipeLider.textContent = equipe.lider;
            detalhesEquipeMembros.textContent = equipe.membros && equipe.membros.length > 0 ? equipe.membros.join(', ') : 'Nenhum membro cadastrado.';
            detalhesEquipeProjetos.textContent = equipe.projetosAtivos;
            modalDetalhesEquipe.style.display = 'flex';
        }
    };

    // Abre o modal de confirmação de exclusão
    const openConfirmacaoExclusaoModal = (id) => {
        equipeParaExcluirId = id;
        modalConfirmacaoExclusao.style.display = 'flex';
    };

    // --- EVENT LISTENERS ---
    
    // Usando delegação de eventos para os cards
    document.addEventListener('click', (e) => {
        const target = e.target.closest('button');
        if (!target) return;

        const id = parseInt(target.dataset.id);

        if (target.classList.contains('btn-detalhes')) {
            openDetalhesEquipeModal(id);
        } else if (target.classList.contains('btn-editar')) {
            openEquipeModalForEdit(id);
        } else if (target.classList.contains('btn-excluir')) {
            openConfirmacaoExclusaoModal(id);
        } else if (target.classList.contains('btn-restaurar')) {
            restaurarEquipe(id);
        }
    });

    // Criar nova equipe
    btnCriarEquipe.addEventListener('click', () => {
        modalEquipeTitle.textContent = 'Criar Nova Equipe';
        formEquipe.reset();
        equipeIdInput.value = '';
        modalEquipe.style.display = 'flex';
    });

    // Salvar (Criar ou Editar)
    formEquipe.addEventListener('submit', (e) => {
        e.preventDefault();
        const id = equipeIdInput.value ? parseInt(equipeIdInput.value) : null;
        const nome = equipeNomeInput.value;
        const descricao = equipeDescricaoInput.value;
        const lider = equipeLiderInput.value;
        const membros = equipeMembrosInput.value.split(',').map(m => m.trim()).filter(Boolean);

        if (id) {
            const index = equipes.findIndex(e => e.id === id);
            if (index !== -1) {
                equipes[index] = { ...equipes[index], nome, descricao, lider, membros };
            }
        } else {
            const newId = equipes.length > 0 ? Math.max(...equipes.map(e => e.id)) + 1 : 1;
            equipes.push({
                id: newId, nome, descricao, lider, membros,
                projetosAtivos: 0, // Novas equipes começam com 0 projetos
                icone: 'https://img.icons8.com/fluency/48/group.png'
            });
        }
        renderEquipes(searchEquipeInput.value);
        modalEquipe.style.display = 'none';
    });
    
    // Botão de confirmar exclusão no modal
    confirmarExclusaoBtn.addEventListener('click', () => {
        if (equipeParaExcluirId !== null) {
            excluirEquipeSuave(equipeParaExcluirId);
            modalConfirmacaoExclusao.style.display = 'none';
            equipeParaExcluirId = null;
        }
    });

    // Busca dinâmica
    searchEquipeInput.addEventListener('input', (e) => {
        renderEquipes(e.target.value);
    });

    // Alternar visão entre ativas e histórico
    btnVerHistorico.addEventListener('click', () => {
        const isHistoricoVisible = !historicoContainer.classList.contains('hidden');
        if (isHistoricoVisible) {
            historicoContainer.classList.add('hidden');
            equipesContainer.classList.remove('hidden');
            searchEquipeInput.disabled = false;
            btnVerHistorico.innerHTML = `<span class="material-icons-outlined">history</span> Ver Histórico`;
        } else {
            historicoContainer.classList.remove('hidden');
            equipesContainer.classList.add('hidden');
            searchEquipeInput.disabled = true; // Desabilita a busca na tela de histórico
            btnVerHistorico.innerHTML = `<span class="material-icons-outlined">visibility</span> Ver Equipes Ativas`;
        }
    });
    
    // Fechar modais
    cancelarEquipeModalBtn.addEventListener('click', () => modalEquipe.style.display = 'none');
    fecharDetalhesEquipeModalBtn.addEventListener('click', () => modalDetalhesEquipe.style.display = 'none');
    cancelarExclusaoBtn.addEventListener('click', () => modalConfirmacaoExclusao.style.display = 'none');
    
    window.addEventListener('click', (e) => {
        if (e.target === modalEquipe) modalEquipe.style.display = 'none';
        if (e.target === modalDetalhesEquipe) modalDetalhesEquipe.style.display = 'none';
        if (e.target === modalConfirmacaoExclusao) modalConfirmacaoExclusao.style.display = 'none';
    });

    // --- RENDERIZAÇÃO INICIAL ---
    renderEquipes();
    renderHistorico();
});