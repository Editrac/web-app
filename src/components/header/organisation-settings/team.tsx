import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom'
import { withStyles } from '@material-ui/core/styles';
import Button from 'src/components/button/text.button';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import AddUserDialog from '../dialogs/add-user';
import { IUser, UserRole } from 'src/store/auth/type';
import { useQuery } from 'src/utils/axios-hooks';
import orgAPI from "src/apis/organisation";
import CircularProgress from '@material-ui/core/CircularProgress';
import { useSelector } from 'react-redux';
import { IState } from 'src/store/config';
import AuthComponent from 'src/components/auth/auth.component';
import { IOrganisationType } from 'src/store/organisation/type';
import Avatar from 'src/components/avatar';
import { avatarColors } from 'src/utils/colors';

const StyledTabs = withStyles({
  root: {
    backgroundColor: 'transparent',
  },
  indicator: {
    height: 3,
    borderTopLeftRadius: 4,
    borderTopRightRadius: 4,
    backgroundColor: 'var(--accent)',
  },
})(Tabs);

const StyledTab = withStyles({
  root: {
    textTransform: 'none',
    fontSize: 16,
    minWidth: '60px !important',
    color: '#fff',
    '&:hover': {
      color: 'var(--accent)',
      opacity: 1,
    },
    '&$selected': {
      color: 'var(--accent)',
    },
  },
  selected: {},
})(Tab);

const ManageTeam: React.FC = () => {
  let history = useNavigate();
  const { user } = useSelector((state: IState) => state.authReducer);
  const [tab, setTab] = React.useState(user?.role === UserRole.ADMIN ? 0 : 1);
  const [users, setUsers] = useState<IUser[]>([])
  const [addUserDialog, setAddUserDialog] = useState<{ open: boolean, role: UserRole, reload: boolean }>({ open: false, role: UserRole.PROJECT_MANAGER, reload: true });

  const { query: getUsers, loading: usersLoading } = useQuery(orgAPI.getUsers, {
    onSuccess: (res) => {
      setUsers(res.data.users)
    }
  });

  useEffect(() => {
    if (addUserDialog.reload)
      getUsers();
  }, [addUserDialog.reload])

  const handleChange = (event: any, newValue: any) => {
    setTab(newValue);
  };

  return (
    <>
      <div className="text-center border-b border-bg m-auto">
        <AuthComponent allowedRoles={[UserRole.ADMIN]} organisationType={IOrganisationType.EDITING}>
          <StyledTabs centered value={tab} onChange={handleChange}>
            <StyledTab value={0} disableRipple label="Admins" />
            <StyledTab value={1} disableRipple label="Project Managers" />
            <StyledTab value={2} disableRipple label="Editors" />
          </StyledTabs>
        </AuthComponent>
        <AuthComponent allowedRoles={[UserRole.PROJECT_MANAGER]} organisationType={IOrganisationType.EDITING}>
          <StyledTabs centered value={tab} onChange={handleChange}>
            <StyledTab value={1} disableRipple label="Project Managers" />
            <StyledTab value={2} disableRipple label="Editors" />
          </StyledTabs>
        </AuthComponent>
        <AuthComponent allowedRoles={[UserRole.ADMIN]} organisationType={IOrganisationType.PRODUCING}>
          <StyledTabs centered value={tab} onChange={handleChange}>
            <StyledTab value={0} disableRipple label="Admins" />
          </StyledTabs>
        </AuthComponent>
      </div>
      <div className="mt-10 mx-auto px-10">
        <AuthComponent allowedRoles={[UserRole.ADMIN]}>
          <div className="" style={{ display: tab === 0 ? "block" : "none" }}>
            <p className="flex items-center justify-between text-sm font-semibold mb-2 pl-0.5">
              <span>Admins</span>
              <Button onClick={() => setAddUserDialog({ open: true, role: UserRole.EDITOR, reload: false })} type="button" size="regular" variant="text-accent" >
                <span className="font-semibold">Add +</span>
              </Button>
            </p>
            {users.map((user, index) => (
              user.role === UserRole.ADMIN && <div key={index} className="flex border-t border-bg items-center">
                <div className="w-8 h-8 rounded-full bg-bg overflow-hidden">
                  {false ?
                    <img src={`${process.env.PUBLIC_URL}`} className="h-full w-full object-cover" /> :
                    <div className="h-full w-full flex items-center justify-center text-xs">
                      <span>{user.firstName[0]}{user.lastName[0]}</span>
                    </div>
                  }
                </div>
                <div className="flex flex-1 items-center pl-3 pr-1 py-4 text-sm">
                  {user.firstName} {user.lastName}
                </div>
              </div>
            ))}
          </div>
        </AuthComponent>
        <AuthComponent allowedRoles={[UserRole.ADMIN, UserRole.PROJECT_MANAGER]} organisationType={IOrganisationType.EDITING}>
          <div className="" style={{ display: tab === 1 ? "block" : "none" }}>
            <p className="flex items-center justify-between text-sm font-semibold mb-2 pl-0.5">
              <span>Project Managers</span>
              <Button onClick={() => setAddUserDialog({ open: true, role: UserRole.PROJECT_MANAGER, reload: false })} type="button" size="regular" variant="text-accent" >
                <span className="font-semibold">Add +</span>
              </Button>
            </p>
            <AddUserDialog open={addUserDialog.open} setOpen={(open: boolean, reload: boolean) => setAddUserDialog({ ...addUserDialog, open, reload })} role={addUserDialog.role} />
            {usersLoading && <div className="text-center mt-4">
              <CircularProgress color="secondary" size={20} thickness={5} />
            </div>}
            {users.map((user, index) => (
              user.role === UserRole.PROJECT_MANAGER && <div key={index} className="flex border-t border-bg items-center">
                <Avatar size={8} initials={`${user.firstName[0]}${user.lastName[0]}`} image={user.picture} crown color={avatarColors[index]} />
                <div className="flex flex-1 items-center pl-3 pr-1 py-4 text-sm">
                  {user.firstName} {user.lastName}
                </div>
              </div>
            ))}
          </div>
          <div className="" style={{ display: tab === 2 ? "block" : "none" }}>
            <p className="flex items-center justify-between text-sm font-semibold mb-2 pl-0.5">
              <span>Editors</span>
              <Button onClick={() => setAddUserDialog({ open: true, role: UserRole.EDITOR, reload: false })} type="button" size="regular" variant="text-accent" >
                <span className="font-semibold">Add +</span>
              </Button>
            </p>
            {users.map((user, index) => (
              user.role === UserRole.EDITOR && <div key={index} className="flex border-t border-bg items-center">
                <div className="w-8 h-8 rounded-full bg-bg overflow-hidden">
                  {false ?
                    <img src={`${process.env.PUBLIC_URL}`} className="h-full w-full object-cover" /> :
                    <div className="h-full w-full flex items-center justify-center text-xs">
                      <span>{user.firstName[0]}{user.lastName[0]}</span>
                    </div>
                  }
                </div>
                <div className="flex flex-1 items-center pl-3 pr-1 py-4 text-sm">
                  {user.firstName} {user.lastName}
                </div>
              </div>
            ))}
          </div>
        </AuthComponent>

      </div>
    </>
  );
};

export default ManageTeam;
