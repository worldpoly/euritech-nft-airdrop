import React from "react";
import { MetamaskCard } from "../components/metamask-card";
import { WalletConnectCard } from "../components/wallet-connect-card";
import { isMobile } from "react-device-detect";
import { Grid } from "@mui/material";

export function Login() {
  return (
    <Grid
      container
      direction="row"
      justifyContent="center"
      alignItems="center"
      spacing={3}
      sx={{ minHeight: "100vh!important" }}
    >
      {!isMobile && (
        <Grid item>
          <MetamaskCard />
        </Grid>
      )}
      <Grid item>
        <WalletConnectCard />
      </Grid>
    </Grid>
  );
}
