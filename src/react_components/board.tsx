import React, { useState, useRef, useEffect } from 'react';
import './components.css';

// Import your images
import playerImage from '../../public/assets/canion.png';
import playerImageInverted from '../../public/assets/canion-inverted.png';
import canionExplode from '../../public/assets/cannon-explode.gif';
import canionExplodeInverted from '../../public/assets/cannon-explode-inverted.gif';
import chickenImage from '../../public/assets/chicken.gif';

interface BoardProps {
  matrix: string[][];
}

const getPlayerInitialPosition = (matrix: string[][]) => {
  let playerInitialPosition = [0, 0];
  matrix.forEach((row, rowIndex) => {
    row.forEach((cell, colIndex) => {
      if (cell === 'player') {
        playerInitialPosition = [colIndex, rowIndex];
      }
    });
  });
  return playerInitialPosition;
}

const Board: React.FC<BoardProps> = ({ matrix }) => {
  const [showCannonExplode, setShowCannonExplode] = useState(false); 
  const [showChicken, setShowChicken] = useState(false); 
  const [animationInProgress, setAnimationInProgress] = useState(false);
  const [stickVisibility, setStickVisibility] = useState<{ [key: string]: boolean }>({});

  const player_initial_pos = getPlayerInitialPosition(matrix);
  const player_initial_row = player_initial_pos[1];
  const player_initial_col = player_initial_pos[0];
  const matrix_rows = matrix.length;
  const matrix_cols = matrix[0].length;
  const isInverted = player_initial_col > 0;

  const [chickenPositionX, setChickenPositionX] = useState(0);
  const [chickenPositionY, setChickenPositionY] = useState(0);
  const [playerTargetSelection, setPlayerTargetSelection] = useState([0, 0]);
  const [cellWidth, setCellWidth] = useState(0);
  const [cellHeight, setCellHeight] = useState(0);

  const boardRef = useRef<HTMLDivElement>(null);

  const updateCellDimensions = () => {
    if (boardRef.current) {
      const containerWidth = boardRef.current.clientWidth;
      const newCellWidth = containerWidth / matrix_cols;
      setCellWidth(newCellWidth);
      const containerHeight = boardRef.current.clientHeight;
      const newCellHeight = containerHeight / matrix_rows;
      setCellHeight(newCellHeight);
    }
  };

  // Calculate cell width and height based on board container size
  useEffect(() => {
    updateCellDimensions(); // Initial call to set dimensions
    window.addEventListener('resize', updateCellDimensions);

    // Clean up the event listener on component unmount
    return () => {
      window.removeEventListener('resize', updateCellDimensions);
    };
  }, [boardRef]);

  // Function to handle cell click
  const handleCellClick = (rowIndex: number, colIndex: number) => {
    console.log('rowIndex', rowIndex, 'colIndex', colIndex)
    if (animationInProgress) return;
    setAnimationInProgress(true);
    setShowCannonExplode(true);
    setPlayerTargetSelection([colIndex, rowIndex]);

    // Show chicken after 1.5 seconds
    setTimeout(() => {
      setChickenPositionX(0);
      setChickenPositionY(0);

      setShowChicken(true);
      startChickenMovement(true, isInverted ? -40 : 40, 0, !isInverted, false, 0, 0, colIndex, rowIndex); 
    }, 1500);

    // Wait for 2 seconds before hiding the cannon explode
    setTimeout(() => {
      setShowCannonExplode(false);
    }, 2000);
  };

  useEffect(() => {
    const stickKeys = matrix.flatMap((row, rowIndex) =>
      row.map((cell, colIndex) => {
        if (cell === 'stickE' || cell === 'stickW') {
          return `${colIndex}-${rowIndex}`;
        }
        return null;
      }).filter(Boolean)
    );
  
    const initialVisibility: { [key: string]: boolean } = {};
    stickKeys.forEach((key) => {
      initialVisibility[key as string] = true;
    });
    setStickVisibility(initialVisibility);
  
    const timer = setTimeout(() => {
      const newVisibility = { ...initialVisibility };
      stickKeys.forEach((key) => {
        newVisibility[key as string] = false;
      });
      setStickVisibility(newVisibility);
    }, 1000);
  
    return () => clearTimeout(timer);
  }, [matrix]);  

  const get_chicken_pos = (xPos: number, yPos: number) => {

    let colIndex = (Math.floor(xPos / cellWidth)) + player_initial_col;
    let rowIndex = (Math.floor(yPos / cellHeight)) + player_initial_row;
    return { colIndex, rowIndex };
  };

  const is_in_the_middle_of_cell = (xPos: number, yPos: number) => {
    xPos = xPos >= 0 ? xPos : -xPos;
    yPos = yPos >= 0 ? yPos: -yPos;

    let cell_width = cellWidth + cellWidth / 2;
    let cell_height = cellHeight + cellHeight / 2;
    if (!isInverted){
      cell_width = cellWidth;
      cell_height = cellHeight;
    }
    
    console.log('xPos % cell_width', xPos % cell_width, 'yPos % cell_height', yPos % cell_height)
    if (
      (xPos % cell_width >= 0) && (xPos % cell_width <= 10) && 
      (yPos % cell_height >= 0) && (yPos % cell_height <= 10)
    ) {
      console.log('in the middle')
      return true;
    }
    return false;
  };

  const startChickenMovement = (
    move_on_x: boolean,
    current_x: number,
    current_y: number,
    going_up: boolean,
    hit_stick: boolean,
    row_hit_stick: number,
    col_hit_stick: number,
    target_col_sel: number,
    target_row_sel: number,
  ) => {
    let newPosition = move_on_x ? current_x : current_y;
    const interval = setInterval(() => {
      newPosition = newPosition + (going_up ? 10 : -10); // Calculate new position X
      let pos_x = move_on_x ? newPosition : current_x;
      let pos_y = move_on_x ? current_y : newPosition;
      console.log('pos_x', pos_x, 'pos_y', pos_y)
      let pos_chicken_matrix = get_chicken_pos(pos_x, pos_y);

      // Stop moving chicken if it reaches the end of the board
      if (
        pos_chicken_matrix.rowIndex >= matrix_rows || 
        pos_chicken_matrix.colIndex >= matrix_cols ||
        pos_chicken_matrix.rowIndex < 0 ||
        pos_chicken_matrix.colIndex < 0
      ) {
        clearInterval(interval);
        setAnimationInProgress(false);
        return;
      }
      let cell = matrix[pos_chicken_matrix.rowIndex][pos_chicken_matrix.colIndex];
      if (cell === 'blank' || cell == 'target'){
        if (
          cell == 'target' && 
          target_col_sel === pos_chicken_matrix.colIndex && 
          target_row_sel === pos_chicken_matrix.rowIndex
        ) {
          winEffect();
        }
        clearInterval(interval);
        setAnimationInProgress(false);
        return;
      }

      if (move_on_x) {
        setChickenPositionX(newPosition); // Update chicken position X directly
      } else {
        setChickenPositionY(newPosition); 
      }

      // If chicken hits a stick but now we are not in the same position
      if (row_hit_stick !== pos_chicken_matrix.rowIndex || col_hit_stick !== pos_chicken_matrix.colIndex) {
        hit_stick = false;
      }

      const chickenSound = new Audio('../public/assets/chicken-noise.mp3');
      console.log('cell', cell)
      if (cell === 'stickE') {
        if (!hit_stick && is_in_the_middle_of_cell(pos_x, pos_y)){
          clearInterval(interval); // Stop moving chicken if it hits a stick or after reaching 300px
          const key = `${pos_chicken_matrix.colIndex}-${pos_chicken_matrix.rowIndex}`;
          setStickVisibility((prev) => ({ ...prev, [key]: true }));
          chickenSound.play();
          hitEffect(pos_chicken_matrix.colIndex, pos_chicken_matrix.rowIndex);
          startChickenMovement(
            !move_on_x, 
            pos_x, 
            pos_y, 
            going_up, 
            true, 
            pos_chicken_matrix.rowIndex, 
            pos_chicken_matrix.colIndex,
            target_col_sel,
            target_row_sel
          );
        }
      } else if (cell === 'stickW') {
        if (!hit_stick && is_in_the_middle_of_cell(pos_x, pos_y)){
          const key = `${pos_chicken_matrix.colIndex}-${pos_chicken_matrix.rowIndex}`;
          setStickVisibility((prev) => ({ ...prev, [key]: true }));
          chickenSound.play();
          hitEffect(pos_chicken_matrix.colIndex, pos_chicken_matrix.rowIndex);
          clearInterval(interval); // Stop moving chicken if it hits a stick or after reaching 300px
          startChickenMovement(
            !move_on_x, 
            pos_x, 
            pos_y, 
            !going_up, 
            true, 
            pos_chicken_matrix.rowIndex, 
            pos_chicken_matrix.colIndex,
            target_col_sel,
            target_row_sel
          ); // Start moving chicken on Y axis
        }
      } else {
        hit_stick = false;
      }
    }, 25);

    // Clean up interval when component unmounts or when no longer needed
    return () => clearInterval(interval);
  };

  function hitEffect(colIndex: number, rowIndex: number) {
    const selector = `.stick-e-line[data-key="${colIndex}-${rowIndex}"]`;
    const element = document.querySelector(selector);
    if (element) {
      element.classList.add('hit');
  
      // Remove the class after the animation completes to allow re-triggering
      element.addEventListener('animationend', () => {
        element.classList.remove('hit');
      }, { once: true });
    } else {
      const selector = `.stick-w-line[data-key="${colIndex}-${rowIndex}"]`;
      const element = document.querySelector(selector);
      if (element) {
        element.classList.add('hit');
    
        // Remove the class after the animation completes to allow re-triggering
        element.addEventListener('animationend', () => {
          element.classList.remove('hit');
        }, { once: true });
      }
    }
  }
  function winEffect() {
    const elements = document.querySelectorAll('.player-target-selection');
    elements.forEach(element => {
      element.classList.remove('player-target-selection');
      element.classList.add('player-target-win');
    });
    setShowChicken(false);
  }

  return (
    <div className="board-container" ref={boardRef}>
      {matrix.map((row, rowIndex) =>
        row.map((cell, colIndex) => (
          <div
            key={`${rowIndex}-${colIndex}`}
            className={
              (cell === 'blank' || cell === 'target') ? 'blank-cell' : cell === 'player' ? 'player-cell' :
              `cell ${cell === 'player' ? 'player-cell' : ''} ${cell === 'stick' ? 'stick-cell' : ''}`}
            onClick={() => handleCellClick(rowIndex, colIndex)}
          >
            {(playerTargetSelection[0] === colIndex && playerTargetSelection[1] === rowIndex) && (
              <div className="player-target-selection"></div>
            )}
            {cell === 'player' && (
              <div className="player-content">
                {/* Show GIF */}
                {showCannonExplode && (
                  <img
                    src={isInverted ? canionExplodeInverted : canionExplode}
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
                      top: `calc(${chickenPositionY}px - 50%)`,
                      left: `${chickenPositionX}px`,
                    }}
                  />
                )}
                {/* Show static player image */}
                {!showCannonExplode && (
                  <img
                    src={isInverted ? playerImageInverted : playerImage}
                    alt="Player"
                    className="player-image"
                  />
                )}
              </div>
            )}
            {cell === 'stickE' && stickVisibility[`${colIndex}-${rowIndex}`] && (
              <div className="stick-e-line hit" data-key={`${colIndex}-${rowIndex}`}></div>
            )}
            {cell === 'stickW' && stickVisibility[`${colIndex}-${rowIndex}`] && (
              <div className="stick-w-line hit" data-key={`${colIndex}-${rowIndex}`}></div>
            )}
            {((cell === 'blank' || cell === 'target') && !(playerTargetSelection[0] === colIndex && playerTargetSelection[1] === rowIndex)) && (
              <div className="blank-cell-content" data-key={`${colIndex}-${rowIndex}`}></div>
            )}
          </div>
        ))
      )}
    </div>
  );
};

export default Board;
