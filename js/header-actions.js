// js/header-actions.js


document.addEventListener('DOMContentLoaded', () => {
    // 1. Carregar preferência de tema do Local Storage
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'dark') {
        document.body.classList.add('dark-mode');
    }
    // O texto/ícone do slider será ajustado quando o dropdown for aberto.

    // 2. Elementos dos ícones do header
    const notificationsIcon = document.querySelector('.header-right .material-icons-outlined:nth-child(1)');
    const emailIcon = document.querySelector('.header-right .material-icons-outlined:nth-child(2)');
    const accountIcon = document.querySelector('.header-right .material-icons-outlined:nth-child(3)');

    // 3. Criação dos elementos dropdown (balões flutuantes)
    function createDropdown(id) {
        const dropdown = document.createElement('div');
        dropdown.id = id;
        dropdown.classList.add('dropdown-menu');
        document.body.appendChild(dropdown);
        return dropdown;
    }

    const notificationsDropdown = createDropdown('notificationsDropdown');
    const emailDropdown = createDropdown('emailDropdown');
    const accountDropdown = createDropdown('accountDropdown');

    // 4. Função para fechar todos os dropdowns abertos
    function closeAllDropdowns() {
        document.querySelectorAll('.dropdown-menu').forEach(dropdown => {
            dropdown.style.display = 'none';
        });
    }

    // 5. Lógica para o Dropdown de Notificações
    if (notificationsIcon) {
        notificationsIcon.addEventListener('click', (event) => {
            event.stopPropagation();
            closeAllDropdowns();
            notificationsDropdown.innerHTML = `
                <h4>Notificações</h4>
                <div class="dropdown-content">
                    <p>Nenhuma notificação nova.</p>
                    <p><span>•</span> Pagamento da fatura de internet.</p>
                    <p><span>•</span> Projeto "OrganiZATION" atingiu 80% do prazo.</p>
                    <p><span>•</span> Nova mensagem de suporte.</p>
                    </div>
                <div class="dropdown-actions">
                    <button id="viewAllNotifications">Ver Todas</button>
                    <button id="clearNotifications">Limpar</button>
                </div>
            `;
            notificationsDropdown.style.display = 'block';

            const iconRect = notificationsIcon.getBoundingClientRect();
            notificationsDropdown.style.top = `${iconRect.bottom + 5}px`;
            notificationsDropdown.style.left = `${iconRect.left - notificationsDropdown.offsetWidth + notificationsIcon.offsetWidth}px`;
            notificationsDropdown.style.right = 'auto';

            document.getElementById('viewAllNotifications').addEventListener('click', () => {
                alert('Redirecionando para a página de todas as notificações...');
                window.location.href = '#';
                closeAllDropdowns();
            });

            document.getElementById('clearNotifications').addEventListener('click', () => {
                const content = notificationsDropdown.querySelector('.dropdown-content');
                content.innerHTML = '<p>Todas as notificações limpas.</p>';
            });
        });
    }

    // 6. Lógica para o Dropdown de Emails
    if (emailIcon) {
        emailIcon.addEventListener('click', (event) => {
            event.stopPropagation();
            closeAllDropdowns();
            emailDropdown.innerHTML = `
                <h4>Mensagens</h4>
                <div class="dropdown-content">
                    <p>Você tem 2 mensagens não lidas.</p>
                    <p><span>•</span> Reunião sobre o novo projeto.</p>
                    <p><span>•</span> Solicitação de feedback de Juliano.</p>
                </div>
                <div class="dropdown-actions">
                    <button id="viewAllEmails">Ver Todos</button>
                    <button id="clearEmails">Limpar Chats</button>
                </div>
            `;
            emailDropdown.style.display = 'block';

            const iconRect = emailIcon.getBoundingClientRect();
            emailDropdown.style.top = `${iconRect.bottom + 5}px`;
            emailDropdown.style.left = `${iconRect.left - emailDropdown.offsetWidth + emailIcon.offsetWidth}px`;
            emailDropdown.style.right = 'auto';

            document.getElementById('viewAllEmails').addEventListener('click', () => {
                alert('Redirecionando para a página de comunicação...');
                window.location.href = 'comunicacao.html';
                closeAllDropdowns();
            });

            document.getElementById('clearEmails').addEventListener('click', () => {
                const content = emailDropdown.querySelector('.dropdown-content');
                content.innerHTML = '<p>Todos os chats marcados como lidos e limpos.</p>';
            });
        });
    }

    // 7. Lógica para o Dropdown de Perfil
    if (accountIcon) {
        accountIcon.addEventListener('click', (event) => {
            event.stopPropagation();
            closeAllDropdowns();

            // Determina o estado inicial do slider e texto/ícones
            const isDarkModeOnLoad = document.body.classList.contains('dark-mode');
            const toggleText = isDarkModeOnLoad ? 'Modo Claro' : 'Modo Escuro';
            const lightIconDisplay = isDarkModeOnLoad ? 'inline-block' : 'none';
            const darkIconDisplay = isDarkModeOnLoad ? 'none' : 'inline-block';
            const inputChecked = isDarkModeOnLoad ? 'checked' : '';


            accountDropdown.innerHTML = `
                <h4>Perfil do Usuário</h4>
                <div class="profile-header">
                    <img src="img/meu-perfil.jpg" alt="Foto de Perfil" class="profile-pic">
                    <p><strong>Nome do Usuário</strong></p>
                    <p style="font-size: 0.8em; color: #666;">usuario@example.com</p>
                </div>
                <div class="dropdown-content">
                    <button class="profile-option" id="editUser">
                        <span class="material-icons-outlined">edit</span> Editar Usuário
                    </button>
                    <button class="profile-option" id="options">
                        <span class="material-icons-outlined">settings</span> Opções
                    </button>

                    <label class="toggle-switch">
                        <input type="checkbox" id="darkModeToggleInput" ${inputChecked}>
                        <span class="material-icons-outlined light-icon" style="display:${lightIconDisplay};">light_mode</span>
                        <span class="material-icons-outlined dark-icon" style="display:${darkIconDisplay};">dark_mode</span>
                        <span class="toggle-text">${toggleText}</span>
                    </label>

                    <button class="profile-option logout" id="logout">
                        <span class="material-icons-outlined">logout</span> Sair
                    </button>
                </div>
            `;
            accountDropdown.style.display = 'block';

            // Posiciona o dropdown
            const iconRect = accountIcon.getBoundingClientRect();
            accountDropdown.style.top = `${iconRect.bottom + 5}px`;
            accountDropdown.style.left = `${iconRect.left - accountDropdown.offsetWidth + accountIcon.offsetWidth}px`;
            accountDropdown.style.right = 'auto';

            // Lógica para o Toggle Slider
            const darkModeToggleInput = document.getElementById('darkModeToggleInput');
            const toggleTextSpan = accountDropdown.querySelector('.toggle-text');
            const lightIcon = accountDropdown.querySelector('.light-icon');
            const darkIcon = accountDropdown.querySelector('.dark-icon');

            darkModeToggleInput.addEventListener('change', () => {
                document.body.classList.toggle('dark-mode');
                const isDarkMode = document.body.classList.contains('dark-mode');

                if (isDarkMode) {
                    localStorage.setItem('theme', 'dark');
                    toggleTextSpan.textContent = 'Modo Claro';
                    lightIcon.style.display = 'inline-block';
                    darkIcon.style.display = 'none';
                } else {
                    localStorage.setItem('theme', 'light');
                    toggleTextSpan.textContent = 'Modo Escuro';
                    lightIcon.style.display = 'none';
                    darkIcon.style.display = 'inline-block';
                }
                closeAllDropdowns(); // Fecha o dropdown após a troca de tema
            });

            // Adiciona listeners para os outros botões internos
            document.getElementById('editUser').addEventListener('click', () => {
                alert('Redirecionando para Editar Usuário...');
                window.location.href = '#';
                closeAllDropdowns();
            });

            document.getElementById('options').addEventListener('click', () => {
                alert('Redirecionando para Opções...');
                window.location.href = '#';
                closeAllDropdowns();
            });

            document.getElementById('logout').addEventListener('click', () => {
                alert('Realizando logout...');
                window.location.href = '#'; // Altere para /logout.php quando tiver PHP
                closeAllDropdowns();
            });
        });
    }

    // 8. Fechar dropdowns ao clicar fora deles
    document.body.addEventListener('click', (event) => {
        if (!event.target.closest('.header-right span') && !event.target.closest('.dropdown-menu')) {
            closeAllDropdowns();
        }
    });
});