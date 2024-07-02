import React, { useState, useRef, useEffect } from 'react';
import './components.css';

// Import your images
import playerImage from '../assets/canion.png';
import canionExplode from '../assets/chicken.gif';
import chickenImage from '../assets/chicken.png';

interface BoardProps {
  matrix: string[][];
}

const Board: React.FC<BoardProps> = ({ matrix }) => {
  const [showCannonExplode, setShowCannonExplode] = useState(false); 
  const [showChicken, setShowChicken] = useState(false); 
  const [animationInProgress, setAnimationInProgress] = useState(false);

  const chicken_inital_pos_x = 90;
  const chicken_inital_pos_y = 25;
  const player_initial_row = 2;
  const player_initial_col = 0;
  const matrix_rows = matrix.length;
  const matrix_cols = matrix[0].length;

  const [chickenPositionX, setChickenPositionX] = useState(chicken_inital_pos_x);
  const [chickenPositionY, setChickenPositionY] = useState(chicken_inital_pos_y);
  const [cellWidth, setCellWidth] = useState(0);
  const [cellHeight, setCellHeight] = useState(0);

  const boardRef = useRef<HTMLDivElement>(null);

  // Calculate cell width and height based on board container size
  useEffect(() => {
    if (boardRef.current) {
      const containerWidth = boardRef.current.clientWidth;
      const cellWidth = containerWidth / matrix_cols; 
      setCellWidth(cellWidth);
      const containerHeight = boardRef.current.clientHeight;
      const cellHeight = containerHeight / matrix_rows;
      setCellHeight(cellHeight);
    }
  }, [boardRef]);

  // Function to handle cell click
  const handleCellClick = () => {
    if (animationInProgress) return;
    setAnimationInProgress(true);
    setShowCannonExplode(true);

    // Show chicken after 1.5 seconds
    setTimeout(() => {
      setChickenPositionX(chicken_inital_pos_x);
      setChickenPositionY(chicken_inital_pos_y);

      setShowChicken(true);
      startChickenMovement(true, chicken_inital_pos_x, chicken_inital_pos_y, true, false); 
    }, 1500);

    // Wait for 2 seconds before hiding the cannon explode
    setTimeout(() => {
      setShowCannonExplode(false);
    }, 2000);
  };

  const get_chicken_pos = (xPos: number, yPos: number) => {
    const colIndex = (Math.floor(xPos / cellWidth)) + player_initial_col; 
    const rowIndex = (Math.floor(yPos / cellHeight)) + player_initial_row;
    return { colIndex, rowIndex };
  };

  const startChickenMovement = (move_on_x: boolean, current_x: number, current_y: number, going_up: boolean, hit_stick: boolean) => {
    let newPosition = move_on_x ? current_x : current_y;
    const interval = setInterval(() => {
      newPosition = newPosition + (going_up ? 10 : -10); // Calculate new position X
      if (move_on_x) {
        setChickenPositionX(newPosition); // Update chicken position X directly
      } else {
        setChickenPositionY(newPosition); 
      }

      let pos_x = move_on_x ? newPosition : current_x;
      let pos_y = move_on_x ? current_y : newPosition;
      let pos_chicken_matrix = get_chicken_pos(pos_x, pos_y);
      if (
        pos_chicken_matrix.rowIndex >= matrix_rows || 
        pos_chicken_matrix.colIndex >= matrix_cols ||
        pos_chicken_matrix.rowIndex < 0 ||
        pos_chicken_matrix.colIndex < 0
      ) {
        clearInterval(interval); // Stop moving chicken if it reaches the end of the board
        setAnimationInProgress(false);
        return;
      }

      let cell = matrix[pos_chicken_matrix.rowIndex][pos_chicken_matrix.colIndex];
      if (cell === 'stickE') {
        if (!hit_stick){
          clearInterval(interval); // Stop moving chicken if it hits a stick or after reaching 300px
          startChickenMovement(!move_on_x, pos_x, pos_y, going_up, true); // Start moving chicken on Y axis
        }
      } else if (cell === 'stickW') {
        if (!hit_stick){
          clearInterval(interval); // Stop moving chicken if it hits a stick or after reaching 300px
          startChickenMovement(!move_on_x, pos_x, pos_y, !going_up, true); // Start moving chicken on Y axis
        }
      } else {
        hit_stick = false;
      }
    }, 30);

    // Clean up interval when component unmounts or when no longer needed
    return () => clearInterval(interval);
  };

  return (
    <div className="board-container" ref={boardRef}>
      {matrix.map((row, rowIndex) =>
        row.map((cell, colIndex) => (
          <div
            key={`${rowIndex}-${colIndex}`}
            className={cell === 'blank' || cell === 'target' ? 'blank-cell' : `cell ${cell === 'player' ? 'player-cell' : ''} ${cell === 'stick' ? 'stick-cell' : ''}`}
            onClick={handleCellClick} // Handle cell click
          >
            {cell === 'player' && (
              <div className="player-content">
                {/* Show GIF */}
                {showCannonExplode && (
                  <img
                    src={canionExplode}
                    alt="Canion Explode"
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
                {!showCannonExplode && (
                  <img
                    src={playerImage}
                    alt="Player"
                    className="player-image"
                  />
                )}
              </div>
            )}
            {cell === 'stickE' && (
              <div className="stick-e-line"></div>
            )}
            {cell === 'stickW' && (
              <div className="stick-w-line"></div>
            )}
          </div>
        ))
      )}
    </div>
  );
};

export default Board;
