export default function contact(state = {}, action) {
  switch (action.type) {
    case 'UPDATE_CONTACT_INFORMATION': {
      return action.contact;
    }
    case 'REMOVE_CONTACT_INFORMATION': {
      return {};
    }
    default: {
      return state;
    }
  }
}
