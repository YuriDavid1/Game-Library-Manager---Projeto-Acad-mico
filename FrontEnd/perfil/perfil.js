console.log('perfil.js carregado');

document.addEventListener('DOMContentLoaded', () => {

  console.log('DOM carregado no perfil');
  const usuarioValido = verificarAutenticacao();

  if (!usuarioValido) return;
  carregarDadosUsuario(usuarioValido);
  configurarEventListeners();
  carregarHistoricoReal();
  carregarReservasSimuladas();
  carregarFavoritosSimulados();
  carregarNotificacoesSimuladas();

  setTimeout(() => {
    if (typeof atualizarNavbar === 'function') {
      atualizarNavbar();
    }
  }, 100);

  const params =
    new URLSearchParams(window.location.search);

const aba =
    params.get('aba');

if (aba) {
    abrirAbas(aba);
}

});



// ===== VERIFICAÇÃO DE AUTENTICAÇÃO =====

function verificarAutenticacao() {
  const usuario = localStorage.getItem('usuarioAtual');
  if (!usuario || usuario === 'undefined' || usuario === 'null') {
    console.warn('Usuário não autenticado');
    alert('Você precisa fazer login para acessar o perfil!');
    window.location.href = '../login/login.html';
    return null;
  }

  return JSON.parse(usuario);
}



// ===== CARREGAR DADOS DO USUÁRIO =====

function carregarDadosUsuario(usuario) {
  try {
    document.getElementById('nomeUsuario').textContent = usuario.nome || 'Usuário';
    document.getElementById('emailUsuario').textContent = usuario.email || 'sem email';
    document.getElementById('nomeInput').value = usuario.nome || '';
    document.getElementById('emailInput').value = usuario.email || '';

    // Mantém a API de avatares dinâmica que você configurou
    const avatarUrl = `https://ui-avatars.com/api/?name=${encodeURIComponent(usuario.nome)}&background=fcca44&color=11141d&size=120&bold=true`;
    document.getElementById('avatarImg').src = avatarUrl;

  } catch (erro) {
    console.error('Erro ao carregar dados do usuário:', erro);
  }
}



// ===== CONTROLE DE MUDANÇA ENTRE ABAS =====

function abrirAbas(nomeAba) {
  console.log('Navegando para a aba:', nomeAba);

  // Oculta todos os blocos de conteúdo das abas
  document.querySelectorAll('.aba-conteudo').forEach(aba => {
    aba.classList.remove('ativa');
  });



  // Remove o estado de ativo de todos os botões do menu lateral

  document.querySelectorAll('.menu-btn').forEach(btn => {
    btn.classList.remove('active');
  });



  // Exibe o bloco de conteúdo correspondente

  const abaAlvo = document.getElementById(nomeAba);
  if (abaAlvo) {
    abaAlvo.classList.add('ativa');
  }

  // Marca o botão clicado como ativo

  if (event && event.target) {
    event.target.classList.add('active');
  }
}

// ===== FORMULÁRIO: MEUS DADOS =====

document.getElementById('formMeusDados')?.addEventListener('submit', async (e) => {
  e.preventDefault();
  const usuario = JSON.parse(localStorage.getItem('usuarioAtual'));
  const novosDados = {
    nome: document.getElementById('nomeInput').value,
    email: document.getElementById('emailInput').value,
    telefone: document.getElementById('telefoneInput').value,
    dataNascimento: document.getElementById('dataInput').value,
    bio: document.getElementById('bioInput').value
  };

  try {
    const usuarioAtualizado = { ...usuario, ...novosDados };
    localStorage.setItem('usuarioAtual', JSON.stringify(usuarioAtualizado));
    alert('Dados salvos com sucesso!');
    carregarDadosUsuario(usuarioAtualizado);
    if (typeof atualizarNavbar === 'function') atualizarNavbar();
  } catch (erro) {
    console.error('Erro ao salvar dados:', erro);
    alert('Erro ao salvar dados.');
  }
});

// ===== FORMULÁRIO: MUDAR SENHA =====
document.getElementById('formMudarSenha')?.addEventListener('submit', async (e) => {
  e.preventDefault();
  const senhaAtual = document.getElementById('senhaAtual').value;
  const senhaNova = document.getElementById('senhaNova').value;
  const senhaConfirma = document.getElementById('senhaConfirma').value;
  if (senhaNova.length < 4) {
    alert('A nova senha deve possuir no mínimo 4 caracteres.');
    return;
  }

  if (senhaNova !== senhaConfirma) {
    alert('A confirmação não confere com a nova senha.');
    return;
  }

  try {
    const token = localStorage.getItem('authToken');
    if (!token) {
      alert('Sessão expirada. Por favor, realize o login novamente.');
      if (typeof fazerLogoutGlobal === 'function') fazerLogoutGlobal();
      return;
    }

    const response = await fetch('http://localhost:8080/auth/alterar-senha', {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({ senhaAtual, novaSenha: senhaNova, confirmarSenha: senhaConfirma })
    });

    const data = await response.json().catch(() => null);
    if (!response.ok) {
      throw new Error((data && data.message) ? data.message : 'Erro ao alterar a senha.');
    }

    alert(data?.message || 'Senha atualizada com sucesso!');
    document.getElementById('formMudarSenha').reset();
  } catch (erro) {
    console.error('Erro ao alterar senha:', erro);
    alert(erro.message);
  }
});

// ===== CARREGAR HISTÓRICO REAL DO CHECKOUT =====
function carregarHistoricoReal() {
  const container = document.getElementById('historicoLista');
  const historicoPedidos = JSON.parse(
    localStorage.getItem('pedidos_gamelibrary')
  ) || [];
  if (historicoPedidos.length === 0) {
    container.innerHTML = `
            <div class="perfil-estado-vazio">
                <i class="fa-solid fa-gamepad"
                   style="font-size:40px;color:#444;margin-bottom:10px;">
                </i>
                <p>Nenhum empréstimo ou compra registrado nesta conta.</p>
            </div>
        `;
    return;
  }

  container.innerHTML = historicoPedidos.reverse().map(pedido => {
    let itensHTML = pedido.itens.map(item => {
    let statusTexto = '';
    let statusCor = '#4caf50';

if (item.tipo === 'Aluguel') {
    if (item.dataDevolucao) {
        const hoje = new Date();
        const devolucao = new Date(item.dataDevolucao);
        const diferencaMs = devolucao.getTime() - hoje.getTime();
        const diasRestantes = Math.ceil(
            diferencaMs / (1000 * 60 * 60 * 24)
        );

        if (diasRestantes > 0) {
            statusTexto = `${diasRestantes} dias para devolução`;
            statusCor = '#ff9800';
        } else if (diasRestantes === 0) {
            statusTexto = 'Devolver hoje';
            statusCor = '#ff9800';
        } else {
            statusTexto = `Atrasado há ${Math.abs(diasRestantes)} dias`;
            statusCor = '#f44336';
        }

    } else {
        statusTexto = '15 dias para devolução';
        statusCor = '#ff9800';
    }

} else {
    statusTexto = 'Compra permanente';
    statusCor = '#4caf50';
}

      return `
                <div class="perfil-pedido-game-linha">
                    <img
                        src="${item.imagem || '../images/default-cover.jpg'}"
                        class="mini-capa-perfil">
                    <div>
                        <h5 style="
                            margin:0;
                            font-size:15px;
                            color:#fff;">
                            ${item.nome}
                        </h5>
                        <p style="
                            margin:3px 0;
                            font-size:12px;
                            color:#aaa;">
                            <span style="
                                color:#fcca44;
                                font-weight:bold;">
                                ${item.tipo}
                            </span>
                            •
                            R$ ${parseFloat(item.preco).toFixed(2).replace('.', ',')}
                        </p>
                        <p style="
                            margin-top:5px;
                            color:${statusCor};
                            font-weight:bold;
                            font-size:13px;">
                            ${statusTexto}
                        </p>
                    </div>
                </div>
            `;
    }).join('');

    return `
            <div class="historico-item real-card">
                <div style="
                    display:flex;
                    justify-content:space-between;
                    align-items:center;
                    margin-bottom:15px;
                    border-bottom:1px dashed rgba(255,255,255,0.1);
                    padding-bottom:10px;">

                    <span style="
                        font-weight:bold;
                        color:#fcca44;">
                        Pedido ${pedido.idPedido}
                    </span>

                    <span style="
                        font-size:13px;
                        color:#aaa;">
                        ${pedido.data}
                    </span>
                </div>

                <div style="
                    display:flex;
                    flex-direction:column;
                    gap:12px;">
                    ${itensHTML}
                </div>

                <div style="
                    margin-top:10px;
                    text-align:right;">
                    <span class="status-emprestimo status-ativo">
                        Concluído
                    </span>
                </div>
            </div>`;
  }).join('');
}

// ===== CARREGAR RESERVAS =====
function carregarReservasSimuladas() {
  const container = document.getElementById('reservasLista');
  if (!container) return;
  const reservas = JSON.parse(
    localStorage.getItem('reservas_gamelibrary')
  ) || [];
  if (reservas.length === 0) {
    container.innerHTML = `
            <div class="perfil-estado-vazio">
                <p>Nenhuma reserva encontrada.</p>
            </div>
        `;
    return;
  }

  container.innerHTML = reservas.map(r => `
        <div class="historico-item" style="border-left-color: #ff9800;">
            <h4>${r.jogo}</h4>
            <p>
                <strong>Solicitada em:</strong>
                ${r.dataReserva}
            </p>
            <p>
                <strong>Disponibilidade:</strong>
                ${r.liberacao}
            </p>

            <p>
                <span class="status-emprestimo"
                      style="background: rgba(255,152,0,0.1);
                             color:#ff9800;">
                    Em Fila de Espera
                </span>
            </p>
        </div>
    `).join('');
}

// ===== CARREGAR FAVORITADOS =====
function carregarFavoritosSimulados() {
  const container = document.getElementById('favoritadosLista');
  if (!container) return;
  const favoritos = JSON.parse(
    localStorage.getItem('favoritos_gamelibrary')
  ) || [];
  if (favoritos.length === 0) {
    container.innerHTML = `
            <div class="perfil-estado-vazio">
                <p>Nenhum jogo favoritado.</p>
            </div>
        `;
    return;
  }

  container.innerHTML = favoritos.map(f => `
        <div class="fav-game-card"
             onclick="window.location.href='../biblioteca/detalhes.html?jogo=${f.slug}'">
            <img src="${f.img}" alt="${f.nome}">
            <h4>${f.nome}</h4>
        </div>
    `).join('');
}



// ===== CARREGAR NOTIFICAÇÕES =====
function carregarNotificacoesSimuladas() {
    const container =
        document.getElementById('notificacoesLista');
    const notificacoes =
        JSON.parse(
            localStorage.getItem('notificacoes_gamelibrary')
        ) || [];

    if (notificacoes.length === 0) {
        container.innerHTML = `
            <div class="perfil-estado-vazio">
                <p>Nenhuma notificação encontrada.</p>
            </div>
        `;
        return;
    }

    container.innerHTML = notificacoes
        .reverse()
        .map(n => `
            <div class="notif-item ${n.lida ? 'lida' : 'nova'}">
                <p>${n.texto}</p>
                <span class="notif-data">
                    ${n.data}
                </span>
            </div>
        `)
        .join('');

    notificacoes.forEach(n => n.lida = true);
    localStorage.setItem(
        'notificacoes_gamelibrary',
        JSON.stringify(notificacoes)
    );
}



// ===== SESSÕES E EXCLUSÃO =====

function fazerLogoutTodos() {
  if (confirm('Deseja encerrar as sessões ativas em todos os dispositivos?')) {
    if (typeof fazerLogoutGlobal === 'function') fazerLogoutGlobal();
  }
}

async function confirmarDeletaConta() {
  const popup = document.getElementById('popupPerfil');
  const tituloEl = document.getElementById('popup-titulo');
  const msgEl = document.getElementById('popup-mensagem');
  const btnConfirmar = document.getElementById('btn-confirmar');
  const btnCancelar = document.getElementById('btn-cancelar');

  // Configura o visual do pop-up
  tituloEl.textContent = "Excluir Conta";
  msgEl.textContent = "AVISO: A exclusão é irreversível e removerá todos os seus dados. Deseja continuar?";
  popup.classList.remove('esconder');
  btnCancelar.onclick = () => popup.classList.add('esconder');
  btnConfirmar.onclick = async () => {
    const usuarioString = localStorage.getItem('usuarioAtual');
    const token = localStorage.getItem('authToken');
    if (!usuarioString || !token) {
      alert("Erro: Dados de sessão não encontrados.");
      return;
    }

    const usuario = JSON.parse(usuarioString);
    try {
      const response = await fetch(`http://localhost:8080/api/usuarios/${usuario.id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (response.ok) {
        // Limpeza completa de todos os resquícios no LocalStorage
        const chavesParaRemover = [
          'authToken',
          'usuarioAtual',
          'usuarioNome',
          'usuarioId',
          'pedidos_gamelibrary',
          'carrinho_gamelibrary'
        ];

        chavesParaRemover.forEach(chave => localStorage.removeItem(chave));
        // Feedback visual de sucesso
        tituloEl.textContent = "Conta Deletada";
        msgEl.textContent = "Sua conta foi removida com sucesso. Até logo!";
        document.getElementById('popup-botoes').innerHTML =
          `<button class="btn-primary" style="width:100%" onclick="window.location.href='../home/home.html'">Ok</button>`;
      } else {
        const erroData = await response.json();
        alert("Erro ao deletar: " + (erroData.message || "Falha no servidor"));
      }
    } catch (erro) {
      console.error('Erro na requisição:', erro);
      alert('Não foi possível conectar ao servidor.');
    }
  };
}

function cancelarEdicao() {
  const usuario = verificarAutenticacao();
  if (usuario) carregarDadosUsuario(usuario);
}

function configurarEventListeners() {
  const uploadAvatar = document.getElementById('uploadAvatar');
  if (uploadAvatar) {
    uploadAvatar.addEventListener('change', (e) => {
      const file = e.target.files[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = (event) => {
          document.getElementById('avatarImg').src = event.target.result;
          alert('Avatar atualizado localmente!');
        };
        reader.readAsDataURL(file);
      }
    });
  }
}