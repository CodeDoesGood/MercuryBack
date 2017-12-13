const constants = {
  USERNAME_MAX_LENGTH: 16,
  USERNAME_MIN_LENGTH: 4,
  PASSWORD_MIN_LENGTH: 6,
  PASSWORD_MAX_LENGTH: 24,
  EMAIL_MAX_LENGTH: 50,
  EMAIL_BODY_MAX_LENGTH: 500,
  EMAIL_BODY_MIN_LENGTH: 5,
  NAME_MIN_LENGTH: 5,
  NAME_MAX_LENGTH: 50,
};

const errors = {
  INVALID_USERNAME_CREDENTIALS_LENGTH: `Username cannot be greater than ${constants.USERNAME_MAX_LENGTH} or less than ${constants.USERNAME_MIN_LENGTH} characters long`,
  INVALID_PASSWORD_CREDENTIALS_LENGTH: `Password cannot be longer than ${constants.PASSWORD_MAX_LENGTH} characters long`,
  INVALID_PASSWORD_CREDENTIALS_LENGTH_MIN: `Password cannot be longer than ${constants.PASSWORD_MIN_LENGTH} characters long`,
  INVALID_USERNAME_CREDENTIALS_SPACES: 'Username cannot contain spaces',

  INVALID_PASSWORD_LENGTH_ALL: `Password cannot be greater than ${constants.PASSWORD_MAX_LENGTH} or less than ${constants.PASSWORD_MIN_LENGTH} characters`,
  INVALID_USERNAME_LENGTH_ALL: `Username cannot be greater than ${constants.USERNAME_MAX_LENGTH} or less than ${constants.USERNAME_MIN_LENGTH} characters`,
  INVALID_EMAIL_LENGTH_ALL: `Email cannot be greater than ${constants.EMAIL_MAX_LENGTH} or less than ${constants.EMAIL_BODY_MIN_LENGTH} characters`,
  INVALID_EMAIL_NO_TYPE: 'Email must be a valid email address format',
  INVALID_NAME_TYPE: `Name cannot be less than ${constants.NAME_MIN_LENGTH} or greater than ${constants.NAME_MAX_LENGTH} characters`,

  INVALID_USERNAME_SYMBOLS: 'Username can only contain alphabetical and numeric characters',
  INVALID_EMAIL_SYMBOLS: 'Email can only contain alphabetical and numeric characters and @',
  INVALID_NAME_SYMBOLS: 'Name can only contain alphabetical and -',

  USERNAME_REQUIRED: 'The username is required.',
  PASSWORD_REQUIRED: 'The password is required.',
  EMAIL_REQUIRED: 'The email is required.',
  RESET_CODE_REQUIRED: 'reset_code must be provided',
  VERIFICATION_CODE_REQUIRED: 'verification must be provided',
  VOLUNTEER_ID_REQUIRED: 'volunteer id must be provided',

  EMAIL_FIELDS_REQUIRED: 'Please, make sure you\'ve filled all of the required fields',
  EMAIL_AND_NAME_LENGTH: 'Please make sure email and name are less than 50 characters each\n',
  EMAIL_BODY_LENGTH: 'Please use less than 500 characters for contact text or greater than 5',

  INCORRECT_PASSWORD: 'The password provided was incorrect',
  FAILED_VALIDATION: 'Failed to validate volunteer credentials',

  INVALID_TOKEN: 'A Invalid token was passed to the server',
  NO_TOKEN_PASSED: 'A valid token was not provided, you might have to fresh and login again',

  DATABASE_UNAVAILABLE: 'The database service is currently unavailable',
  EMAIL_UNAVAILABLE: 'The email service is currently unavailable, your email will be sent later',

  EMAIL_RESET_SENT: 'An email will be sent to that account\'s address shortly',

  USERNAME_ALREADY_EXISTS: username => `The username ${username} already exists`,
  EMAIL_ALREADY_EXISTS: email => `The email ${email} already exists`,

  USERNAME_DOES_NOT_EXIST: username => `The username ${username} does not exist`,
  EMAIL_DOES_NOT_EXIST: email => `The email ${email} does not exist`,

  INVALID_PROJECT_ID_FORMAT: projectId => `Id '${projectId}' is in a invalid format or not provided`,
  PROJECT_MUST_CONTAIN: contain => `The projet must contain ${contain} value`,

  PROJECT_MUST_CONTAIN_HIDDEN: 'The project must contain the hidden value',
  INVALID_PROJECT_FORMAT: 'The provided project is not a valid format',
  PROJECT_TYPE_ID_INVALID: 'id type is invalid, must be a int',
  PROJECT_TYPE_CREATED_DATETIME_INVALID: 'created_datetime type is invalid, must be a string',
  PROJECT_TYPE_DATA_ENTRY_USER_ID_INVALID: 'data_entry_user_id type is invalid, must be a int',
  PROJECT_TYPE_TITLE_INVALID: 'title type is invalid, must be a string',
  PROJECT_TYPE_STATUS_INVALID: 'status type is invalid, must be a string',
  PROJECT_TYPE_PROJECT_CATEGORY_INVALID: 'project_category type is invalid, must be a int',
  PROJECT_TYPE_HIDDEN_INVALID: 'hidden type is invalid, must be a bool',
  PROJECT_TYPE_IMAGE_DIRECTORY_INVALID: 'image_directory type is invalid, must be a string',
  PROJECT_TYPE_SUMMARY_INVALID: 'summary type is invalid, must be a string',
  PROJECT_TYPE_DESCRIPTION_INVALID: 'description type is invalid, must be a string',

  UNABLE_TO_UPDATE_PROJECT: projectId => `Unable to update project by id ${projectId}`,
  UNABLE_TO_GATHER_PROJECT: projectId => `Unable to gather project by id ${projectId}`,

  UNABLE_TO_GATHER_PROJECTS: 'Unable to gather the projects',
  UNABLE_TO_GATHER_ACTIVE_PROJECTS: 'Unable to gather all active projects',

  INVALID_STATUS_FORMAT: status => `Status '${status}' is in a invalid format or not provided`,
  INVALID_CATEGORY_FORMAT: category => `Category '${category}' is in a invalid format or not provided`,

  UNABLE_TO_GATHER_BY_STATUS: status => `Unable to gather all projects by status '${status}'`,
  UNABLE_TO_GATHER_BY_CATEGORY: category => `Unable to gather all projects by category '${category}'`,
  UNABLE_TO_GATHER_ALL_HIDDEN: 'Unable to gather all hidden projects',

  INVALID_VOLUNTEER_FORMAT: 'volunteer provided is not in a valid format',

  VOLUNTEER_REQUIREMENT_NEEDED: requirement => `Volunteer must contain ${requirement}`,
  VOLUNTEER_REQUIREMENT_STRING: requirement => `Volunteer ${requirement} must be a string`,

  VOLUNTEER_EMAIL_MATCH: 'The email passed does not match the volunteer email',
  VOLUNTEER_EXISTS: 'Volunteer does not exist',

  VOLUNTEER_VERIFICATION_REQUIRED: username => `Volunteer ${username} must be verified to continue.`,
  VOLUNTEER_RESET_CODE_FAIL: 'Unable to generate password reset code',
  VOLUNTEER_UPDATE_PASSWORD_REQUIRE: 'Both oldPassword and password need to be provided',
  VOLUNTEER_FAILED_UPDATE_PASSWORD: (username, error) => `Failed to update password for ${username}, error=${error}`,
  VOLUNTEER_FAILED_GET_RESET_CODE: error => `Failed to get password reset code, error=${error}`,
  VOLUNTEER_FAILED_REMOVE_RESET_CODE: error => `Failed to remove password reset code, error=${error}`,

  VOLUNTEER_FAILED_GET_VERIFICATION_CODE: error => `Failed to get verification code, error=${error}`,
  VOLUNTEER_INVALID_VERIFICATION_CODE: 'The code passed was not the correct code for verification',
  VOLUNTEER_VERIFICATION_CODE_DOES_NOT_EXIST: 'Verification Code Does not exist',

  VOLUNTEER_VERIFY_MARK_FAIL: username => `Failed to mark account ${username} as verified`,
  VOLUNTEER_CREATE_FAIL: (username, error) => `Failed to create the user ${username}, error=${error}`,

  VOLUNTEER_GET_NOTIFICATION_FAIL: (username, error) => `Failed to gather notifications for user ${username}, error=${error}`,
  VOLUNTEER_DISMISS_NOTIFICATION_FAIL: (notificationId, error) => `Unable to dismiss notification ${notificationId}, error=${error}`,
  NOTIFICATION_ID_REQUIRED: 'export const You must pass a notification id to dismiss',

  VOLUNTEER_IS_VERIFIED: username => `Volunteer ${username} is already verified`,
  FAILED_VOLUNTEER_GET: error => `Failed to get volunteer, error=${error}`,

  UNKNOWN_ERROR: 'Something went wrong',
};

const constantsAndErrors = Object.assign(constants, errors);

module.exports = constantsAndErrors;

