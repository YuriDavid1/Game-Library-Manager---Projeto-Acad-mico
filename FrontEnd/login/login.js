// Referências dos elementos HTML
const loginForm = document.querySelector('form');
const emailInput = document.querySelector('input[type="emailLogin"]');
const senhaInput = document.querySelector('input[type="senhaLogin"]'); 
const botaoLogin = document.querySelector('button#logButton'); 

// Função para fazer login
async function fazerLogin(event) {
  event.preventDefault(); // Previne recarregar a página

  // Pegar valores dos inputs
  const email = emailInput.value.trim();
  const senha = senhaInput.value.trim();

  // Validar se campos estão preenchidos
  if (!email || !senha) {
    alert('Preencha todos os campos!');
    return;
  }

  try {
    // Enviar dados para o backend
    const resposta = await api.post('/usuarios/login', {
      email: email,
      senha: senha
    });

    // Se chegou aqui, login foi bem-sucedido
    console.log('Login sucesso:', resposta);
    
    // Salvar dados do usuário no localStorage (para usar depois)
    localStorage.setItem('usuario', JSON.stringify(resposta));
    
    // Redirecionar para página de home
    window.location.href = '../home/home.html';

  } catch (erro) {
    console.error('Erro no login:', erro);
    alert('Erro ao fazer login. Verifique suas credenciais.');
  }
}

// Adicionar event listener ao formulário
if (loginForm) {
  loginForm.addEventListener('submit', fazerLogin);
}