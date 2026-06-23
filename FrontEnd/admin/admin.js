/* =========================================================
   PAINEL ADMINISTRATIVO - Lógica (admin.js)
   Conversa com as rotas /api/admin/* do back-end Spring Boot.
   Validação de token enviada no header Authorization.
========================================================= */

const API = 'http://localhost:8080';
const token = localStorage.getItem('authToken');

// Cache local dos jogos para preencher o modal de edição sem nova requisição
let cacheJogos = [];

// ---------------------------------------------------------
// 1) CONTROLE DE ACESSO
// Só admins entram. Verifica a role salva no login.
// ---------------------------------------------------------
document.addEventListener('DOMContentLoaded', () => {
    const usuarioStr = localStorage.getItem('usuarioAtual');
    let usuario = null;
    try { usuario = JSON.parse(usuarioStr); } catch (e) { usuario = null; }

    const ehAdmin = token && usuario && (usuario.role === 'ADMIN');

    if (!ehAdmin) {
        document.getElementById('bloqueio').style.display = 'block';
        document.getElementById('painel').style.display = 'none';
        return;
    }

    document.getElementById('painel').style.display = 'block';
    document.getElementById('adminNome').textContent = usuario.nome || 'admin';

    // Liga o submit do formulário de jogo
    document.getElementById('formJogo').addEventListener('submit', salvarJogo);

    carregarTudo();
});

// ---------------------------------------------------------
// 2) HELPER DE REQUISIÇÃO
// ---------------------------------------------------------
async function req(metodo, endpoint, body = null) {
    const opcoes = {
        method: metodo,
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        }
    };
    if (body) opcoes.body = JSON.stringify(body);

    const resp = await fetch(`${API}${endpoint}`, opcoes);
    const data = await resp.json().catch(() => null);

    if (!resp.ok) {
        const msg = data && data.message ? data.message : `Erro ${resp.status}`;
        throw new Error(msg);
    }
    return data;
}

// ---------------------------------------------------------
// 3) CARREGAMENTO GERAL
// ---------------------------------------------------------
async function carregarTudo() {
    carregarDashboard();
    carregarJogos();
    carregarUsuarios();
    carregarEmprestimos();
}

async function carregarDashboard() {
    try {
        const s = await req('GET', '/api/admin/dashboard');
        document.getElementById('statUsuarios').textContent    = s.totalUsuarios;
        document.getElementById('statAdmins').textContent      = s.totalAdmins;
        document.getElementById('statJogos').textContent       = s.totalJogos;
        document.getElementById('statDisponiveis').textContent = s.jogosDisponiveis;
        document.getElementById('statEmprestimos').textContent = s.emprestimosAtivos;
    } catch (e) {
        console.error('Dashboard:', e.message);
    }
}

// ---------------------------------------------------------
// 4) JOGOS
// ---------------------------------------------------------
async function carregarJogos() {
    const tbody = document.getElementById('tbodyJogos');
    try {
        const jogos = await req('GET', '/api/admin/jogos');
        cacheJogos = jogos;

        if (!jogos.length) {
            tbody.innerHTML = `<tr><td colspan="7" class="carregando">Nenhum jogo cadastrado.</td></tr>`;
            return;
        }

        tbody.innerHTML = jogos.map(j => `
            <tr>
                <td><img class="capa-mini" src="${j.imagemCapa || ''}" alt="" onerror="this.style.visibility='hidden'"></td>
                <td>${escapar(j.nome)}</td>
                <td>${escapar(j.genero || '—')}</td>
                <td>R$ ${escapar(j.precoAluguel || '—')}</td>
                <td>R$ ${escapar(j.precoCompra || '—')}</td>
                <td>${j.disponivel
                    ? '<span class="badge verde">Disponível</span>'
                    : '<span class="badge vermelho">Indisponível</span>'}</td>
                <td>
                    <div class="acoes-cell">
                        <button class="btn-icone editar" title="Editar" onclick="abrirModalJogo(${j.id})"><i class="fa-solid fa-pen"></i></button>
                        <button class="btn-icone deletar" title="Excluir" onclick="confirmarDeleteJogo(${j.id}, '${escaparAttr(j.nome)}')"><i class="fa-solid fa-trash"></i></button>
                    </div>
                </td>
            </tr>
        `).join('');
    } catch (e) {
        tbody.innerHTML = `<tr><td colspan="7" class="carregando">Erro: ${escapar(e.message)}</td></tr>`;
    }
}

function abrirModalJogo(id = null) {
    const form = document.getElementById('formJogo');
    form.reset();
    document.getElementById('jogoId').value = '';

    if (id) {
        const j = cacheJogos.find(x => x.id === id);
        if (j) {
            document.getElementById('modalJogoTitulo').textContent = 'Editar Jogo';
            document.getElementById('jogoId').value = j.id;
            document.getElementById('jogoNome').value = j.nome || '';
            document.getElementById('jogoSlug').value = j.slug || '';
            document.getElementById('jogoGenero').value = j.genero || '';
            document.getElementById('jogoDescricao').value = j.descricao || '';
            document.getElementById('jogoPrecoAluguel').value = j.precoAluguel || '';
            document.getElementById('jogoPrecoCompra').value = j.precoCompra || '';
            document.getElementById('jogoImagemCapa').value = j.imagemCapa || '';
            document.getElementById('jogoImagemFundo').value = j.imagemFundo || '';
            document.getElementById('jogoDisponivel').checked = !!j.disponivel;
        }
    } else {
        document.getElementById('modalJogoTitulo').textContent = 'Adicionar Jogo';
        document.getElementById('jogoDisponivel').checked = true;
    }

    document.getElementById('modalJogo').classList.remove('esconder');
}

function fecharModalJogo() {
    document.getElementById('modalJogo').classList.add('esconder');
}

async function salvarJogo(event) {
    event.preventDefault();

    const id = document.getElementById('jogoId').value;
    const btn = document.getElementById('btnSalvarJogo');

    const jogo = {
        nome: document.getElementById('jogoNome').value.trim(),
        slug: document.getElementById('jogoSlug').value.trim().toLowerCase(),
        genero: document.getElementById('jogoGenero').value.trim(),
        descricao: document.getElementById('jogoDescricao').value.trim(),
        precoAluguel: document.getElementById('jogoPrecoAluguel').value.trim(),
        precoCompra: document.getElementById('jogoPrecoCompra').value.trim(),
        imagemCapa: document.getElementById('jogoImagemCapa').value.trim(),
        imagemFundo: document.getElementById('jogoImagemFundo').value.trim(),
        disponivel: document.getElementById('jogoDisponivel').checked
    };

    if (!jogo.nome || !jogo.slug) {
        toast('Nome e Slug são obrigatórios.', 'erro');
        return;
    }

    btn.disabled = true;
    btn.textContent = 'Salvando...';

    try {
        if (id) {
            await req('PUT', `/api/admin/jogos/${id}`, jogo);
            toast('Jogo atualizado com sucesso!', 'sucesso');
        } else {
            await req('POST', '/api/admin/jogos', jogo);
            toast('Jogo adicionado à biblioteca!', 'sucesso');
        }
        fecharModalJogo();
        carregarJogos();
        carregarDashboard();
    } catch (e) {
        toast(e.message, 'erro');
    } finally {
        btn.disabled = false;
        btn.textContent = 'Salvar';
    }
}

function confirmarDeleteJogo(id, nome) {
    abrirConfirma(
        'Excluir jogo',
        `Tem certeza que deseja excluir <b>${escapar(nome)}</b>? Esta ação não pode ser desfeita.`,
        async () => {
            try {
                await req('DELETE', `/api/admin/jogos/${id}`);
                toast('Jogo excluído.', 'sucesso');
                carregarJogos();
                carregarDashboard();
            } catch (e) {
                toast(e.message, 'erro');
            }
        }
    );
}

// ---------------------------------------------------------
// 5) USUÁRIOS
// ---------------------------------------------------------
async function carregarUsuarios() {
    const tbody = document.getElementById('tbodyUsuarios');
    try {
        const usuarios = await req('GET', '/api/admin/usuarios');

        if (!usuarios.length) {
            tbody.innerHTML = `<tr><td colspan="5" class="carregando">Nenhum usuário cadastrado.</td></tr>`;
            return;
        }

        tbody.innerHTML = usuarios.map(u => {
            const ehAdmin = (u.role === 'ADMIN');
            return `
            <tr>
                <td>${u.id}</td>
                <td>${escapar(u.nome)}</td>
                <td>${escapar(u.email)}</td>
                <td>${ehAdmin
                    ? '<span class="badge roxo">ADMIN</span>'
                    : '<span class="badge amarelo">USER</span>'}</td>
                <td>
                    <div class="acoes-cell">
                        <button class="btn-icone promover" title="${ehAdmin ? 'Rebaixar para USER' : 'Promover a ADMIN'}"
                            onclick="alternarRole(${u.id}, '${ehAdmin ? 'USER' : 'ADMIN'}')">
                            <i class="fa-solid ${ehAdmin ? 'fa-user-minus' : 'fa-user-shield'}"></i>
                        </button>
                        <button class="btn-icone deletar" title="Excluir usuário"
                            onclick="confirmarDeleteUsuario(${u.id}, '${escaparAttr(u.nome)}')">
                            <i class="fa-solid fa-trash"></i>
                        </button>
                    </div>
                </td>
            </tr>`;
        }).join('');
    } catch (e) {
        tbody.innerHTML = `<tr><td colspan="5" class="carregando">Erro: ${escapar(e.message)}</td></tr>`;
    }
}

async function alternarRole(id, novaRole) {
    try {
        await req('PUT', `/api/admin/usuarios/${id}/role`, { role: novaRole });
        toast(`Permissão alterada para ${novaRole}.`, 'sucesso');
        carregarUsuarios();
        carregarDashboard();
    } catch (e) {
        toast(e.message, 'erro');
    }
}

function confirmarDeleteUsuario(id, nome) {
    abrirConfirma(
        'Excluir usuário',
        `Tem certeza que deseja excluir o usuário <b>${escapar(nome)}</b>? Todos os dados dele serão removidos.`,
        async () => {
            try {
                await req('DELETE', `/api/admin/usuarios/${id}`);
                toast('Usuário excluído.', 'sucesso');
                carregarUsuarios();
                carregarDashboard();
            } catch (e) {
                toast(e.message, 'erro');
            }
        }
    );
}

// ---------------------------------------------------------
// 6) EMPRÉSTIMOS
// ---------------------------------------------------------
async function carregarEmprestimos() {
    const tbody = document.getElementById('tbodyEmprestimos');
    try {
        const lista = await req('GET', '/api/admin/emprestimos');

        if (!lista.length) {
            tbody.innerHTML = `<tr><td colspan="5" class="carregando">Nenhum empréstimo registrado.</td></tr>`;
            return;
        }

        tbody.innerHTML = lista.map(e => `
            <tr>
                <td>${e.id}</td>
                <td>${escapar(e.jogo ? e.jogo.nome : '—')}</td>
                <td>${escapar(e.usuario ? e.usuario.nome : '—')}</td>
                <td>${e.ativo
                    ? '<span class="badge verde">Ativo</span>'
                    : '<span class="badge vermelho">Finalizado</span>'}</td>
                <td>
                    <div class="acoes-cell">
                        ${e.ativo
                            ? `<button class="btn-icone finalizar" title="Finalizar empréstimo" onclick="finalizarEmprestimo(${e.id})"><i class="fa-solid fa-check"></i></button>`
                            : '<span style="color:#666;">—</span>'}
                    </div>
                </td>
            </tr>
        `).join('');
    } catch (e) {
        tbody.innerHTML = `<tr><td colspan="5" class="carregando">Erro: ${escapar(e.message)}</td></tr>`;
    }
}

async function finalizarEmprestimo(id) {
    try {
        await req('PATCH', `/api/admin/emprestimos/${id}/finalizar`);
        toast('Empréstimo finalizado.', 'sucesso');
        carregarEmprestimos();
        carregarDashboard();
        carregarJogos(); // o jogo volta a ficar disponível
    } catch (e) {
        toast(e.message, 'erro');
    }
}

// ---------------------------------------------------------
// 7) ABAS
// ---------------------------------------------------------
function trocarAba(aba) {
    document.querySelectorAll('.aba').forEach(s => s.classList.remove('ativa'));
    document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('ativa'));
    document.getElementById('aba-' + aba).classList.add('ativa');
    document.querySelector(`.tab-btn[data-tab="${aba}"]`).classList.add('ativa');
}

// ---------------------------------------------------------
// 8) MODAL DE CONFIRMAÇÃO GENÉRICO
// ---------------------------------------------------------
let acaoConfirmar = null;

function abrirConfirma(titulo, texto, acao) {
    document.getElementById('confirmaTitulo').textContent = titulo;
    document.getElementById('confirmaTexto').innerHTML = texto;
    acaoConfirmar = acao;
    document.getElementById('modalConfirma').classList.remove('esconder');

    const btn = document.getElementById('btnConfirmar');
    btn.onclick = () => {
        if (acaoConfirmar) acaoConfirmar();
        fecharConfirma();
    };
}

function fecharConfirma() {
    document.getElementById('modalConfirma').classList.add('esconder');
    acaoConfirmar = null;
}

// ---------------------------------------------------------
// 9) TOAST
// ---------------------------------------------------------
let toastTimer = null;
function toast(msg, tipo = '') {
    const el = document.getElementById('toast');
    document.getElementById('toastMsg').textContent = msg;
    el.className = 'toast ' + tipo;
    el.classList.remove('esconder');
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => el.classList.add('esconder'), 3500);
}

// ---------------------------------------------------------
// 10) HELPERS DE SEGURANÇA (escapar HTML para evitar quebras)
// ---------------------------------------------------------
function escapar(txt) {
    if (txt == null) return '';
    return String(txt)
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;');
}
function escaparAttr(txt) {
    return escapar(txt).replace(/'/g, "\\'").replace(/"/g, '&quot;');
}
