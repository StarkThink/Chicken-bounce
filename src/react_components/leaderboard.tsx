import React, { useState } from 'react';
import './components.css';
import App from '../App';
import { useDojo } from "../dojo/useDojo";
import Canion from "../../public/assets/canion-chicken.gif";
import { getLeaderBoard } from '../dojo/utils/getLeaderBoard';

const Leaderboard = () => {
  const [playAgain, setPlayAgain] = useState(false);
    const {
      setup: {
          systemCalls: { },
          clientComponents: { LeaderBoard, LeaderBoardPlayers },
      },
  } = useDojo();

  const leaderboard = getLeaderBoard(LeaderBoard, LeaderBoardPlayers).slice(0, 10) ?? { len_player: 0 };

  const handlePlayAgain = () => {
    setPlayAgain(true);
  }

  return (
    <div>
      {!playAgain ? (
        <div className="leaderboard">
          <div className="stars-container">
            <div className="star">⭐</div>
            <div className="star middle">⭐</div>
            <div className="star">⭐</div>
          </div>
          <h1>Leaderboard</h1>
          <div className="table-container">
            <table>
              <thead>
                <tr>
                  <th className="position">Position</th>
                  <th className="player">Player Name</th>
                  <th className="">Score</th>
                </tr>
              </thead>
              <tbody>
                {leaderboard.map(([playerName, score], index) => (
                  <tr key={index}>
                    <td>{index + 1}</td>
                    <td>{playerName}</td>
                    <td>{score}</td>
                  </tr>
                  ))}
                </tbody>
            </table>
          </div>
          <div className="button-container">
            <button onClick={handlePlayAgain}>Play Again</button>
          </div>
          <div className="gif-container">
            <img src={Canion} alt="Celebration GIF" />
          </div>
        </div>
      ) : (
        <App />
      )}
    </div>
  );
}  

export default Leaderboard;
