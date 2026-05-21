import React from 'react';
import CardJogo from './CardJogo';

/*
 * Componente CarroselJogos - Versão React 
 * Refatoração do carrossel de home.js e biblioteca.js para React
 
 * Props:
 * @param {Array} jogos
 * @param {Function} onEmprestar
 * @param {Number} maxItems
 */
const CarroselJogos = ({ jogos = [], onEmprestar, maxItems = null }) => {
  if (!jogos || jogos.length === 0) {
    return (
      <div style={{
        padding: '40px',
        textAlign: 'center',
        color: '#999'
      }}>
        <p>Nenhum jogo disponível no momento</p>
      </div>
    );
  }

  // Limitar quantidade de items se maxItems foi fornecido
  const items = maxItems ? jogos.slice(0, maxItems) : jogos;

  return (
    <div style={{
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))',
      gap: '20px',
      padding: '20px',
      maxWidth: '1200px',
      margin: '0 auto'
    }}>
      {items.map((jogo) => (
        <CardJogo
          key={jogo.id}
          jogo={jogo}
          onEmprestar={onEmprestar}
        />
      ))}
    </div>
  );
};

export default CarroselJogos;