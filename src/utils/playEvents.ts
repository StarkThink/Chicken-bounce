
import { DojoEvent } from "../types/DojoEvent";

export interface PlayEvents {
    play: MultiPoints;
  }
  
  export interface MultiPoints {
    multi?: number;
    points?: number;
  }
  

export const getHandEvent = (events: DojoEvent[]) => {
  
    return {
      multi: 1,
      points: 0,
    };
  };

  export const getPlayEvents = (events: DojoEvent[]): PlayEvents => {
    const playEvents: PlayEvents = {
      play: getHandEvent(events)
    };
  
    return playEvents;
  };
  