import React, { useEffect } from "react";
import { hooks, metaMask } from "../connectors/metamask";
import { Card, Button, CardActions, CardContent, Grid, Typography } from "@mui/material";
import { getAddChainParameters } from "../chains";
import { MetamaskLogo } from "./metamask-logo";

export const MetamaskCard = ({
  setIsLoggedIn,
}: {
  setIsLoggedIn: (auth: boolean, type: "metamask" | "walletconnect") => void;
}) => {
  const { useChainId, useAccounts, useError, useIsActivating, useIsActive } = hooks;

  const chainId = useChainId();
  const accounts = useAccounts();
  const error = useError();
  const isActivating = useIsActivating();

  const isActive = useIsActive();

  // attempt to connect eagerly on mount
  useEffect(() => {
    void metaMask.connectEagerly();
  }, []);

  const handleConnect = async () => {
    void metaMask.activate(getAddChainParameters(56));
  };

  const handleDisconnect = async () => {
    void metaMask.deactivate();
  };

  useEffect(() => {
    setIsLoggedIn(isActive, "metamask");
  }, [isActive]);

  return (
    <Card sx={{ minWidth: 275, backgroundColor: "rgba(0,0,0,0.6)" }}>
      <CardContent>
        <Grid container direction="row" justifyContent="center" alignItems="center">
          <Grid item>
            <MetamaskLogo />
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
};
