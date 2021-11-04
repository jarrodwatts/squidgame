import React, { ReactElement } from "react";
import Button from "@mui/material/Button";
import signupUserWithGithub from "../lib/signupWithGithub";
import writePlayerToPlayersCollection from "../lib/writePlayerToPlayersCollection";
import { Grid, Typography } from "@mui/material";
import GitHubIcon from "@mui/icons-material/GitHub";

interface Props {}

export default function Auth({}: Props): ReactElement {
  async function handleSignup() {
    const userInfo = await signupUserWithGithub();
    const writeResult = await writePlayerToPlayersCollection(userInfo.user);
  }

  return (
    <Grid container direction="column" spacing={1} alignItems="center">
      <Grid item>
        <Typography variant="h2">Sign Up To Play</Typography>
      </Grid>
      <Grid item>
        <Button
          variant="contained"
          color="primary"
          startIcon={<GitHubIcon />}
          onClick={() => handleSignup()}
        >
          Sign Up With GitHub
        </Button>
      </Grid>
    </Grid>
  );
}
