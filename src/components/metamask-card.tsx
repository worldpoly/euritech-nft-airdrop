import React, { useEffect } from "react";
import { hooks, metaMask } from "../connectors/metamask";
import { ConnectWithSelect } from "./ConnectWithSelect";
import { Card } from "./Card";

export const MetamaskCard = () => {
  const { useChainId, useAccounts, useError, useIsActivating, useIsActive, useProvider } = hooks;

  const chainId = useChainId();
  const accounts = useAccounts();
  const error = useError();
  const isActivating = useIsActivating();

  const isActive = useIsActive();

  const provider = useProvider();

  // attempt to connect eagerly on mount
  useEffect(() => {
    void metaMask.connectEagerly();
  }, []);

  return (
    <Card>
      <div>
        <b>MetaMask</b>
        <div style={{ marginBottom: "1rem" }} />
      </div>
      <div style={{ marginBottom: "1rem" }} />
      <ConnectWithSelect
        connector={metaMask}
        chainId={chainId}
        isActivating={isActivating}
        error={error}
        isActive={isActive}
      />
    </Card>
  );
};
