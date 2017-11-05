import * as actionTypes from './actionTypes';


// Authentication
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

// Notifications
export function updateNotifications(notifications) {
  return {
    type: actionTypes.UPDATE_NOTIFICATIONS,
    notifications,
  };
}

// Projects / project
export function updateProjects(projects) {
  return {
    type: actionTypes.UPDATE_PROJECTS,
    projects,
  };
}

export function removeProject(projectId) {
  return {
    type: actionTypes.REMOVE_PROJECT,
    projectId,
  };
}

// announcements
export function updateAnnouncements(announcements) {
  return {
    type: actionTypes.UPDATE_ANNOUNCEMENTS,
    announcements,
  };
}

export function removeNotification() {
  return {
    type: actionTypes.REMOVE_NOTIFICATION,
  };
}

export function removeAnnouncements() {
  return {
    type: actionTypes.REMOVE_ANNOUNCEMENT,
  };
}

// Profile
export function updateVolunteerProfile(profile) {
  return {
    type: actionTypes.UPDATE_VOLUNTEER_PROFILE,
    profile,
  };
}

export function removeVolunteerProfile() {
  return {
    type: actionTypes.REMOVE_VOLUNTEER_PROFILE,
  };
}
