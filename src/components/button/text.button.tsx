import React from 'react';
import cx from 'classnames';
import styles from './text-button.module.css';

interface Props {
  type?: 'button' | 'submit' | 'reset';
  title?: string
  variant: 'solid' | 'text-accent' | 'text-primary' | 'text-grey' | 'text-error' | 'text-white' | 'fill-accent' | 'fill-primary';
  round?: boolean;
  thick?: boolean;
  size: 'regular' | 'medium' | 'large';
  icon?: string;
  iconRight?: boolean | true;
  fullWidth?: boolean;
  styles?: object | {};
  onClick?: (event: React.MouseEvent<HTMLButtonElement>) => void;
}
const Button: React.FC<Props> = (props) => {
  return (
    <button
      type={props.type}
      onClick={props.onClick}
      className={cx(styles.button, styles[props.variant], styles[props.size], props.round && styles.round, props.thick && styles.thick, props.fullWidth && styles.fullWidth)}
      style={props.styles}
    >
      <span
        className={styles.buttonText}
      >
        {props.children}
      </span>
    </button>
  );
};

export default Button;