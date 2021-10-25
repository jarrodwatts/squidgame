import { Grid } from "@mui/material";
import React, { FormEvent, useState } from "react";
import Auth from "../components/Auth";
import useUserAuth from "../lib/firebase/useUserAuth";
import runCodeOnPiston from "../lib/piston/runCodeOnPiston";

export default function Home() {
  const [loading, user] = useUserAuth();
  console.log(user);

  return (
    <Grid
      style={{
        width: "100vw",
        height: "100vh",
      }}
      container
      alignItems="center"
      justifyContent="center"
    >
      {loading ? (
        <div>Loading</div>
      ) : (
        <div>
          {user && "hey user"}
          {!user && <Auth />}
        </div>
      )}
    </Grid>
  );
}
