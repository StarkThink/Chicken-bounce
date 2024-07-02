import React, { useState } from 'react';
import './components.css'; // Ensure the CSS file path is correct
import { BurnerAccount } from '@dojoengine/create-burner';

// Import your images
import playerImage from '../assets/canion.png';
import playerGif from '../assets/chicken.gif';
import chickenImage from '../assets/chicken.png';

interface BoardProps {
  matrix: string[][];
  player_x: number;
  player_y: number;
  account: BurnerAccount;
  game_id: number;
  onValueChange: (gameActive: boolean, gameWin: boolean) => void;
}

const Board: React.FC<BoardProps> = ({ matrix, player_x, player_y, account, game_id, onValueChange }) => {
  const [showGif, setShowGif] = useState(false); // State to toggle GIF display
  const [showChicken, setShowChicken] = useState(false); // State to toggle chicken display
  const [chickenPositionX, setChickenPositionX] = useState(35); // State to track chicken position
  const [chickenPositionY, setChickenPositionY] = useState(0); // State to track chicken position

  // Function to handle cell click
  const handleCellClick = () => {
    setShowGif(true); // Show GIF
    setShowChicken(false); // Show chicken
    setChickenPositionX(35); // Reset chicken position
    setTimeout(() => {
      setShowChicken(true); // Hide chicken after 2 seconds
      setChickenPositionX(35); // Reset chicken position
      startChickenMovement(); // Start chicken movement
    }, 1500);
    setTimeout(() => {
      setShowGif(false); // Hide GIF after 2 seconds
    }, 2000);
  };

  const startChickenMovement = () => {
    let initial_pos = 35;
    let newPositionX = initial_pos;
    const interval = setInterval(() => {
      newPositionX = newPositionX + 10; // Calculate new position X
      setChickenPositionX(newPositionX); // Update chicken position X directly

      if (newPositionX >= (initial_pos + 300)) {
        clearInterval(interval); // Stop moving chicken after reaching 300px
      }
    }, 30); // Adjust interval speed as needed

    // Clean up interval when component unmounts or when no longer needed
    return () => clearInterval(interval);
  };

  return (
    <div className="board-container">
      {matrix.map((row, rowIndex) =>
        row.map((cell, colIndex) => (
          <div
            key={`${rowIndex}-${colIndex}`}
            className={`cell ${cell === 'player' ? 'player-cell' : ''}`}
            onClick={handleCellClick} // Handle cell click
          >
            {cell === 'player' && (
              <div className="player-content">
                {/* Show GIF */}
                {showGif && (
                  <img
                    src={playerGif}
                    alt="Player GIF"
                    className="player-image"
                  />
                )}
                {/* Show chicken */}
                {showChicken && (
                  <img
                    src={chickenImage}
                    alt="Chicken"
                    className="chicken-image"
                    style={{
                      display: 'block',
                      position: 'absolute',
                      top: `${chickenPositionY}px`,
                      left: `${chickenPositionX}px`,
                    }}
                  />
                )}
                {/* Show static player image */}
                {!showGif && (
                  <img
                    src={playerImage}
                    alt="Player"
                    className="player-image"
                  />
                )}
              </div>
            )}
          </div>
        ))
      )}
    </div>
  );
};

export default Board;
