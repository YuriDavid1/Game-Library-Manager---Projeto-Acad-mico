console.log('Modelo.js carregado');

// Pegar ID do jogo da URL
function obterIdDaURL() {
  const params = new URLSearchParams(window.location.search);
  return params.get('id');
}

// Verificar se usuário está logado
function verificarLogin() {
  const usuario = localStorage.getItem('usuarioAtual');
  if (!usuario) {
    alert('Você precisa fazer login!');
    window.location.href = '../login/login.html';
    return null;
  }
  return JSON.parse(usuario);
}

// Carregar detalhes do jogo
async function carregarDetalheJogo() {
  try {
    const jogoId = obterIdDaURL();
    
    if (!jogoId) {
      console.log('Nenhum ID de jogo na URL, exibindo jogo padrão');
      // Se não tem ID na URL, carrega o primeiro jogo
      const jogos = await api.listarJogos();
      if (jogos.length > 0) {
        exibirDetalhes(jogos[0]);
      }
      return;
    }

    console.log('Carregando jogo ID:', jogoId);
    
    // Buscar jogo específico (se seu backend tiver endpoint para isso)
    // Por enquanto, carrega todos e procura pelo ID
    const jogos = await api.listarJogos();
    const jogo = jogos.find(j => j.id == jogoId);
    
    if (jogo) {
      exibirDetalhes(jogo);
    } else {
      console.error('Jogo não encontrado');
      exibirDetalhes(jogos[0] || {});
    }
    
  } catch (erro) {
    console.error('Erro ao carregar jogo:', erro);
    alert('Erro ao carregar jogo');
  }
}

// Exibir detalhes do jogo
function exibirDetalhes(jogo) {
  console.log('Exibindo jogo:', jogo);

  // Atualizar título da página
  document.title = `${jogo.nome || 'Jogo'} - Game Library`;

  // Atualizar banner principal
  const faixaTopo = document.querySelector('.faixa-topo');
  if (faixaTopo) {
    faixaTopo.style.backgroundImage = `url('https://via.placeholder.com/1400x400?text=${jogo.nome}')`;
  }

  const nomeJogo = document.querySelector('.nome-jogo');
  if (nomeJogo) {
    nomeJogo.textContent = jogo.nome || 'Sem nome';
  }

  const generoJogo = document.querySelector('.classificacao-jogo');
  if (generoJogo) {
    generoJogo.textContent = jogo.genero || 'Sem gênero';
  }

  const insignia = document.querySelector('.insignia-status');
  if (insignia) {
    insignia.innerHTML = `
      <i class="fas fa-${jogo.disponivel ? 'check' : 'times'}-circle"></i>
      <span>${jogo.disponivel ? 'Pronto para aluguel' : 'Indisponível'}</span>
    `;
  }

  // Configurar botões
  const btnAluga = document.querySelector('.btn-aluga');
  if (btnAluga) {
    btnAluga.onclick = () => emprestarJogo(jogo.id, jogo.nome);
    btnAluga.disabled = !jogo.disponivel;
    btnAluga.textContent = jogo.disponivel ? 'Alugar Agora' : 'Indisponível';
  }

  // Atualizar informações do jogo
  const blocos = document.querySelectorAll('.bloco-conteudo');
  if (blocos.length > 0) {
    blocos[0].querySelector('p').textContent = jogo.descricao || 
      `Mergulhe em uma aventura épica com ${jogo.nome}. Um jogo ${jogo.genero} que proporcionará horas de diversão e emoção!`;
  }

  // Atualizar cartão de informações
  const cartao = document.querySelector('.cartao-informacoes');
  if (cartao) {
    const itens = cartao.querySelectorAll('.item-informacao');
    if (itens.length > 0) {
      itens[0].querySelector('.conteudo').textContent = jogo.nome || '-';
    }
    if (itens.length > 1) {
      itens[1].querySelector('.conteudo').textContent = jogo.genero || '-';
    }
    if (itens.length > 2) {
      itens[2].querySelector('.conteudo').textContent = jogo.disponivel ? 'Sim' : 'Não';
    }
  }
}

// Emprestar jogo
async function emprestarJogo(jogoId, jogoNome) {
  try {
    const usuario = verificarLogin();
    if (!usuario) return;

    console.log('Criando empréstimo...');
    const resposta = await api.criarEmprestimo(usuario.id, jogoId);
    
    console.log('Empréstimo criado:', resposta);
    alert(`Você alugou ${jogoNome} com sucesso!`);
    
    // Voltar para biblioteca
    window.location.href = '../biblioteca/biblioteca.html';
    
  } catch (erro) {
    console.error('Erro ao emprestar:', erro);
    alert('Erro ao emprestar jogo:\n' + erro.message);
  }
}

// Atualizar navbar
function atualizarNavbar() {
  const usuario = verificarLogin();
  const navList = document.querySelector('.nav-list');
  
  if (usuario && navList) {
    const logoutBtn = document.createElement('li');
    logoutBtn.innerHTML = `
      <button onclick="fazerLogout()" style="background: none; border: none; cursor: pointer; color: inherit; font-size: 1rem;">
        Logout (${usuario.nome})
      </button>
    `;
    navList.appendChild(logoutBtn);
  }
}

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
  carregarDetalheJogo();
  atualizarNavbar();
});