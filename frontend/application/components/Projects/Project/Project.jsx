import React from 'react';
import PropTypes from 'prop-types';
import _ from 'lodash';

export default class Project extends React.Component {
  constructor(props) {
    super(props);

    const { project } = this.props;

    this.title = _.defaultTo(project.title, '');
    this.status = _.defaultTo(project.status, '');
    this.project_category = _.defaultTo(project.project_category, '');
    this.platforms = _.defaultTo(project.platforms, '');
    this.last_activity = _.defaultTo(project.last_activity, '');
  }

  render() {
    return (
      <tr>
        <td>{this.title}</td>
        <td>{this.status}</td>
        <td>{this.project_category}</td>
        <td>{this.platforms}</td>
        <td>{this.last_activity}</td>
      </tr>
    );
  }
}

Project.propTypes = {
  project: PropTypes.shape().isRequired,
};
