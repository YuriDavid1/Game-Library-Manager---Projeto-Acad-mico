// Verificar se usuário está logado
function verificarLogin() {
  const usuario = localStorage.getItem('usuario');
  if (!usuario) {
    alert('Você precisa fazer login primeiro!');
    window.location.href = '../login/login.html';
  }
  return JSON.parse(usuario);
}

// Carregar jogos ao abrir a página
async function carregarJogos() {
  try {
    const jogos = await api.get('/jogos');
    
    console.log('Jogos carregados:', jogos);
    
    // Exibir jogos na página
    exibirJogos(jogos);
    
  } catch (erro) {
    console.error('Erro ao carregar jogos:', erro);
    alert('Erro ao carregar jogos');
  }
}

// Função para exibir jogos (você personaliza com seu HTML)
function exibirJogos(jogos) {
  const container = document.querySelector('.jogos-container'); // ajustar seletor
  
  if (!container) {
    console.error('Container de jogos não encontrado');
    return;
  }

  container.innerHTML = ''; // Limpar conteúdo anterior

  jogos.forEach(jogo => {
    const jogoHTML = `
      <div class="jogo-card">
        <h3>${jogo.nome}</h3>
        <p>Gênero: ${jogo.genero}</p>
        <p>Disponível: ${jogo.disponivel ? 'Sim' : 'Não'}</p>
        <button onclick="emprestarJogo(${jogo.id})">Emprestar</button>
      </div>
    `;
    container.innerHTML += jogoHTML;
  });
}

// Função para emprestar jogo
async function emprestarJogo(jogoId) {
  try {
    const usuario = verificarLogin();
    
    const resposta = await api.post('/emprestimos', {
      usuarioId: usuario.id,
      jogoId: jogoId
    });
    
    alert('Jogo emprestado com sucesso!');
    carregarJogos(); // Recarregar lista
    
  } catch (erro) {
    console.error('Erro ao emprestar:', erro);
    alert('Erro ao emprestar jogo');
  }
}

// Chamar ao carregar a página
document.addEventListener('DOMContentLoaded', () => {
  verificarLogin();
  carregarJogos();
});