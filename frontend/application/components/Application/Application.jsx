
import { BrowserRouter as Router, Route } from 'react-router-dom';
import PropTypes from 'prop-types';
import React from 'react';

import * as routePaths from './routePaths';

import Header from '../Layout/Header';

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
            render={() => (<Home
              volunteer={client.volunteer}
              announcements={this.props.announcements}
              notifications={this.props.notifications}
              authentication={this.props.authentication}
              updateNotifications={this.props.updateNotifications}
              updateAnnouncements={this.props.updateAnnouncements}
            />)}
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
        </div>
      </Router>
    );
  }
}

Application.propTypes = {
  authenticating: PropTypes.func.isRequired,
  authentication: PropTypes.shape().isRequired,
  updateNotifications: PropTypes.func.isRequired,
  updateAnnouncements: PropTypes.func.isRequired,
  client: PropTypes.shape().isRequired,
  notifications: PropTypes.arrayOf(PropTypes.shape()).isRequired,
  announcements: PropTypes.arrayOf(PropTypes.shape()).isRequired,
};
