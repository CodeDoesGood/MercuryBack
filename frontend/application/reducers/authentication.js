export default function authentication(state = { username: null, result: false }, action) {
  switch (action.type) {
    case 'UPDATE_AUTHENTICATED': {
      return action.authentication;
    }
    case 'LOGOUT_AUTHENTICATED': {
      const logout = state;
      logout.authentication.result = false;
      logout.authentication.username = undefined;
      return logout;
    }
    default: {
      return state;
    }
  }
}
