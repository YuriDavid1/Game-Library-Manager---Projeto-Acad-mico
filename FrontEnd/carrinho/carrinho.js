document.addEventListener('DOMContentLoaded', () => {
    renderizarCarrinho();
});

function renderizarCarrinho() {
    const containerItens = document.getElementById('lista-itens-carrinho');
    const caixaResumo = document.getElementById('caixa-resumo');
    
    // Obtém a lista atual armazenada no navegador
    let carrinho = JSON.parse(localStorage.getItem('carrinho_gamelibrary')) || [];

    // Caso o carrinho esteja vazio
    if (carrinho.length === 0) {
        caixaResumo.style.display = 'none';
        containerItens.innerHTML = `
            <div class="carrinho-vazio">
                <i class="fa-solid fa-basket-shopping"></i>
                <h3>Seu carrinho está vazio</h3>
                <p>Você ainda não adicionou nenhum jogo para alugar ou comprar.</p>
                <a href="../biblioteca/biblioteca.html" class="btn-voltar-loja">Explorar Jogos</a>
            </div>
        `;
        return;
    }

    // Caso possua itens, exibe a caixa de resumo e limpa o container anterior
    caixaResumo.style.display = 'block';
    containerItens.innerHTML = '';

    let totalAcumulado = 0;

    carrinho.forEach((item, index) => {
        // Converte o valor de texto para numérico para realizar a soma com segurança
        const valorNumerico = parseFloat(item.preco) || 0;
        totalAcumulado += valorNumerico;

        const cardItem = document.createElement('div');
        cardItem.className = 'item-carrinho-card';
        cardItem.innerHTML = `
            <div class="item-info-esquerda">
                <img src="${item.imagem || '../images/default-cover.jpg'}" alt="${item.nome}">
                <div class="item-detalhes">
                    <h4>${item.nome}</h4>
                    <span class="item-tipo-badge">${item.tipo}</span>
                </div>
            </div>
            <div class="item-info-direita">
                <div class="item-preco">R$ ${valorNumerico.toFixed(2).replace('.', ',')}</div>
                <button class="btn-remover-item" onclick="removerDoCarrinho(${index})" title="Remover item">
                    <i class="fa-solid fa-trash-can"></i>
                </button>
            </div>
        `;
        containerItens.appendChild(cardItem);
    });

    // Atualiza os valores consolidados na interface
    document.getElementById('resumo-qtd').textContent = `${carrinho.length} ${carrinho.length === 1 ? 'item' : 'itens'}`;
    document.getElementById('resumo-total').textContent = `R$ ${totalAcumulado.toFixed(2).replace('.', ',')}`;

    // Ação do botão para a próxima fase (Checkout)
    document.getElementById('btn-prosseguir').onclick = () => {
        window.location.href = '../checkout/checkout.html';
    };
}

// Remove o item selecionado e propaga a atualização para o sistema global
function removerDoCarrinho(index) {
    let carrinho = JSON.parse(localStorage.getItem('carrinho_gamelibrary')) || [];
    
    // Remove o elemento correspondente pelo índice do array
    carrinho.splice(index, 1);
    
    // Salva o novo estado no localStorage
    localStorage.setItem('carrinho_gamelibrary', JSON.stringify(carrinho));
    
    // Sincroniza a bolinha vermelha do cabeçalho de forma imediata
    if (typeof atualizarBadgeCarrinho === 'function') {
        atualizarBadgeCarrinho();
    }
    
    // Atualiza o ecrã do carrinho
    renderizarCarrinho();
}