import React, { useState } from 'react';
import { useContext } from 'react';
import Snackbar from '@material-ui/core/Snackbar';
import SnackbarContent from '@material-ui/core/SnackbarContent';
import IconButton from '@material-ui/core/IconButton';
import CloseRoundedIcon from '@material-ui/icons/CloseRounded';
import ErrorIcon from "@material-ui/icons/Error";
import InfoIcon from "@material-ui/icons/Info";
import WarningIcon from "@material-ui/icons/Warning";
import CheckCircleIcon from "@material-ui/icons/CheckCircle";
import FileCopyIcon from '@material-ui/icons/FileCopy';
import withStyles from '@material-ui/styles/withStyles';
import createStyles from '@material-ui/styles/createStyles';

interface ISnackbarValue {
  visible: boolean;
  variant: SnackBarVariant;
  message: string;
  quick?: boolean;
}

export enum SnackBarVariant {
  ERROR = "error",
  INFORMATION = "information",
  SUCCESS = "success",
  WARNING = "warning",
  COPIED = "Copied"
}

const variantIcon = {
  [SnackBarVariant.ERROR]: ErrorIcon,
  [SnackBarVariant.INFORMATION]: InfoIcon,
  [SnackBarVariant.SUCCESS]: CheckCircleIcon,
  [SnackBarVariant.WARNING]: WarningIcon,
  [SnackBarVariant.COPIED]: FileCopyIcon,
};

export const StyledSnackbar = withStyles(() =>
  createStyles({
    root: {

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
)(Snackbar);

export const SnackBarContext = React.createContext<
  (values: ISnackbarValue) => void
>(() => { });

const SnackbarProvider: React.FC = ({ children }) => {
  const [values, setValues] = useState<ISnackbarValue>({
    visible: false,
    variant: SnackBarVariant.SUCCESS,
    quick: false,
    message: '',
  });

  const Icon = variantIcon[values.variant];

  const handleClose = () => {
    setValues({
      ...values,
      visible: false,
    });
  }

  const getStyles = (
    variant: SnackBarVariant
  ) => {
    switch (variant) {
      case SnackBarVariant.ERROR:
        return {
          backgroundColor: "var(--error-red)"
        };
      case SnackBarVariant.INFORMATION:
        return {
          backgroundColor: "var(--success-green)"
        }
      case SnackBarVariant.SUCCESS:
        return {
          backgroundColor: "var(--success-green)"
        }
      case SnackBarVariant.WARNING:
        return {
          backgroundColor: "var(--success-green)"
        }
      default:
        return {
          backgroundColor: "var(--success-green)"
        }
    }
  };

  return (
    <SnackBarContext.Provider value={setValues}>
      {children}
      <Snackbar
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
        open={values.visible}
        onClose={handleClose}
        autoHideDuration={1000}
      >
        <SnackbarContent
          style={{ padding: "0 1rem", ...getStyles(values.variant) }}
          className=""
          message={
            <span id="client-snackbar" className="flex items-center text-sm font-semibold">
              <Icon fontSize="inherit" />
              <span className="ml-2">{values.message}</span>
            </span>
          }
          action={[
            <IconButton
              key="close"
              aria-label="close"
              color="secondary"
              size="small"
              onClick={handleClose}
            >
              <CloseRoundedIcon fontSize="small" />
            </IconButton>
          ]}
        />
      </Snackbar>
    </SnackBarContext.Provider>
  );
};

export const useSnackbar = () => useContext(SnackBarContext);

export default SnackbarProvider;