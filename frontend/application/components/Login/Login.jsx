import React from 'react';
import PropTypes from 'prop-types';

import style from './login.less';

export default class Login extends React.Component {
  constructor(props) {
    super(props);

    this.login = this.login.bind(this);
    this.register = this.register.bind(this);
    this.requestReset = this.requestReset.bind(this);

    this.switchRegisteringState = this.switchRegisteringState.bind(this);
    this.switchForgotState = this.switchForgotState.bind(this);

    this.state = {
      message: '',
      error: false,
      registering: false,
      forgot: false,
    };
  }

  /**
   * Gets the username, password from the login from and attempts to authenticate the details with the server.
   */
  login(e) {
    e.preventDefault();

    const username = this.formUsername.value;
    const password = this.formPassword.value;
    const volunteer = this.props.client.volunteer;

    this.loginForm.reset();
    this.emptyStatusMessage();

    volunteer.authenticate(username, password)
    .then((result) => {
      this.props.client.setUtil('TOKEN', result.content.token);
      this.props.authenticating(result.content);
      this.setState({ message: result.message, error: false });
      this.props.history.push('/')
    })
    .catch((error) => {
      this.setState({ message: error.description, error: true });
    });
  }

  register(e) {
    e.preventDefault();

    // TODO: We need to validate name, username, passowrd and email on the client as well as the server (server done)

    const name = this.registeringFormName.value;
    const username = this.registeringFormUsername.value;
    const password = this.registeringFormPassword.value;
    const verifyVassword = this.registeringFormVerifyPassword.value;
    const email = this.registeringFormEmail.value;
    const volunteer = this.props.client.volunteer;

    this.loginForm.reset();
    this.emptyStatusMessage();
    this.switchRegisteringState();

    if(password !== verifyVassword) {
      this.setState({ message: 'passwords don\'t match', error: true })
    } else {
      volunteer.create(name, username, password, email)
        .then(result => this.setState({ message: result.message, error: false }))
        .catch(error => this.setState({ message: error.description, error: true }));
    }
  }

  /**
   * Gets the username, email from the from and attempts to request a reset email from the server.
   */
  requestReset(e) {
    e.preventDefault();

    const username = this.forgotFormUsername.value;
    const email = this.forgotFormEmail.value;
    const volunteer = this.props.client.volunteer;

    this.loginForm.reset();
    this.emptyStatusMessage();
    this.switchForgotState();

    volunteer.resetRequest(username, email)
      .then(result => this.setState({ message: result.message, error: false }))
      .catch(error => this.setState({ message: error.description, error: true }));
  }

  emptyStatusMessage() {
    this.setState({
      message: '',
      error: false
    })
  }

  switchRegisteringState() {
    this.loginForm.reset();

    this.setState({
      registering: !this.state.registering
    });
  }

  switchForgotState() {
    this.loginForm.reset();

    this.setState({
      registering: false,
      forgot: !this.state.forgot
    });
  }

  alertBox() {
    if (this.state.error && this.state.message !== '') {
      return (
        <div className={style.alertBox}>
          <span role="button" tabIndex={0} onClick={this.emptyStatusMessage.bind(this)} className={style.boxClose}>&times;</span>
          <strong className={style.message}>Warning: </strong>
          {this.state.message}
        </div>
      );
    } else if (!this.state.error && this.state.message !== '') {
      return (
        <div className={style.successBox}>
          <span role="button" tabIndex={0} onClick={this.emptyStatusMessage.bind(this)} className={style.boxClose}>&times;</span>
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
      <div className={style.loginWrapper}>
        <div className={style.loginForms}>
          {this.alertBox()}
          <form ref={(loginForm) => { this.loginForm = loginForm; }}>
            <input placeholder={'username'} type={'username'} ref={(forgotFormUsername) => { this.forgotFormUsername = forgotFormUsername; }} required="required" />
            <input placeholder={'email'} type={'email'} ref={(forgotFormEmail) => { this.forgotFormEmail = forgotFormEmail; }} required="required" />
            <button type="submit" onClick={this.requestReset}>Request Reset</button>
            <p className={style.registerMessage}>Need to login? <span onClick={this.switchForgotState}>Login</span></p>
          </form>
        </div>
      </div>
    );
  }

  loginBox() {
    return (
      <div className={style.loginWrapper}>
        <div className={style.loginForms}>
          {this.alertBox()}
          <form ref={(loginForm) => { this.loginForm = loginForm; }}>
            <input placeholder={'username'} type={'username'} ref={(formUsername) => { this.formUsername = formUsername; }} required="required" />
            <input placeholder={'password'} type={'password'} ref={(formPassword) => { this.formPassword = formPassword; }} required="required" />
            <button type="submit" onClick={this.login}>Sign In</button>
            <p className={style.registerMessage}>Not a CDG volunteer? Sign up <span onClick={this.switchRegisteringState}>here</span></p>
            <p className={style.forgotMessage}><span onClick={this.switchForgotState}>forgot my username / password</span></p>
          </form>
        </div>
      </div>
    );
  }

  registeringBox() {
    return (
      <div className={style.loginWrapper}>
        <div className={style.loginForms}>
          {this.alertBox()}
          <form ref={(loginForm) => { this.loginForm = loginForm; }}>
            <input placeholder={'name'} type={'name'} ref={(registeringFormName) => { this.registeringFormName = registeringFormName; }} required="required" />
            <input placeholder={'username'} type={'username'} ref={(registeringFormUsername) => { this.registeringFormUsername = registeringFormUsername; }} required="required" />
            <input placeholder={'password'} type={'password'} ref={(registeringFormPassword) => { this.registeringFormPassword = registeringFormPassword; }} required="required" />
            <input placeholder={'verify password'} type={'password'} ref={(registeringFormVerifyPassword) => { this.registeringFormVerifyPassword = registeringFormVerifyPassword; }} required="required" />
            <input placeholder={'email'} type={'email'} ref={(registeringFormEmail) => { this.registeringFormEmail = registeringFormEmail; }} required="required" />
            <button type="submit" onClick={this.register}>Start Volunteering</button>
            <p className={style.registerMessage}>Need to login? <span onClick={this.switchRegisteringState}>Login</span></p>
            <p className={style.forgotMessage}><span onClick={this.switchForgotState}>forgot my username / password</span></p>
          </form>
        </div>
      </div>
    );
  }

  render() {
    if (this.state.forgot) {
      return this.forgotBox();
    } else if (this.state.registering) {
      return this.registeringBox();
    }
    return this.loginBox();

  }
}

Login.propTypes = {
  client: PropTypes.shape().isRequired,
  authenticating: PropTypes.func.isRequired,
};
