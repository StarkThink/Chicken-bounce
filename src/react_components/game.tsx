import React, { useEffect, useState } from 'react';
import { useDojo } from "../dojo/useDojo";
import { Entity } from "@dojoengine/recs";
import BoardComponent from './board';
import Leaderboard from './leaderboard';
import Modal from './modal';
import "../App.css";
import { BurnerAccount } from '@dojoengine/create-burner';
import gifImage from '../assets/countdown.gif';
import './components.css';
import sound from "../assets/sound.mp3"
import './components.css';

interface GameProps {
  account: BurnerAccount;
  entityId: Entity;
  gameId: number;
}

const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

const Game: React.FC<GameProps> = ({ account, entityId, gameId }) => {
  const {
      setup: {
          systemCalls: {  },
          clientComponents: { },
      },
  } = useDojo();


  const matrix: string[][] = [
    ["blank", "blank", "blank", "blank", "blank", "blank", "blank"],
    ["blank", "empty", "empty", "empty", "empty", "empty", "blank"],
    ["player", "alien", "empty", "empty", "alien", "empty", "target"],
    ["blank", "alien", "empty", "empty", "alien", "empty", "blank"],
    ["blank", "empty", "empty", "empty", "alien", "empty", "blank"],
    ["blank", "empty", "empty", "empty", "empty", "empty", "blank"],
    ["blank", "empty", "empty", "empty", "empty", "empty", "blank"]
  ];

  const [showModal, setShowModal] = useState(false);
  const [gameEnded, setGameEnded] = useState(false);
  
  const [showRound, setShowRound] = useState(true); // initially show round animation

  const handleModalToggle = () => {
    setShowModal(!showModal);
  };

  const handleEndGame = async () => {
    setGameEnded(true);
  };

  const handleBoardValueChange = async (gameActive: boolean, gameWin: boolean) => {
    if (gameWin) {
      // Assuming create_round is an async function or a function that returns a promise
      console.log('game wing')
      setShowRound(true);
    } else {
      console.log('game lost')
      setGameEnded(true);
    }}

  useEffect(() => {
    if (showRound) {
      const timer = setTimeout(() => {
        setShowRound(false);
      }, 2000); // 2 seconds

      return () => clearTimeout(timer);
    }
  }, [showRound]);

  return (
    <div className="game-image-container">
      {gameEnded ? (
        <Leaderboard />
      ) : (
        <div className="game-content">
          {showRound ? (
            <div className="game-image-container">
              <div className="round-title">
                Round 1
              </div>
              <div className="gif-container">
                <img src={gifImage} alt="Loading animation" />
              </div>
            </div>
          ) : (
            <>
              <div className="board-header">
                <div>
                  <p>Player: test</p>
                  <p>Round: 1</p>
                  <p>Score: 0</p>
                  <p className="how-to-play" onClick={handleModalToggle}>
                    How to play?
                  </p>
                </div>
                <div className="buttons-container">
                  <div className="button-container">
                    <button className="end-game-button" onClick={handleEndGame}>End Game</button>
                  </div>
                </div>
              </div>
              <div className="board-content">
                <BoardComponent
                  matrix={matrix}
                  player_x={2}
                  player_y={0}
                  account={account}
                  game_id={gameId}
                  onValueChange={handleBoardValueChange}
                />
              </div>
            </>
          )}
        </div>
      )}
      <Modal show={showModal} handleClose={handleModalToggle}>
        <h2>How to Play</h2>
        <p>
          Your goal is to collect all missing characters and bring them to their corresponding planet. Make sure
          not to run out of gas!
        </p>
        <p>
          To play just click on the board to move your spaceship. The spaceship will move to the clicked cell.
        </p>
      </Modal>
    </div>
  );  
};

export default Game;
