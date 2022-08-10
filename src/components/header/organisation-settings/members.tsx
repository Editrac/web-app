import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom'
import { IUser, UserRole, UserRoleConsts } from 'src/store/auth/type';
import { useQuery } from 'src/utils/axios-hooks';
import orgAPI from "src/apis/organisation";
import { useSelector } from 'react-redux';
import { IState } from 'src/store/config';
import Avatar from 'src/components/avatar';
import { avatarColors } from 'src/utils/colors';
import IconButton from '@material-ui/core/IconButton';
import CloseRoundedIcon from '@material-ui/icons/CloseRounded';
import EditIcon from '@material-ui/icons/Edit';
import Grid from '@material-ui/core/Grid';
import { ProgressRound } from 'src/components/progress';
import DotIcon from '@material-ui/icons/FiberManualRecord';
import MemberInfo from './member-info';

const Members: React.FC = () => {
  let history = useNavigate();
  const { user } = useSelector((state: IState) => state.authReducer);
  const [tab, setTab] = React.useState(user?.role === UserRole.ADMIN ? 0 : 1);
  const [selectedUser, setSelectedUser] = useState<IUser | undefined>();
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

  function randIndex(min: number, max: number) {
    return Math.floor(Math.random() * (max - min + 1) + min)
  }

  return (
    <div className="flex h-full overflow-hidden">
      <div className={`flex flex-1 py-12 h-full items-start overflow-y-auto pl-10 transition-width ${!selectedUser && 'pr-10'}`}>
        <table className='w-full'>
          {/* <tr>
            <th>jk</th>
            <th>jk</th>
            <th>jk</th>
          </tr> */}
          {[...users, ...users, ...users, ...users, ...users, ...users].map((user, index) => {
            const bool = Math.random() < 0.5
            return (
              <tr key={index} className={`border-b border-bg text-sm cursor-pointer hover:bg-bg ${selectedUser?._id === user._id && ''}`} onClick={() => setSelectedUser(user)}>
                <td className='py-4 w-0 whitespace-nowrap'>
                  <Avatar size={8} initials={`${user.firstName[0]}${user.lastName[0]}`} image={user.picture} color={avatarColors[randIndex(0, 6)]} />
                </td>
                <td className="pl-3 w-0 whitespace-nowrap">
                  <p>{user.firstName} {user.lastName}</p>
                  <p className='opacity-30'>
                    {user.email}
                  </p>
                </td>
                <td className='pl-12 w-0 whitespace-nowrap'>
                  <span className={`${bool ? "text-error" : "text-accent"} flex items-center`}>
                    <DotIcon fontSize='inherit' color='inherit' />
                    <span className='text-sm ml-0.5'>{bool ? "On Leave" : "Working"}</span>
                  </span>
                </td>
                <td className="pl-12 w-0 whitespace-nowrap">
                  <span className='border border-grey-2 rounded px-1 py-0.5 text-grey-2 border-opacity-50 text-xs' style={{ color: UserRoleConsts[user.role].color }}>{UserRoleConsts[user.role].label}</span>
                </td>
                <td className='pl-12'>
                  {!selectedUser && <div className='flex items-center'>
                    <ProgressRound value={25} size={30} thickness={5} />
                    <div className='ml-2'>
                      <p className='text-sm'>12<span className='opacity-50 mx-0.5'>/</span>48</p>
                      <p className='text-xs opacity-40 -mt-0.5'>Tasks</p>
                    </div>
                  </div>}
                </td>
                <td className='whitespace-nowrap pl-12'>
                  {!selectedUser && <span className='border border-grey-2 rounded px-1 py-0.5 text-xs'>Premier Pro</span>}
                </td>
              </tr>
            )
          })}
        </table>
      </div>
      <MemberInfo user={selectedUser} dismiss={() => setSelectedUser(undefined)} />
    </div >
  );
};

export default Members;
