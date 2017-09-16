import React from 'react';
import PropTypes from 'prop-types';
import _ from 'lodash';

export default class Reset extends React.Component {
  constructor(props) {
    super(props);

    this.emptyStatusMessage = this.emptyStatusMessage.bind(this);
    this.resetPassword = this.resetPassword.bind(this);

    this.state = {
      code: _.defaultTo(this.props.match.params.code, ''),
      username: _.defaultTo(this.props.match.params.username, ''),
      message: '',
      error: false,
    };
  }

  emptyStatusMessage() {
    this.setState({ message: '', error: false });
  }

  resetPassword(e) {
    e.preventDefault();

    const code = this.state.code;
    const username = this.state.username;
    const password = this.formPassword.value;
    const verifyPassword = this.formVerifyPassword.value;
    const volunteer = this.props.volunteer;

    this.loginForm.reset();

    if (password !== verifyPassword) {
      this.setState({ message: 'Passwords didn\'t match, try again.', error: true });
      return;
    }

    volunteer.resetPassword(username, code, password)
    .then(result => this.setState({ message: result.message, error: false }))
    .catch(error => this.setState({ message: error.description, error: true }));
  }

  render() {
    return (
      <div style={{ textAlign: 'center', display: 'inherit' }}>
        <h1>Reset: {this.state.username}</h1>
        <form ref={(loginForm) => { this.loginForm = loginForm; }}>
          <span>password:</span>
          <input ref={(formPassword) => { this.formPassword = formPassword; }} type="password" required="required" /><br />
          <span>verify:</span>
          <input ref={(formVerifyPassword) => { this.formVerifyPassword = formVerifyPassword; }} type="password" required="required" /><br />
          <button type="submit" onClick={this.resetPassword}><span>Request Reset</span></button>
        </form>
      </div>
    );
  }
}

Reset.propTypes = {
  volunteer: PropTypes.shape().isRequired,
  match: PropTypes.shape({
    params: PropTypes.shape({
      code: PropTypes.string,
      username: PropTypes.string,
    }),
  }).isRequired,
};
