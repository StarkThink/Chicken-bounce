
export interface CreateRoundEvents {
    game: GameEvent;
    gameOver: boolean;
  }
  
  export interface GameEvent {
    score: number;
    round: number;
  }
