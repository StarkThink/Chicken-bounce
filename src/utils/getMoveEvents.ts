import { DojoEvent } from "../types/DojoEvent";
import { MoveEvent, MoveEvents, GameWinEvent } from "../types/MoveEvents";
import { getNumberValueFromEvents } from "./getNumberValueFromEvent";
import { MOVE_EVENT, GAME_WIN, GAME_OVER } from "../constants/dojoEventKeys";
import { get } from "http";

export const getMoveEvent = (events: DojoEvent[]): MoveEvent => {
    // This event should be triggered from the move function in the contract
    const pos_x_event = getNumberValueFromEvents(events, MOVE_EVENT, true, 0);
    const pos_y_event = getNumberValueFromEvents(events, MOVE_EVENT, true, 1);
    const remaining_gas_event = getNumberValueFromEvents(events, MOVE_EVENT, true, 2);
    const len_characters_inside = getNumberValueFromEvents(events, MOVE_EVENT, true, 4);

    const result: MoveEvent = {
        pos_x: pos_x_event ?? -1,
        pos_y: pos_y_event ?? -1,
        remaining_gas: remaining_gas_event ?? 0,
        len_characters_inside: len_characters_inside ?? 0,
    }
    return result;
};

export const getGameWin = (events: DojoEvent[]): GameWinEvent => {
    // This event should be triggered from the move function in the contract
    const round = getNumberValueFromEvents(events, GAME_WIN, true, 0);
    const score = getNumberValueFromEvents(events, GAME_WIN, true, 1);

    const result: GameWinEvent = {
        round: round ?? 0,
        score: score ?? 0,
    }
    return result;
};

export const getMoveEvents = (events: DojoEvent[]): MoveEvents => {
    const moveEvents: MoveEvents = {
      move: getMoveEvent(events),
      game_win: getGameWin(events),
      gameOver: !!events.find((event) => event.keys[0] === GAME_OVER),
    };
  
    return moveEvents;
  };
