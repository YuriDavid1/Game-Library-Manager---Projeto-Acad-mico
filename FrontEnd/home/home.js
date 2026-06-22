// Verificar se usuário está logado
function verificarLogin() {
  const usuario = localStorage.getItem('usuarioAtual');
  if (!usuario) {
    console.log('Usuário não logado - pode visualizar jogos normalmente');
    return null;
  }
  return JSON.parse(usuario);
}

// Carregar jogos do backend
async function carregarJogos() {
  try {
    console.log('Carregando jogos...');
    const jogos = await api.get('/games');
    console.log(jogos);
    console.log(jogos[0]);
    console.log('Jogos carregados:', jogos);
    exibirCarrossel(jogos);
    exibirPromocoes(jogos);
    exibirNovidades(jogos);

  } catch (erro) {
    console.error('Erro ao carregar jogos:', erro);
  }
}

// Exibir jogos no carrossel
function exibirCarrossel(jogos) {
  const carrossel = document.getElementById('carrossel');
  
  if (!carrossel) {
    console.error('Elemento #carrossel não encontrado');
    return;
  }

  // Limpar conteúdo anterior
  carrossel.innerHTML = '';

  // Se não tem jogos
  if (!jogos || jogos.length === 0) {
    carrossel.innerHTML = '<p>Nenhum jogo disponível no momento</p>';
    return;
  }

  // Exibir até 6 primeiros jogos
  jogos.slice(0, 6).forEach((jogo, index) => {
    const jogoDiv = document.createElement('div');
    jogoDiv.className = `g${index + 1}`;
    jogoDiv.innerHTML = `
      <a href="../biblioteca/detalhes.html?jogo=${jogo.slug}" style="text-decoration: none; color: inherit;">
      <img src="${jogo.imagemCapa}" alt="${jogo.nome}">       
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

function exibirPromocoes(jogos) {
    const container =
        document.getElementById('carrossel-promocoes');
    if (!container) return;
    container.innerHTML = '';
    jogos.slice(0, 8).forEach(jogo => {
        const precoOriginal =
            Number(jogo.precoCompra);
        const precoPromo =
            Math.floor(precoOriginal * 0.8) +0.90;
        container.innerHTML += `
        <div class="promo-card">
            <div class="promo-badge">
                -20%
            </div>
            <img src="${jogo.imagemCapa}">
            <div class="promo-info">
                <h3>${jogo.nome}</h3>
                <div class="promo-preço">
                    <span class="preco-original">
                        R$ ${precoOriginal.toFixed(2)}
                    </span>
                    <span class="preco-promo">
                        R$ ${precoPromo.toFixed(2)}
                    </span>
                </div>
                <button
                onclick="window.location.href='../biblioteca/detalhes.html?jogo=${jogo.slug}'"
                class="btn-promo">
                    Ver Jogo
                </button>
            </div>
        </div>
        `;
    });
}

function exibirNovidades(jogos) {
    const container =
        document.getElementById('carrossel-novidades');
    if (!container) return;
    container.innerHTML = '';
    jogos.slice(-8).reverse().forEach(jogo => {
        container.innerHTML += `
        <div class="novidade-card">
            <img src="${jogo.imagemCapa}">
            <div class="novidade-info">
                <h3>${jogo.nome}</h3>
                <p class="descricao-novidade">
                    ${jogo.genero}
                </p>
                <button
                onclick="window.location.href='../biblioteca/detalhes.html?jogo=${jogo.slug}'"
                class="btn-novidade">
                    Conhecer
                </button>
            </div>
        </div>
        `;
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

// Função para fazer logout
function fazerLogout() {
  localStorage.removeItem('authToken');
  localStorage.removeItem('usuarioAtual');
  localStorage.removeItem('usuarioNome');
  localStorage.removeItem('usuarioId');
  alert('Logout realizado');
  window.location.reload();
}

// Executar quando página carregar
document.addEventListener('DOMContentLoaded', () => {
  console.log('Página Home carregada');
  carregarJogos();
  configurarBotaoBiblioteca();
  atualizarNavbar();
});