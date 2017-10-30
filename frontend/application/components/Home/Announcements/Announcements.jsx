import _ from 'lodash';
import React from 'react';
import PropTypes from 'prop-types';

import Announcement from './Announcement';

export default class Announcements extends React.Component {
  constructor(props) {
    super(props);

    const { volunteer } = this.props;

    volunteer.getAnnouncements()
      .then(gainedAnnouncements => this.props.updateAnnouncements(gainedAnnouncements))
      .catch(() => this.props.updateAnnouncements([]));
  }

  render() {
    if (!_.isNil(this.props.announcements) && !_.isNil(this.props.announcements[0])) {
      return (
        <div>{(_.map(
        this.props.announcements,
        (announcement, index) => (<Announcement key={index} announcement={announcement} />),
          ))}
        </div>);
    }
    return (<div>No Announcements</div>);
  }
}

Announcements.propTypes = {
  volunteer: PropTypes.shape().isRequired,
  updateAnnouncements: PropTypes.func.isRequired,
  announcements: PropTypes.arrayOf(PropTypes.shape()).isRequired,
};
