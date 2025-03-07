import { useState, useEffect } from 'react';
import './App.css';

// Componentes
import Card from './components/Card';
import DifficultySelector from './components/DifficultySelector';
import GameStats from './components/GameStats';

function App() {
  // Estados del juego
  const [cards, setCards] = useState([]);
  const [flippedCards, setFlippedCards] = useState([]);
  const [matchedCards, setMatchedCards] = useState([]);
  const [moves, setMoves] = useState(0);
  const [gameOver, setGameOver] = useState(false);
  const [difficulty, setDifficulty] = useState(null); // null, 'easy', 'medium', 'hard'
  const [timer, setTimer] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);

  // Configuración según dificultad
  const difficultyConfig = {
    easy: { pairs: 6, timeLimit: 60 },
    medium: { pairs: 8, timeLimit: 90 },
    hard: { pairs: 12, timeLimit: 120 }
  };

  // Iniciar juego con la dificultad seleccionada
  const startGame = (selectedDifficulty) => {
    setDifficulty(selectedDifficulty);
    setIsPlaying(true);
    setGameOver(false);
    setMoves(0);
    setTimer(0);
    setFlippedCards([]);
    setMatchedCards([]);
    
    const numPairs = difficultyConfig[selectedDifficulty].pairs;
    generateCards(numPairs);
  };

  // Generar cartas aleatorias
  const generateCards = (numPairs) => {
    const emojis = ['🐶', '🐱', '🐭', '🐹', '🐰', '🦊', '🐻', '🐼', '🐨', '🐯', '🦁', '🐮', '🐷', '🐸', '🐵'];
    const selectedEmojis = emojis.slice(0, numPairs);
    
    let newCards = [];
    selectedEmojis.forEach(emoji => {
      // Crear par de cartas con el mismo emoji
      newCards.push({ id: Math.random(), emoji, isFlipped: false, isMatched: false });
      newCards.push({ id: Math.random(), emoji, isFlipped: false, isMatched: false });
    });
    
    // Barajar cartas
    for (let i = newCards.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [newCards[i], newCards[j]] = [newCards[j], newCards[i]];
    }
    
    setCards(newCards);
  };

  // Manejar click en carta
  const handleCardClick = (clickedCardId) => {
    if (flippedCards.length === 2 || gameOver) return; // No hacer nada si ya hay 2 cartas volteadas o juego terminado
    
    // Encontrar la carta seleccionada
    const clickedCard = cards.find(card => card.id === clickedCardId);
    
    // No hacer nada si la carta ya está emparejada o volteada
    if (clickedCard.isMatched || flippedCards.includes(clickedCardId)) return;
    
    // Voltear la carta
    const newFlippedCards = [...flippedCards, clickedCardId];
    setFlippedCards(newFlippedCards);
    
    // Si hay 2 cartas volteadas, verificar si son pares
    if (newFlippedCards.length === 2) {
      setMoves(moves + 1);
      
      const firstCard = cards.find(card => card.id === newFlippedCards[0]);
      const secondCard = cards.find(card => card.id === newFlippedCards[1]);
      
      if (firstCard.emoji === secondCard.emoji) {
        // Las cartas coinciden
        const newMatchedCards = [...matchedCards, ...newFlippedCards];
        setMatchedCards(newMatchedCards);
        
        // Comprobar si el juego ha terminado
        if (newMatchedCards.length === cards.length) {
          setGameOver(true);
          setIsPlaying(false);
        }
        
        // Reiniciar las cartas volteadas
        setTimeout(() => setFlippedCards([]), 500);
      } else {
        // Las cartas no coinciden, voltearlas de nuevo
        setTimeout(() => setFlippedCards([]), 1000);
      }
    }
  };

  // Efecto para el temporizador
  useEffect(() => {
    let interval = null;
    
    if (isPlaying && !gameOver) {
      interval = setInterval(() => {
        setTimer(prevTimer => {
          const newTime = prevTimer + 1;
          
          // Verificar si se alcanzó el límite de tiempo
          if (difficulty && newTime >= difficultyConfig[difficulty].timeLimit) {
            setGameOver(true);
            setIsPlaying(false);
            clearInterval(interval);
          }
          
          return newTime;
        });
      }, 1000);
    } else {
      clearInterval(interval);
    }
    
    return () => clearInterval(interval);
  }, [isPlaying, gameOver, difficulty, difficultyConfig]);

  return (
    <div className="app-container">
      <h1 className="app-title">
        Juego de Memoria
      </h1>
      
      {!difficulty ? (
        <DifficultySelector onSelectDifficulty={startGame} />
      ) : (
        <div className="game-container">
          <GameStats
            moves={moves}
            timeElapsed={timer}
            timeLimit={difficultyConfig[difficulty].timeLimit}
            gameOver={gameOver}
            matchedCards={matchedCards.length}
            totalCards={cards.length}
            onRestartGame={() => setDifficulty(null)}
          />
          
          <div className={`cards-grid ${difficulty === 'hard' ? 'grid-hard' : 'grid-easy'}`}>
            {cards.map(card => (
              <Card
                key={card.id}
                id={card.id}
                emoji={card.emoji}
                isFlipped={flippedCards.includes(card.id) || matchedCards.includes(card.id)}
                isMatched={matchedCards.includes(card.id)}
                onClick={handleCardClick}
              />
            ))}
          </div>
          
          {gameOver && (
            <div className="game-over">
              <h2 className="game-over-title">
                {matchedCards.length === cards.length ? '¡Felicidades! 🎉' : 'Se acabó el tiempo ⏱️'}
              </h2>
              <button
                className="play-again-button"
                onClick={() => setDifficulty(null)}
              >
                Jugar de Nuevo
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default App;
