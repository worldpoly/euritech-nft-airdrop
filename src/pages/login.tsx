import React, { useEffect, useState } from "react";
import { MetamaskCard } from "../components/metamask-card";
import { WalletConnectCard } from "../components/wallet-connect-card";
import { isMobile } from "react-device-detect";
import { useNavigate } from "react-router-dom";
import { Grid } from "@mui/material";

type LoginType = "metamask" | "walletconnect";

export function Login() {
  const navigateTo = useNavigate();
  const [isLoggedIn, setIsLoggedInState] = useState<boolean>();
  const [loginType, setLoginType] = useState<LoginType>();

  const setIsLoggedIn = (auth: boolean, type: LoginType) => {
    setIsLoggedInState(auth);
    setLoginType(type);
  };

  useEffect(() => {
    if (isLoggedIn) {
      console.log("isLoggedIn", isLoggedIn);
      navigateTo("/");
    }
  }, [isLoggedIn, navigateTo]);

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
          <MetamaskCard setIsLoggedIn={setIsLoggedIn} />
        </Grid>
      )}
      <Grid item>
        <WalletConnectCard setIsLoggedIn={setIsLoggedIn} />
      </Grid>
    </Grid>
  );
}
