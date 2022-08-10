import React from 'react';
import { createStyles, makeStyles, withStyles } from '@material-ui/core/styles';
import TextField, { TextFieldProps } from '@material-ui/core/TextField';
import { OutlinedInputProps } from '@material-ui/core/OutlinedInput';
import InputBase from '@material-ui/core/InputBase';
import Switch from '@material-ui/core/Switch';
import Slider from '@material-ui/core/Slider';
const useInputStyles = makeStyles(() =>
  createStyles({
    root: {
      backgroundColor: 'transparent',
      '&:hover': {
        backgroundColor: 'transparent',
      },
      '&$focused': {
        backgroundColor: 'transparent',
      }
    },
    focused: {},
  }),
);

const StyledInput = (props: TextFieldProps) => {
  const classes = useInputStyles();

  return (
    <TextField
      InputProps={{ classes, disableUnderline: true } as Partial<OutlinedInputProps>}
      {...props}
    />
  );
}
export const useStyles = makeStyles({
  bold: {
    fontWeight: 'bold',
  },
  subHeadline: {
    fontSize: 16,
    paddingTop: 10,
    fontWeight: 500,
  },
  sandwitchText: {
    margin: '0 0 15px 0',
    fontWeight: 500
  },
  button: {
    borderRadius: 15,
    fontSize: 14,
    padding: '12px 0',
    margin: '5px 0 20px 0'
  },
  smallgutter: {
    marginTop: 30
  }
});

export const StyledInputBase = withStyles(() =>
  createStyles({
    root: {
      marginTop: "0.375rem",
      padding: "0 !important"
    },

    input: {
      height: "initial",
      borderRadius: "8px !important",
      position: 'relative',
      backgroundColor: 'var(--bg)',
      border: '1px solid var(--bg)',
      fontSize: 14,
      padding: '10px 12px',
      minHeight: 'initial',
      color: "var(--text-primary)",
      '&:focus': {
        border: '1px solid var(--accent)',
      }
    },
    error: {
      '& input': {
        borderColor: "var(--text-error)",
        color: "var(--text-error)"
      },
      '& textarea': {
        borderColor: "var(--text-error)",
        color: "var(--text-error)"
      },
      '& .MuiSelect-select': {
        bborderColor: "var(--text-error)",
        color: "var(--text-error)",
        backgroundColor: 'var(--bg-dark)',
      },
      '&:focus': {
        borderColor: "var(--text-error)",
      }
    }
  }),
)(InputBase);

export const StyledSwitch = withStyles(() =>
  createStyles({
    root: {
      width: 34,
      height: 22,
      padding: 0,
      display: 'flex',
    },
    switchBase: {
      padding: 4,
      color: "var(--grey-1)",
      '&$checked': {
        transform: 'translateX(12px)',
        color: "#fff",
        '& + $track': {
          opacity: 1,
          backgroundColor: 'var(--accent)',
          borderColor: 'var(--accent)',
        }
      },
    },
    thumb: {
      width: 14,
      height: 14,
      boxShadow: 'none',
      backgroundColor: "var(--grey-5)"
    },
    track: {
      border: `1px solid var(--grey-2)`,
      borderRadius: 22 / 2,
      height: 22,
      opacity: 1,
      backgroundColor: "var(--bg-bg)",
    },
    checked: {},
  }),
)(Switch);

export const StyledSlider = withStyles({
  root: {
    color: 'var(--accent)',
    height: 4,
    padding: 0
  },
  thumb: {
    height: 10,
    width: 10,
    backgroundColor: '#fff',
    marginTop: -3,
    marginLeft: -3,
    '&:focus, &:hover, &$active': {
      boxShadow: 'inherit',
    },
    '&:after': {
      display: 'none',
    },
  },
  track: {
    height: 4,
    borderRadius: 2,
  },
  rail: {
    height: 4,
    borderRadius: 2,
    backgroundColor: "var(--grey-2)"
  },
})(Slider);

export default StyledInput