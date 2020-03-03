import React, { useEffect, useState } from "react";
import {
  Box,
  TextField,
  Button,
  Typography,
  Grid,
  Paper,
  Container,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow
} from "@material-ui/core";
import AddIcon from "@material-ui/icons/Add";

import { apiBase } from "../config";
import Http from "../Http";

export default function Dashboard() {
  // State hooks.
  const [todo, setTodo] = useState("");
  const [error, setError] = useState(false);
  const [data, setData] = useState([]);

  // API Path
  const api = `${apiBase}/api/v1/todo`;

  // Effect runs once on mount.
  useEffect(() => {
    Http.get(`${api}?status=open`)
      .then(response => {
        const { data } = response.data;
        setData(data);
        setError(false);
      })
      .catch(() => {
        setError("Unable to fetch data.");
      });
  }, [api]);

  const handleChange = e => {
    const { value } = e.target;
    setTodo(value);
  };

  const handleSubmit = e => {
    e.preventDefault();
    addTodo(todo);
  };

  const addTodo = todo => {
    Http.post(api, { value: todo })
      .then(({ data: response }) => {
        const newItem = {
          id: response.id,
          value: todo
        };
        const allTodos = [newItem, ...data];
        setData(allTodos);
        setTodo("");
      })
      .catch(() => {
        setError("Sorry, there was an error saving your to do.");
      });
  };

  const closeTodo = e => {
    const { key } = e.target.dataset;
    const todos = data;

    Http.patch(`${api}/${key}`, { status: "closed" })
      .then(() => {
        const updatedTodos = todos.filter(
          todo => todo.id !== parseInt(key, 10)
        );
        setData(updatedTodos);
      })
      .catch(() => {
        setError("Sorry, there was an error closing your to do.");
      });
  };

  return (
    <Container maxWidth="md">
      <Box mb={6}>
        <Typography component="h2" variant="h3">
          Add a Task
        </Typography>
        <form method="post" onSubmit={handleSubmit}>
          <Grid
            container
            direction="row"
            justify="flex-start"
            alignItems="stretch"
            spacing={2}
          >
            <Grid item>
              <TextField
                name="todo"
                label="New Task"
                onChange={handleChange}
                value={todo}
                variant="filled"
              />
            </Grid>
            <Grid item>
              <Button type="submit" variant="contained" color="primary">
                Add
                <AddIcon>+</AddIcon>
              </Button>
            </Grid>
          </Grid>
        </form>
      </Box>

      {error && (
        <div className="alert alert-warning" role="alert">
          {error}
        </div>
      )}

      <Typography component="h2" variant="h3">
        Open Tasks
      </Typography>
      <Paper>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>To Do</TableCell>
              <TableCell align="right">Action</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {data.map(row => (
              <TableRow key={row.id}>
                <TableCell component="th" scope="row">
                  {row.value}
                </TableCell>
                <TableCell align="right">
                  <button
                    type="button"
                    className="btn btn-secondary"
                    onClick={closeTodo}
                    data-key={row.id}
                  >
                    Close
                  </button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Paper>
    </Container>
  );
}
