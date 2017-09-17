import _ from 'lodash';
import React from 'react';
import PropTypes from 'prop-types';

import Notification from './Notification';

export default class Notifications extends React.Component {
  constructor(props) {
    super(props);

    // TODO: Create a endpoint and store notifications

    this.state = {
      message: '',
      error: false,
    };
  }

  render() {
    if (!_.isNil(this.props.notifications) && !_.isNil(this.props.notifications[0])) {
      return _.map(this.props.notifications,
          notification => <Notification notification={notification} />);
    }
    return (<div>No Notifications</div>);
  }
}

Notifications.propTypes = {
  notifications: PropTypes.arrayOf(PropTypes.string).isRequired,
};
