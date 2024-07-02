import React, { useState } from 'react';
import './components.css';
import App from '../App';
import { useDojo } from "../dojo/useDojo";

const Leaderboard = () => {
  const [playAgain, setPlayAgain] = useState(false);
    const {
      setup: {
          systemCalls: { },
          clientComponents: { },
      },
  } = useDojo();

  const leaderboard: string[] = []

  const handlePlayAgain = () => {
    setPlayAgain(true);
  }

  return (
    <div>
      {!playAgain ? 
          (<div className='leaderboard-wrapper'>
            <h1>Leaderboard</h1>
          <div className="leaderboard-scores">
            {leaderboard.map(([playerName, score], index) => (
              <p key={index}>{index + 1}. {playerName} - {score}</p>
            ))}
          </div>
          <div className='button-play-again-content'>
            <button className="button-play-again" onClick={handlePlayAgain}>Play Again</button>
          </div>
        </div>)
        :
          (<App />)
      }
    </div>

  );
};

export default Leaderboard;
