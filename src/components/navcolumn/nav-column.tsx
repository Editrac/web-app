import React, { ReactNode, useEffect, useState } from 'react';
import { NavLink, useNavigate, useLocation } from 'react-router-dom';
import cx from 'classnames'
import styles from './nav-column.module.css';
import SimpleBar from 'simplebar-react';
import ArrowBackIcon from '@material-ui/icons/ArrowBack';
import { useSelector } from 'react-redux';
import Typography from '@material-ui/core/Typography';

interface NavColumnCardProps {
  onClick?: () => void;
  linkTo: string;
  _id?: string;
  name: string;
  brief?: ReactNode;
  overflowMenu?: ReactNode;
}


interface NavLinkGroupProps {
  children: ReactNode
}

export const NavLinkGroup: React.FC<NavLinkGroupProps> = (props) => {
  return (
    <div className={styles.navlinkGroup}>
      {props.children}
    </div>
  )
}
export const NavColumnCard: React.FC<NavColumnCardProps> = (props) => {
  const location = useLocation();
  const navigate = useNavigate();
  return (
    <div
      role="button"
      onClick={() => {
        if (props.onClick)
          props.onClick();
        navigate(props.linkTo);
      }}
      className={cx(styles.navCard, location.pathname === props.linkTo && styles.activeNavCard)} >
      <p>{props.name}</p>
      {props.brief && <div className="flex row-flex space-between cross-center">
        <span>{props.brief}</span>
        {props.overflowMenu &&
          <div className={styles.groupCardMenu}>
            {props.overflowMenu}
          </div>
        }
      </div>}
    </div>
  )
}
interface NavColumnLinkProps {
  icon?: string;
  linkTo: string;
  title: string;
  description?: string;
  compact?: boolean
}
export const NavColumnLink: React.FC<NavColumnLinkProps> = (props) => {
  return (
    <NavLink
      to={props.linkTo}
      className={({ isActive }) =>
        isActive ? `${styles.navlink} transition2 ${props.compact && styles.compact} ${cx(styles.activeNavlink)}` : `${styles.navlink} transition2 ${props.compact && styles.compact}`
      }
    >
      <div className="flex fill">
        <div className={styles.navlinkIcon}>
          {props.icon && <i className={`${styles.navicon} pficon-${props.icon}`}></i>}
        </div>
        <div className={styles.navlinkText}>
          <div>
            <p className="bold">{props.title}</p>
            {props.description && <span>Lets get started with HTML Ta</span>}
          </div>
        </div>
      </div>
    </NavLink>
  )
}

interface NavColumnHeaderProps {
  header: string;
}
export const NavColumnHeader: React.FC<NavColumnHeaderProps> = (props) => {
  return (
    <Typography className={styles.header} variant="h5">
      <span className="">{props.header}</span>
    </Typography>
  )
}

interface NavColumnHeaderProps {
  header: string;
  backButton?: boolean;
}
export const NavHeaderNavigation: React.FC<NavColumnHeaderProps> = (props) => {
  return (
    <button className={`${styles.headerBackButton} transition2 pointer`} >
      <ArrowBackIcon fontSize="small" />
      <span>{props.header}</span>
    </button>
  )
}


interface NavColumnProps {
  children: ReactNode
}
const NavColumn: React.FC<NavColumnProps> = (props) => {

  const [windowHeight, setWindowHeight] = useState<number>(0);

  useEffect(() => {
    setWindowHeight(window.innerHeight)
  }, [window.innerHeight])

  return (
    <div className={styles.navbar}>
      {windowHeight ? <SimpleBar style={{ padding: '30px 16px 10px 16px', maxHeight: "100%" }}>
        {props.children}
      </SimpleBar> : null}
    </div>
  )
};


export default NavColumn;
