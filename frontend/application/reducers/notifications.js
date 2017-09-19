import _ from 'lodash';

import * as actionTypes from '../actions/actionTypes';

export default function notifications(state = [], action) {
  switch (action.type) {
    case actionTypes.UPDATE_NOTIFICATIONS: {
      const newNotifications = _.defaultTo(action.notifications, []);

      if (_.isArray(newNotifications) && !_.isNil(newNotifications[0])) {
        return newNotifications;
      }

      return state;
    }
    case actionTypes.REMOVE_NOTIFICATION: {
      return state;
    }
    default: {
      return state;
    }
  }
}
