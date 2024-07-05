import { AccountInterface } from "starknet";
import { ClientComponents } from "./createClientComponents"
import { ContractComponents } from "./generated/contractComponents";
import type { IWorld } from "./generated/generated";
import { getNumberValueFromEvents } from "../utils/getNumberValueFromEvent"
import { getPlayEvents } from "../utils/playEvents";
import { CREATE_GAME_EVENT, GAME_EVENT } from "../constants/dojoEventKeys";

export type SystemCalls = ReturnType<typeof createSystemCalls>;

export function createSystemCalls(
    { client }: { client: IWorld },
    _contractComponents: ContractComponents,
    {  }: ClientComponents
) {
    const create_game = async (account: AccountInterface, username: string) => {
        try {
            const { transaction_hash } = await client.actions.create_game({
                account, username
            });

            const tx = await account.waitForTransaction(transaction_hash, {
                retryInterval: 100,
              });
        
            if (tx.isSuccess()) {
                const events = tx.events;
                const gameId = getNumberValueFromEvents(events, CREATE_GAME_EVENT, false, 1);
                console.log("Game " + gameId + " created");
                return gameId;
            } else {
                console.error("Error creating game:", tx);
            }
        } catch (e) {
            console.log(e);
        }
        return -1;
    };

    const play = async (account: AccountInterface, game_id: number, rowIndex: number, colIndex: number) => {
        try {
            const { transaction_hash } = await client.actions.play({
                account, game_id, rowIndex, colIndex
            });

            const tx = await account.waitForTransaction(transaction_hash, {
                retryInterval: 100,
              });
        
            if (tx.isSuccess()) {
                const events = tx.events;
                console.log('Play events:', events);
                console.log('Play events parsed:', getPlayEvents(events));
                return getPlayEvents(events).gameWin;
            } else {
                console.error("Error creating game:", tx);
                return false;
            }
        } catch (e) {
            false;
        }
    };

    const create_round = async (account: AccountInterface, game_id: number) => {
        try {
            const { transaction_hash } = await client.actions.create_round({
                account, game_id
            });

            const tx = await account.waitForTransaction(transaction_hash, {
                retryInterval: 100,
              });
        
            if (tx.isSuccess()) {
                const events = tx.events;
                const score = getNumberValueFromEvents(events, GAME_EVENT, true, 0);
                const round = getNumberValueFromEvents(events, GAME_EVENT, true, 1);
                return {score: score, round: round};
            } else {
                console.error("Error creating round:", tx);
                return {score: 0, round: 0};
            }
        } catch (e) {
            console.log(e);
            return {score: 0, round: 0};
        }
    };

    const end_game = async (account: AccountInterface, game_id: number) => {
        try {
            const { transaction_hash } = await client.actions.end_game({
                account, game_id
            });

            const tx = await account.waitForTransaction(transaction_hash, {
                retryInterval: 100,
              });
        
            if (tx.isSuccess()) {
                const events = tx.events;
                return getPlayEvents(events);
            } else {
                console.error("Error ending game:", tx);
                return {game_id: 0};
            }
        } catch (e) {
            console.log(e);
        }
    };

    return {
        create_game,
        play,
        create_round,
        end_game
    };
}
