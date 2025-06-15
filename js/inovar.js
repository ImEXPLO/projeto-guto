document.addEventListener('DOMContentLoaded', () => {

    // --- SEÇÃO DO CALENDÁRIO DE LANÇAMENTOS ---
    const calendarioContainer = document.getElementById('calendario-widget');
    if (calendarioContainer) {
        const mesAnoEl = document.createElement('div');
        mesAnoEl.id = 'mes-ano';
        mesAnoEl.className = 'calendario-header';

        const calendarioGrid = document.createElement('div');
        calendarioGrid.className = 'calendario-grid';

        const listaEventosEl = document.createElement('div');
        listaEventosEl.id = 'calendario-eventos-lista';
        
        calendarioContainer.append(mesAnoEl, calendarioGrid, listaEventosEl);

        const eventos = {
            6: { 15: "Beta do painel de indicadores" }, // Julho (mês 6)
            7: { 10: "Integração com app mobile" },     // Agosto (mês 7)
            8: { 20: "Testes com login biométrico" }     // Setembro (mês 8)
        };

        const hoje = new Date();
        let mesAtual = hoje.getMonth();
        let anoAtual = hoje.getFullYear();

        function renderizarCalendario(mes, ano) {
            mesAnoEl.innerHTML = `<span>${new Date(ano, mes).toLocaleString('pt-BR', { month: 'long', year: 'numeric' })}</span>`;
            calendarioGrid.innerHTML = '';
            listaEventosEl.innerHTML = '';

            // Adiciona dias da semana
            ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'].forEach(dia => {
                calendarioGrid.innerHTML += `<div class="dia-semana">${dia}</div>`;
            });

            const primeiroDiaDoMes = new Date(ano, mes, 1).getDay();
            const diasNoMes = new Date(ano, mes + 1, 0).getDate();

            // Preenche dias vazios do início
            for (let i = 0; i < primeiroDiaDoMes; i++) {
                calendarioGrid.innerHTML += `<div></div>`;
            }

            // Preenche os dias do mês
            for (let dia = 1; dia <= diasNoMes; dia++) {
                const diaEl = document.createElement('div');
                diaEl.className = 'dia';
                diaEl.textContent = dia;

                if (dia === hoje.getDate() && mes === hoje.getMonth() && ano === hoje.getFullYear()) {
                    diaEl.classList.add('dia-hoje');
                }
                
                if (eventos[mes] && eventos[mes][dia]) {
                    diaEl.classList.add('dia-evento');
                    diaEl.title = eventos[mes][dia];
                    listaEventosEl.innerHTML += `<p><strong>Dia ${dia}:</strong> ${eventos[mes][dia]}</p>`;
                }
                
                calendarioGrid.appendChild(diaEl);
            }
        }
        renderizarCalendario(mesAtual, anoAtual);
    }


    // --- SEÇÃO DO FORMULÁRIO DE IDEIAS ---
    const formIdeia = document.getElementById('form-ideia');
    if (formIdeia) {
        formIdeia.addEventListener('submit', (e) => {
            e.preventDefault();

            const ideia = {
                nome: document.getElementById('nome-servidor').value,
                setor: document.getElementById('setor-servidor').value,
                descricao: document.getElementById('descricao-ideia').value,
                dataEnvio: new Date().toISOString()
            };

            // Simula o envio salvando no localStorage
            let ideiasSalvas = JSON.parse(localStorage.getItem('ideiasInovacao')) || [];
            ideiasSalvas.push(ideia);
            localStorage.setItem('ideiasInovacao', JSON.stringify(ideiasSalvas));

            // Log para confirmar que funcionou
            console.log('Ideia enviada com sucesso:', ideia);
            
            // Limpa o formulário e dá um feedback ao usuário
            alert('Obrigado! Sua ideia foi enviada para análise.');
            formIdeia.reset();
        });
    }
});
