import React from 'react';

import Notifications from './Notifications/Notifications';
import Announcements from './Announcements/Announcements';

const style = require('./home.less');

export default class Login extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      message: '',
      error: false,
    };
  }

  render() {
    return (
      <div>
        <div className={style.homeTitle}>Volunteer Home</div>
        <div className={style.announcements}>
          <span className={style.announcementsTitle}>Announcements</span>
          <Announcements announcements={[]} />
        </div>
        <div className={style.notifications}>
          <span className={style.notificationsTitle}>Notifications</span>
          <Notifications notifications={[]} />
        </div>
      </div>
    );
  }
}
