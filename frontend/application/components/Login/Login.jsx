import React from 'react';
import PropTypes from 'prop-types';
import _ from 'lodash';

import Loading from '../Loading/Loading';

import constants from '../utils/constants';

import style from './login.less';

export default class Login extends React.Component {
  constructor(props) {
    super(props);

    this.login = this.login.bind(this);
    this.register = this.register.bind(this);
    this.requestReset = this.requestReset.bind(this);
    this.resendVerification = this.resendVerification.bind(this);

    this.switchRegisteringState = this.switchRegisteringState.bind(this);
    this.switchForgotState = this.switchForgotState.bind(this);
    this.emptyStatusMessage = this.emptyStatusMessage.bind(this);
    this.loadingBox = this.loadingBox.bind(this);

    this.state = {
      message: '',
      error: false,
      registering: false,
      forgot: false,
      username: null,
      loading: false,
    };
  }

  /**
   * Validates that the registering details match the constants.
   * @returns {*} Returns a bool if it passes and a string if it fails.
   */
  clientValidation(password, email, name, user = null) {
    const username = _.defaultTo(this.state.username, user);
    const passLen = password.length;
    const userLen = username.length;
    const emailLen = email.length;
    const nameLen = name.length;

    const re = new RegExp('^[a-zA-Z0-9]+$');
    const reName = new RegExp('^[a-zA-Z- ]+$');
    const reEmail = new RegExp('^[a-zA-Z0-9@._-]+$');

    if (constants.PASSWORD_MIN_LENGTH > passLen || passLen > constants.PASSWORD_MAX_LENGTH) {
      return `Password cannot be less than ${constants.PASSWORD_MIN_LENGTH} or greater than ${constants.PASSWORD_MAX_LENGTH} characters.`;
    } else if (constants.USERNAME_MIN_LENGTH > userLen || userLen > constants.USERNAME_MAX_LENGTH) {
      return `Username cannot be less than ${constants.USERNAME_MIN_LENGTH} or greater than ${constants.USERNAME_MAX_LENGTH} characters`;
    } else if (constants.EMAIL_BODY_MIN_LENGTH > emailLen ||
      emailLen > constants.EMAIL_MAX_LENGTH) {
      return `Email cannot be less than ${constants.EMAIL_BODY_MIN_LENGTH} or greater than ${constants.EMAIL_BODY_MAX_LENGTH} characters`;
    } else if (constants.NAME_MIN_LENGTH > nameLen || nameLen > constants.NAME_MAX_LENGTH) {
      return `Name cannot be less than ${constants.NAME_MIN_LENGTH} or greater than ${constants.NAME_MAX_LENGTH} characters`;
    }

    if (email.indexOf('@') === -1) {
      return 'Email must be a valid email address format';
    }

    if (!re.test(username)) {
      return 'Username can only contain alphabetical and numeric characters';
    } else if (!reEmail.test(email)) {
      return 'Email can only contain alphabetical and numeric characters and @';
    } else if (!reName.test(name)) {
      return 'Name can only contain alphabetical characters and -';
    }

    return true;
  }

  /**
   * resend the verification email
   */
  resendVerification() {
    const { username } = this.state;
    const { volunteer } = this.props.client;

    this.setState({ loading: true });

    volunteer.resendVerification(username)
      .then(result => this.setState({ message: result.message, error: false, loading: false }))
      .catch(error => this.setState({ message: error.description, error: true, loading: false }));
  }

  /**
   * Gets the username, password from the login from and attempts to
   * authenticate the details with the server.
   */
  login(e) {
    e.preventDefault();

    const username = this.formUsername.value;
    const password = this.formPassword.value;
    const { volunteer } = this.props.client;

    this.setState({ username, loading: true });

    this.loginForm.reset();
    this.emptyStatusMessage();

    volunteer.authenticate(username, password)
      .then((result) => {
        this.props.client.setUtil('TOKEN', result.content.token);
        this.props.authenticating(result.content);
        this.setState({ message: result.message, error: false, loading: false });
        return volunteer.getProfile();
      })
      .then((profile) => {
        this.props.updateVolunteerProfile(profile.content.volunteer);
        this.props.history.push('/');
      })
      .catch((error) => {
        if (!_.isNil(error.failed_verify) && error.failed_verify) {
          this.setState({
            message: (
              <span>
                {error.description} Resend verification code?
                <div role="button" tabIndex={0} onKeyPress={this.resendVerification} onClick={this.resendVerification}>Click here</div>
              </span>),
            error: true,
            loading: false,
          });
        } else {
          this.setState({ message: error.description, error: true, loading: false });
        }
      });
  }

  register(e) {
    e.preventDefault();

    const name = this.registeringFormName.value;
    const username = this.registeringFormUsername.value;
    const password = this.registeringFormPassword.value;
    const verifyPassword = this.registeringFormVerifyPassword.value;
    const email = this.registeringFormEmail.value;
    const { volunteer } = this.props.client;

    this.setState({ username, loading: true });
    const clientValidation = this.clientValidation(password, email, name, username);

    this.loginForm.reset();
    this.emptyStatusMessage();
    this.switchRegisteringState();

    if (!_.isBoolean(clientValidation)) {
      this.setState({ message: clientValidation, error: true, loading: false });
    } else if (password !== verifyPassword) {
      this.setState({ message: 'passwords don\'t match', error: true, loading: false });
    } else {
      volunteer.create(name, username, password, email)
        .then(result => this.setState({ message: result.message, error: false, loading: false }))
        .catch(error => this.setState({ message: error.description, error: true, loading: false }));
    }
  }

  /**
   * Gets the username, email from the from and attempts to request a reset email from the server.
   */
  requestReset(e) {
    e.preventDefault();

    const username = this.forgotFormUsername.value;
    const email = this.forgotFormEmail.value;
    const { volunteer } = this.props.client;

    this.setState({ loading: true });

    this.loginForm.reset();
    this.emptyStatusMessage();
    this.switchForgotState();

    volunteer.resetRequest(username, email)
      .then(result => this.setState({ message: result.message, error: false, loading: false }))
      .catch(error => this.setState({ message: error.description, error: true, loading: false }));
  }

  emptyStatusMessage() {
    this.setState({
      message: '',
      error: false,
    });
  }

  switchRegisteringState() {
    this.loginForm.reset();

    this.setState({
      registering: !this.state.registering,
    });
  }

  switchForgotState() {
    this.loginForm.reset();

    this.setState({
      registering: false,
      forgot: !this.state.forgot,
    });
  }

  alertBox() {
    if (this.state.error && this.state.message !== '') {
      return (
        <div className={style.alertBox}>
          <span role="button" tabIndex={0} onClick={this.emptyStatusMessage} onKeyPress={this.emptyStatusMessage} className={style.boxClose}>&times;</span>
          <strong className={style.message}>Warning: </strong>
          {this.state.message}
        </div>
      );
    } else if (!this.state.error && this.state.message !== '') {
      return (
        <div className={style.successBox}>
          <span role="button" tabIndex={0} onClick={this.emptyStatusMessage} onKeyPress={this.emptyStatusMessage} className={style.boxClose}>&times;</span>
          <strong className={style.message}>Success: </strong>
          {this.state.message}
        </div>
      );
    }
    return (
      <div />
    );
  }

  forgotBox() {
    return (
      <div className={style.registerWrapper}>
        <div className={style.forgotForm}>
          {this.alertBox()}
          <div className={style.loginTitle}>Request Reset</div>
          <form ref={(loginForm) => { this.loginForm = loginForm; }}>
            <input placeholder="username" type="username" ref={(forgotFormUsername) => { this.forgotFormUsername = forgotFormUsername; }} required="required" />
            <input placeholder="email" type="email" ref={(forgotFormEmail) => { this.forgotFormEmail = forgotFormEmail; }} required="required" />
            <button type="submit" onClick={this.requestReset}>Request Reset</button>
            <div className={style.loginMessage}>
              <div>
                Need to login? <span role="button" tabIndex={0} onClick={this.switchForgotState} onKeyPress={this.switchForgotState}>Login</span>
              </div>
            </div>
          </form>
        </div>
      </div>
    );
  }

  loginBox() {
    return (
      <div className={style.registerWrapper}>
        <div className={style.loginForms}>
          {this.alertBox()}
          <div className={style.loginTitle}>CDG Volunteer Sign In</div>
          <form ref={(loginForm) => { this.loginForm = loginForm; }}>
            <div>
              <span className={style.loginInputTexts}>username</span>
              <input type="username" ref={(formUsername) => { this.formUsername = formUsername; }} required="required" />
            </div>
            <div>
              <span className={style.loginInputTexts}>password</span>
              <input type="password" ref={(formPassword) => { this.formPassword = formPassword; }} required="required" />
            </div>
            <button type="submit" onClick={this.login}>Sign In</button>
            <div className={style.registerMessage}>Not a CDG volunteer?
              <div>
                Sign up <span role="button" tabIndex={0} onClick={this.switchRegisteringState} onKeyPress={this.switchRegisteringState}>here</span>
              </div>
            </div>
            <p className={style.forgotMessage}>
              <span role="button" tabIndex={0} onClick={this.switchForgotState} onKeyPress={this.switchForgotState}>forgot my username / password</span>
            </p>
          </form>
        </div>
      </div>
    );
  }

  registeringBox() {
    return (
      <div className={style.registerWrapper}>
        <div className={style.registeringForm}>
          {this.alertBox()}
          <div className={style.loginTitle}>Registering</div>
          <form ref={(loginForm) => { this.loginForm = loginForm; }}>
            <input placeholder="name" type="name" ref={(registeringFormName) => { this.registeringFormName = registeringFormName; }} required="required" />
            <input placeholder="username" type="username" ref={(registeringFormUsername) => { this.registeringFormUsername = registeringFormUsername; }} required="required" />
            <input placeholder="password" type="password" ref={(registeringFormPassword) => { this.registeringFormPassword = registeringFormPassword; }} required="required" />
            <input placeholder="verify password" type="password" ref={(registeringFormVerifyPassword) => { this.registeringFormVerifyPassword = registeringFormVerifyPassword; }} required="required" />
            <input placeholder="email" type="email" ref={(registeringFormEmail) => { this.registeringFormEmail = registeringFormEmail; }} required="required" />
            <button type="submit" onClick={this.register}>Start Volunteering</button>
            <div className={style.loginMessage}>
              <div>
                Need to login? <span role="button" tabIndex={0} onClick={this.switchRegisteringState} onKeyPress={this.switchRegisteringState}>Login</span>
              </div>
            </div>
            <p className={style.forgotMessage}>
              <span role="button" tabIndex={0} onClick={this.switchForgotState} onKeyPress={this.switchForgotState}>forgot my username / password</span>
            </p>
          </form>
        </div>
      </div>
    );
  }

  loadingBox() {
    if (this.state.loading) {
      return (
        <div className={style.registerWrapper}>
          <div className={style.registeringForm}>
            <Loading />
          </div>
        </div>
      );
    }
    return (<div />);
  }

  render() {
    if (this.state.loading) {
      return this.loadingBox();
    } else if (this.state.forgot) {
      return this.forgotBox();
    } else if (this.state.registering) {
      return this.registeringBox();
    }
    return this.loginBox();
  }
}

Login.propTypes = {
  client: PropTypes.shape().isRequired,
  history: PropTypes.shape().isRequired,
  authenticating: PropTypes.func.isRequired,
  updateVolunteerProfile: PropTypes.func.isRequired,
};
