import { withStyles, Theme, createStyles, makeStyles } from '@material-ui/core/styles';
import TableCell from '@material-ui/core/TableCell';
import TableRow from '@material-ui/core/TableRow';
import Avatar from '@material-ui/core/Avatar';
export const StyledTableCell = withStyles((theme: Theme) =>
  createStyles({
    root: {
      color: 'var(--text-primary)',
      border: 0,
      padding: '10px 10px',
      '&:first-child': {
        borderTopLeftRadius: 5,
        borderBottomLeftRadius: 5
      },
      '&:last-child': {
        borderTopRightRadius: 5,
        borderBottomRightRadius: 5
      }
    },
    head: {
      backgroundColor: '#121216',
      color: 'var(--text-primary)',
      padding: '10px',
      fontSize: 'var(--font-regular)'
    },
    body: {
      fontSize: 14,
    },
  }),
)(TableCell);

export const StyledTableRow = withStyles((theme: Theme) =>
  createStyles({
    root: {
      cursor: "pointer",
      '&:nth-of-type(even)': {
        backgroundColor: 'rgba(0,0,0,0.14)',
      },
      '&:hover': {
        backgroundColor: 'var(--bg)',
      },
    },
  }),
)(TableRow);

export const InvestorAvatar = withStyles(() =>
  createStyles({
    root: {
      height: 24,
      width: 24,
      fontSize: '1rem',
      lineHeight: 2
    },
  }),
)(Avatar);


export const useTableStyles = makeStyles({
  table: {
    minWidth: 100,
  },
  avatarCell: {
    width: '1%',
  },
  checkboxCell: {
    padding: '0 4px',
    width: '1%'
  },
  semiBold: {
    fontWeight: 500
  },
  noWhiteSpace: {
    width: '1%',
  },
});