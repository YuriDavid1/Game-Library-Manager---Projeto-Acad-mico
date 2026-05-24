// Referências dos elementos HTML
const cadastroForm = document.querySelector('form');
const nomeInput = document.querySelector('input[name="nomeCad"]'); 
const emailInput = document.querySelector('input[name="emailCad"]'); 
const senhaInput = document.querySelector('input[name="senhaCad"]'); 
const botaoCadastro = document.querySelector('button#cadButton'); 

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

  if (email.includes('@') === false) {
    alert('Email inválido!');
    return;
  }

  if (senha.length < 4) {
    alert('Senha deve ter no mínimo 4 caracteres!');
    return;
  }

  try {
    botaoCadastro.disabled = true;
    botaoCadastro.textContent = 'Cadastrando...';

    console.log('Enviando cadastro para /auth/register');
    
    // Enviar para backend usando endpoint correto
    const resposta = await api.post('/auth/register', {
      nome: nome,
      email: email,
      senha: senha,
      senhaConfirmacao: senha
    });

    console.log('Cadastro sucesso:', resposta);
    
    alert('Cadastro realizado com sucesso! Redirecionando para login...');
    cadastroForm.reset();
    
    // Redirecionar para login após 1 segundo
    setTimeout(() => {
      window.location.href = './login.html';
    }, 1000);

  } catch (erro) {
    console.error('Erro no cadastro:', erro);
    alert('Erro ao cadastrar:\n' + (erro.message || 'Email pode já estar em uso.'));
    botaoCadastro.disabled = false;
    botaoCadastro.textContent = 'Cadastrar';
  }
}

// Adicionar event listener
if (cadastroForm) {
  cadastroForm.addEventListener('submit', fazerCadastro);
  console.log('Event listener de cadastro adicionado');
} else {
  console.error('Formulário de cadastro não encontrado!');
}