// Dicionário definitivo de Galeria
const bancoGaleria = {
    'forza-6': [
        'https://raw.githubusercontent.com/YuriDavid1/Game-Library-Manager---Assets/refs/heads/master/forza/carrossel4.webp',
        'https://raw.githubusercontent.com/YuriDavid1/Game-Library-Manager---Assets/refs/heads/master/forza/Carrossel1.jpg',
        'https://raw.githubusercontent.com/YuriDavid1/Game-Library-Manager---Assets/refs/heads/master/forza/carrossel2.webp',
        'https://raw.githubusercontent.com/YuriDavid1/Game-Library-Manager---Assets/refs/heads/master/forza/Carrossel3.jpg'
    ],
    'cyberpunk': [
        'https://images.unsplash.com/photo-1605901309584-818e25960b8f?q=80&w=1920&auto=format&fit=crop',
        'https://images.unsplash.com/photo-1542751371-adc38448a05e?q=80&w=1920&auto=format&fit=crop'
    ],
    'elden-ring': [
        'https://images.unsplash.com/photo-1552820728-8b83bb6b773f?q=80&w=1920&auto=format&fit=crop',
        'https://images.unsplash.com/photo-1542751371-adc38448a05e?q=80&w=1920&auto=format&fit=crop'
    ],
    'padrao': [
        'https://images.unsplash.com/photo-1542751371-adc38448a05e?q=80&w=1920&auto=format&fit=crop'
    ]
};

let imagensLightbox = [];
let indiceAtual = 0;

document.addEventListener('DOMContentLoaded', async () => {
    configurarEventosLightbox(); // Garante que as setas funcionem

    const urlParams = new URLSearchParams(window.location.search);
    const jogoSlug = urlParams.get('jogo');

    if (!jogoSlug) {
        exibirErro("Jogo não especificado na URL.");
        return;
    }

    try {
        const jogoInfo = await api.get(`/games/detalhes/${jogoSlug}`);

        if (jogoInfo) {
            document.title = `${jogoInfo.nome} - Game Library`;
            
            const partesNome = jogoInfo.nome.split(' ');
            document.getElementById('detalhe-titulo').innerHTML = partesNome.length > 1 
                ? `${partesNome[0]} <span class="highlight">${partesNome.slice(1).join(' ')}</span>` 
                : jogoInfo.nome;

            document.getElementById('detalhe-genero').textContent = jogoInfo.genero;
            document.getElementById('detalhe-descricao').textContent = jogoInfo.descricao;

            // ===== BLOCO DE RECURSOS (ADICIONADO AQUI) =====
            const listaRecursos = document.getElementById('lista-recursos');
            if (listaRecursos) {
                listaRecursos.innerHTML = '';
                const gen = jogoInfo.genero ? jogoInfo.genero.toUpperCase() : "";
                if(gen.includes('ACAO') || gen.includes('AÇÃO')) listaRecursos.innerHTML += `<li><i class="fas fa-fist-raised"></i> Combate Intenso</li>`;
                if(gen.includes('RPG')) listaRecursos.innerHTML += `<li><i class="fas fa-khanda"></i> Elementos de RPG</li>`;
                if(gen.includes('MUNDO ABERTO') || gen.includes('AVENTURA')) listaRecursos.innerHTML += `<li><i class="fas fa-globe"></i> Exploração de Mundo</li>`;
            }

            document.getElementById('detalhe-preco-aluguel').textContent = `Alugar por R$ ${jogoInfo.precoAluguel || '0,00'}`;
            document.getElementById('detalhe-preco-compra').textContent = `Comprar R$ ${jogoInfo.precoCompra || '0,00'}`;
            
            const badgeStatus = document.getElementById('detalhe-status');
            const btnAlugar = document.getElementById('btn-alugar-jogo');
            const btnComprar = document.getElementById('btn-comprar-jogo');
            const btnReservar = document.getElementById('btn-reservar');
            const btnFavoritar = document.getElementById('btn-favoritar');

            if (jogoInfo.disponivel) {
                badgeStatus.textContent = "✓ Disponível";
                badgeStatus.className = "status-badge disponivel";
                btnAlugar.disabled = false; btnAlugar.style.opacity = "1";
                btnComprar.disabled = false; btnComprar.style.opacity = "1";
                if(btnReservar) btnReservar.disabled = true;
            } else {
                badgeStatus.textContent = "✗ Indisponível";
                badgeStatus.className = "status-badge indisponivel";
                btnAlugar.disabled = true; btnAlugar.style.opacity = "0.3";
                btnComprar.disabled = true; btnComprar.style.opacity = "0.3";
                if(btnReservar) btnReservar.disabled = false;
            }

            if (jogoInfo.imagemFundo) document.getElementById('detalhe-fundo').style.backgroundImage = `url('${jogoInfo.imagemFundo}')`;
            if (jogoInfo.imagemCapa) document.getElementById('detalhe-capa').src = jogoInfo.imagemCapa;

            const containerGaleria = document.getElementById('galeria-jogo');
            const fotosGaleria = bancoGaleria[jogoSlug] || bancoGaleria['padrao'];
            imagensLightbox = fotosGaleria;
            containerGaleria.innerHTML = '';
            fotosGaleria.forEach((fotoUrl, index) => {
                const img = document.createElement('img');
                img.src = fotoUrl;
                img.onclick = () => abrirLightbox(index);
                containerGaleria.appendChild(img);
            });

            btnAlugar.onclick = () => adicionarAoCarrinhoERedirecionar('Aluguel', jogoInfo.precoAluguel, jogoInfo);
            btnComprar.onclick = () => adicionarAoCarrinhoERedirecionar('Compra', jogoInfo.precoCompra, jogoInfo);
            
            btnFavoritar.onclick = () => {
                if (!localStorage.getItem('usuarioAtual')) { alert("Faça login para favoritar."); return; }
                let favoritos = JSON.parse(localStorage.getItem('favoritos_gamelibrary')) || [];
                if (!favoritos.find(f => f.id === jogoInfo.id)) {
                    favoritos.push({ id: jogoInfo.id, nome: jogoInfo.nome, img: jogoInfo.imagemCapa, slug: jogoInfo.slug });
                    localStorage.setItem('favoritos_gamelibrary', JSON.stringify(favoritos));
                    mostrarPopup("★ Adicionado aos favoritos!");
                } else { mostrarPopup("Já está nos favoritos!"); }
            };

            if(btnReservar) {
                btnReservar.onclick = () => {
                    let reservas = JSON.parse(localStorage.getItem('reservas_gamelibrary')) || [];
                    reservas.push({ id: jogoInfo.id, jogo: jogoInfo.nome, dataReserva: new Date().toLocaleDateString(), liberacao: 'Aguardando' });
                    localStorage.setItem('reservas_gamelibrary', JSON.stringify(reservas));
                    mostrarPopup("Reserva solicitada com sucesso!");
                };
            }
        } 
    } catch (erro) {
        console.error('Erro:', erro);
        exibirErro("Não foi possível carregar os dados.");
    }
});

function adicionarAoCarrinhoERedirecionar(tipo, preco, jogo) {
    if (jogo.disponivel === false) { alert("Indisponível."); return; }
    if (!localStorage.getItem('usuarioAtual')) { window.location.href = '../login/login.html'; return; }
    let carrinho = JSON.parse(localStorage.getItem('carrinho_gamelibrary')) || [];
    let idx = carrinho.findIndex(i => i.id === jogo.id);
    if (idx === -1) {
        carrinho.push({ id: jogo.id, slug: jogo.slug, nome: jogo.nome, preco, tipo, imagem: jogo.imagemCapa });
    } else {
        carrinho[idx] = { ...carrinho[idx], tipo, preco };
    }
    localStorage.setItem('carrinho_gamelibrary', JSON.stringify(carrinho));
    window.location.href = '../carrinho/carrinho.html';
}

function abrirLightbox(index) {
    indiceAtual = index;
    const lightbox = document.getElementById('lightbox');
    const imgElement = document.getElementById('lightbox-img');
    if (imgElement && imagensLightbox[indiceAtual]) {
        imgElement.src = imagensLightbox[indiceAtual];
        lightbox.style.display = 'flex';
    }
}

function fecharLightbox() { document.getElementById('lightbox').style.display = 'none'; }

function mudarImagem(direcao) {
    if (imagensLightbox.length === 0) return;
    indiceAtual = (indiceAtual + direcao + imagensLightbox.length) % imagensLightbox.length;
    document.getElementById('lightbox-img').src = imagensLightbox[indiceAtual];
}

function configurarEventosLightbox() {
    const lightbox = document.getElementById('lightbox');
    const btnFechar = document.querySelector('.lightbox-fechar');
    const btnPrev = document.querySelector('.lightbox-nav.prev');
    const btnNext = document.querySelector('.lightbox-nav.next');
    if (btnFechar) btnFechar.onclick = fecharLightbox;
    if (btnPrev) btnPrev.onclick = (e) => { e.stopPropagation(); mudarImagem(-1); };
    if (btnNext) btnNext.onclick = (e) => { e.stopPropagation(); mudarImagem(1); };
    if (lightbox) lightbox.onclick = (e) => { if (e.target === lightbox) fecharLightbox(); };
}

function exibirErro(mensagem) {
    document.getElementById('detalhe-titulo').textContent = "Erro";
    document.getElementById('detalhe-descricao').textContent = mensagem;
}

function mostrarPopup(mensagem) {
    const popup = document.getElementById('status-popup');
    const texto = document.getElementById('popup-texto');
    texto.textContent = mensagem;
    popup.style.display = 'block';
    setTimeout(() => { popup.style.display = 'none'; }, 3000);
}