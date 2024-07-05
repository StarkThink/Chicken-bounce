import { useState } from "react";
import ReactDOM from "react-dom/client";
import App from "./App.tsx";
import "./index.css";
import { setup } from "./dojo/generated/setup";
import { DojoProvider } from "./dojo/DojoContext.tsx";
import { dojoConfig } from "../dojoConfig";
import { Loading } from "./Loading";
import { sepolia } from "@starknet-react/chains";
import cartridgeConnector from "./cartridgeConnector.tsx";
import { StarknetConfig, jsonRpcProvider } from "@starknet-react/core";

function rpc() {
    return {
      nodeUrl: "https://starknet-sepolia.public.blastapi.io/rpc/v0_6",
    };
  }

async function init() {
    const rootElement = document.getElementById("root");
    if (!rootElement) throw new Error("React root not found");
    const root = ReactDOM.createRoot(rootElement as HTMLElement);

    const chains = [sepolia];
    const connectors = [cartridgeConnector];

    const setupResult = await setup(dojoConfig);
    !setupResult && <Loading />;

    root.render(
        <StarknetConfig
            chains={chains}
            provider={jsonRpcProvider({ rpc })}
            connectors={connectors}
            autoConnect
        >
            <DojoProvider value={setupResult}>
              <App />
            </DojoProvider>
        </StarknetConfig>
    );
}

init();
