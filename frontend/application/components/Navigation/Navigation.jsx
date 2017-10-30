import React from 'react';
import PropTypes from 'prop-types';
// Make sure to use { Link } otherwise you get a error
import { Link } from 'react-router-dom';

import * as routes from '../Application/routePaths';

const style = require('./navigation.less');

export default function Navigation(props) {
  if (props.authentication.result) {
    return (
      <nav>
        <div className={style.menuNavigation}>
          <ul>
            <li className={style.textNavigation}>
              <Link href to={routes.myProfile}>My Profile</Link>
            </li>
            <li className={style.textNavigation}>
              <Link href to={routes.projects}>Projects</Link>
            </li>
            <li className={style.textNavigation}>
              <Link href to={routes.orgWiki}>Org Wiki</Link>
            </li>
            <li className={style.textNavigation}>
              <Link href to={routes.devHatchery}>Dev Hatchery</Link>
            </li>
            <li className={style.textNavigation}>
              <Link href to={routes.contactUs}>Contact Us</Link>
            </li>
            <li className={style.textNavigation}>
              <Link href to={routes.pastAnnouncements}>Past Announcements</Link>
            </li>
            <li className={style.textNavigation}>
              <Link href to={routes.signOut}>Sign Out</Link>
            </li>
          </ul>
        </div>
      </nav>
    );
  }
  return (
    <nav>
      <div className={style.menuNavigation}>
        <ul>
          <li className={style.textNavigation}>
            <Link href to={routes.projects}>Projects</Link>
          </li>
          <li className={style.textNavigation}>
            <Link href to={routes.orgWiki}>Org Wiki</Link>
          </li>
          <li className={style.textNavigation}>
            <Link href to={routes.devHatchery}>Dev Hatchery</Link>
          </li>
          <li className={style.textNavigation}>
            <Link href to={routes.contactUs}>Contact Us</Link>
          </li>
          <li className={style.textNavigation}>
            <Link href to={routes.pastAnnouncements}>Past Announcements</Link>
          </li>
          <li className={style.textNavigation}>
            <Link href to={routes.login}>Sign In</Link>
          </li>
        </ul>
      </div>
    </nav>
  );
}

Navigation.propTypes = {
  authentication: PropTypes.shape().isRequired,
};
