document.addEventListener('DOMContentLoaded', () => {
    
    const formRecuperar = document.getElementById('formRecuperar');
    const popup = document.getElementById('popupRecuperacao');
    const popupMensagem = document.getElementById('popupMensagem');
    const btnFecharPopup = document.getElementById('btnFecharPopup');

    formRecuperar?.addEventListener('submit', (event) => {
        event.preventDefault();

        const email = document.getElementById('emailRecuperar').value;

        // Monta a mensagem injetando o e-mail digitado
        popupMensagem.innerHTML = `Um link de recuperação foi enviado para:<br><br><strong>${email}</strong><br><br>Verifique sua caixa de entrada e a pasta de spam.`;

        // Remove a classe "esconder" para mostrar o pop-up com a animação
        popup.classList.remove('esconder');
    });

    // Quando o usuário clicar em "Entendi", redireciona para o login
    btnFecharPopup?.addEventListener('click', () => {
        window.location.href = '../login/login.html';
    });
});