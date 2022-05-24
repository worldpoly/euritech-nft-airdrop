import { Card, Button, CardActions, CardContent, Grid, Typography } from "@mui/material";
import { useEffect, useState } from "react";
import { hooks, walletConnect } from "../connectors/walletConnect";
import { ReactComponent as WalletConnectBanner } from "../assets/walletconnect-banner.svg";

export function WalletConnectCard({
  setIsLoggedIn,
}: {
  setIsLoggedIn: (auth: boolean, type: "metamask" | "walletconnect") => void;
}) {
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

  useEffect(() => {
    setIsLoggedIn(isActive, "walletconnect");
  }, [isActive]);

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
        <Grid container direction="column" justifyContent="center" alignItems="center">
          <Grid item>
            <Typography>{accounts?.map((account) => account)}</Typography>
          </Grid>
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
