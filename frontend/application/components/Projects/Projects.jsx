import React from 'react';
import PropTypes from 'prop-types';
import _ from 'lodash';

import Project from './Project/Project';

import style from './projects.less';

export default class Projects extends React.Component {
  constructor(props) {
    super(props);

    this.projectTables = this.projectTables.bind(this);

    this.props.projectsClient.getActive()
      .then(projects => this.props.updateProjects(projects.content.projects));
  }

  projectTables() {
    const { projects } = this.props;

    if (_.isNil(projects[0])) {
      return (<Project project={{ title: 'No projects' }} />);
    }

    return _.map(projects, (project, index) => (<Project project={project} key={index} />));
  }

  render() {
    return (
      <div>
        <div className={style.welcomeProjects}>Projects</div>
        <table>
          <thead>
            <tr>
              <th>Title</th>
              <th>Status</th>
              <th>Category</th>
              <th>Platforms</th>
              <th>Latest Activity</th>
            </tr>
          </thead>
          <tbody>
            {this.projectTables()}
          </tbody>
        </table>
      </div>
    );
  }
}

Projects.propTypes = {
  updateProjects: PropTypes.func.isRequired,
  projects: PropTypes.arrayOf(PropTypes.shape()).isRequired,
  projectsClient: PropTypes.shape().isRequired,
};
