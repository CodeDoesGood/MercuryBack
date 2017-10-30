import React from 'react';
import PropTypes from 'prop-types';
import _ from 'lodash';

const style = require('./verify.less');

export default class Verify extends React.Component {
  constructor(props) {
    super(props);

    this.emptyStatusMessage = this.emptyStatusMessage.bind(this);
    this.verifyAccount = this.verifyAccount.bind(this);


    this.state = {
      code: _.defaultTo(this.props.match.params.code, ''),
      username: _.defaultTo(this.props.match.params.username, ''),
      message: '',
      error: false,
    };

    this.verifyAccount();
  }

  emptyStatusMessage() {
    this.setState({ message: '', error: false });
  }

  verifyAccount() {
    const { code, username } = this.state;
    const { volunteer } = this.props;

    volunteer.verifyAccount(username, code)
      .then(result => this.setState({ message: result.message, error: false }))
      .catch(error => this.setState({ message: error.description, error: true }));
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
      <div className={style.center}>
        <h1 className={style.title}>Verify: {this.state.username}</h1>
        {this.alertBox()}
      </div>
    );
  }
}

Verify.propTypes = {
  volunteer: PropTypes.shape().isRequired,
  match: PropTypes.shape({
    params: PropTypes.shape({
      code: PropTypes.string,
      username: PropTypes.string,
    }),
  }).isRequired,
};
