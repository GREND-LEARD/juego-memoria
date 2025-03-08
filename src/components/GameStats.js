import React from 'react';
import './GameStats.css';

const GameStats = ({ difficulty, moves, timer, timeLimit, onRestart }) => {
  // Función para formatear el tiempo en formato mm:ss
  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  // Calcular porcentaje del tiempo transcurrido
  const timePercentage = (timer / timeLimit) * 100;

  // Textos según dificultad
  const difficultyLabels = {
    easy: 'Fácil',
    medium: 'Difícil',
    hard: 'Extremo'
  };

  return (
    <div className="stats-container">
      <div className="stats-row">
        <div className="stats-item">
          <span className="stats-label">Dificultad:</span>
          <span className={`stats-value difficulty-${difficulty}`}>
            {difficultyLabels[difficulty]}
          </span>
        </div>
        
        <div className="stats-item">
          <span className="stats-label">Movimientos:</span>
          <span className="stats-value">
            {moves}
          </span>
        </div>
        
        <div className="stats-item">
          <span className="stats-label">Tiempo:</span>
          <span className={`stats-value ${
            timer > timeLimit * 0.75 ? 'time-warning' : ''
          }`}>
            {formatTime(timer)} / {formatTime(timeLimit)}
          </span>
        </div>
        
        <button
          className="restart-button"
          onClick={onRestart}
        >
          Reiniciar
        </button>
      </div>
      
      {/* Barra de progreso del tiempo */}
      <div className="progress-bar-container">
        <div 
          className={`progress-bar ${
            timePercentage < 50 ? 'progress-good' : 
            timePercentage < 75 ? 'progress-warning' : 'progress-danger'
          }`}
          style={{ width: `${Math.min(timePercentage, 100)}%` }}
        ></div>
      </div>
    </div>
  );
};

export default GameStats; 