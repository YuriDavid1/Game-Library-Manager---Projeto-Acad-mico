// Verificar autenticação ao carregar página
document.addEventListener('DOMContentLoaded', () => {
  verificarAutenticacao(); // Redireciona se não tem token
  carregarJogos();
});

// Verificar se usuário está logado
function verificarLogin() {
  const usuario = localStorage.getItem('usuarioAtual');
  if (!usuario) {
    console.log('Usuário não logado');
    // Não redireciona, deixa ver a home mesmo sem login
    return null;
  }
  return JSON.parse(usuario);
}

// Carregar jogos do backend
async function carregarJogos() {
  try {
    console.log('Carregando jogos...');
    const jogos = await api.listarJogos();
    console.log('Jogos carregados:', jogos);
    
    // Exibir jogos no carrossel
    exibirCarrossel(jogos);
    
  } catch (erro) {
    console.error('Erro ao carregar jogos:', erro);
    document.getElementById('carrossel').innerHTML = '<p>Erro ao carregar jogos</p>';
  }
}

//Exibir jogos no carrossel
function exibirCarrossel(jogos) {
  const carrossel = document.getElementById('carrossel');
  
  if (!carrossel) {
    console.error('Elemento #carrossel não encontrado');
    return;
  }

  //Limpar conteúdo anterior
  carrossel.innerHTML = '';

  //Se não tem jogos
  if (!jogos || jogos.length === 0) {
    carrossel.innerHTML = '<p>Nenhum jogo disponível no momento</p>';
    return;
  }

  //Exibir até 6 primeiros jogos
  jogos.slice(0, 6).forEach((jogo, index) => {
    const jogoDiv = document.createElement('div');
    jogoDiv.className = `g${index + 1}`;
    jogoDiv.innerHTML = `
      <a href="./modelo.html?id=${jogo.id}" style="text-decoration: none; color: inherit;">
        <img src="https://via.placeholder.com/200x250?text=${jogo.nome}" alt="${jogo.nome}">
        <div class="legenda">
          <h3>${jogo.nome}</h3>
          <p>${jogo.genero}</p>
          <p class="disponivel">${jogo.disponivel ? '✓ Disponível' : '✗ Indisponível'}</p>
        </div>
      </a>
    `;
    carrossel.appendChild(jogoDiv);
  });
}

function configurarBotaoBiblioteca() {
  const botao = document.querySelector('.banner button');
  if (botao) {
    botao.addEventListener('click', () => {
      window.location.href = '../biblioteca/biblioteca.html';
    });
  }
}

// Atualizar nome do usuário na navbar (se logado)
function atualizarNavbar() {
  const usuario = verificarLogin();
  const navList = document.querySelector('.nav-list');
  
  if (usuario && navList) {
    // Adicionar botão de logout
    const logoutBtn = document.createElement('li');
    logoutBtn.innerHTML = `
      <button onclick="fazerLogout()" style="background: none; border: none; cursor: pointer; color: inherit; font-size: 1rem;">
        Logout (${usuario.nome})
      </button>
    `;
    navList.appendChild(logoutBtn);
  }
}

// Função para fazer logout
function fazerLogout() {
  localStorage.removeItem('usuarioAtual');
  localStorage.removeItem('usuarioNome');
  localStorage.removeItem('usuarioId');
  alert('Logout realizado');
  window.location.href = '../login/login.html';
}

// Executar quando página carregar
document.addEventListener('DOMContentLoaded', () => {
  console.log('Página carregada');
  verificarLogin();
  carregarJogos();
  configurarBotaoBiblioteca();
  atualizarNavbar();
});

function fazerLogout() {
  fazerLogout(); // Chamar função do auth.js
}