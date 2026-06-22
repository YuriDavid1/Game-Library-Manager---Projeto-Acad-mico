document.addEventListener('DOMContentLoaded', () => {
    // 1. Verifica login e carrinho
    const usuarioLogado = localStorage.getItem('usuarioAtual');
    if (!usuarioLogado) {
        window.location.href = '../login/login.html';
        return;
    }

    const carrinho = JSON.parse(localStorage.getItem('carrinho_gamelibrary')) || [];
    if (carrinho.length === 0) {
        window.location.href = '../carrinho/carrinho.html';
        return;
    }

    // 2. Preenche Nome do Titular automaticamente
    const usuario = JSON.parse(usuarioLogado);
    document.getElementById('nome-titular').value = usuario.nome || '';

    // 3. Renderiza Resumo Lateral
    renderizarResumo(carrinho);

    // 4. Ação de Concluir Pedido
    document.getElementById('btn-concluir-pedido').onclick = () => finalizarCompra(carrinho);
});

// Alterna a exibição entre Cartão e PIX
function selecionarPagamento(metodo) {
    document.getElementById('opt-cartao').classList.remove('ativa');
    document.getElementById('opt-pix').classList.remove('ativa');
    
    document.getElementById(`opt-${metodo}`).classList.add('ativa');

    if (metodo === 'cartao') {
        document.getElementById('form-cartao').style.display = 'block';
        document.getElementById('form-pix').style.display = 'none';
    } else {
        document.getElementById('form-cartao').style.display = 'none';
        document.getElementById('form-pix').style.display = 'block';
    }
}

// Renderiza a lista de jogos e os cálculos finais
function renderizarResumo(carrinho) {
    const containerItens = document.getElementById('resumo-itens-checkout');
    let totalAcumulado = 0;

    containerItens.innerHTML = '';

    carrinho.forEach(item => {
        const valorNumerico = parseFloat(item.preco) || 0;
        totalAcumulado += valorNumerico;

        containerItens.innerHTML += `
            <div class="mini-item">
                <div class="mini-item-info">
                    <span>${item.nome}</span>
                    <span>${item.tipo}</span>
                </div>
                <span class="mini-item-preco">R$ ${valorNumerico.toFixed(2).replace('.', ',')}</span>
            </div>
        `;
    });

    const totalFormatado = `R$ ${totalAcumulado.toFixed(2).replace('.', ',')}`;
    document.getElementById('checkout-subtotal').textContent = totalFormatado;
    document.getElementById('checkout-total').textContent = totalFormatado;
}

// =========================================
// CONTROLE DO POP-UP CUSTOMIZADO
// =========================================
function mostrarPopup(titulo, message, tipo, acaoAoFechar = null) {
    const popup = document.getElementById('popupCheckout');
    const icone = document.getElementById('popup-icone');
    const tituloEl = document.getElementById('popup-titulo');
    const msgEl = document.getElementById('popup-mensagem');
    const btn = document.getElementById('btn-popup');

    tituloEl.textContent = titulo;
    msgEl.textContent = message;

    if (tipo === 'erro') {
        icone.className = 'fa-solid fa-circle-xmark popup-icone erro'; 
        btn.className = 'btn-erro'; 
        btn.textContent = 'Tentar Novamente';
    } else {
        icone.className = 'fa-solid fa-circle-check popup-icone'; 
        btn.className = ''; 
        btn.textContent = 'Concluir';
    }

    popup.classList.remove('esconder');

    btn.onclick = () => {
        popup.classList.add('esconder'); 
        if (acaoAoFechar) {
            acaoAoFechar(); 
        }
    };
}

// =========================================
// LÓGICA DE FINALIZAÇÃO
// =========================================
function finalizarCompra(carrinho) {
    // 1. Validação do CPF
    const cpf = document.getElementById('cpf-titular').value;
    if (!cpf || cpf.length < 11) {
        mostrarPopup(
            "Dados Incompletos", 
            "Por favor, preencha um CPF válido para prosseguirmos com o faturamento.", 
            "erro"
        );
        return;
    }

    const temAluguel = carrinho.some(item => item.tipo === 'Aluguel');
    let dataDevolucao = null;
    if (temAluguel) {
        const data = new Date();
        data.setDate(data.getDate() + 7); // 7 dias de prazo
        dataDevolucao = data.toLocaleDateString('pt-BR');
    }

    const novoPedido = {
        idPedido: '#' + Math.floor(Math.random() * 90000 + 10000),
        data: new Date().toLocaleDateString('pt-BR'),
        dataDevolucao: dataDevolucao, // Salva a data aqui
        itens: carrinho,
        status: 'Ativo'
    };

    let historico = JSON.parse(localStorage.getItem('pedidos_gamelibrary')) || [];
    historico.push(novoPedido);
    localStorage.setItem('pedidos_gamelibrary', JSON.stringify(historico));
    let notificacoes =
    JSON.parse(
        localStorage.getItem('notificacoes_gamelibrary')
    ) || [];

notificacoes.push({
    texto: `Pedido ${novoPedido.idPedido} realizado com sucesso.`,
    data: new Date().toLocaleDateString('pt-BR'),
    lida: false
});

localStorage.setItem(
    'notificacoes_gamelibrary',
    JSON.stringify(notificacoes)
);
    localStorage.removeItem('carrinho_gamelibrary');

    mostrarPopup("Pedido Confirmado!", `Seu pedido ${novoPedido.idPedido} foi processado.`, "sucesso", () => {
        window.location.href = '../perfil/perfil.html';
    });
}