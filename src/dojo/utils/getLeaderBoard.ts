import { getComponentValue } from "@dojoengine/recs";
import { Entity, OverridableComponent } from "@dojoengine/recs/src/types";
import { getEntityIdFromKeys } from "@dojoengine/utils";
import { decodeString } from "./decodeString";

interface Player {
  player_name: string;
  score: number;
}

export const getLeaderBoard = (
  LeaderBoard: OverridableComponent,
  LeaderBoardPlayers: OverridableComponent
): [string, number][] => {
  const entityId = getEntityIdFromKeys([
    BigInt(1),
  ]) as Entity;
  const leaderboard = getComponentValue(LeaderBoard, entityId) ?? { len_players: 0 };

  let players: Player[] = [];
  for (let i = 0; i < leaderboard.len_players; i++) {
    const entityId = getEntityIdFromKeys([
      BigInt(i),
    ]) as Entity;
    const player = getComponentValue(LeaderBoardPlayers, entityId) ?? { player_name: '', score: 0 };
    if (player.player_name === '') {
      continue;
    }
    const player_object: Player = { player_name: decodeString(player.player_name), score: player.score };
    players.push(player_object);
  }

  // Sort players by score in descending order
  players.sort((a, b) => b.score - a.score);

  // Transform the sorted array into the desired matrix format
  let result: [string, number][] = players.map(player => [player.player_name, player.score]);

  return result;
};
