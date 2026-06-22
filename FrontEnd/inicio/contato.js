document.addEventListener('DOMContentLoaded', () => {
    const formContato = document.getElementById('formContato');
    const popupContato = document.getElementById('popupContato');
    const btnFecharContato = document.getElementById('btnFecharContato');
    const btnEnviar = document.getElementById('btnEnviarContato');

    if (formContato) {
        formContato.addEventListener('submit', (event) => {
            event.preventDefault(); // Impede o F5 automático do formulário

            // Captura o texto original do botão para voltar depois
            const textoOriginal = btnEnviar.textContent;
            
            // Trava o botão para o usuário não clicar duas vezes
            btnEnviar.disabled = true;
            btnEnviar.textContent = 'Enviando...';

            // Simulando um tempo de requisição de 1 segundo (futuramente você substitui pelo fetch da API)
            setTimeout(() => {
                // Limpa todos os campos do formulário
                formContato.reset();

                // Destrava e restaura o botão
                btnEnviar.disabled = false;
                btnEnviar.textContent = textoOriginal;

                // Mostra o pop-up de sucesso!
                popupContato.classList.remove('esconder');
            }, 1000);
        });
    }

    // Fecha o pop-up e volta pra tela normal quando clica em "Entendi"
    if (btnFecharContato) {
        btnFecharContato.addEventListener('click', () => {
            popupContato.classList.add('esconder');
        });
    }
});