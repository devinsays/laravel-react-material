import React, { useEffect, useState } from "react";
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
  CircularProgress
} from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import MuiAlert from "@material-ui/lab/Alert";

import { apiBase } from "../config";
import Http from "../Http";

export default function Archive() {
  // State hooks.
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState({});
  const [apiMore, setApiMore] = useState("");
  const [moreLoaded, setMoreLoaded] = useState(false);
  const [error, setError] = useState(false);

  // API Path
  const api = `${apiBase}/api/v1/todo`;

  // Effect runs once on mount.
  useEffect(() => {
    Http.get(api)
      .then(response => {
        const { data } = response.data;
        const apiMore = response.data.links.next;
        setData(data);
        setApiMore(apiMore);
        setLoading(false);
        setError(false);
      })
      .catch(() => {
        setError("Unable to fetch data.");
      });
  }, [api]);

  const loadMore = () => {
    setLoading(true);
    Http.get(apiMore)
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
        setError("Unable to fetch data.");
      });
  };

  const deleteTodo = e => {
    const { key } = e.target.dataset;
    const todos = data;

    Http.delete(`${api}/${key}`)
      .then(response => {
        if (response.status === 204) {
          const index = todos.findIndex(
            todo => parseInt(todo.id, 10) === parseInt(key, 10)
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

  // Styles.
  const classes = useStyles();

  return (
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
                    <button
                      type="button"
                      className="btn btn-secondary"
                      onClick={deleteTodo}
                      data-key={todo.id}
                    >
                      Delete
                    </button>
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
          {loading && (
            <CircularProgress
              size={24}
              thickness={4}
              className={classes.loader}
            />
          )}
        </Button>
      )}

      {apiMore === null && moreLoaded === true && (
        <Typography variant="body2" align="center">
          Everything loaded.
        </Typography>
      )}
    </Container>
  );
}

const useStyles = makeStyles(() => ({
  loader: {
    color: "#fff"
  }
}));
