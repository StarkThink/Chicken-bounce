import { getComponentValue } from "@dojoengine/recs";
import { Entity, OverridableComponent } from "@dojoengine/recs/src/types";
import { getEntityIdFromKeys } from "@dojoengine/utils";

export const getGame = (
  gameId: number,
  Game: OverridableComponent
) => {
  const entityId = getEntityIdFromKeys([
    BigInt(gameId),
  ]) as Entity;
  return getComponentValue(Game, entityId);
};

export const gameExists = (
  Game: OverridableComponent,
  gameId: number
) => {
  const game = getGame(gameId, Game);
  return !!game;
};
