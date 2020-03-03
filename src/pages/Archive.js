import React, { Component } from "react";
import classNames from "classnames";
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
import MuiAlert from "@material-ui/lab/Alert";

import { apiBase } from "../config";
import Http from "../Http";

class Archive extends Component {
  constructor(props) {
    super(props);

    this.state = {
      loading: true,
      data: {},
      apiMore: "",
      moreLoaded: false,
      error: false
    };

    // API Endpoint
    this.api = `${apiBase}/api/v1/todo`;
  }

  componentDidMount() {
    Http.get(this.api)
      .then(response => {
        const { data } = response.data;
        const apiMore = response.data.links.next;
        this.setState({
          data,
          apiMore,
          loading: false,
          error: false
        });
      })
      .catch(() => {
        this.setState({
          error: "Unable to fetch data."
        });
      });
  }

  loadMore = () => {
    this.setState({ loading: true });
    Http.get(this.state.apiMore)
      .then(response => {
        const { data } = response.data;
        const apiMore = response.data.links.next;
        const dataMore = this.state.data.concat(data);
        this.setState({
          data: dataMore,
          apiMore,
          loading: false,
          moreLoaded: true,
          error: false
        });
      })
      .catch(() => {
        this.setState({
          error: "Unable to fetch data."
        });
      });
  };

  deleteTodo = e => {
    const { key } = e.target.dataset;
    const { data: todos } = this.state;

    Http.delete(`${this.api}/${key}`)
      .then(response => {
        if (response.status === 204) {
          const index = todos.findIndex(
            todo => parseInt(todo.id, 10) === parseInt(key, 10)
          );
          const update = [...todos.slice(0, index), ...todos.slice(index + 1)];
          this.setState({ data: update });
        }
      })
      .catch(error => {
        console.log(error);
      });
  };

  render() {
    const { loading, error, apiMore } = this.state;
    const todos = Array.from(this.state.data);

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
                        onClick={this.deleteTodo}
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
            onClick={this.loadMore}
          >
            {!loading && <span>Load More</span>}
            {loading && (
              <CircularProgress
                size={24}
                thickness={4}
                // className={classes.loader}
              />
            )}
          </Button>
        )}

        {apiMore === null && this.state.moreLoaded === true && (
          <Typography variant="body2" align="center">
            Everything loaded.
          </Typography>
        )}
      </Container>
    );
  }
}

export default Archive;
