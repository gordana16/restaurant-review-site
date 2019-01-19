import React, { Component } from "react";
import { BrowserRouter as Router, Route } from "react-router-dom";
import Main from "./containers/Main";
import Place from "./containers/Place";
import "./App.css";

class App extends Component {
  render() {
    return (
      <Router>
        <div className="App">
          <Route exact path="/" component={Main} />
          <Route path="/:place_id" component={Place} />
        </div>
      </Router>
    );
  }
}

export default App;
