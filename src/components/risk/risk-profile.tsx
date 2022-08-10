import React from 'react';
import cx from 'classnames';
import styles from './risk-profile.module.css';

interface Props {
  risk: 1 | 2 | 3 | 4 | 5;
  icon?: string;
}
export const riskTitleMap: string[] = ['none', 'Low', 'Mod low', 'Moderate', 'Mod high', 'High'];
export const riskColorMap: string[] = ['#fff', 'green', 'olive', 'yellow', 'orange', 'red'];

const RiskProfileTag: React.FC<Props> = (props) => {
  return (
    <span className={cx(styles.riskTag, styles[riskColorMap[props.risk]])}>
      <span className={styles.tagText}>
        {props.icon && <>
          <span className={`pficon-${props.icon}`} style={{ fontSize: 14 }} />
          <span className={styles.spacer} />
        </>}
        <span>
          {riskTitleMap[props.risk]}
        </span>
      </span>
    </span>
  );
};

export default RiskProfileTag;