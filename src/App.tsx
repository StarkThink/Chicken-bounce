import { Entity } from "@dojoengine/recs";
import React, { useState } from 'react';
import "./App.css";
import { getEntityIdFromKeys } from "@dojoengine/utils";
import { GAME_ID } from "./constants/localStorage";
import { useDojo } from "./dojo/useDojo";
import Game  from "./react_components/game";

const App: React.FC = () => {
    const {
        setup: {
            systemCalls: { create_game },
            clientComponents: {  },
        },
        account,
    } = useDojo();
    const [startGame, setStartGame] = useState(false);
    const [gameId, setGameId] = useState<number>(
        Number(localStorage.getItem(GAME_ID)) ?? 0
      );

    const [playerName, setPlayerName] = useState('');
    const [error, setError] = useState(false);

    const executeCreateGame = (username: string) => {
        create_game(account.account, username).then((newGameId) => {
            console.log("NEW GAME ID: ", newGameId)
          if (newGameId) {
            setGameId(newGameId);
            localStorage.setItem(GAME_ID, newGameId.toString());
          } else {
            setError(true);
          }
        });
    };

    const handlePlayClick = () => {
        if (playerName === '') {
            console.log('Please enter a player name')
            return;
        }
        executeCreateGame(playerName);
        if (error) {
            console.log("Error creating game");
        }
        setStartGame(true);
    };

    if (startGame) {
        const entityId = getEntityIdFromKeys([
            BigInt(account?.account.address),
        ]) as Entity;
        return <Game account={account} gameId={gameId} entityId={entityId} />;
    }

    return (
        <div className="image-container">
            <div className="tile-gif"></div>
            <div className="account-container">
                <div>
                    <div className="account-player">
                        <label htmlFor="playerName">Player Name</label>
                        <input 
                            type="text" 
                            id="playerName" 
                            name="playerName" 
                            value={playerName} 
                            onChange={e => setPlayerName(e.target.value)} 
                        />
                    </div>
                </div>
                <div className="centered-button">
                    <button onClick={handlePlayClick} className="pixel-art-button">Start</button>
                </div>
            </div>
        </div>
    );
}

export default App;
