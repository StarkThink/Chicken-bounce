import { Entity } from "@dojoengine/recs";
import React, { useState } from 'react';
import "./App.css";
import { getEntityIdFromKeys } from "@dojoengine/utils";
import { useDojo } from "./dojo/useDojo";
import Game  from "./react_components/game";
import { GAME_ID } from "./constants/localStorage";

const App: React.FC = () => {
    const {
        setup: {
            systemCalls: {  },
            clientComponents: {  },
        },
        account,
    } = useDojo();
    const [startGame, setStartGame] = useState(false);
    const [gameId, setGameId] = useState(0);

    const [playerName, setPlayerName] = useState('');

    const handlePlayClick = () => {
        if (playerName === '') {
            console.log('Please enter a player name')
            return;
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
