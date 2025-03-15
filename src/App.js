import React from 'react';
import { IonApp, IonContent, IonHeader, IonTitle, IonToolbar, setupIonicReact } from '@ionic/react';

/* Core CSS required for Ionic components to work properly */
import '@ionic/react/css/core.css';

/* Basic CSS for apps built with Ionic */
import '@ionic/react/css/normalize.css';
import '@ionic/react/css/structure.css';
import '@ionic/react/css/typography.css';

/* Optional CSS utils that can be commented out */
import '@ionic/react/css/padding.css';
import '@ionic/react/css/float-elements.css';
import '@ionic/react/css/text-alignment.css';
import '@ionic/react/css/text-transformation.css';
import '@ionic/react/css/flex-utils.css';
import '@ionic/react/css/display.css';

import './App.css';

// Componentes
import Card from './components/Card';
import DifficultySelector from './components/DifficultySelector';
import GameStats from './components/GameStats';

setupIonicReact();

function App() {
  // Estados del juego
  const [cards, setCards] = React.useState([]);
  const [flippedCards, setFlippedCards] = React.useState([]);
  const [matchedCards, setMatchedCards] = React.useState([]);
  const [moves, setMoves] = React.useState(0);
  const [gameOver, setGameOver] = React.useState(false);
  const [difficulty, setDifficulty] = React.useState(null); // null, 'easy', 'medium', 'hard'
  const [timer, setTimer] = React.useState(0);
  const [isPlaying, setIsPlaying] = React.useState(false);
  const [showConfetti, setShowConfetti] = React.useState(false);

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
          setShowConfetti(true);
          setTimeout(() => setShowConfetti(false), 5000); // Ocultar confeti después de 5 segundos
        }
        
        // Reiniciar las cartas volteadas
        setTimeout(() => setFlippedCards([]), 500);
      } else {
        // Las cartas no coinciden, aplicar animación de shake
        const cardsElements = document.querySelectorAll('.card');
        newFlippedCards.forEach(id => {
          const cardElement = Array.from(cardsElements).find(
            element => element.getAttribute('data-id') === id.toString()
          );
          if (cardElement) {
            cardElement.classList.add('shake');
            setTimeout(() => cardElement.classList.remove('shake'), 500);
          }
        });
        
        // Voltearlas de nuevo después de la animación
        setTimeout(() => setFlippedCards([]), 1000);
      }
    }
  };

  // Efecto para el temporizador
  React.useEffect(() => {
    let interval;
    if (isPlaying && !gameOver) {
      interval = setInterval(() => {
        setTimer(prevTime => {
          // Verificar si se acabó el tiempo
          if (prevTime >= difficultyConfig[difficulty].timeLimit - 1) {
            clearInterval(interval);
            setGameOver(true);
            setIsPlaying(false);
            return difficultyConfig[difficulty].timeLimit;
          }
          return prevTime + 1;
        });
      }, 1000);
    }
    
    return () => clearInterval(interval);
  }, [isPlaying, difficulty, gameOver]);

  return (
    <IonApp>
      <IonHeader>
        <IonToolbar>
          <IonTitle>Juego de Memoria</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent className="ion-padding">
        <div className="app-container">
          <h1 className="game-title">Juego de Memoria</h1>
          
          {difficulty === null ? (
            <DifficultySelector onSelectDifficulty={startGame} />
          ) : (
            <>
              <GameStats 
                difficulty={difficulty}
                moves={moves}
                timer={timer}
                timeLimit={difficultyConfig[difficulty].timeLimit}
                onRestart={() => setDifficulty(null)}
              />
              
              <div className={`game-board difficulty-${difficulty}`}>
                {cards.map(card => (
                  <Card
                    key={card.id}
                    id={card.id}
                    emoji={card.emoji}
                    isFlipped={flippedCards.includes(card.id) || card.isMatched}
                    isMatched={matchedCards.includes(card.id)}
                    onClick={handleCardClick}
                  />
                ))}
              </div>
              
              {gameOver && (
                <div className="game-over-message">
                  {matchedCards.length === cards.length ? (
                    <p className="win-message">¡Felicidades! Has completado el juego en {moves} movimientos.</p>
                  ) : (
                    <p className="lose-message">¡Se acabó el tiempo! Inténtalo de nuevo.</p>
                  )}
                  <button className="restart-button" onClick={() => setDifficulty(null)}>
                    Volver a jugar
                  </button>
                </div>
              )}
              
              {showConfetti && (
                <div className="confetti-container">
                  {[...Array(50)].map((_, index) => (
                    <div 
                      key={index} 
                      className="confetti"
                      style={{
                        left: `${Math.random() * 100}vw`,
                        animationDelay: `${Math.random() * 5}s`,
                        backgroundColor: `hsl(${Math.random() * 360}, 100%, 50%)`,
                      }}
                    />
                  ))}
                </div>
              )}
            </>
          )}
        </div>
      </IonContent>
    </IonApp>
  );
}

export default App;
