import React, { Component } from "react";
import { connect } from "react-redux";
import {
  Box,
  TextField,
  Button,
  Typography,
  Grid,
  Paper
} from "@material-ui/core";
import AddIcon from "@material-ui/icons/Add";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";

import { apiBase } from "../config";
import Http from "../Http";

class Dashboard extends Component {
  constructor(props) {
    super(props);

    // Initial state.
    this.state = {
      todo: null,
      error: false,
      data: []
    };

    // API endpoint.
    this.api = `${apiBase}/api/v1/todo`;
  }

  componentDidMount() {
    Http.get(`${this.api}?status=open`)
      .then(response => {
        const { data } = response.data;
        this.setState({
          data,
          error: false
        });
      })
      .catch(() => {
        this.setState({
          error: "Unable to fetch data."
        });
      });
  }

  handleChange = e => {
    const { name, value } = e.target;
    this.setState({ [name]: value });
  };

  handleSubmit = e => {
    e.preventDefault();
    const { todo } = this.state;
    this.addTodo(todo);
  };

  addTodo = todo => {
    Http.post(this.api, { value: todo })
      .then(({ data }) => {
        const newItem = {
          id: data.id,
          value: todo
        };
        const allTodos = [newItem, ...this.state.data];
        this.setState({ data: allTodos, todo: null });
        this.todoForm.reset();
      })
      .catch(() => {
        this.setState({
          error: "Sorry, there was an error saving your to do."
        });
      });
  };

  closeTodo = e => {
    const { key } = e.target.dataset;
    const { data: todos } = this.state;

    Http.patch(`${this.api}/${key}`, { status: "closed" })
      .then(() => {
        const updatedTodos = todos.filter(
          todo => todo.id !== parseInt(key, 10)
        );
        this.setState({ data: updatedTodos });
      })
      .catch(() => {
        this.setState({
          error: "Sorry, there was an error closing your to do."
        });
      });
  };

  render() {
    const { data, error } = this.state;

    return (
      <div className="container py-5">
        <Box mb={6}>
          <Typography component="h2" variant="h3">
            Add a To Do
          </Typography>
          <form
            method="post"
            onSubmit={this.handleSubmit}
            ref={el => {
              this.todoForm = el;
            }}
          >
            <Grid
              container
              direction="row"
              justify="flex-start"
              alignItems="stretch"
            >
              <TextField
                name="todo"
                label="Add a New To Do"
                onChange={this.handleChange}
                variant="filled"
              />
              <Button type="submit" variant="contained" color="primary">
                Add
                <AddIcon>+</AddIcon>
              </Button>
            </Grid>
          </form>
        </Box>

        {error && (
          <div className="alert alert-warning" role="alert">
            {error}
          </div>
        )}

        <div className="todos">
          <Typography component="h2" variant="h3">
            Open To Dos
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
                        onClick={this.closeTodo}
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
        </div>
      </div>
    );
  }
}

const mapStateToProps = state => ({
  isAuthenticated: state.Auth.isAuthenticated,
  user: state.Auth.user
});

export default connect(mapStateToProps)(Dashboard);
