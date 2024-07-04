import { getComponentValue, Entity, OverridableComponent  } from "@dojoengine/recs";
import { getEntityIdFromKeys } from "@dojoengine/utils";
import { decodeString } from "./decodeString";

export const getBoard = (
  gameId: number,
  Tile: OverridableComponent,
  Board: OverridableComponent
) => {
    // Read Board
    const entityId = getEntityIdFromKeys([
        BigInt(gameId),
    ]) as Entity;
    let board = getComponentValue(Board, entityId) ?? { len_rows: 0, len_cols: 0};
    let rows = board.len_rows;
    let cols = board.len_cols;

    // Read Tiles
    let result: string[][] = Array.from({ length: rows }, () => new Array(cols).fill(''));
    for (let i = 0; i < rows; i++) {
        for (let j = 0; j < cols; j++) {
            let tilesEntityId = getEntityIdFromKeys([
                BigInt(i), BigInt(j), BigInt(gameId),
            ]) as Entity;
            let tile = getComponentValue(Tile, tilesEntityId) ?? { value: 'undefined'};
            result[i][j] = decodeString(tile.value);
        }
    }
    return result;
};
