import { Grid } from "@mui/material";
// import { useSnackbar } from "notistack";

import "./App.css";
import { MetamaskCard } from "./components/metamask-card";
import { WalletConnectCard } from "./components/wallet-connect-card";
import { isMobile } from "react-device-detect";

function App() {
  // const { enqueueSnackbar } = useSnackbar();

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

export default App;
