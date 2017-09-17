import _ from 'lodash';
import React from 'react';
import PropTypes from 'prop-types';

import Announcement from './Announcement';

export default class Announcements extends React.Component {
  constructor(props) {
    super(props);

    // TODO: Create a endpoint and store announcements

    this.state = {
      message: '',
      error: false,
    };
  }

  render() {
    if (!_.isNil(this.props.announcements) && !_.isNil(this.props.announcements[0])) {
      return _.map(this.props.announcements,
        announcement => <Announcement announcement={announcement} />);
    }
    return (<div>No Notifications</div>);
  }
}

Announcements.propTypes = {
  announcements: PropTypes.arrayOf(PropTypes.string).isRequired,
};
