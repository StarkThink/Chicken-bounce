import React, { useEffect, useState } from 'react';
import { useDojo } from "../dojo/useDojo";
import { Entity } from "@dojoengine/recs";
import BoardComponent from './board';
import Leaderboard from './leaderboard';
import Modal from './modal';
import "../App.css";
import { BurnerAccount } from '@dojoengine/create-burner';
import gifImage from '../../public/assets/countdown.gif';
import { getBoard } from '../dojo/utils/getBoard';
import { getGame } from '../dojo/utils/getGame';
import './components.css';
import { decodeString } from '../dojo/utils/decodeString';
import { Account } from 'starknet';

interface GameProps {
  account: BurnerAccount;
  entityId: Entity;
  gameId: number;
}

const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

const Game: React.FC<GameProps> = ({ account, entityId, gameId }) => {
  const {
      setup: {
          systemCalls: { create_round, end_game },
          clientComponents: { Tile, Board, Game },
      },
  } = useDojo();


  // const matrix: string[][] = [
  //   ["blank", "blank", "blank", "blank", "target", "blank", "blank"],
  //   ["blank", "empty", "stickW", "stickE", "empty", "empty", "blank"],
  //   ["blank", "stickW", "stickW", "stickW", "stickE", "empty", "target"],
  //   ["blank", "alien", "empty", "empty", "alien", "empty", "blank"],
  //   ["player", "empty", "stickW", "empty", "stickE", "empty", "blank"],
  //   ["blank", "empty", "empty", "empty", "empty", "empty", "blank"],
  //   ["blank", "blank", "blank", "blank", "target", "blank", "blank"]
  // ];
  const game = getGame(gameId, Game) ?? { player_name: 'Unknown Player', round: 1, score: 0 };
  const matrix = getBoard(gameId, Tile, Board);
  const [showModal, setShowModal] = useState(false);
  const [gameEnded, setGameEnded] = useState(false);
  
  const [showRound, setShowRound] = useState(true); // initially show round animation

  const handleModalToggle = () => {
    setShowModal(!showModal);
  };

  const handleEndGame = async () => {
    await end_game(account.account as Account, gameId);
    setGameEnded(true);
  };

  const handleBoardValueChange = async (gameActive: boolean, gameWin: boolean) => {
    if (gameWin) {
      // Assuming create_round is an async function or a function that returns a promise
      console.log('game id is ', gameId)
      await create_round(account.account, gameId);
      console.log('game win')
      await sleep(3000);
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
                Round {game.round}
              </div>
              <div className="gif-container">
                <img src={gifImage} alt="Loading animation" />
              </div>
            </div>
          ) : (
            <>
              <div className="board-header">
                <div>
                  <p>Player: {decodeString(game.player_name)}</p>
                  <p>Round: {game.round}</p>
                  <p>Score: {game.score}</p>
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
          Your goal is to save the chicken. Guess the hole where the chicken bounces and win!
          See the sticks before they disappear to guess the correct path. Be quick!
        </p>
        <p>
          To play, just click on the hole that you think the chicken will bounce :)
        </p>
      </Modal>
    </div>
  );  
};

export default Game;
