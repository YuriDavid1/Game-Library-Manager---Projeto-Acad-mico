console.log('Login.js (com JWT) carregado');

const formLogin = document.querySelector('form');
const emailInput = document.getElementById('emailLogin');
const senhaInput = document.getElementById('senhaLogin');
const botaoLogin = document.querySelector('.logButton');

async function fazerLogin(event) {
  event.preventDefault();
  
  console.log('Login clicado...');
  
  const email = emailInput?.value.trim();
  const senha = senhaInput?.value.trim();
  
  if (!email || !senha) {
    alert('Preencha todos os campos!');
    return;
  }
  
  try {
    botaoLogin.disabled = true;
    botaoLogin.textContent = 'Entrando...';
    
    console.log('📡 Enviando requisição de login para: /api/auth/login');
    
    //Enviar email e senha para o backend
    const response = await api.post('/auth/login', {
      email: email,
      senha: senha
    });
    
    console.log('Login bem-sucedido:', response);
    
    //Salvar token JWT
    localStorage.setItem('authToken', response.token);
    localStorage.setItem('usuarioAtual', JSON.stringify({
      id: response.id,
      nome: response.nome,
      email: response.email
    }));
    localStorage.setItem('usuarioNome', response.nome);
    localStorage.setItem('usuarioId', response.id);
    
    alert('Login realizado com sucesso!');
    
    //Redirecionar
    window.location.href = '../home/home.html';
    
  } catch (erro) {
    console.error('Erro no login:', erro);
    alert('Erro ao fazer login:\n' + erro.message);
    botaoLogin.disabled = false;
    botaoLogin.textContent = 'Login';
  }
}

if (formLogin) {
  formLogin.addEventListener('submit', fazerLogin);
  console.log('Event listener adicionado ao formulário');
} else {
  console.error('Formulário não encontrado!');
}