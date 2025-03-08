import React from 'react';
import './Card.css';

const Card = ({ id, emoji, isFlipped, isMatched, onClick }) => {
  return (
    <div
      className={`card ${isFlipped ? 'flipped' : ''} ${isMatched ? 'matched' : ''}`}
      onClick={() => onClick(id)}
      data-id={id}
    >
      <div className={`card-inner ${isFlipped ? 'flipped' : ''}`}>
        {/* Parte frontal (oculta) */}
        <div className={`card-front ${isMatched ? 'matched' : ''}`}>
          <div className="card-question">?</div>
        </div>

        {/* Parte trasera (emoji) */}
        <div className={`card-back ${isMatched ? 'matched' : ''}`}>
          <div className="card-emoji">{emoji}</div>
        </div>
      </div>
    </div>
  );
};

export default Card; 