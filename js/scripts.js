// SIDEBAR

var sidebarOpen = false;
var sidebar = document.getElementById("sidebar");

function openSidebar() {
    if(!sidebarOpen) {
        sidebar.classList.add("sidebar-responsive");
        sidebarOpen = true
    }
}

function closeSidebar () {
    if(sidebarOpen) {
        sidebar.classList.remove("sidebar-responsive");
        sidebarOpen = false;
    }
}

document.querySelectorAll(".sidebar-list-item").forEach(item => {
    item.addEventListener("click", function(event) {
        // Impede que o clique se propague para elementos pais, como o <body>
        // isso é importante se você tiver lógica de fechar menus ao clicar fora.
        event.stopPropagation(); 

        // Tenta encontrar um ID que indique a página de destino
        const itemId = this.id; // Pega o ID do item clicado

        // Remove a classe 'active' de todos os itens antes de adicionar ao atual
        document.querySelectorAll(".sidebar-list-item").forEach(li => {
            if (li !== this) { // Não remove do item que foi clicado
                li.classList.remove("active");
            }
        });
        
        // Adiciona/remove a classe 'active' para o item clicado (para expandir sub-listas se houver)
        this.classList.toggle("active"); 

        // Lógica de navegação baseada no ID do item
        let paginaDestino = null;

        switch (itemId) {
            case 'lista-projetos':
                paginaDestino = 'index.html'; // Altere para o nome real do arquivo
                break;
            case 'lista-tarefas':
                paginaDestino = 'tarefas.html'; // Altere para o nome real do arquivo
                break;
            case 'lista-equipes':
                paginaDestino = 'equipes.html'; // Altere para o nome real do arquivo
                break;
            case 'lista-financa':
                paginaDestino = 'financa.html'; // Este é o arquivo atual, pode ser redundante redirecionar para ele mesmo
                break;
            case 'lista-mensagem':
                paginaDestino = 'comunicar.html'; // Seu arquivo de comunicação
                break;
            case 'lista-dados':
                paginaDestino = 'dados.html'; // Altere para o nome real do arquivo
                break;
            case 'lista-inovar':
                paginaDestino = 'inovar.html'; // Altere para o nome real do arquivo
                break;
            case 'lista-riscos':
                paginaDestino = 'riscos.html'; // Altere para o nome real do arquivo
                break;
            case 'lista-performance':
                paginaDestino = 'performance.html'; // Altere para o nome real do arquivo
                break;
            case 'lista-integrar':
                paginaDestino = 'integrar.html'; // Altere para o nome real do arquivo
                break;
            // Adicione mais casos conforme necessário para outros itens da sidebar
            default:
                // Se o ID não corresponder a nenhuma página, não faz nada ou loga um erro
                console.warn('Página de destino não definida para:', itemId);
                break;
        }

        // Se uma página de destino foi encontrada, redireciona
        if (paginaDestino && window.location.pathname.split('/').pop() !== paginaDestino) {
             window.location.href = paginaDestino;
        }

        // Se você tiver um menu lateral que fecha automaticamente após a navegação
        // closeSidebar(); // Descomente esta linha se desejar
    });
});

  // ID's das páginas e seus endereços
  // Ou seja, o script olha o ID que o referente chamou, se bater
  // Ele chama a função e leva para a página desejada
  // Usei essa function para excluir o efeito de Hiperlink que aparecia usando <a href>
  // Também para facilitar a distinção de cada menu, separei os itens por categoria.

  // Index //
  navPagina('ch-planejamento', '/../child-pages/index/planejamento.php');
  navPagina('ch-execucao', '/DashboardGuto/child-pages/index/execucao.php');
  navPagina('ch-monitoramento', '/DashboardGuto/child-pages/index/monitoramento.php');
  navPagina('ch-fechamento', '/DashboardGuto/child-pages/index/fechamento.html');
 
  // Tarefas //
  navPagina('ch-gtarefas', '/../child-pages/tarefas/gtarefas.html');
  navPagina('ch-priorizacao', '/../child-pages/tarefas/priorizacao.html');
  navPagina('ch-astatus', '/DashboardGuto/child-pages/tarefas/astatus.html');
  navPagina('ch-afluxos', '/DashboardGuto/child-pages/tarefas/afluxos.html');

  // Equipes //
  navPagina('ch-gequipes', '/DashboardGuto/child-pages/equipes/gequipes.html');
  navPagina('ch-afuncoes', '/DashboardGuto/child-pages/equipes/afuncoes.html');
  navPagina('ch-devpessoas', '/DashboardGuto/child-pages/equipes/devpessoas.html');
  navPagina('ch-adesempenho', '/DashboardGuto/child-pages/equipes/adesempenho.html');
  
  // Finanças //
  navPagina('ch-orcamento', '/child-pages/financas/orcamento.html');
  navPagina('ch-ccustos', '/child-pages/financas/ccustos.html');
  navPagina('ch-preceita', '/child-pages/financas/preceita.html');
  navPagina('ch-fcaixa', '/child-pages/financas/fcaixa.html');
  
  // Comunicação //
  navPagina('ch-cominterna', '/child-pages/comunicar/cominterna.html');
  navPagina('ch-notificacao', '/child-pages/comunicar/notificacao.html');
  navPagina('ch-colaboracao', '/child-pages/comunicar/colaboracao.html');
  navPagina('ch-reunioes', '/child-pages/comunicar/reunioes.html');

  // Dados //
  navPagina('ch-coldados', '/child-pages/dados/coldados.html');
  navPagina('ch-adados', '/child-pages/dados/adados.html');
  navPagina('ch-drelatorios', '/child-pages/dados/drelatorios.html');
  navPagina('ch-armdados', '/child-pages/dados/armdados.html');

  // Inovação //
  navPagina('ch-pdev', '/child-pages/inovar/pdev.html');
  navPagina('ch-feedback', '/child-pages/inovar/feedback.html');
  navPagina('ch-melhoriac', '/child-pages/inovar/melhoriac.html');
  navPagina('ch-impideias', '/child-pages/inovar/impideias.html');

  // Riscos //
  navPagina('ch-ariscos', '/child-pages/riscos/ariscos.html');
  navPagina('ch-compliance', '/child-pages/riscos/compliance.html');
  navPagina('ch-monconform', '/child-pages/riscos/monconform.html');
  navPagina('ch-pcontingencia', '/child-pages/riscos/pcontingencia.html');

  // Performance //
  navPagina('ch-kpi', '/child-pages/performance/kpi.html');
  navPagina('ch-andesempenho', '/child-pages/performance/andesempenho.html');
  navPagina('ch-ajustestrategia', '/child-pages/performance/ajustestrategia.html');
  navPagina('ch-relresult', '/child-pages/performance/relresult.html');

  // Integração //
  navPagina('ch-intsistemas', '/child-pages/integrar/intsistemas.html');
  navPagina('ch-acessomovel', '/child-pages/integrar/acessomovel.html');
  navPagina('ch-acessoseguro', '/child-pages/integrar/acessoseguro.html');
  navPagina('ch-autoprocesso', '/child-pages/integrar/autoprocesso.html');