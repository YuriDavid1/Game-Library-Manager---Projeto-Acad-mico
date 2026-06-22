// Função para fazer cadastro
async function fazerCadastro(event) {
    event.preventDefault();

    const nomeInput = document.querySelector('#nomeCad');
    const emailInput = document.querySelector('#emailCad');
    const senhaInput = document.querySelector('#senhaCad');
    const botaoCadastro = document.querySelector('#cadButton');
    const cadastroForm = document.querySelector('form');
    
    // Pegando os elementos dos pop-ups (Sucesso e Erro)
    const popupSucesso = document.getElementById('popupCadastro');
    const popupErro = document.getElementById('popupErro');
    const mensagemErro = document.getElementById('mensagemErro');

    const nome = nomeInput.value.trim();
    const email = emailInput.value.trim();
    const senha = senhaInput.value.trim();

    // Validações básicas antes de enviar
    if (!nome || !email || !senha) {
        mensagemErro.textContent = 'Preencha todos os campos!';
        popupErro.classList.remove('esconder');
        return;
    }

    if (email.includes('@') === false) {
        mensagemErro.textContent = 'Digite um e-mail válido!';
        popupErro.classList.remove('esconder');
        return;
    }

    if (senha.length < 4) {
        mensagemErro.textContent = 'A senha deve ter no mínimo 4 caracteres!';
        popupErro.classList.remove('esconder');
        return;
    }

    try {
        botaoCadastro.disabled = true;
        botaoCadastro.textContent = 'Cadastrando...';

        // Enviar para backend usando endpoint correto
        const resposta = await api.post('/auth/register', {
            nome: nome,
            email: email,
            senha: senha,
            senhaConfirmacao: senha
        });

        // Limpa o formulário e mostra pop-up de SUCESSO
        cadastroForm.reset();
        popupSucesso.classList.remove('esconder');
        botaoCadastro.textContent = 'Cadastrar';

    } catch (erro) {
        console.error('Erro no cadastro:', erro);
        
        let textoErro = erro.message || 'Email pode já estar em uso.';
        
        //TRATAMENTO PARA LIMPAR A MENSAGEM DA API
        try {
            // Se a mensagem contiver um JSON (uma chave '{'), vamos tentar extrair
            if (textoErro.includes('{')) {
                // Pega tudo a partir da primeira chave '{'
                const jsonString = textoErro.substring(textoErro.indexOf('{'));
                const erroObj = JSON.parse(jsonString); // Converte de texto para objeto
                
                // Se o backend mandou um atributo "message", a gente usa só ele
                if (erroObj.message) {
                    textoErro = erroObj.message; 
                }
            }
        } catch (e) {
            // Se falhar o tratamento, ignora e segue com a mensagem original
            console.warn('Não foi possível fazer o parse do erro:', e);
        }

        // Coloca o texto limpo dentro do pop-up e mostra ele
        mensagemErro.textContent = textoErro;
        popupErro.classList.remove('esconder');
        
        botaoCadastro.disabled = false;
        botaoCadastro.textContent = 'Cadastrar';
    }
}

// Event Listeners (Carregamento da página e cliques)
document.addEventListener('DOMContentLoaded', () => {
    const cadastroForm = document.querySelector('form');
    const btnIrParaLogin = document.getElementById('btnIrParaLogin');
    const btnFecharErro = document.getElementById('btnFecharErro');
    const popupErro = document.getElementById('popupErro');
    
    if (cadastroForm) {
        cadastroForm.addEventListener('submit', fazerCadastro);
    }
    
    // Botão do pop-up de sucesso -> Vai pro login
    if (btnIrParaLogin) {
        btnIrParaLogin.addEventListener('click', () => {
            window.location.href = './login.html'; 
        });
    }

    // Botão do pop-up de erro -> Só fecha o modal para o usuário tentar de novo
    if (btnFecharErro) {
        btnFecharErro.addEventListener('click', () => {
            popupErro.classList.add('esconder');
        });
    }
});