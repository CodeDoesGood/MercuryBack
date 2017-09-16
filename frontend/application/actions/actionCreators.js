import * as actionTypes from './actionTypes';


// Autentication

export function authenticating(authentication) {
  return {
    type: actionTypes.UPDATE_AUTHENTICATED,
    authentication,
  };
}

// Contact types
export function updateContactInformation(contact = {}) {
  return {
    type: actionTypes.UPDATE_CONTACT_INFORMATION,
    contact,
  };
}

export function removeContactInformation(contact = {}) {
  return {
    type: actionTypes.REMOVE_CONTACT_INFORMATION,
    contact,
  };
}
