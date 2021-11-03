import * as React from "react";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import Player from "../types/Player";
import { Avatar, Grid, Typography } from "@mui/material";
import capitalizeFirst from "../lib/format/capitalizeFirst";

interface Props {
  players: Player[];
}

export default function Leaderboard({ players }: Props) {
  console.log(players);
  return (
    <TableContainer
      component={Paper}
      style={{ maxHeight: 421.5, overflowY: "auto" }}
    >
      <Table aria-label="simple table">
        <TableHead>
          <TableRow>
            <TableCell>Player Name</TableCell>
            <TableCell align="right">Status</TableCell>
            <TableCell align="right">Score</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {players.map((player) => (
            <TableRow
              key={player.id}
              sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
            >
              <TableCell component="th" scope="row">
                <Grid container direction="row" alignItems="center" spacing={1}>
                  <Grid item>
                    <Avatar alt={player.displayName} src={player.photoURL} />
                  </Grid>
                  <Grid item>{player.displayName}</Grid>
                </Grid>
              </TableCell>
              <TableCell align="right">
                <Typography>{capitalizeFirst(player.status)}</Typography>
              </TableCell>
              <TableCell align="right">{player.score}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}
