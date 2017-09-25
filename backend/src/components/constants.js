export const USERNAME_MAX_LENGTH = 16;
export const USERNAME_MIN_LENGTH = 4;
export const PASSWORD_MAX_LENGTH = 6;
export const EMAIL_MAX_LENGTH = 50;
export const EMAIL_BODY_MAX_LENGTH = 500;
export const EMAIL_BODY_MIN_LENGTH = 5;

export const INVALID_USERNAME_CREDENTIALS_LENGTH = `Username cannot be greater than ${USERNAME_MAX_LENGTH} or less than ${USERNAME_MIN_LENGTH} characters long`;
export const INVALID_PASSWORD_CREDENTIALS_LENGTH = `Password cannot be longer than ${PASSWORD_MAX_LENGTH} characters long`;
export const INVALID_EMAIL_CREDENTIALS = '';

export const USERNAME_REQUIRED = 'The username is required.';
export const PASSWORD_REQUIRED = 'The password is required.';
export const EMAIL_REQUIRED = 'The email is required.';

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
