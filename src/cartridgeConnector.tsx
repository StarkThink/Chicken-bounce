import { Connector } from "@starknet-react/core";
import CartridgeConnector from "@cartridge/connector";
import { getContractByName } from "@dojoengine/core";
import manifest from "./manifest.json";
const paymaster: any = { caller: "0x414e595f43414c4c4552" };

const actions_contract_address = getContractByName(
  manifest,
  "chicken_bounce::systems::game_system::game_system",
)?.address;

const cartridgeConnector = new CartridgeConnector(
  [
    {
      target: import.meta.env.VITE_PUBLIC_ACCOUNT_CLASS_HASH,
      method: "initialize",
    },
    {
      target: import.meta.env.VITE_PUBLIC_ACCOUNT_CLASS_HASH,
      method: "create",
    },
    // actions
    {
      target: actions_contract_address,
      method: "create_game",
    },
    {
      target: actions_contract_address,
      method: "play",
    },
    {
      target: actions_contract_address,
      method: "create_round",
    },
    {
      target: actions_contract_address,
      method: "end_game",
    },
  ],
  { theme: "chicken_bounce", paymaster },
) as never as Connector;

export default cartridgeConnector;
