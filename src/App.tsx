import React from "react";
import { Button, Card, CardActions, CardContent, Grid, Typography } from "@mui/material";
import { useWeb3React } from "@web3-react/core";
import { useSnackbar } from "notistack";
import { MetamaskLogo } from "./components/metamask-logo";

import "./App.css";
import { MetamaskCard } from "./components/metamask-card";
import { WalletConnectCard } from "./components/wallet-connect-card";

function App() {
  const { enqueueSnackbar } = useSnackbar();

  async function connect() {
    try {
      enqueueSnackbar("Connected to Wallet!", { variant: "info" });
    } catch (ex) {
      console.log(ex);
      enqueueSnackbar("Error while connecting to Wallet!", {
        variant: "error",
        persist: false,
        preventDuplicate: true,
      });
    }
  }

  const handleConnectWallet = async () => {
    await connect();
  };

  return (
    <Grid container direction="column" justifyContent="flex-start" alignItems="center">
      <Grid item>
        <Card sx={{ minWidth: 275 }}>
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
                <Button onClick={handleConnectWallet} sx={{ color: "#fff" }} size="large">
                  <Typography variant="h6">CONNECT WALLET</Typography>
                </Button>
              </Grid>
            </Grid>
          </CardActions>
        </Card>
      </Grid>
      <Grid item>
        <MetamaskCard />
      </Grid>
      <Grid item>
        <WalletConnectCard />
      </Grid>
    </Grid>
  );
}

export default App;
