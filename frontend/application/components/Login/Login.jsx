import React from 'react';
import PropTypes from 'prop-types';

export default class Login extends React.Component {
  constructor(props) {
    super(props);
    this.login = this.login.bind(this);

    this.state = {
      message: '',
      error: false,
    };
  }

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
    })
    .catch((error) => {
      this.setState({ message: error.description, error: true });
    });
  }

  render() {
    return (
      <div style={{ textAlign: 'center', display: 'inherit' }}>
        <h1>Login</h1>
        <form ref={(loginForm) => { this.loginForm = loginForm; }}>
          <span>username:</span>
          <input ref={(formUsername) => { this.formUsername = formUsername; }} required="required" /><br />
          <span>password:</span>
          <input ref={(formPassword) => { this.formPassword = formPassword; }} type="password" required="required" /><br />
          <button type="submit" onClick={this.login}><span>Login</span></button>
        </form>
      </div>
    );
  }
}

Login.propTypes = {
  client: PropTypes.shape().isRequired,
  authenticating: PropTypes.func.isRequired,
};
