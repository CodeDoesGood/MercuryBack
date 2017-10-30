import React from 'react';
import PropTypes from 'prop-types';
import _ from 'lodash';

const style = require('./reset.less');

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

    const { code, username } = this.state;
    const { volunteer } = this.props;

    const password = this.formPassword.value;
    const verifyPassword = this.formVerifyPassword.value;

    this.loginForm.reset();

    if (password !== verifyPassword) {
      this.setState({ message: 'Passwords didn\'t match, try again.', error: true });
      return;
    }

    volunteer.resetPassword(username, code, password)
      .then(result => this.setState({ message: result.message, error: false }))
      .catch((error) => {
        this.setState({ message: error.description, error: true });
      });
  }

  alertBox() {
    if (this.state.error && this.state.message !== '') {
      return (
        <div className={style.alertBox}>
          <span role="button" tabIndex={0} onClick={this.emptyStatusMessage} onKeyPress={this.emptyStatusMessage} className={style.boxClose}>&times;</span>
          <strong className={style.message}>Warning! </strong>
          {this.state.message}
        </div>
      );
    } else if (!this.state.error && this.state.message !== '') {
      return (
        <div className={style.successBox}>
          <span role="button" tabIndex={0} onClick={this.emptyStatusMessage} onKeyPress={this.emptyStatusMessage} className={style.boxClose}>&times;</span>
          <strong className={style.message}>Success! </strong>
          {this.state.message}
        </div>
      );
    }
    return (
      <div />
    );
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
        {this.alertBox()}
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
