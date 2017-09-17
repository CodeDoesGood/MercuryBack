import _ from 'lodash';

import * as actionTypes from '../actions/actionTypes';

export default function announcements(state = [], action) {
  switch (action.type) {
    case actionTypes.UPDATE_ANNOUNCEMENTS: {
      const newAnnouncements = _.defaultTo(action.announcements, []);

      if (_.isArray(newAnnouncements) && !_.isNil(newAnnouncements[0])) {
        return newAnnouncements;
      }

      return state;
    }
    case actionTypes.REMOVE_ANNOUNCEMENT: {
      return state;
    }
    default: {
      return state;
    }
  }
}
