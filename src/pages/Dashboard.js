import React, { useEffect, useState } from 'react';
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
  TableRow,
  IconButton,
  FormControl,
  InputLabel,
  FilledInput,
  Input,
  InputAdornment
} from '@material-ui/core';
import AddIcon from '@material-ui/icons/Add';
import CloseIcon from '@material-ui/icons/HighlightOff';

import { apiBase } from '../config';
import Http from '../Http';

export default function Dashboard() {
  // State hooks.
  const [todo, setTodo] = useState('');
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
        setError('Unable to fetch data.');
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
        setTodo('');
      })
      .catch(() => {
        setError('Sorry, there was an error saving your to do.');
      });
  };

  const closeTodo = id => {
    const todos = data;

    Http.patch(`${api}/${id}`, { status: 'closed' })
      .then(() => {
        const updatedTodos = todos.filter(todo => todo.id !== parseInt(id, 10));
        setData(updatedTodos);
      })
      .catch(() => {
        setError('Sorry, there was an error closing your to do.');
      });
  };

  return (
    <Container maxWidth="md">
      <Box mb={6}>
        <Typography component="h2" variant="h3">
          Add a Task
        </Typography>
        <form method="post" onSubmit={handleSubmit}>
          <FormControl fullWidth variant="filled">
            <InputLabel htmlFor="add-todo">New Task</InputLabel>
            <FilledInput
              id="add-todo"
              onChange={handleChange}
              value={todo}
              endAdornment={
                <InputAdornment position="end">
                  <IconButton
                    aria-label="toggle password visibility"
                    type="submit"
                  >
                    <AddIcon />
                  </IconButton>
                </InputAdornment>
              }
            />
          </FormControl>
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
                  <IconButton
                    aria-label="Close"
                    onClick={() => closeTodo(row.id)}
                  >
                    <CloseIcon />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Paper>
    </Container>
  );
}
