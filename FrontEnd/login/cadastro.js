// Função para fazer cadastro
async function fazerCadastro(event) {
  event.preventDefault();

  // Selecionar elementos AQUI, não no topo do arquivo
  const nomeInput = document.querySelector('#nomeCad');
  const emailInput = document.querySelector('#emailCad');
  const senhaInput = document.querySelector('#senhaCad');
  const botaoCadastro = document.querySelector('#cadButton');
  const cadastroForm = document.querySelector('form');

  console.log('✅ Elementos encontrados:', { nomeInput, emailInput, senhaInput, botaoCadastro });

  // Pegar valores
  const nome = nomeInput.value.trim();
  const email = emailInput.value.trim();
  const senha = senhaInput.value.trim();

  console.log('📝 Valores:', { nome, email });

  // Validar
  if (!nome || !email || !senha) {
    alert('⚠️ Preencha todos os campos!');
    return;
  }

  if (email.includes('@') === false) {
    alert('⚠️ Email inválido!');
    return;
  }

  if (senha.length < 4) {
    alert('⚠️ Senha deve ter no mínimo 4 caracteres!');
    return;
  }

  try {
    botaoCadastro.disabled = true;
    botaoCadastro.textContent = '⏳ Cadastrando...';

    console.log('📡 Enviando cadastro para /auth/register');
    
    // Enviar para backend usando endpoint correto
    const resposta = await api.post('/auth/register', {
      nome: nome,
      email: email,
      senha: senha,
      senhaConfirmacao: senha
    });

    console.log('✅ Cadastro sucesso:', resposta);
    
    alert('✅ Cadastro realizado com sucesso! Redirecionando para login...');
    cadastroForm.reset();
    
    // Redirecionar para login após 2 segundos
    setTimeout(() => {
      window.location.href = './login.html';
    }, 2000);

  } catch (erro) {
    console.error('❌ Erro no cadastro:', erro);
    alert('❌ Erro ao cadastrar:\n' + (erro.message || 'Email pode já estar em uso.'));
    botaoCadastro.disabled = false;
    botaoCadastro.textContent = 'Cadastrar';
  }
}

// Adicionar event listener quando DOM está pronto
document.addEventListener('DOMContentLoaded', () => {
  console.log('✅ DOM carregado, adicionando event listeners...');
  
  const cadastroForm = document.querySelector('form');
  const botaoCadastro = document.querySelector('#cadButton');
  
  if (cadastroForm) {
    cadastroForm.addEventListener('submit', fazerCadastro);
    console.log('✅ Event listener adicionado ao formulário');
  } else {
    console.error('❌ Formulário de cadastro não encontrado!');
  }
  
  if (botaoCadastro) {
    console.log('✅ Botão de cadastro encontrado');
  } else {
    console.error('❌ Botão #cadButton não encontrado!');
  }
});