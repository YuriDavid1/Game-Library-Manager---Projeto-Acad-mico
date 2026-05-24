// Pegar ID do jogo da URL
function obterIdDaURL() {
  const params = new URLSearchParams(window.location.search);
  return params.get('id');
}

// Verificar se usuário está logado
function verificarLogin() {
  const usuario = localStorage.getItem('usuarioAtual');
  if (!usuario) {
    console.log('Usuário não logado');
    return null;
  }
  return JSON.parse(usuario);
}

// Carregar detalhes do jogo
async function carregarDetalheJogo() {
  try {
    const jogoId = obterIdDaURL();
    
    console.log('Carregando jogo ID:', jogoId);
    const jogos = await api.get('/jogos');
    
    let jogo = null;
    if (jogoId) {
      jogo = jogos.find(j => j.id == jogoId);
    }
    
    if (!jogo && jogos.length > 0) {
      jogo = jogos[0];
    }
    
    if (jogo) {
      exibirDetalhes(jogo);
    }
    
  } catch (erro) {
    console.error('Erro:', erro);
    alert('Erro ao carregar jogo');
  }
}

// Exibir detalhes do jogo
function exibirDetalhes(jogo) {
  console.log('Exibindo jogo:', jogo);

  document.title = `${jogo.nome} - Game Library`;

  const faixaTopo = document.querySelector('.faixa-topo');
  if (faixaTopo) {
    faixaTopo.style.backgroundImage = `url('https://via.placeholder.com/1400x400?text=${jogo.nome}')`;
  }

  const nomeJogo = document.querySelector('.nome-jogo');
  if (nomeJogo) {
    nomeJogo.textContent = jogo.nome;
  }

  const generoJogo = document.querySelector('.classificacao-jogo');
  if (generoJogo) {
    generoJogo.textContent = jogo.genero;
  }

  const insignia = document.querySelector('.insignia-status');
  if (insignia) {
    insignia.innerHTML = `
      <i class="fas fa-${jogo.disponivel ? 'check' : 'times'}-circle"></i>
      <span>${jogo.disponivel ? 'Pronto para aluguel' : 'Indisponível'}</span>
    `;
  }

  const btnAluga = document.querySelector('.btn-aluga');
  if (btnAluga) {
    btnAluga.onclick = () => {
      const usuario = verificarLogin();
      if (!usuario) {
        alert('Você precisa fazer login para emprestar jogos!');
        window.location.href = '../login/login.html';
        return;
      }
      emprestarJogo(jogo.id, jogo.nome);
    };
    btnAluga.disabled = !jogo.disponivel;
    btnAluga.textContent = jogo.disponivel ? 'Alugar Agora' : 'Indisponível';
  }

  const blocos = document.querySelectorAll('.bloco-conteudo');
  if (blocos.length > 0 && blocos[0].querySelector('p')) {
    blocos[0].querySelector('p').textContent = `Um jogo ${jogo.genero} de qualidade`;
  }
}

// Emprestar jogo
async function emprestarJogo(jogoId, jogoNome) {
  try {
    const usuario = verificarLogin();
    if (!usuario) return;

    console.log('Criando empréstimo...');
    const resposta = await api.post('/emprestimos', {
      usuarioId: usuario.id,
      jogoId: jogoId
    });
    
    console.log('Empréstimo criado:', resposta);
    alert(`Você alugou ${jogoNome}!`);
    window.location.href = '../biblioteca/biblioteca.html';
    
  } catch (erro) {
    console.error('Erro:', erro);
    alert('Erro ao emprestar:\n' + erro.message);
  }
}

// Executar quando página carregar
document.addEventListener('DOMContentLoaded', () => {
  console.log('Página Modelo carregada');
  carregarDetalheJogo();
});