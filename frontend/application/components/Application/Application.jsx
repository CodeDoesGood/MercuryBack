
import { BrowserRouter as Router, Route } from 'react-router-dom';
import PropTypes from 'prop-types';
import React from 'react';

import * as routePaths from './routePaths';

import Header from '../Layout/Header';

import Login from '../Login/Login';
import SignOut from '../Login/SignOut';
import Reset from '../Reset/Reset';
import Verify from '../Verify/Verify';
import Home from '../Home/Home';
import Profile from '../Profile/Profile';
import Projects from '../Projects/Projects';

import style from './application.less';

export default class Application extends React.Component {
  constructor(props) {
    super(props);

    this.routePaths = routePaths;
  }

  render() {
    const { authenticating, client } = this.props;

    return (
      <Router>
        <div className={style.applicationScale}>
          <Header logo="/components/img/logo.png" />
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
            render={history => (<Login
              history={history.history}
              client={client}
              authenticating={authenticating}
              updateVolunteerProfile={this.props.updateVolunteerProfile}
            />)}
          />
          <Route
            path={this.routePaths.signOut}
            render={history => <SignOut history={history.history} />}
          />
          <Route
            path={this.routePaths.reset}
            render={props => <Reset volunteer={client.volunteer} {...props} />}
          />
          <Route
            path={this.routePaths.verify}
            render={props => <Verify volunteer={client.volunteer} {...props} />}
          />
          <Route
            path={this.routePaths.projects}
            render={() => (<Projects
              projectsClient={client.projects}
              authentication={this.props.authentication}
              updateProjects={this.props.updateProjects}
              removeProject={this.props.removeProject}
              projects={this.props.projects}
            />)}
          />
          <Route
            path={this.routePaths.myProfile}
            render={history => (<Profile
              volunteer={client.volunteer}
              authentication={this.props.authentication}
              updateVolunteerProfile={this.props.updateVolunteerProfile}
              removeVolunteerProfile={this.props.removeVolunteerProfile}
              profile={this.props.profile}
              history={history.history}
            />)}
          />
        </div>
      </Router>
    );
  }
}

Application.propTypes = {
  authenticating: PropTypes.func.isRequired,
  authentication: PropTypes.shape().isRequired,
  updateProjects: PropTypes.func.isRequired,
  removeProject: PropTypes.func.isRequired,
  updateNotifications: PropTypes.func.isRequired,
  updateVolunteerProfile: PropTypes.func.isRequired,
  removeVolunteerProfile: PropTypes.func.isRequired,
  updateAnnouncements: PropTypes.func.isRequired,
  client: PropTypes.shape().isRequired,
  profile: PropTypes.shape().isRequired,
  projects: PropTypes.arrayOf(PropTypes.shape()).isRequired,
  notifications: PropTypes.arrayOf(PropTypes.shape()).isRequired,
  announcements: PropTypes.arrayOf(PropTypes.shape()).isRequired,
};
