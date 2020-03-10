import React, { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet';
import {
  Box,
  Button,
  Typography,
  Paper,
  Container,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  IconButton
} from '@material-ui/core';
import MuiAlert from '@material-ui/lab/Alert';
import Delete from '@material-ui/icons/Delete';

import { apiBase } from '../config';
import http from '../http';
import Loader from '../components/Loader';

export default function Archive() {
  // State hooks.
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState({});
  const [apiMore, setApiMore] = useState('');
  const [moreLoaded, setMoreLoaded] = useState(false);
  const [error, setError] = useState(false);

  // API Path
  const api = `${apiBase}/api/v1/todo`;

  // Effect runs once on mount.
  useEffect(() => {
    http
      .get(api)
      .then(response => {
        const { data } = response.data;
        const apiMore = response.data.links.next;
        setData(data);
        setApiMore(apiMore);
        setLoading(false);
        setError(false);
      })
      .catch(() => {
        setError('Unable to fetch data.');
      });
  }, [api]);

  const loadMore = () => {
    setLoading(true);
    http
      .get(apiMore)
      .then(response => {
        const apiMore = response.data.links.next;
        const dataMore = data.concat(response.data.data);
        setData(dataMore);
        setApiMore(apiMore);
        setLoading(false);
        setError(false);
        setMoreLoaded(true);
      })
      .catch(() => {
        setError('Unable to fetch data.');
      });
  };

  const deleteTodo = id => {
    const todos = data;

    http
      .delete(`${api}/${id}`)
      .then(response => {
        if (response.status === 204) {
          const index = todos.findIndex(
            todo => parseInt(todo.id, 10) === parseInt(id, 10)
          );
          const update = [...todos.slice(0, index), ...todos.slice(index + 1)];
          setData(update);
        }
      })
      .catch(error => {
        console.log(error);
      });
  };

  const todos = Array.from(data);

  return (
    <>
      <Helmet>
        <title>Archive | Laravel Material</title>
      </Helmet>
      <Container maxWidth="md">
        {error && <MuiAlert severity="error">{error}</MuiAlert>}

        <Typography component="h2" variant="h3">
          Archive
        </Typography>

        <Box mb={4}>
          <Paper>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Time</TableCell>
                  <TableCell>To Do</TableCell>
                  <TableCell>Status</TableCell>
                  <TableCell>Action</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {todos.map(todo => (
                  <TableRow key={todo.id}>
                    <TableCell component="th" scope="row">
                      {todo.created_at}
                    </TableCell>
                    <TableCell>{todo.value}</TableCell>
                    <TableCell>{todo.status}</TableCell>
                    <TableCell>
                      <IconButton
                        aria-label="Close"
                        onClick={() => deleteTodo(todo.id)}
                      >
                        <Delete />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </Paper>
        </Box>

        {apiMore && (
          <Button
            variant="contained"
            color="primary"
            disabled={loading}
            fullWidth
            type="submit"
            onClick={loadMore}
          >
            {!loading && <span>Load More</span>}
            {loading && <Loader />}
            )}
          </Button>
        )}

        {apiMore === null && moreLoaded === true && (
          <Typography variant="body2" align="center">
            Everything loaded.
          </Typography>
        )}
      </Container>
    </>
  );
}
