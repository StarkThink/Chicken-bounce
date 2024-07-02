import React, { useState, useRef, useEffect } from 'react';
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

  const chickenPosition = 90;
  const player_initial_row = 2;
  const player_initial_col = 0;
  const [chickenPositionX, setChickenPositionX] = useState(chickenPosition); // State to track chicken position
  const [chickenPositionY, setChickenPositionY] = useState(25); // State to track chicken position

  const boardRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (boardRef.current) {
      const containerWidth = boardRef.current.clientWidth;
      const cellWidth = containerWidth / 7; // 7 columns in the grid
      setCellWidth(cellWidth);
      const containerHeight = boardRef.current.clientHeight;
      const cellHeight = containerHeight / 7; // 7 rows in the grid
      setCellHeight(cellHeight);
    }
  }, [boardRef]);

  const [cellWidth, setCellWidth] = useState(0);
  const [cellHeight, setCellHeight] = useState(0);

  // Function to handle cell click
  const handleCellClick = () => {
    setShowGif(true); // Show GIF
    setShowChicken(false); // Hide chicken
    setTimeout(() => {
      setChickenPositionX(chickenPosition); // Reset chicken position
      setChickenPositionY(25); // Reset chicken position
      setShowChicken(true);
      startChickenMovement(true, chickenPosition, 25, true, false); // Start chicken movement
    }, 1500);
    setTimeout(() => {
      setShowGif(false); // Hide GIF after 2 seconds
    }, 2000);
  };

  const checkForStick = (xPos: number, yPos: number) => {
    const colIndex = (Math.floor(xPos / cellWidth)) + player_initial_col; // Calculate column index based on cell width
    const rowIndex = (Math.floor(yPos / cellHeight)) + player_initial_row; // Calculate column index based on cell width
    if (matrix[rowIndex][colIndex] === 'stick') {
      return true;
    }
    return false;
  };

  const startChickenMovement = (move_on_x: boolean, current_x: number, current_y: number, going_up: boolean, hit_stick: boolean) => {
    let newPositionX = move_on_x ? current_x : current_y;
    const interval = setInterval(() => {
      if (going_up) {
        newPositionX = newPositionX + 10; // Calculate new position X
      } else{
        newPositionX = newPositionX - 10; // Calculate new position X
      }
      if (move_on_x) {
        setChickenPositionX(newPositionX); // Update chicken position X directly
      } else {
        setChickenPositionY(newPositionX); 
      }

      let pos_x = move_on_x ? newPositionX : current_x;
      let pos_y = move_on_x ? current_y : newPositionX;
      if (checkForStick(pos_x, pos_y)) {
        if (!hit_stick){
          clearInterval(interval); // Stop moving chicken if it hits a stick or after reaching 300px
          startChickenMovement(!move_on_x, pos_x, pos_y, going_up, true); // Start moving chicken on Y axis
        }
      } else {
        hit_stick = false;
      }
      
    }, 30); // Adjust interval speed as needed

    // Clean up interval when component unmounts or when no longer needed
    return () => clearInterval(interval);
  };

  return (
    <div className="board-container" ref={boardRef}>
      {matrix.map((row, rowIndex) =>
        row.map((cell, colIndex) => (
          <div
            key={`${rowIndex}-${colIndex}`}
            className={`cell ${cell === 'player' ? 'player-cell' : ''} ${cell === 'stick' ? 'stick-cell' : ''}`}
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
            {cell === 'stick' && (
              <div className="stick-line"></div>
            )}
          </div>
        ))
      )}
    </div>
  );
};

export default Board;
