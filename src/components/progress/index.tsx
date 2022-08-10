import CircularProgress from '@material-ui/core/CircularProgress';
import { makeStyles } from '@material-ui/core/styles';
import React from 'react';

interface Props {
  value: number;
  thickness?: number;
  size?: number;
}

const useStylesFacebook = makeStyles(() => ({
  bottom: {
    color: "var(--bg-lightest)",
  },
  top: {
    color: '#1a90ff',
    animationDuration: '550ms',
    position: "absolute",
    top: 0
  },
  circle: {
    strokeLinecap: 'round',
    stroke: "#00934f"
  },
  circleBottom: {
    strokeLinecap: 'round',
    stroke: "var(--bg-lightest)"
  },
}));

export const ProgressRound: React.FC<Props> = ({ value, thickness = 5, size = 36 }) => {
  const classes = useStylesFacebook();

  return (
    <div className="flex items-center relative">
      <div className='relative'>
        <div className='flex' style={{ transform: `scaleX(-1) ${value && 'rotate(21deg)'}` }}>
          <CircularProgress
            variant="determinate"
            className={classes.bottom}
            size={size}
            thickness={thickness}
            classes={{
              circle: classes.circleBottom,
            }}
            value={value ? 100 - value - 12 : 100}
          />
        </div>
        <CircularProgress
          variant="determinate"
          disableShrink
          className={classes.top}
          classes={{
            circle: classes.circle,
          }}
          size={size}
          value={value}
          thickness={thickness}
        />
      </div>
    </div>

  );
};