import * as React from "react";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";

function createData(name: string, calories: number, fat: number) {
  return { name, calories, fat };
}

const rows = [
  createData("Frozen yoghurt", 159, 6.0),
  createData("Ice cream sandwich", 237, 9.0),
  createData("Eclair", 262, 16.0),
  createData("Cupcake", 305, 3.7),
  createData("Gingerbread", 356, 16.0),
];

export default function BasicTable() {
  return (
    <TableContainer component={Paper}>
      <Table aria-label="simple table">
        <TableHead>
          <TableRow>
            <TableCell>Player Name</TableCell>
            <TableCell align="right">Status</TableCell>
            <TableCell align="right">Score</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {rows.map((row) => (
            <TableRow
              key={row.name}
              sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
            >
              <TableCell component="th" scope="row">
                {row.name}
              </TableCell>
              <TableCell align="right">{row.calories}</TableCell>
              <TableCell align="right">{row.fat}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}
