import React from 'react';
import './DifficultySelector.css';

const DifficultySelector = ({ onSelectDifficulty }) => {
  const difficulties = [
    { id: 'easy', name: 'Fácil', description: '6 pares, 60 segundos', color: 'easy' },
    { id: 'medium', name: 'Difícil', description: '8 pares, 90 segundos', color: 'medium' },
    { id: 'hard', name: 'Extremo', description: '12 pares, 120 segundos', color: 'hard' }
  ];

  return (
    <div className="difficulty-container">
      <h2 className="difficulty-title">
        Selecciona la dificultad
      </h2>
      
      <div className="difficulty-grid">
        {difficulties.map(level => (
          <button
            key={level.id}
            className={`difficulty-button ${level.color}`}
            onClick={() => onSelectDifficulty(level.id)}
          >
            <span className="difficulty-name">{level.name}</span>
            <span className="difficulty-description">{level.description}</span>
          </button>
        ))}
      </div>
      
      <div className="instructions">
        <p className="instructions-title">¿Cómo jugar?</p>
        <ul className="instructions-list">
          <li>Voltea dos cartas en cada turno intentando encontrar pares coincidentes</li>
          <li>Completa todos los pares antes de que se acabe el tiempo</li>
          <li>¡Intenta hacerlo en la menor cantidad de movimientos posible!</li>
        </ul>
      </div>
    </div>
  );
};

export default DifficultySelector; 