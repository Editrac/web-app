import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import cx from 'classnames';
import styles from './sidebar.module.css'

const Sidebar: React.FC = () => {
  const [isDarkThemeActive, setDarkThemeActive] = useState<boolean>(false);
  const handleThemeSwitch = () => {
    if (isDarkThemeActive) { document.documentElement.className = 'light-theme'; }
    else { document.documentElement.className = 'dark-theme'; }
    setDarkThemeActive(!isDarkThemeActive);
  }

  return (
    <div className={cx(styles.navbarContainer)}>
      <div className={cx(styles.navbarAvatar)}>
        <div className={styles.navLogo}>
          <svg id="Group_89" data-name="Group 89" xmlns="http://www.w3.org/2000/svg" width="32.545" height="15.731" viewBox="0 0 32.545 15.731">
            <g id="Group_5" data-name="Group 5">
              <path id="Path_6" data-name="Path 6" d="M169.35,248.142a7.866,7.866,0,1,1,0-15.731v3.3a4.566,4.566,0,1,0,0,9.131Z" transform="translate(-161.484 -232.411)" fill="#f6275d" />
            </g>
            <g id="Group_7" data-name="Group 7" transform="translate(7.866)">
              <path id="Path_8" data-name="Path 8" d="M237.993,248.142h-.043a8.463,8.463,0,0,1-6.46-2.989l-6.47-7.617a5.168,5.168,0,0,0-3.945-1.825v-3.3a8.463,8.463,0,0,1,6.46,2.989l6.47,7.617a5.168,5.168,0,0,0,3.945,1.825h.043Z" transform="translate(-221.074 -232.411)" fill="#ffad02" />
            </g>
            <g id="Group_8" data-name="Group 8" transform="translate(7.826)">
              <path id="Path_9" data-name="Path 9" d="M220.814,248.142h-.043v-3.3h.043a5.168,5.168,0,0,0,3.945-1.825l6.47-7.617a8.463,8.463,0,0,1,6.46-2.989v3.3a5.168,5.168,0,0,0-3.945,1.825l-6.47,7.617A8.463,8.463,0,0,1,220.814,248.142Z" transform="translate(-220.77 -232.411)" fill="#3b69ff" />
            </g>
            <g id="Group_6" data-name="Group 6" transform="translate(24.68)">
              <path id="Path_7" data-name="Path 7" d="M348.456,248.142v-3.3a4.566,4.566,0,0,0,0-9.131v-3.3a7.866,7.866,0,0,1,0,15.731Z" transform="translate(-348.456 -232.411)" fill="#3b69ff" />
            </g>
          </svg>
        </div>
      </div>
      <div className="container--navlinks">
        <NavLink className={({ isActive }) => isActive ? `${cx(styles.navlink)} ${cx(styles.activeNavlink)}` : cx(styles.navlink)} to="/dashboard">
          <i className={cx(styles.navicon, 'pficon-dashboard')}></i>
        </NavLink>
        <NavLink className={({ isActive }) => isActive ? `${cx(styles.navlink)} ${cx(styles.activeNavlink)}` : cx(styles.navlink)} to="/projects">
          <i className={cx(styles.navicon, 'pficon-trades')}></i>
        </NavLink>
        <NavLink className={({ isActive }) => isActive ? `${cx(styles.navlink)} ${cx(styles.activeNavlink)}` : cx(styles.navlink)} to="/folio">
          <i className={cx(styles.navicon, 'pficon-folio')}></i>
        </NavLink>

      </div>
      <div className={styles.bottomActions}>
        <div role="button" onClick={handleThemeSwitch} className={styles.themeSwitcher}>
          <div className={cx(styles.themeSwitcherIcon, !!isDarkThemeActive && styles.darkThemeActive)}>
            <span className={cx(styles.front, "pficon-circle")} />
            <span className={cx(styles.back, "pficon-circle")} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
