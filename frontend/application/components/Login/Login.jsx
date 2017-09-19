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
      <div>
        <div>
          <div>
            <img src="http://via.placeholder.com/500x200" alt="login background text" />
            <div>&lt;Code Does Good /&gt;</div>
          </div>
          <div>
            <span>CDG Volunteer Sign In</span>
            <form ref={(loginForm) => { this.loginForm = loginForm; }}>
              <input ref={(formUsername) => { this.formUsername = formUsername; }} required="required" />
              <input ref={(formPassword) => { this.formUsername = formPassword; }} required="required" />
              <div>
                <span>Not a CDG Volunteer yet? Sign up here</span>
                <button type="submit" onClick={this.login}>Sign In</button>
              </div>
              <span>forgot my username / password</span>
            </form>
          </div>
        </div>
      </div>
    );
  }
}

Login.propTypes = {
  client: PropTypes.shape().isRequired,
  authenticating: PropTypes.func.isRequired,
};
