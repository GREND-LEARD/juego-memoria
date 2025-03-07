import React from 'react';
import './GameStats.css';

const GameStats = ({ moves, timeElapsed, timeLimit, gameOver, matchedCards, totalCards, onRestartGame }) => {
  // Función para formatear el tiempo en formato mm:ss
  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  // Calcular porcentaje del tiempo transcurrido
  const timePercentage = (timeElapsed / timeLimit) * 100;
  
  // Calcular porcentaje de cartas emparejadas
  const matchedPercentage = totalCards > 0 ? (matchedCards / totalCards) * 100 : 0;

  return (
    <div className="stats-container">
      <div className="stats-row">
        <div className="stats-item">
          <span className="stats-label">Movimientos:</span>
          <span className="stats-value">
            {moves}
          </span>
        </div>
        
        <div className="stats-item">
          <span className="stats-label">Parejas:</span>
          <span className="stats-value">
            {matchedCards / 2} / {totalCards / 2}
          </span>
        </div>
        
        <div className="stats-item">
          <span className="stats-label">Tiempo:</span>
          <span className={`stats-value ${
            timeElapsed > timeLimit * 0.75 ? 'time-warning' : ''
          }`}>
            {formatTime(timeElapsed)} / {formatTime(timeLimit)}
          </span>
        </div>
        
        <button
          className="restart-button"
          onClick={onRestartGame}
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
      
      {/* Barra de progreso de parejas encontradas */}
      <div className="progress-bar-container">
        <div 
          className="progress-bar progress-matches"
          style={{ width: `${matchedPercentage}%` }}
        ></div>
      </div>
    </div>
  );
};

export default GameStats; 