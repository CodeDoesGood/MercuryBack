import _ from 'lodash';

import * as actionTypes from '../actions/actionTypes';

export default function profile(state = {}, action) {
  switch (action.type) {
    case actionTypes.UPDATE_VOLUNTEER_PROFILE: {
      const newProfile = _.defaultTo(action.profile, {});

      if (_.isObject(newProfile) && !_.isNil(newProfile.username)) {
        return newProfile;
      }

      return state;
    }
    case actionTypes.REMOVE_VOLUNTEER_PROFILE: {
      return {};
    }
    default: {
      return state;
    }
  }
}
