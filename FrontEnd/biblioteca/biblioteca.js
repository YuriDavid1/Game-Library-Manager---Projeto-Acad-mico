// Verificar se usuário está logado
function verificarLogin() {
  const usuario = localStorage.getItem('usuarioAtual');
  if (!usuario) {
    console.log('Usuário não logado - pode visualizar biblioteca');
    return null;
  }
  return JSON.parse(usuario);
}

// Carregar todos os jogos
async function carregarJogos() {
  try {
    console.log('Carregando todos os jogos...');
    const jogos = await api.get('/jogos');
    console.log('Jogos carregados:', jogos);
    
    if (jogos.length > 0) {
      exibirDestaque(jogos[0]);
    }
    
    exibirListaJogos(jogos);
    
  } catch (erro) {
    console.error('Erro ao carregar:', erro);
    alert('Erro ao carregar jogos');
  }
}

// Exibir primeiro jogo em destaque
function exibirDestaque(jogoDestaque) {
  const heroBg = document.querySelector('.hero-background');
  if (heroBg) {
    heroBg.style.backgroundImage = `url('https://via.placeholder.com/1400x500?text=${jogoDestaque.nome}')`;
  }

  const titulo = document.querySelector('.game-titulo');
  if (titulo) {
    titulo.innerHTML = `${jogoDestaque.nome} <span class="highlight">em destaque</span>`;
  }

  const generos = document.querySelectorAll('.genero');
  if (generos.length > 0) {
    generos[0].textContent = jogoDestaque.genero;
  }

  const disponibilidade = document.querySelector('.status-badge');
  if (disponibilidade) {
    disponibilidade.textContent = jogoDestaque.disponivel ? '✓ Disponível' : '✗ Indisponível';
  }

  const btnAlugar = document.querySelector('.btn-alugar');
  if (btnAlugar) {
    btnAlugar.onclick = () => {
      const usuario = verificarLogin();
      if (!usuario) {
        alert(' Você precisa fazer login para emprestar jogos!');
        window.location.href = '../login/login.html';
        return;
      }
      emprestarJogo(jogoDestaque.id, jogoDestaque.nome);
    };
  }
}

// Exibir lista de jogos
function exibirListaJogos(jogos) {
  const container = document.querySelector('.games-grid') || document.querySelector('main');
  
  let listaSection = document.getElementById('jogos-lista');
  if (!listaSection) {
    listaSection = document.createElement('section');
    listaSection.id = 'jogos-lista';
    listaSection.style.cssText = 'padding: 40px 20px; background: #1a1a1a;';
    
    const titulo = document.createElement('h2');
    titulo.textContent = 'Todos os Jogos';
    titulo.style.cssText = 'color: white; margin-bottom: 30px; text-align: center; font-size: 2rem;';
    
    const grid = document.createElement('div');
    grid.id = 'games-grid';
    grid.style.cssText = 'display: grid; grid-template-columns: repeat(auto-fill, minmax(250px, 1fr)); gap: 20px; max-width: 1200px; margin: 0 auto;';
    
    listaSection.appendChild(titulo);
    listaSection.appendChild(grid);
    container.appendChild(listaSection);
  }

  const grid = document.getElementById('games-grid');
  grid.innerHTML = '';

  jogos.forEach(jogo => {
    const card = document.createElement('div');
    card.style.cssText = `
      background: #2a2a2a;
      border-radius: 8px;
      overflow: hidden;
      transition: transform 0.3s;
      color: white;
      padding: 15px;
    `;

    card.innerHTML = `
      <img src="https://via.placeholder.com/250x320?text=${jogo.nome}" 
           style="width: 100%; height: 250px; object-fit: cover; border-radius: 5px; margin-bottom: 10px;">
      <h3 style="margin: 10px 0;">${jogo.nome}</h3>
      <p style="color: #aaa; margin: 5px 0;">${jogo.genero}</p>
      <p style="color: ${jogo.disponivel ? '#4CAF50' : '#f44336'};">
        ${jogo.disponivel ? '✓ Disponível' : '✗ Indisponível'}
      </p>
      <button onclick="verificarLoginEEmprestar(${jogo.id}, '${jogo.nome}')" 
              style="width: 100%; padding: 10px; margin-top: 10px; background: #007bff; color: white; border: none; border-radius: 5px; cursor: pointer;">
        ${jogo.disponivel ? 'Emprestar' : 'Indisponível'}
      </button>
    `;
    grid.appendChild(card);
  });
}

// Verificar login antes de emprestar
function verificarLoginEEmprestar(jogoId, jogoNome) {
  const usuario = verificarLogin();
  
  if (!usuario) {
    alert('Você precisa fazer login para emprestar jogos!');
    window.location.href = '../login/login.html';
    return;
  }
  
  emprestarJogo(jogoId, jogoNome);
}

// Emprestar jogo
async function emprestarJogo(jogoId, jogoNome) {
  try {
    const usuario = verificarLogin();
    if (!usuario) return;

    console.log('📡 Criando empréstimo...');
    const resposta = await api.post('/emprestimos', {
      usuarioId: usuario.id,
      jogoId: jogoId
    });
    
    console.log('Empréstimo criado:', resposta);
    alert(`Você alugou ${jogoNome} com sucesso!`);
    location.reload();
    
  } catch (erro) {
    console.error('Erro:', erro);
    alert('Erro ao emprestar:\n' + erro.message);
  }
}

// Executar quando página carregar
document.addEventListener('DOMContentLoaded', () => {
  console.log('Página Biblioteca carregada');
  carregarJogos();
});