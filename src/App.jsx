import { useState, useEffect } from 'react';
import './App.css';

export default function App() {
  const [cards, setCards] = useState([]);
  const [clickedCards, setClickedCards] = useState([]);
  const [score, setScore] = useState(0);
  const [bestScore, setBestScore] = useState(0);

  // Fetch from Pokemon API on mount
  useEffect(() => {
    const fetchCards = async () => {
      const response = await fetch('https://pokeapi.co/api/v2/pokemon?limit=12');
      const data = await response.json();
      
      const detailedCards = await Promise.all(
        data.results.map(async (item) => {
          const res = await fetch(item.url);
          const details = await res.json();
          return { id: details.id, name: details.name, image: details.sprites.front_default };
        })
      );
      setCards(detailedCards);
    };
    fetchCards();
  }, []); // Empty dependency array ensures this runs once on mount

  const shuffleCards = (array) => {
    return [...array].sort(() => Math.random() - 0.5);
  };

  const handleCardClick = (id) => {
    if (clickedCards.includes(id)) {
      setScore(0);
      setClickedCards([]);
    } else {
      const newScore = score + 1;
      setScore(newScore);
      setClickedCards([...clickedCards, id]);
      if (newScore > bestScore) {
        setBestScore(newScore);
      }
    }
    // Display cards in random order anytime a user clicks one
    setCards(shuffleCards(cards));
  };

  return (
    <div className="app">
      <header>
        <h1>Pokemon Memory Game</h1>
        <div className="scoreboard">
          <p>Score: {score}</p>
          <p>Best Score: {bestScore}</p>
        </div>
      </header>
      <main className="card-grid">
        {cards.map((card) => (
          <div key={card.id} className="card" onClick={() => handleCardClick(card.id)}>
            <img src={card.image} alt={card.name} />
            <p>{card.name}</p>
          </div>
        ))}
      </main>
    </div>
  );
}