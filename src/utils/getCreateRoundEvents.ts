import { DojoEvent } from "../types/DojoEvent";
import { CreateRoundEvents, GameEvent } from "../types/CreateRoundEvents";
import { getNumberValueFromEvents } from "./getNumberValueFromEvent";
import { MOVE_EVENT, GAME_WIN, GAME_OVER } from "../constants/dojoEventKeys";

export const getGameEvent = (events: DojoEvent[]): GameEvent => {
    // This event should be triggered from the move function in the contract
    const round = getNumberValueFromEvents(events, GAME_WIN, true, 0);
    const score = getNumberValueFromEvents(events, GAME_WIN, true, 1);

    const result: GameEvent = {
        round: round ?? 0,
        score: score ?? 0,
    }
    return result;
};

export const getCreateRoundEvents = (events: DojoEvent[]): CreateRoundEvents => {
    const moveEvents: CreateRoundEvents = {
      game: getGameEvent(events),
      gameOver: !!events.find((event) => event.keys[0] === GAME_OVER),
    };
  
    return moveEvents;
  };
