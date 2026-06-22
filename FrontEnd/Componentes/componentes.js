document.addEventListener("DOMContentLoaded", async () => {

    const header = await fetch("../Componentes/header.html");
    document.getElementById("header-container").innerHTML = await header.text();

    const footer = await fetch("../Componentes/footer.html");
    document.getElementById("footer-container").innerHTML = await footer.text();

    if (typeof atualizarNavbar === 'function') {
        atualizarNavbar();
    }
});

// =========================================
// SISTEMA GLOBAL DE CARRINHO E NOTIFICAÇÕES
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