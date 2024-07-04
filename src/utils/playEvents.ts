
import { GAME_OVER } from "../constants/dojoEventKeys";
import { DojoEvent } from "../types/DojoEvent";

export interface PlayEvents {
    gameWin: boolean;
  }
  
  export interface MultiPoints {
    multi?: number;
    points?: number;
  }
  

export const getGameWin = (events: DojoEvent[]) => {
  
    return false;
  };

  export const getPlayEvents = (events: DojoEvent[]): PlayEvents => {
    const playEvents: PlayEvents = {
      gameWin: !events.find((event) => event.keys[0] === GAME_OVER)
    };
  
    return playEvents;
  };
  