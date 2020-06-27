import React, { Component } from "react";
import socket from "../api/receive";
import { Route, Switch, Link, BrowserRouter as Router } from "react-router-dom";
import Table from "./Table";
import Dashboard from "./Dashboard";
import NotFound from "./NotFound";
import Login from "./Authorization";

class Root extends Component {
  constructor(props) {
    super(props);
    this.state = {
      currentPlayers: [],
    };
    this.handleClick = this.handleClick.bind(this);
  }

  // handleClick() {
  //     this.setState({isStarted: true});
  // }

  render() {
    return (
      <Router>
        <Switch>
          <Route exact path="/" component={Login} />
          <Route path="/tables" render={(props) => <Dashboard {...props} />} />
          <Route path="/table:id" render={(props) => <Table {...props} />} />
          <Route component={NotFound} />
        </Switch>
      </Router>
    );
  }
}

export default Root;
