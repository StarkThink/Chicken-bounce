import React, { useState, useRef, useEffect } from 'react';
import './components.css';

// Import your images
import playerImage from '../../public/assets/canion.png';
import playerImageInverted from '../../public/assets/canion-inverted.png';
import canionExplode from '../../public/assets/cannon-explode.gif';
import canionExplodeInverted from '../../public/assets/cannon-explode-inverted.gif';
import chickenImage from '../../public/assets/chicken.gif';
import { useDojo } from "../dojo/useDojo";
import { BurnerAccount } from '@dojoengine/create-burner';

interface BoardProps {
  matrix: string[][];
  account: BurnerAccount,
  game_id: number,
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

const isSquare = (matrix: string[][], colIndex: number, rowIndex: number) => {
  const matrix_rows = matrix.length;
  const matrix_cols = matrix[0].length;
  if (matrix[rowIndex][colIndex] === 'corner') {
    return true;
  }

  if (rowIndex == matrix_rows - 1 && colIndex == matrix_cols - 1) {
    return true;
  } else if (rowIndex == 0 && colIndex == 0) {
    return true;
  } else if (rowIndex == matrix_rows - 1 && colIndex == 0) {
    return true;
  } else if (rowIndex == 0 && colIndex == matrix_cols - 1) {
    return true;
  } 

  return false;
}

const Board: React.FC<BoardProps> = ({ matrix, account, game_id }) => {
  const {
    setup: {
        systemCalls: { play },
        clientComponents: { },
    },
  } = useDojo();

  console.log('matrix', matrix);
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
  const [playerTargetSelection, setPlayerTargetSelection] = useState([-1, -1]);
  const [cellWidth, setCellWidth] = useState(0);
  const [cellHeight, setCellHeight] = useState(0);
  const [isLoser, setIsLoser] = useState(false);

  const boardRef = useRef<HTMLDivElement>(null);

  const executePlay = async(rowIndex: number, colIndex: number) => {
    const game_win = await play(account.account, game_id, rowIndex, colIndex);
    return game_win;
  };

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

  const center_chicken = () => {
   if (is_in_the_middle_of_cell(chickenPositionX, chickenPositionY)) {
      return { x_diff: 0, y_diff: 0 };
   } 
   let current_pos = get_chicken_pos(chickenPositionX, chickenPositionY);
   let xPos = cellWidth * player_initial_col + chickenPositionX;
   let yPos = cellHeight * player_initial_row + chickenPositionY;
   let cell_boundaries = get_cell_boundaries(current_pos.colIndex, current_pos.rowIndex);

   let x_middle_point = cell_boundaries.x1 + (cellWidth / 2);
   let y_middle_point = cell_boundaries.y1 + (cellHeight / 2);
   let x_diff= x_middle_point - xPos;
   let y_diff = y_middle_point - yPos;
   return { x_diff, y_diff };
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

  const isValidMove = (rowIndex: number, colIndex: number) => {
    if (isSquare(matrix, colIndex, rowIndex)) {
      return false;
    }
    if (colIndex == 0 || rowIndex == 0 || colIndex == matrix_cols - 1 || rowIndex == matrix_rows - 1) {
      return true;
    }
    return false;
  }

  // Function to handle cell click
  const handleCellClick = async (rowIndex: number, colIndex: number) => {
    if (animationInProgress) return;
    if (!isValidMove(rowIndex, colIndex)) return;
    executePlay(rowIndex, colIndex).then((result) => {
      // Place the rest of your code that depends on `result` here.
      result = result ? result : false;
      setAnimationInProgress(true);
      setShowCannonExplode(true);
      setPlayerTargetSelection([colIndex, rowIndex]);

      // Show chicken after 1.5 seconds
      setTimeout(() => {
        setChickenPositionX(0);
        setChickenPositionY(0);

        setShowChicken(true);
        let diff = center_chicken();
        startChickenMovement(true, diff.x_diff, diff.y_diff, !isInverted, false, 0, 0, colIndex, rowIndex, result!); 
      }, 1500);

      // Wait for 2 seconds before hiding the cannon explode
      setTimeout(() => {
        setShowCannonExplode(false);
      }, 5000);
    });
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
    // We need to consider the chicken size to calculate the position
    xPos = cellWidth * player_initial_col + xPos;
    yPos = cellHeight * player_initial_row + yPos;
    let colIndex = (Math.floor(xPos / cellWidth));
    let rowIndex = (Math.floor(yPos / cellHeight));
    return { colIndex, rowIndex };
  };

  const get_cell_boundaries = (colIndex: number, rowIndex: number) => {
    let x1 = colIndex * cellWidth;
    let y1 = rowIndex * cellHeight;
    let x2 = x1 + cellWidth;
    let y2 = y1 + cellHeight;
    return { x1, y1, x2, y2 };
  }

  const is_in_the_middle_of_cell = (xPos: number, yPos: number) => {
    let current_pos = get_chicken_pos(xPos, yPos);

    xPos = cellWidth * player_initial_col + xPos;
    yPos = cellHeight * player_initial_row + yPos;

    let cell_boundaries = get_cell_boundaries(current_pos.colIndex, current_pos.rowIndex);

    let x_middle_point = isInverted ? cell_boundaries.x1 + (cellWidth / 2) : cell_boundaries.x1;
    let y_middle_point = isInverted ? cell_boundaries.y1 + (cellHeight / 2) : cell_boundaries.y1;

    let x_diff = Math.abs(xPos - x_middle_point);
    let y_diff = Math.abs(yPos - y_middle_point);
    if ((x_diff <= 10) && (y_diff <= 10)) {
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
    gameWin: boolean
  ) => {
    let newPosition = move_on_x ? current_x : current_y;
    const interval = setInterval(() => {
      newPosition = newPosition + (going_up ? 10 : -10); // Calculate new position X
      let pos_x = move_on_x ? newPosition : current_x;
      let pos_y = move_on_x ? current_y : newPosition;
      let pos_chicken_matrix = get_chicken_pos(pos_x, pos_y);

      // Stop moving chicken if it reaches the end of the board
      if (
        pos_chicken_matrix.rowIndex >= matrix_rows || 
        pos_chicken_matrix.colIndex >= matrix_cols ||
        pos_chicken_matrix.rowIndex < 0 ||
        pos_chicken_matrix.colIndex < 0
      ) {
        console.log('reached the end of the board')
        if (gameWin) {
          winEffect();
        } else {
          console.log('lost')
          setIsLoser(true);
        }
        clearInterval(interval);
        setAnimationInProgress(false);
        return;
      }

      let cell = matrix[pos_chicken_matrix.rowIndex][pos_chicken_matrix.colIndex];
      if (cell === 'blank' || cell == 'target'){
        if (gameWin) {
          winEffect();
        } else {
          console.log('lost')
          setIsLoser(true);
        }
        console.log('reached target')
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
      if (cell === 'stickW') {
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
            target_row_sel,
            gameWin
          );
        }
      } else if (cell === 'stickE') {
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
            target_row_sel,
            gameWin
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

  const [isVisible, setIsVisible] = useState(false);

  function winEffect() {
    const elements = document.querySelectorAll('.player-target-selection');
    elements.forEach(element => {
      element.classList.remove('player-target-selection');
      element.classList.add('player-target-win');
    });

    setIsVisible(true);
    // setTimeout(() => {
    //   setIsVisible(false);
    // }, 3000);

    setShowChicken(false);
  }

  return (
    <div className="board-container" ref={boardRef}>
      {matrix.map((row, rowIndex) =>
        row.map((cell, colIndex) => (
          <div
            key={`${rowIndex}-${colIndex}`}
            className={
              (
                cell === 'blank' || cell === 'corner' || cell === 'target') ? 'blank-cell' : 
                cell === 'player' ? 'player-cell' :
              `cell ${cell === 'player' ? 'player-cell' : ''} ${cell === 'stick' ? 'stick-cell' : ''}`
            }
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
            {
            (
              !isSquare(matrix, colIndex, rowIndex) &&
              (cell === 'blank' || cell === 'target') && 
              !(playerTargetSelection[0] === colIndex && playerTargetSelection[1] === rowIndex)) && 
              (
              <div className="blank-cell-content" data-key={`${colIndex}-${rowIndex}`}></div>
              )
            }
          </div>
        ))
      )}
      {isVisible && (
        <div className="info">
          <div className="stars-container">
              <div className="star">⭐</div>
              <div className="star middle">🏆</div>
              <div className="star">⭐</div>
          </div>
          <div className='info-text'>
            <p>You win!</p>
            <button className="next-round-button">
                Next Round
            </button>
          </div>
        </div>
      )}
      {isLoser && (
        <div className="info-lost">
            <div className="x-container">
              <img src={chickenImage} alt="" />
          </div>
          <div className='info-text-lost'>
            <p>You lost</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default Board;
