import React from 'react';
import PropTypes from 'prop-types';

import Notifications from './Notifications/Notifications';
import Navigation from '../Navigation/Navigation';
import Announcements from './Announcements/Announcements';

const style = require('./home.less');

export default class Home extends React.Component {
  constructor(props) {
    super(props);

    this.displayWelcomeMessage = this.displayWelcomeMessage.bind(this);
    this.displayNotifications = this.displayNotifications.bind(this);
    this.displayAnnouncements = this.displayAnnouncements.bind(this);
  }

  /**
   * Returns the jsx for displaying all current announcements
   */
  displayAnnouncements() {
    return (
      <div className={style.announcements}>
        <span className={style.announcementsTitle}>Announcements</span>
        <Announcements
          volunteer={this.props.volunteer}
          announcements={this.props.announcements}
          updateAnnouncements={this.props.updateAnnouncements}
        />
      </div>
    );
  }

  /**
   * Returns the jsx to display the notifications if the user is authenticated
   */
  displayNotifications() {
    if (this.props.authentication.result) {
      return (
        <div className={style.notifications}>
          <span className={style.notificationsTitle}>Notifications</span>
          <Notifications
            volunteer={this.props.volunteer}
            notifications={this.props.notifications}
            updateNotifications={this.props.updateNotifications}
          />
        </div>
      );
    }
    return null;
  }

  displayWelcomeMessage() {
    const currentHour = new Date().getHours();
    const username = (this.props.authentication.result) ? this.props.authentication.username : 'Volunteer';

    if (currentHour < 12) {
      return (<div className={style.welcomeMessage}>Good Morning, {username}</div>);
    } else if (currentHour < 18) {
      return (<div className={style.welcomeMessage}>Good Afternoon, {username}</div>);
    }
    return (<div className={style.welcomeMessage}>Good Evening, {username}</div>);
  }

  render() {
    return (
      <div>
        <div className={style.homeTitle}>Volunteer Home</div>
        {this.displayWelcomeMessage()}
        {this.displayAnnouncements()}
        {this.displayNotifications()}
        <Navigation authentication={this.props.authentication} />
      </div>
    );
  }
}

Home.propTypes = {
  authentication: PropTypes.shape({
    username: PropTypes.string,
    result: PropTypes.bool,
  }).isRequired,
  volunteer: PropTypes.shape().isRequired,
  updateAnnouncements: PropTypes.func.isRequired,
  updateNotifications: PropTypes.func.isRequired,
  notifications: PropTypes.arrayOf(PropTypes.shape()).isRequired,
  announcements: PropTypes.arrayOf(PropTypes.shape()).isRequired,
};
