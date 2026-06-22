console.log('Login.js (com Fetch direto e Pop-ups)');

const formLogin = document.querySelector('form');
const emailInput = document.getElementById('emailLogin');
const senhaInput = document.getElementById('senhaLogin');
const botaoLogin = document.querySelector('.logButton');

// Elementos dos Pop-ups
const popupSucesso = document.getElementById('popupLogin');
const popupErro = document.getElementById('popupErro');
const mensagemErro = document.getElementById('mensagemErro');
const btnFecharErro = document.getElementById('btnFecharErro');

async function fazerLogin(event) {
    event.preventDefault();
    
    console.log('Login clicado...');
    
    const email = emailInput?.value.trim();
    const senha = senhaInput?.value.trim();
    
    // Validação de campos vazios acionando o pop-up de erro
    if (!email || !senha) {
        mensagemErro.textContent = 'Preencha todos os campos!';
        popupErro.classList.remove('esconder');
        return;
    }
    
    try {
        botaoLogin.disabled = true;
        botaoLogin.textContent = 'Entrando...';
        
        console.log('Enviando requisição de login...');
        
        // 🔥 SUBSTITUÍMOS O api.post POR UM FETCH PURO PARA BURLAR O REFRESH DA PÁGINA
        const response = await fetch('http://localhost:8080/auth/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ email: email, senha: senha })
        });
        
        // Tenta converter a resposta do Spring Boot em JSON
        const data = await response.json().catch(() => null);

        // Se o Spring Boot devolveu um erro (como o 401 UNAUTHORIZED)
        if (!response.ok) {
            // Lança o erro com a mensagem exata que veio do Java (ErrorResponse)
            throw new Error(data && data.message ? data.message : 'Usuário ou senha incorretos.');
        }
        
        console.log('Login bem-sucedido:', data);
        
        // Salvar token JWT e dados
        localStorage.setItem('authToken', data.token);
        localStorage.setItem('usuarioAtual', JSON.stringify({
            id: data.id,
            nome: data.nome,
            email: data.email
        }));
        localStorage.setItem('usuarioNome', data.nome);
        localStorage.setItem('usuarioId', data.id);
        
        // Mostrar pop-up de sucesso e redirecionar automaticamente após 1.5 segundos
        popupSucesso.classList.remove('esconder');
        setTimeout(() => {
            window.location.href = '../home/home.html';
        }, 1500);
        
    } catch (erro) {
        console.error('Erro no login:', erro);
        
        // O fetch puro já joga a mensagem limpa no erro.message, então usamos ela direto
        mensagemErro.textContent = erro.message;
        popupErro.classList.remove('esconder');
        
        botaoLogin.disabled = false;
        botaoLogin.textContent = 'Login';
    }
}

// Event Listeners
if (formLogin) {
    formLogin.addEventListener('submit', fazerLogin);
    console.log('Event listener adicionado ao formulário');
} else {
    console.error('Formulário não encontrado!');
}

// Fechar pop-up de erro
if (btnFecharErro) {
    btnFecharErro.addEventListener('click', () => {
        popupErro.classList.add('esconder');
    });
}