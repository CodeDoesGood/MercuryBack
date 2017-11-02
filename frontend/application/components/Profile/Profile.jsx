import React from 'react';
import PropTypes from 'prop-types';
import _ from 'lodash';

export default class Profile extends React.Component {
  constructor(props) {
    super(props);

    this.state = {};

    if (!this.props.authentication.result) {
      this.props.history.push('/');
    }

    if (_.isNil(this.props.profile.username)) {
      this.props.volunteer.getProfile()
        .then(profile => this.props.updateVolunteerProfile(profile.content.volunteer))
        .catch(() => {});
    }
  }

  render() {
    return (
      <div>profile</div>
    );
  }
}

Profile.propTypes = {
  volunteer: PropTypes.shape().isRequired,
  authentication: PropTypes.shape().isRequired,
  history: PropTypes.shape().isRequired,
  profile: PropTypes.shape().isRequired,
  updateVolunteerProfile: PropTypes.func.isRequired,
};
