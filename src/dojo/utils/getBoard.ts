import { getComponentValue, Entity, OverridableComponent  } from "@dojoengine/recs";
import { getEntityIdFromKeys } from "@dojoengine/utils";
import { useComponentValue } from "@dojoengine/react";
import { decodeString } from "./decodeString";
import { useMemo } from "react";
import { useDojo } from "../useDojo";

export const getBoard = (
  gameId: number,
  Tile: OverridableComponent,
  Board: OverridableComponent
) => {
    // const {
    //     setup: {
    //         systemCalls: {  },
    //         clientComponents: { Board },
    //     },
    //   } = useDojo();
    // Read Board
    //gameId = 1;
    const boardKey = useMemo(
        () => getEntityIdFromKeys([BigInt(gameId)]) as Entity,
        [gameId],
    );
    
    console.log('boardKey game id is', gameId);
    const board = useComponentValue(Board, boardKey);

    // const entityId = getEntityIdFromKeys([
    //     BigInt(gameId),
    // ]) as Entity;
    //let board = getComponentValue(Board, entityId) ?? { len_rows: 0, len_cols: 0};
    console.log('board is', board);
    if (board === undefined) {
        let result: string[][] = Array.from({ length: 0 }, () => new Array(cols).fill(''));
        console.log('board is undefined');
        return [];
    }
    let rows = board.len_rows;
    let cols = board.len_cols;

    // Read Tiles
    let result: string[][] = Array.from({ length: rows }, () => new Array(cols).fill(''));
    for (let i = 0; i < rows; i++) {
        for (let j = 0; j < cols; j++) {
            let tilesEntityId = getEntityIdFromKeys([
                BigInt(i), BigInt(j), BigInt(gameId),
            ]) as Entity;
            let tile = useComponentValue(Tile, tilesEntityId) ?? { value: 'undefined'};
            if (tile.value === 'undefined'){
                console.log('tile value is undefined, i:', i, 'j:', j);
                continue;
            }
            result[i][j] = decodeString(tile.value);
        }
    }
    return result;
};
