
export interface MoveEvents {
  move: MoveEvent;
  game_win: GameWinEvent;
  gameOver: boolean;
}

export interface MoveEvent {
  pos_x: number;
  pos_y: number;
  remaining_gas: number;
  len_characters_inside: number;
}

export interface GameWinEvent {
  round: number;
  score: number;
}
