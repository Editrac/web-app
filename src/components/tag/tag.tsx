import React from 'react';
import cx from 'classnames';
import styles from './tag.module.css';

interface Props {
  title?: string,
  color: 'grey' | 'white' | 'blue' | 'red' | 'yellow' | 'green' | 'orange' | 'olive' | 'teal' | 'purple' | 'pink' | 'brown',
  size: 'regular' | 'medium' | 'large',
  icon?: string
}
const Tag: React.FC<Props> = (props) => {
  return (
    <span className={cx(styles.tag, styles[props.color], styles[props.size])}>
      <span className={styles.tagText}>
        {props.icon && <span className={`pficon-${props.icon}`} style={{ fontSize: 14 }} />}
        {props.icon && props.title && <span className={styles.spacer} />}
        {props.title && <span>
          {props.title}
        </span>}
      </span>
    </span>
  );
};

export default Tag;