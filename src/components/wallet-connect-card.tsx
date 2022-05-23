import { Card, Button, CardActions, CardContent, Grid, Typography, SvgIcon } from "@mui/material";
import { useEffect } from "react";
import { hooks, walletConnect } from "../connectors/walletConnect";

import type { CoinbaseWallet } from "@web3-react/coinbase-wallet";
import type { Web3ReactHooks } from "@web3-react/core";
import { GnosisSafe } from "@web3-react/gnosis-safe";
import type { MetaMask } from "@web3-react/metamask";
import { Network } from "@web3-react/network";
import { WalletConnect } from "@web3-react/walletconnect";
import { useCallback, useState } from "react";
import { CHAINS, getAddChainParameters, URLS } from "../chains";
import { ReactComponent as WalletConnectBanner } from "../assets/walletconnect-banner.svg";

export function ConnectWithSelect({
  connector,
  chainId,
  isActivating,
  error,
  isActive,
}: {
  connector: MetaMask | WalletConnect | CoinbaseWallet | Network | GnosisSafe;
  chainId: ReturnType<Web3ReactHooks["useChainId"]>;
  isActivating: ReturnType<Web3ReactHooks["useIsActivating"]>;
  error: ReturnType<Web3ReactHooks["useError"]>;
  isActive: ReturnType<Web3ReactHooks["useIsActive"]>;
}) {
  const isNetwork = connector instanceof Network;
  const displayDefault = !isNetwork;
  const chainIds = (isNetwork ? Object.keys(URLS) : Object.keys(CHAINS)).map((chainId) => Number(chainId));

  const [desiredChainId, setDesiredChainId] = useState<number>(isNetwork ? 1 : -1);

  if (error) {
    console.log("error", error);
    return (
      <div style={{ display: "flex", flexDirection: "column" }}>
        <div style={{ marginBottom: "1rem" }} />
        <button
          onClick={() =>
            connector instanceof GnosisSafe
              ? void connector.activate()
              : connector instanceof WalletConnect || connector instanceof Network
              ? void connector.activate(desiredChainId === -1 ? undefined : desiredChainId)
              : void connector.activate(desiredChainId === -1 ? undefined : getAddChainParameters(desiredChainId))
          }
        >
          Try Again?
        </button>
      </div>
    );
  } else if (isActive) {
    return (
      <div style={{ display: "flex", flexDirection: "column" }}>
        <div style={{ marginBottom: "1rem" }} />
        <button onClick={() => void connector.deactivate()}>Disconnect</button>
      </div>
    );
  } else {
    return (
      <div style={{ display: "flex", flexDirection: "column" }}>
        <div style={{ marginBottom: "1rem" }} />
        <button
          onClick={
            isActivating
              ? undefined
              : () =>
                  connector instanceof GnosisSafe
                    ? void connector.activate()
                    : connector instanceof WalletConnect || connector instanceof Network
                    ? connector.activate(desiredChainId === -1 ? undefined : desiredChainId)
                    : connector.activate(desiredChainId === -1 ? undefined : getAddChainParameters(desiredChainId))
          }
          disabled={isActivating}
        >
          Connect
        </button>
      </div>
    );
  }
}

export function WalletConnectCard() {
  const { useChainId, useAccounts, useError, useIsActivating, useIsActive } = hooks;

  const chainId = useChainId();
  const accounts = useAccounts();
  const error = useError();
  const isActivating = useIsActivating();
  const isActive = useIsActive();

  // attempt to connect eagerly on mount
  useEffect(() => {
    void walletConnect.connectEagerly();
  }, []);

  const handleConnect = async () => {
    console.log("chainId", chainId);
    void walletConnect.activate();
  };

  const handleDisconnect = async () => {
    console.log("disconnect");
    void walletConnect.deactivate();
  };

  return (
    <Card sx={{ minWidth: 275, backgroundColor: "rgba(0,0,0,0.6)" }}>
      <CardContent>
        <Grid container direction="row" justifyContent="center" alignItems="center">
          <Grid item>
            <WalletConnectBanner
              width={Math.floor(window.innerWidth / 5)}
              height={Math.floor(window.innerHeight / 5)}
            />
          </Grid>
        </Grid>
      </CardContent>
      <CardActions>
        <Grid container direction="row" justifyContent="center" alignItems="center">
          <Grid item>
            <Button onClick={isActive ? handleDisconnect : handleConnect} sx={{ color: "#fff" }} size="large">
              <Typography variant="h6">{error ? "Try again?" : isActive ? "Disconnect" : "Connect"}</Typography>
            </Button>
          </Grid>
        </Grid>
      </CardActions>
    </Card>
  );
}
