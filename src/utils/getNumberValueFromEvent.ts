import { Type } from "@dojoengine/recs";
import { parseComponentValue } from "@dojoengine/utils";
import { DojoEvent } from "../types/DojoEvent";

export const getNumberValueFromEvent = (
  event: DojoEvent,
  readFromData: boolean,
  indexToGet: number
): number | undefined => {
  if (readFromData) {
    const txValue = event.data.at(indexToGet);
    return txValue ? (parseComponentValue(txValue, Type.Number) as number) : undefined;
  } else {
    const txValue = event.keys.at(indexToGet);
    return txValue ? (parseComponentValue(txValue, Type.Number) as number) : undefined;
  }
};

export const getNumberValueFromEvents = (
  events: DojoEvent[],
  event_address: string,
  readFromData: boolean,
  indexToGet: number
): number | undefined => {
  const event = events?.find((e) => {
    return e.keys[0] === event_address;
  });
  return event && getNumberValueFromEvent(event, readFromData, indexToGet);
};
