import { Button } from "@mui/material";
import { useEffect } from "react";
import { hooks, walletConnect } from "../connectors/walletConnect";
import { Card } from "./Card";
import { ConnectWithSelect } from "./ConnectWithSelect";

const { useChainId, useAccounts, useError, useIsActivating, useIsActive, useProvider } = hooks;

export function WalletConnectCard() {
  const chainId = useChainId();
  const accounts = useAccounts();
  const error = useError();
  const isActivating = useIsActivating();

  const isActive = useIsActive();

  const provider = useProvider();

  // attempt to connect eagerly on mount
  useEffect(() => {
    void walletConnect.connectEagerly();
  }, []);

  const handleConnect = async () => {
    console.log("chainId", chainId);
    void walletConnect.activate(56);
  };

  return (
    <Card>
      <div>
        <b>WalletConnect</b>
        <div style={{ marginBottom: "1rem" }} />
      </div>
      <div style={{ marginBottom: "1rem" }} />
      <Button onClick={handleConnect}>Connect</Button>
      <ConnectWithSelect
        connector={walletConnect}
        chainId={chainId}
        isActivating={isActivating}
        error={error}
        isActive={isActive}
      />
    </Card>
  );
}
