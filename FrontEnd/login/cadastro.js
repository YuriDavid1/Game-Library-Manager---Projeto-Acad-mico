// Referências dos elementos HTML
const cadastroForm = document.querySelector('form');
const nomeInput = document.querySelector('input[name="nome"]'); // ajustar
const emailInput = document.querySelector('input[name="email"]'); // ajustar
const senhaInput = document.querySelector('input[name="senha"]'); // ajustar
const botaoCadastro = document.querySelector('button'); // ajustar

// Função para fazer cadastro
async function fazerCadastro(event) {
  event.preventDefault();

  // Pegar valores
  const nome = nomeInput.value.trim();
  const email = emailInput.value.trim();
  const senha = senhaInput.value.trim();

  // Validar
  if (!nome || !email || !senha) {
    alert('Preencha todos os campos!');
    return;
  }

  if (senha.length < 6) {
    alert('Senha deve ter no mínimo 6 caracteres!');
    return;
  }

  try {
    // Enviar para backend
    const resposta = await api.post('/usuarios', {
      nome: nome,
      email: email,
      senha: senha
    });

    console.log('Cadastro sucesso:', resposta);
    
    // Mensagem de sucesso
    alert('Cadastro realizado com sucesso! Faça login.');
    
    // Redirecionar para login
    window.location.href = './login.html';

  } catch (erro) {
    console.error('Erro no cadastro:', erro);
    alert('Erro ao cadastrar. Email pode já estar em uso.');
  }
}

// Adicionar event listener
if (cadastroForm) {
  cadastroForm.addEventListener('submit', fazerCadastro);
}