import React from 'react';
import PropTypes from 'prop-types';
import Link from 'react-router-dom';

const style = require('./navigation.less');

export default function Navigation(props) {
  if (props.authentication.result) {
    return (
      <nav>
        <div className={style.menuNavigation}>
          <ul>
            <li className={style.textNavigation}>My Profile</li>
            <li className={style.textNavigation}>Projects</li>
            <li className={style.textNavigation}>Org Wiki</li>
            <li className={style.textNavigation}>Dev Hatchery</li>
            <li className={style.textNavigation}>Contact Us</li>
            <li className={style.textNavigation}>Past Announcements</li>
            <li className={style.textNavigation}>Sign Out</li>
          </ul>
        </div>
      </nav>
    );
  }
  return (
    <nav>
      <div className={style.menuNavigation}>
        <ul>
          <li className={style.textNavigation}>Projects</li>
          <li className={style.textNavigation}>Org Wiki</li>
          <li className={style.textNavigation}>Dev Hatchery</li>
          <li className={style.textNavigation}>Contact Us</li>
          <li className={style.textNavigation}>Past Announcements</li>
          <li className={style.textNavigation}>Sign In</li>
        </ul>
      </div>
    </nav>
  );
}

Navigation.propTypes = {
  authentication: PropTypes.shape().isRequired,
};
