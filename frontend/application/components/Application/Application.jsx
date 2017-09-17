
import { BrowserRouter as Router, Route } from 'react-router-dom';
import PropTypes from 'prop-types';
import React from 'react';

import * as routePaths from './routePaths';

import Header from '../Layout/Header';
import Footer from '../Layout/Footer';

import Login from '../Login/Login';
import Reset from '../Reset/Reset';
import Verify from '../Verify/Verify';
import Home from '../Home/Home';

export default class Application extends React.Component {
  constructor(props) {
    super(props);

    this.routePaths = routePaths;
  }

  render() {
    const authenticating = this.props.authenticating;
    const client = this.props.client;

    return (
      <Router>
        <div>
          <Header logo={'/components/img/logo.png'} />
          <Route
            exact
            path="/"
            render={() => <Home />}
          />
          <Route
            path={this.routePaths.login}
            render={() => <Login client={client} authenticating={authenticating} />}
          />
          <Route
            path={this.routePaths.reset}
            render={props => <Reset volunteer={client.volunteer} {...props} />}
          />
          <Route
            path={this.routePaths.verify}
            render={props => <Verify volunteer={client.volunteer} {...props} />}
          />
          <Footer />
        </div>
      </Router>
    );
  }
}

Application.propTypes = {
  authenticating: PropTypes.func.isRequired,
  client: PropTypes.shape().isRequired,
};
