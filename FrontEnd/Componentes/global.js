document.addEventListener("DOMContentLoaded", async () => {
    try {
        // Carrega o Header
        const headerResponse = await fetch("../Componentes/header.html");
        if (headerResponse.ok) {
            document.getElementById("header-container").innerHTML = await headerResponse.text();
        }

        // Carrega o Footer
        const footerResponse = await fetch("../Componentes/footer.html");
        if (footerResponse.ok) {
            document.getElementById("footer-container").innerHTML = await footerResponse.text();
        }

        // --- VALIDAÇÃO DE SEGURANÇA (LOGIN FANTASMA) ---
        await verificarSessao();
        // ------------------------------------------------

        // Atualiza a Navbar com os dados do usuário e os ícones
        atualizarNavbar();
        atualizarBadgeNotificacoes();
    } catch (error) {
        console.error("Erro ao carregar componentes globais:", error);
    }
});

// Função adicionada para matar o Login Fantasma
async function verificarSessao() {
    const usuarioStr = localStorage.getItem('usuarioAtual');
    const token = localStorage.getItem('authToken');

    if (!usuarioStr || !token) return;

    try {
        const usuario = JSON.parse(usuarioStr);
        // Tenta buscar o usuário no banco para ver se ele ainda existe
        const response = await fetch(`http://localhost:8080/api/usuarios/buscar/${usuario.nome}`, {
            headers: { 'Authorization': `Bearer ${token}` }
        });

        // Se o servidor retornar erro, o usuário não existe mais no banco
        if (!response.ok) {
            console.log("Conta não encontrada no servidor, limpando...");
            localStorage.clear();
            window.location.reload(); 
        }
    } catch (e) {
        console.error("Erro ao validar sessão");
    }
}

// =========================================
// FUNÇÃO CENTRAL DA NAVBAR
// =========================================
function atualizarNavbar() {
    const usuarioStr = localStorage.getItem('usuarioAtual');
    let usuario = {};
    
    try {
        if(usuarioStr) usuario = JSON.parse(usuarioStr);
    } catch (e) { console.log('Erro ao ler usuário.'); }

    const menuUsuario = document.getElementById('usuarioMenu');
    const grupoIcones = document.getElementById('grupo-icones'); 

    if (!menuUsuario) return;

    if (usuario && usuario.nome) {
        // 🔥 USUÁRIO ESTÁ LOGADO
        menuUsuario.innerHTML = `
            <div class="user-dropdown">
                <span class="user-name">${usuario.nome}</span>
                <div class="dropdown-content">
                    <a href="../perfil/perfil.html">Perfil</a>
                    <a href="#" onclick="fazerLogoutGlobal(event)">Logout</a>
                </div>
            </div>
        `;
        
        if (grupoIcones) {
            grupoIcones.style.display = 'flex';
            atualizarBadgeCarrinho();
            atualizarBadgeNotificacoes();
        }
    } else {
        // 👻 É UM VISITANTE DESLOGADO
        menuUsuario.innerHTML = `
            <a href="../login/login.html">Login</a>
        `;
        
        if (grupoIcones) {
            grupoIcones.style.display = 'none';
        }
    }
}

function atualizarBadgeNotificacoes() {

    const notificacoes =
        JSON.parse(
            localStorage.getItem('notificacoes_gamelibrary')
        ) || [];

    const badge =
        document.querySelector(
            '#btn-notificacoes .badge-notificacao'
        );

    if (!badge) return;

    const naoLidas =
        notificacoes.filter(n => !n.lida).length;

    badge.textContent = naoLidas;

    badge.style.display =
        naoLidas > 0 ? 'flex' : 'none';
}

// =========================================
// SISTEMA GLOBAL DE CARRINHO
// =========================================
function atualizarBadgeCarrinho() {
    let carrinho = JSON.parse(localStorage.getItem('carrinho_gamelibrary')) || [];
    let badge = document.getElementById('carrinho-contador');
    
    if (badge) {
        badge.textContent = carrinho.length;
        
        if (carrinho.length === 0) {
            badge.style.display = 'none';
        } else {
            badge.style.display = 'flex';
        }
    }
}

// =========================================
// LOGOUT GLOBAL
// =========================================
function fazerLogoutGlobal(event) {
    if (event) event.preventDefault();

    const popupLogout = document.getElementById('popupLogout');
    
    localStorage.removeItem('authToken');
    localStorage.removeItem('usuarioAtual');
    localStorage.removeItem('usuarioNome');
    localStorage.removeItem('usuarioId');
    
    if (popupLogout) {
        popupLogout.classList.remove('esconder');
        
        setTimeout(() => {
            window.location.href = '../login/login.html';
        }, 1500);
    } else {
        window.location.href = '../login/login.html';
    }
}

document.addEventListener('click', (e) => {

    const btnNotif =
        e.target.closest('#btn-notificacoes');

    if (!btnNotif) return;

    e.preventDefault();

    window.location.href =
        '../perfil/perfil.html?aba=notificacoes-aba';
});

document.addEventListener('click', (e) => {

    const btnfavo =
        e.target.closest('#btn-favoritos');

    if (!btnfavo) return;

    e.preventDefault();

    window.location.href =
        '../perfil/perfil.html?aba=favoritados';
});