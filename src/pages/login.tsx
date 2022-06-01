import React, { useEffect, useState } from "react";
import axios from "axios";
import { WalletConnectCard } from "../components/wallet-connect-card";
import { hooks, walletConnect } from "../connectors/walletConnect";
import { useNavigate } from "react-router-dom";
import { Grid } from "@mui/material";
import { Home } from "./home";
import { Links } from "../components/links";

type LoginType = "metamask" | "walletconnect";

export function Login() {
  const navigateTo = useNavigate();
  const [isLoggedIn, setIsLoggedInState] = useState<boolean>();
  const [loginType, setLoginType] = useState<LoginType>();

  const { useChainId, useAccounts, useError, useIsActivating, useIsActive } = hooks;

  const chainId = useChainId();
  const accounts = useAccounts();
  const error = useError();

  const setIsLoggedIn = (auth: boolean, type: LoginType) => {
    setIsLoggedInState(auth);
    setLoginType(type);
  };

  useEffect(() => {
    if (isLoggedIn) {
      console.log("isLoggedIn", isLoggedIn, "accounts", accounts);
      // navigateTo("/");
      axios
        .post(
          "http://localhost:3002/address",
          {
            accounts,
          },
          {
            headers: { contentType: "application/json; charset=utf-8" },
          }
        )
        .then((response: any) => {
          console.log(response);
        })
        .catch((error: any) => {
          console.log(error);
        });
    }
  }, [isLoggedIn, navigateTo, accounts]);

  return (
    <>
      <Grid
        container
        direction="row"
        justifyContent="center"
        alignItems="center"
        spacing={3}
        sx={{ minHeight: "100vh!important", height: "100%" }}
      >
        {
          /*isLoggedIn &&*/ <Grid item>
            <Home />
          </Grid>
        }
        {/* !isMobile && (
        <Grid item>
          <MetamaskCard setIsLoggedIn={setIsLoggedIn} />
        </Grid>
      ) */}
        <Grid item>
          <WalletConnectCard setIsLoggedIn={setIsLoggedIn} />
        </Grid>
      </Grid>
      <Links />
    </>
  );
}
