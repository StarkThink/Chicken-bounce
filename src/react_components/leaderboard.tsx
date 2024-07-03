import React, { useState } from 'react';
import './components.css';
import App from '../App';
import { useDojo } from "../dojo/useDojo";
import Canion from "../assets/canion-chicken.gif";

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
          (
          <div className="leaderboard">
              <div className="stars-container">
                <div className="star">⭐</div>
                <div className="star middle">⭐</div>
                <div className="star">⭐</div>
              </div>
            <h1>Leaderboard</h1>
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
                  <tr>
                    <td key={index}>{index + 1}</td>
                    <td>{playerName}</td>
                    <td>{score}</td>
                  </tr>
                  ))}
                    {/* <tr>
                        <td className="position">1</td>
                        <td className="player">John Doe</td>
                        <td className="">10000000</td>
                    </tr>
                    <tr>
                        <td className="position">2</td>
                        <td className="player">Jane Smith</td>
                        <td className="">900</td>
                    </tr>
                    <tr>
                        <td className="position">3</td>
                        <td className="player">Bob Johnson</td>
                        <td className="">850</td>
                    </tr>
                    <tr>
                        <td className="position">3</td>
                        <td className="player">Bob Johnson</td>
                        <td className="">850</td>
                    </tr>
                    <tr>
                        <td className="position">3</td>
                        <td className="player">Bob Johnson</td>
                        <td className="">850</td>
                    </tr> */}
                </tbody>
            </table>
            <div className="button-container">
                <button onClick={handlePlayAgain}>Play Again</button>
            </div>
            <div className="gif-container">
                <img src={Canion} alt="Celebration GIF" />
            </div>
          </div>
        )
        :
        (<App />)
      }
    </div>
  );
};

export default Leaderboard;
