import _ from 'lodash';
import React from 'react';
import PropTypes from 'prop-types';

import Notification from './Notification';

export default class Notifications extends React.Component {
  constructor(props) {
    super(props);

    const { volunteer } = this.props;

    volunteer.getNotifications()
      .then(notifications => this.props.updateNotifications(notifications))
      .catch(() => this.props.updateNotifications([]));
  }

  render() {
    if (!_.isNil(this.props.notifications) && !_.isNil(this.props.notifications[0])) {
      return (
        <div>{(_.map(
        this.props.notifications,
          (notification, index) => (<Notification key={index} notification={notification} />),
        ))}
        </div>);
    }
    return (<div>No Notifications</div>);
  }
}

Notifications.propTypes = {
  volunteer: PropTypes.shape().isRequired,
  updateNotifications: PropTypes.func.isRequired,
  notifications: PropTypes.arrayOf(PropTypes.shape()).isRequired,
};
