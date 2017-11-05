import _ from 'lodash';

import * as actionTypes from '../actions/actionTypes';

export default function projects(state = [], action) {
  switch (action.type) {
    case actionTypes.UPDATE_PROJECTS: {
      const newProjects = _.defaultTo(action.projects, []);

      if (_.isArray(newProjects) && !_.isNil(newProjects[0])) {
        return newProjects;
      }

      return state;
    }
    case actionTypes.REMOVE_PROJECT: {
      return state;
    }
    default: {
      return state;
    }
  }
}
