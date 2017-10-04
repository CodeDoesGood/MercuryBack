export const USERNAME_MAX_LENGTH = 16;
export const USERNAME_MIN_LENGTH = 4;
export const PASSWORD_MAX_LENGTH = 6;
export const EMAIL_MAX_LENGTH = 50;
export const EMAIL_BODY_MAX_LENGTH = 500;
export const EMAIL_BODY_MIN_LENGTH = 5;

export const INVALID_USERNAME_CREDENTIALS_LENGTH = `Username cannot be greater than ${USERNAME_MAX_LENGTH} or less than ${USERNAME_MIN_LENGTH} characters long`;
export const INVALID_PASSWORD_CREDENTIALS_LENGTH = `Password cannot be longer than ${PASSWORD_MAX_LENGTH} characters long`;

export const USERNAME_REQUIRED = 'The username is required.';
export const PASSWORD_REQUIRED = 'The password is required.';
export const EMAIL_REQUIRED = 'The email is required.';
export const RESET_CODE_REQUIRED = 'reset_code must be provided';

export const EMAIL_FIELDS_REQUIRED = 'Please, make sure you\'ve filled all of the required fields';
export const EMAIL_AND_NAME_LENGTH = 'Please make sure email and name are less than 50 characters each\n';
export const EMAIL_BODY_LENGTH = 'Please use less than 500 characters for contact text or greater than 5';

export const INCORRECT_PASSWORD = 'The password provided was incorrect';
export const FAILED_VALIDATION = 'Failed to validate volunteer credentials';

export const INVALID_TOKEN = 'A Invalid token was passed to the server';
export const NO_TOKEN_PASSED = 'A valid token was not provided, you might have to fresh and login again';

export const FAILED_VOLUNTEER_GET = 'Failed to get volunteer login information';

export const DATABASE_UNAVAILABLE = 'The database service is currently unavailable';
export const EMAIL_UNAVAILABLE = 'The email service is currently unavailable, your email will be sent later';

export const USERNAME_ALREADY_EXISTS = username => `The username ${username} already exists`;
export const EMAIL_ALREADY_EXISTS = email => `The email ${email} already exists`;

export const USERNAME_DOES_NOT_EXIST = username => `The username ${username} does not exist`;
export const EMAIL_DOES_NOT_EXIST = email => `The email ${email} does not exist`;

export const INVALID_PROJECT_ID_FORMAT = projectId => `Id '${projectId}' is in a invalid format or not provided`;
export const PROJECT_MUST_CONTAIN = contain => `The projet must contain ${contain} value`;

export const PROJECT_MUST_CONTAIN_HIDDEN = 'The project must contain the hidden value';
export const INVALID_PROJECT_FORMAT = 'The provided project is not a valid format';

export const PROJECT_TYPE_ID_INVALID = 'id type is invalid, must be a int';
export const PROJECT_TYPE_CREATED_DATETIME_INVALID = 'created_datetime type is invalid, must be a string';
export const PROJECT_TYPE_DATA_ENTRY_USER_ID_INVALID = 'data_entry_user_id type is invalid, must be a int';
export const PROJECT_TYPE_TITLE_INVALID = 'title type is invalid, must be a string';
export const PROJECT_TYPE_STATUS_INVALID = 'status type is invalid, must be a string';
export const PROJECT_TYPE_PROJECT_CATEGORY_INVALID = 'project_category type is invalid, must be a int';
export const PROJECT_TYPE_HIDDEN_INVALID = 'hidden type is invalid, must be a bool';
export const PROJECT_TYPE_IMAGE_DIRECTORY_INVALID = 'image_directory type is invalid, must be a string';
export const PROJECT_TYPE_SUMMARY_INVALID = 'summary type is invalid, must be a string';
export const PROJECT_TYPE_DESCRIPTION_INVALID = 'description type is invalid, must be a string';

export const UNABLE_TO_UPDATE_PROJECT = projectId => `Unable to update project by id ${projectId}`;
export const UNABLE_TO_GATHER_PROJECT = projectId => `Unable to gather project by id ${projectId}`;

export const UNABLE_TO_GATHER_PROJECTS = 'Unable to gather the projects';
export const UNABLE_TO_GATHER_ACTIVE_PROJECTS = 'Unable to gather all active projects';

export const INVALID_STATUS_FORMAT = status => `Status '${status}' is in a invalid format or not provided`;
export const INVALID_CATEGORY_FORMAT = category => `Category '${category}' is in a invalid format or not provided`;

export const UNABLE_TO_GATHER_BY_STATUS = status => `Unable to gather all projects by status '${status}'`;
export const UNABLE_TO_GATHER_BY_CATEGORY = category => `Unable to gather all projects by category '${category}'`;
export const UNABLE_TO_GATHER_ALL_HIDDEN = 'Unable to gather all hidden projects';

export const INVALID_VOLUNTEER_FORMAT = 'volunteer provided is not in a valid format';

export const VOLUNTEER_REQUIREMENT_NEEDED = requirement => `Volunteer must contain ${requirement}`;
export const VOLUNTEER_REQUIREMENT_STRING = requirement => `Volunteer ${requirement} must be a string`;

export const VOLUNTEER_EMAIL_MATCH = 'The email passed does not match the volunteer email';
export const VOLUNTEER_EXISTS = 'Volunteer does not exist';

export const VOLUNTEER_RESET_CODE_FAIL = 'Unable to generate password reset code';
export const VOLUNTEER_UPDATE_PASSWORD_REQUIRE = 'Both oldPassword and password need to be provided';
export const VOLUNTEER_FAILED_UPDATE_PASSWORD = (username, error) => `Failed to update password for ${username}, error=${error}`;

export const VOLUNTEER_INVALID_VERIFICATION_CODE = 'The code passed was not the correct code for verification';

export const NOTIFICATION_ID_REQUIRED = 'export const You must pass a notification id to dismiss';
