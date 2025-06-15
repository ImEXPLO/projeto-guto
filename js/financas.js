// Variable transações
let transacoes = [];

// Variables Chart.js
let graficoFinanceiro;
let receitasCard, despesasCard, lucroCard, saldoCard;

// Função para formatar valores monetários para o padrão brasileiro (contábil)
function formatCurrency(value) {
    const numberValue = parseFloat(value);
    if (isNaN(numberValue)) {
        return value; // Retorna o valor original se não for um número válido
    }
    return new Intl.NumberFormat('pt-BR', {
        style: 'currency',
        currency: 'BRL',
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
    }).format(numberValue);
}

// Referencial aos elementos do modal
const confirmacaoModal = document.getElementById('confirmacaoModal');
const btnConfirmarExclusao = document.getElementById('btnConfirmarExclusao');
const btnCancelarExclusao = document.getElementById('btnCancelarExclusao');

// Variável para armazenar a transação a ser excluída temporariamente
let transacaoParaExcluir = null;

// Variável para armazenar o estado atual da ordenação da tabela
let currentSortColumn = null;
let currentSortDirection = 'asc'; // 'asc' ou 'desc'

// Função para formatar a data para exibição (dd/mm/yyyy)
function formatarData(dataString) {
    const [ano, mes, dia] = dataString.split('-');
    return `${dia}/${mes}/${ano}`;
}

// Função para filtrar transações por período
function filtrarPorPeriodo(transacoesArray, periodo) {
    const hoje = new Date();
    let dataInicio;

    switch (periodo) {
        case 'Todas':
            return transacoesArray;
        case 'Este Mês':
            dataInicio = new Date(hoje.getFullYear(), hoje.getMonth(), 1);
            break;
        case 'Últimos 7 Dias':
            dataInicio = new Date(hoje);
            dataInicio.setDate(hoje.getDate() - 7);
            break;
        case 'Últimos 30 Dias':
            dataInicio = new Date(hoje);
            dataInicio.setDate(hoje.getDate() - 30);
            break;
        case 'Este Ano':
            dataInicio = new Date(hoje.getFullYear(), 0, 1);
            break;
        default:
            return transacoesArray; // Retorna todas se o período não for reconhecido
    }

    dataInicio.setHours(0, 0, 0, 0); // Zera a hora para comparação

    return transacoesArray.filter(transacao => {
        const dataTransacao = new Date(transacao.data + 'T00:00:00'); // Garante que a data seja comparável sem problemas de fuso horário
        return dataTransacao >= dataInicio;
    });
}

// Função para renderizar a tabela de transações
function renderizarTabela(filtroCategoria = 'Todas', filtroPeriodo = 'Todas') {
    const tabelaBody = document.getElementById('tabelaTransacoesBody');
    tabelaBody.innerHTML = ''; // Limpa o conteúdo atual da tabela

    let transacoesFiltradas = transacoes;

    // 1. Aplicar filtro de Categoria
    if (filtroCategoria !== 'Todas') {
        transacoesFiltradas = transacoesFiltradas.filter(transacao => transacao.categoria === filtroCategoria);
    }

    // 2. Aplicar filtro de Período
    transacoesFiltradas = filtrarPorPeriodo(transacoesFiltradas, filtroPeriodo);

    // 3. Aplicar ordenação
    if (currentSortColumn) {
        transacoesFiltradas.sort((a, b) => {
            let valA = a[currentSortColumn];
            let valB = b[currentSortColumn];

            // Conversão específica para ordenação de datas e valores
            if (currentSortColumn === 'data') {
                valA = new Date(valA);
                valB = new Date(valB);
            } else if (currentSortColumn === 'valor') {
                valA = parseFloat(valA);
                valB = parseFloat(valB);
            }

            if (valA < valB) {
                return currentSortDirection === 'asc' ? -1 : 1;
            }
            if (valA > valB) {
                return currentSortDirection === 'asc' ? 1 : -1;
            }
            return 0;
        });
    }

    // Exibir mensagens se não houver transações
    if (transacoesFiltradas.length === 0 && transacoes.length > 0) {
        const row = tabelaBody.insertRow();
        const cell = row.insertCell(0);
        cell.colSpan = 5;
        cell.textContent = `Nenhuma transação encontrada para os filtros selecionados.`;
        cell.style.textAlign = 'center';
        cell.style.padding = '20px';
        return;
    } else if (transacoes.length === 0) {
        const row = tabelaBody.insertRow();
        const cell = row.insertCell(0);
        cell.colSpan = 5;
        cell.textContent = 'Nenhuma transação adicionada ainda.';
        cell.style.textAlign = 'center';
        cell.style.padding = '20px';
        return;
    }

    transacoesFiltradas.forEach((transacao, index) => {
        const novaLinha = tabelaBody.insertRow();

        novaLinha.insertCell().textContent = formatarData(transacao.data);
        novaLinha.insertCell().textContent = transacao.descricao;

        const categoriaCell = novaLinha.insertCell();
        categoriaCell.textContent = transacao.categoria;

        const valorCell = novaLinha.insertCell();
        // ATENÇÃO AQUI: Use a função formatCurrency
        if (transacao.categoria === 'Receita') {
            valorCell.textContent = formatCurrency(transacao.valor);
            categoriaCell.classList.add('receita');
            valorCell.classList.add('receita');
        } else {
            valorCell.textContent = `- ${formatCurrency(transacao.valor)}`;
            categoriaCell.classList.add('despesa');
            valorCell.classList.add('despesa');
        }

        const acoesCell = novaLinha.insertCell();
        acoesCell.classList.add('acoes-transacao');

        const deleteButton = document.createElement('button');
        deleteButton.classList.add('btn-excluir');
        deleteButton.innerHTML = '<span class="material-icons-outlined">delete</span>';
        deleteButton.title = 'Excluir Transação';

        // Armazena a transação inteira no dataset, ou um ID único, para exclusão
        deleteButton.dataset.index = index; // Isso é o index NO ARRAY FILTRADO, não no original.

        deleteButton.addEventListener('click', () => excluirTransacao(transacao)); // Passa o objeto completo
        acoesCell.appendChild(deleteButton);
    });
}

// Função para renderizar os cards de resumo financeiro
function renderizarCards() {
    // Garante que os elementos dos cards sejam selecionados apenas uma vez
    if (!receitasCard) receitasCard = document.querySelector('.card.receita p');
    if (!despesasCard) despesasCard = document.querySelector('.card.despesa p');
    if (!lucroCard) lucroCard = document.querySelector('.card:nth-child(3) p'); // Seleciona o 3º card P
    if (!saldoCard) saldoCard = document.querySelector('.card:nth-child(4) p'); // Seleciona o 4º card P

    let totalReceitas = 0;
    let totalDespesas = 0;

    transacoes.forEach(transacao => {
        if (transacao.categoria === 'Receita') {
            totalReceitas += transacao.valor;
        } else {
            totalDespesas += transacao.valor;
        }
    });

    const lucro = totalReceitas - totalDespesas;
    const saldoAtual = lucro;

    receitasCard.textContent = formatCurrency(totalReceitas);
    despesasCard.textContent = formatCurrency(totalDespesas);
    lucroCard.textContent = formatCurrency(lucro);
    saldoCard.textContent = formatCurrency(saldoAtual);
}

// Função para atualizar o gráfico financeiro
function atualizarGrafico() {
    const meses = ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez'];
    const dadosReceitas = new Array(meses.length).fill(0);
    const dadosDespesas = new Array(meses.length).fill(0);

    transacoes.forEach(transacao => {
        const dataTransacao = new Date(transacao.data + 'T00:00:00'); // Adiciona T00:00:00 para evitar problemas de fuso horário
        const mesIndex = dataTransacao.getMonth(); // 0 = Jan, 1 = Fev, etc.

        if (mesIndex >= 0 && mesIndex < meses.length) { // Garante que o mês seja válido
            if (transacao.categoria === 'Receita') {
                dadosReceitas[mesIndex] += transacao.valor;
            } else {
                dadosDespesas[mesIndex] += transacao.valor;
            }
        }
    });

    // Se o gráfico ainda não foi inicializado, crie-o
    if (!graficoFinanceiro) {
        const ctx = document.getElementById('graficoFinanceiro');
        if (ctx) { // Garante que o canvas existe
            const chartContext = ctx.getContext('2d');
            graficoFinanceiro = new Chart(chartContext, {
                type: 'bar',
                data: {
                    labels: meses,
                    datasets: [
                        {
                            label: 'Receitas',
                            data: dadosReceitas,
                            backgroundColor: 'rgba(56, 142, 60, 0.6)'
                        },
                        {
                            label: 'Despesas',
                            data: dadosDespesas,
                            backgroundColor: 'rgba(211, 47, 47, 0.6)'
                        }
                    ]
                },
                options: {
                    responsive: true,
                    scales: {
                        y: {
                            beginAtZero: true,
                            ticks: {
                                callback: function(value, index, values) {
                                    return formatCurrency(value); // Formata os rótulos do eixo Y
                                }
                            }
                        }
                    },
                     plugins: {
                        tooltip: {
                            callbacks: {
                                label: function(context) {
                                    let label = context.dataset.label || '';
                                    if (label) {
                                        label += ': ';
                                    }
                                    if (context.parsed.y !== null) {
                                        label += formatCurrency(context.parsed.y); // Formata o valor na tooltip
                                    }
                                    return label;
                                }
                            }
                        }
                    }
                }
            });
        }
    } else {
        // Se o gráfico já existe, apenas atualiza os dados
        graficoFinanceiro.data.datasets[0].data = dadosReceitas;
        graficoFinanceiro.data.datasets[1].data = dadosDespesas;
        graficoFinanceiro.update(); // Manda o Chart.js redesenhar o gráfico
    }
}

// Função para salvar as transações no Local Storage
function salvarTransacoes() {
    localStorage.setItem('transacoes', JSON.stringify(transacoes));
}

// Função para carregar as transações do Local Storage
function carregarTransacoes() {
    const transacoesSalvas = localStorage.getItem('transacoes');
    if (transacoesSalvas) {
        transacoes = JSON.parse(transacoesSalvas);
    }
}

// Função principal para inicializar e atualizar a interface
function inicializarFinancas() {
    carregarTransacoes(); // Carrega as transações salvas
    // Ao inicializar, use os valores atuais dos filtros se já estiverem selecionados
    const filtroCategoriaSelect = document.getElementById('filtroCategoria');
    const filtroPeriodoSelect = document.getElementById('filtroPeriodo');
    const categoriaInicial = filtroCategoriaSelect ? filtroCategoriaSelect.value : 'Todas';
    const periodoInicial = filtroPeriodoSelect ? filtroPeriodoSelect.value : 'Todas';

    renderizarTabela(categoriaInicial, periodoInicial); // Renderiza a tabela com os filtros
    renderizarCards(); // Atualiza os cards de resumo
    atualizarGrafico(); // Atualiza o gráfico
}

// Função para exibir o modal de confirmação
function mostrarModalConfirmacao(transacaoObjeto) { // Agora passa o objeto da transação
    transacaoParaExcluir = transacaoObjeto; // Armazena o objeto da transação
    confirmacaoModal.style.display = 'flex';
}

// Função para esconder o modal de confirmação
function esconderModalConfirmacao() {
    confirmacaoModal.style.display = 'none';
    transacaoParaExcluir = null; // Limpa a transação temporária
}

// Event listener para o botão "Sim, Excluir" do modal
btnConfirmarExclusao.addEventListener('click', () => {
    if (transacaoParaExcluir) {
        // Encontra o índice da transação no array original (AGORA COM SEGURANÇA)
        const indexReal = transacoes.findIndex(t =>
            t.data === transacaoParaExcluir.data &&
            t.descricao === transacaoParaExcluir.descricao &&
            t.valor === transacaoParaExcluir.valor &&
            t.categoria === transacaoParaExcluir.categoria
        );

        if (indexReal !== -1) { // Garante que a transação foi encontrada
            window.historicoModule.adicionarAoHistorico(transacaoParaExcluir);
            transacoes.splice(indexReal, 1);
            salvarTransacoes();
            const filtroCategoriaSelect = document.getElementById('filtroCategoria');
            const filtroPeriodoSelect = document.getElementById('filtroPeriodo');
            renderizarTabela(
                filtroCategoriaSelect ? filtroCategoriaSelect.value : 'Todas',
                filtroPeriodoSelect ? filtroPeriodoSelect.value : 'Todas'
            ); // Re-renderiza com os filtros atuais
            renderizarCards();
            atualizarGrafico();
        }
    }
    esconderModalConfirmacao();
});

// Event listener para o botão "Não, Cancelar" do modal
btnCancelarExclusao.addEventListener('click', () => {
    esconderModalConfirmacao();
});

// Event listener para fechar o modal clicando fora dele (no overlay)
confirmacaoModal.addEventListener('click', (event) => {
    // Se o clique foi no overlay e não no conteúdo do modal
    if (event.target === confirmacaoModal) {
        esconderModalConfirmacao();
    }
});


// Função para excluir uma transação (modificada para usar o modal)
function excluirTransacao(transacaoObjeto) {
    mostrarModalConfirmacao(transacaoObjeto);
}


// Event Listener para o formulário de adição de transação e filtros
document.addEventListener('DOMContentLoaded', () => {
    inicializarFinancas();

    const formTransacao = document.getElementById('formTransacao');
    if (formTransacao) {
        formTransacao.addEventListener('submit', function (e) {
            e.preventDefault();

            const dataInput = document.getElementById('data');
            const descricaoInput = document.getElementById('descricao');
            const valorInput = document.getElementById('valor');
            const categoriaSelect = document.getElementById('categoria');

            const novaTransacao = {
                data: dataInput.value,
                descricao: descricaoInput.value,
                valor: parseFloat(valorInput.value),
                categoria: categoriaSelect.value
            };

            transacoes.push(novaTransacao);
            salvarTransacoes();

            // Ao adicionar, re-renderiza com os filtros atuais
            const filtroCategoriaSelect = document.getElementById('filtroCategoria');
            const filtroPeriodoSelect = document.getElementById('filtroPeriodo');
            renderizarTabela(
                filtroCategoriaSelect ? filtroCategoriaSelect.value : 'Todas',
                filtroPeriodoSelect ? filtroPeriodoSelect.value : 'Todas'
            );
            renderizarCards();
            atualizarGrafico();

            formTransacao.reset();
        });
    }

    // Event listener para o filtro de categoria
    const filtroCategoriaSelect = document.getElementById('filtroCategoria');
    if (filtroCategoriaSelect) {
        filtroCategoriaSelect.addEventListener('change', () => {
            const categoriaSelecionada = filtroCategoriaSelect.value;
            const filtroPeriodoSelect = document.getElementById('filtroPeriodo');
            const periodoSelecionado = filtroPeriodoSelect ? filtroPeriodoSelect.value : 'Todas';
            renderizarTabela(categoriaSelecionada, periodoSelecionado); // Re-renderiza a tabela com o filtro
        });
    }

    // Event listener para o filtro de período
    const filtroPeriodoSelect = document.getElementById('filtroPeriodo');
    if (filtroPeriodoSelect) {
        filtroPeriodoSelect.addEventListener('change', () => {
            const periodoSelecionado = filtroPeriodoSelect.value;
            const filtroCategoriaSelect = document.getElementById('filtroCategoria');
            const categoriaSelecionada = filtroCategoriaSelect ? filtroCategoriaSelect.value : 'Todas';
            renderizarTabela(categoriaSelecionada, periodoSelecionado); // Re-renderiza a tabela com o filtro
        });
    }

    // Event listeners para ordenação da tabela
    document.querySelectorAll('.transactions table th[data-sort-column]').forEach(header => {
        header.addEventListener('click', (event) => {
            const column = event.currentTarget.dataset.sortColumn;
            if (currentSortColumn === column) {
                currentSortDirection = currentSortDirection === 'asc' ? 'desc' : 'asc';
            } else {
                currentSortColumn = column;
                currentSortDirection = 'asc';
            }
            // Remove a seta de ordenação de todos os outros cabeçalhos
            document.querySelectorAll('.transactions table th .sort-arrow').forEach(arrow => {
                arrow.remove();
            });
            // Adiciona a seta de ordenação ao cabeçalho clicado
            const sortArrow = document.createElement('span');
            sortArrow.classList.add('sort-arrow');
            sortArrow.textContent = currentSortDirection === 'asc' ? ' ▲' : ' ▼';
            event.currentTarget.appendChild(sortArrow);

            // Re-renderiza a tabela com a nova ordenação
            const filtroCategoriaSelect = document.getElementById('filtroCategoria');
            const filtroPeriodoSelect = document.getElementById('filtroPeriodo');
            renderizarTabela(
                filtroCategoriaSelect ? filtroCategoriaSelect.value : 'Todas',
                filtroPeriodoSelect ? filtroPeriodoSelect.value : 'Todas'
            );
        });
    });
});

// =================================================================
// MÓDULO DE HISTÓRICO DE TRANSAÇÕES (CÓDIGO COMPLEMENTAR)
// =================================================================

// Adiciona um namespace global para o módulo para garantir o desacoplamento.
window.historicoModule = {};

document.addEventListener('DOMContentLoaded', () => {

    // --- Variáveis e Referências do DOM ---
    let historicoTransacoes = [];
    const historicoModal = document.getElementById('historicoModal');
    const btnAbrirHistorico = document.getElementById('btnAbrirHistorico');
    const btnFecharHistorico = document.getElementById('btnFecharHistorico');
    const tabelaHistoricoBody = document.getElementById('tabelaHistoricoBody');

    // --- Funções Principais ---

    /**
     * Carrega o histórico de transações do localStorage.
     */
    function carregarHistorico() {
        const historicoSalvo = localStorage.getItem('historicoTransacoes');
        if (historicoSalvo) {
            historicoTransacoes = JSON.parse(historicoSalvo);
        }
    }

    /**
     * Salva o array do histórico de transações no localStorage.
     */
    function salvarHistorico() {
        localStorage.setItem('historicoTransacoes', JSON.stringify(historicoTransacoes));
    }

    /**
     * Adiciona uma transação ao histórico e salva.
     * @param {object} transacao - O objeto da transação a ser arquivado.
     */
    function adicionarAoHistorico(transacao) {
        // Cria uma cópia para não alterar o objeto original antes da exclusão
        const transacaoArquivada = JSON.parse(JSON.stringify(transacao));
        historicoTransacoes.unshift(transacaoArquivada); // Adiciona no início para ver os mais recentes primeiro
        salvarHistorico();
    }

    /**
     * Renderiza a tabela de transações no modal de histórico.
     */
    function renderizarHistorico() {
        tabelaHistoricoBody.innerHTML = ''; // Limpa a tabela

        if (historicoTransacoes.length === 0) {
            const row = tabelaHistoricoBody.insertRow();
            const cell = row.insertCell(0);
            cell.colSpan = 5;
            cell.textContent = 'Nenhuma transação no histórico.';
            cell.style.textAlign = 'center';
            cell.style.padding = '20px';
            return;
        }

        historicoTransacoes.forEach((transacao, index) => {
            const novaLinha = tabelaHistoricoBody.insertRow();

            novaLinha.insertCell().textContent = formatarData(transacao.data); // Reutiliza função global
            novaLinha.insertCell().textContent = transacao.descricao;

            const categoriaCell = novaLinha.insertCell();
            categoriaCell.textContent = transacao.categoria;

            const valorCell = novaLinha.insertCell();
            if (transacao.categoria === 'Receita') {
                valorCell.textContent = formatCurrency(transacao.valor); // Reutiliza função global
                categoriaCell.classList.add('receita');
                valorCell.classList.add('receita');
            } else {
                valorCell.textContent = `- ${formatCurrency(transacao.valor)}`;
                categoriaCell.classList.add('despesa');
                valorCell.classList.add('despesa');
            }

            const acoesCell = novaLinha.insertCell();
            acoesCell.classList.add('acoes-transacao');

            // Botão Restaurar
            const btnRestaurar = document.createElement('button');
            btnRestaurar.innerHTML = '<span class="material-icons-outlined">restore</span>';
            btnRestaurar.title = 'Restaurar Transação';
            btnRestaurar.classList.add('btn-restaurar');
            btnRestaurar.onclick = () => restaurarTransacao(index);
            acoesCell.appendChild(btnRestaurar);

            // Botão Excluir Permanentemente
            const btnExcluirPerm = document.createElement('button');
            btnExcluirPerm.innerHTML = '<span class="material-icons-outlined">delete_forever</span>';
            btnExcluirPerm.title = 'Excluir Permanentemente';
            btnExcluirPerm.classList.add('btn-excluir-perm');
            btnExcluirPerm.onclick = () => excluirPermanentemente(index);
            acoesCell.appendChild(btnExcluirPerm);
        });
    }

    /**
     * Restaura uma transação do histórico para a lista principal.
     * @param {number} index - O índice da transação no array de histórico.
     */
    function restaurarTransacao(index) {
        const [transacaoRestaurada] = historicoTransacoes.splice(index, 1);

        transacoes.push(transacaoRestaurada); // Acessa variável global

        salvarHistorico();
        salvarTransacoes(); // Função global existente

        renderizarHistorico();

        const filtroCategoriaSelect = document.getElementById('filtroCategoria');
        const filtroPeriodoSelect = document.getElementById('filtroPeriodo');
        renderizarTabela(filtroCategoriaSelect.value, filtroPeriodoSelect.value); // Função global
        renderizarCards(); // Função global
        atualizarGrafico(); // Função global
    }

    /**
     * Exclui uma transação permanentemente do histórico.
     * @param {number} index - O índice da transação no array de histórico.
     */
    function excluirPermanentemente(index) {
        if (confirm('Tem certeza que deseja excluir esta transação permanentemente? Esta ação não pode ser desfeita.')) {
            historicoTransacoes.splice(index, 1);
            salvarHistorico();
            renderizarHistorico();
        }
    }

    // --- Event Listeners do Modal ---
    if (btnAbrirHistorico) {
        btnAbrirHistorico.addEventListener('click', () => {
            renderizarHistorico();
            historicoModal.style.display = 'flex';
        });
    }

    if (btnFecharHistorico) {
        btnFecharHistorico.addEventListener('click', () => {
            historicoModal.style.display = 'none';
        });
    }

    if (historicoModal) {
        historicoModal.addEventListener('click', (event) => {
            if (event.target === historicoModal) {
                historicoModal.style.display = 'none';
            }
        });
    }

    // --- Inicialização e Exportação ---
    carregarHistorico();
    window.historicoModule.adicionarAoHistorico = adicionarAoHistorico;
});