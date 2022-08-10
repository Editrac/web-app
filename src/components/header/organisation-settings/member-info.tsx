import React, { useEffect, useState } from 'react';
import { IUser, UserRole, UserRoleConsts } from 'src/store/auth/type';
import IconButton from '@material-ui/core/IconButton';
import CloseRoundedIcon from '@material-ui/icons/CloseRounded';
import EditIcon from '@material-ui/icons/Edit';
import Grid from '@material-ui/core/Grid';
import { ProgressRound } from 'src/components/progress';
import DotIcon from '@material-ui/icons/FiberManualRecord';
import { TaskStatus } from 'src/store/organisation/type';
import { taskStatusMap } from 'src/utils/consts';
import { testProject } from 'src/pages/project/testdata';
import DeleteIcon from '@material-ui/icons/Delete';

interface IProps {
  user?: IUser,
  dismiss: () => void
}

const MemberInfo: React.FC<IProps> = ({ user, dismiss }) => {
  const [tab, setTab] = React.useState(user?.role === UserRole.ADMIN ? 0 : 1);
  const [addUserDialog, setAddUserDialog] = useState<{ open: boolean, role: UserRole, reload: boolean }>({ open: false, role: UserRole.PROJECT_MANAGER, reload: true });

  const handleChange = (event: any, newValue: any) => {
    setTab(newValue);
  };

  function randIndex(min: number, max: number) {
    return Math.floor(Math.random() * (max - min + 1) + min)
  }

  return (
    <div className={`border-l border-grey-1 transition-width duration-300 overflow-y-auto overflow-x-hidden`} style={{ width: user ? 400 : 0 }}>
      {user && < div className='py-8 px-6' style={{ width: 400 }}>
        <div className='flex justify-between items-start'>
          <div className="w-20 h-20 border border-dashed border-grey-1 rounded-lg overflow-hidden bg-bg ">
            <div className="w-full h-full">
              {"https://picsum.photos/id/1005/200/200" ?
                <img src={"https://picsum.photos/id/1005/200/200"} className="h-full w-full object-contain" /> :
                <div className="h-full w-full flex items-center justify-center text-base font-bold">
                  <span className='opacity-40'>{user.firstName[0]}{user.lastName[0]}</span>
                </div>
              }
            </div>
          </div>
          <span className='flex flex-1' />
          <div className='border border-error w-12 h-12 flex items-center justify-center rounded-full mr-2 text-error'>
            <IconButton color="inherit">
              <DeleteIcon fontSize='small' />
            </IconButton>
          </div>
          <div className='border border-grey-2 w-12 h-12 flex items-center justify-center rounded-full'>
            <IconButton color="secondary" onClick={() => dismiss()}>
              <CloseRoundedIcon fontSize='small' />
            </IconButton>
          </div>
        </div>
        <p className='text-base font-semibold mt-5 mb-2'>
          <span className='mr-2'>{user.firstName} {user.lastName}</span>
          <span className='text-error'>
            <DotIcon fontSize='inherit' color='inherit' />
            <span className='text-sm ml-0.5'>On Leave</span>
          </span>
        </p>
        <span className='border rounded px-1 py-0.5 text-grey-2 text-xs' style={{ color: UserRoleConsts[user.role].color }}>{UserRoleConsts[user.role].label}</span>
        <span className='border rounded px-1 py-0.5 ml-1 text-xs'>Final Cut Pro</span>
        <p className='mb-2'></p>
        <Grid container spacing={1}>
          <Grid item xs={12}>
            <p className='border-b border-grey-1 border-dashed mt-4 mb-2'></p>
          </Grid>
          <Grid item xs={3}>
            <div className='flex items-center'>
              <ProgressRound value={25} size={32} thickness={5} />
              <div className='ml-2'>
                <p className='text-base -mt-1'>34%</p>
                <p className='text-xs opacity-40 -mt-0.5'>Effort</p>
              </div>
            </div>
          </Grid>
          <Grid item xs={3}>
            <p className='text-base text-center -mt-1'>04</p>
            <p className='text-xs opacity-40 -mt-0.5 text-center'>In Progress</p>
          </Grid>
          <Grid item xs={2}>
            <p className='text-base text-center -mt-1'>01</p>
            <p className='text-xs opacity-40 -mt-0.5 text-center'>Review</p>
          </Grid>
          <Grid item xs={2}>
            <p className='text-base text-center -mt-1'>02</p>
            <p className='text-xs opacity-40 -mt-0.5 text-center'>Approved</p>
          </Grid>
          <Grid item xs={2}>
            <p className='text-base text-right -mt-1'>01</p>
            <p className='text-xs opacity-40 -mt-0.5 text-right'>Delivery</p>
          </Grid>
          <Grid item xs={12}>
            <p className='border-b border-grey-1 border-dashed mt-2'></p>
          </Grid>
        </Grid>
        <div className=' mt-5'>
          <p className='text-sm font-semibold mb-2'>Active Tasks</p>
          {testProject.tasks.map((task) => {
            const taskStatus = taskStatusMap[task.status];
            const { label, color, shade } = taskStatus
            return (
              <div className='bg-bg rounded py-3 px-2 mt-1 flex items-center'>
                <span className="text-base mr-2 inline-flex items-center" style={{ color: color }}>
                  {taskStatus.icon || null}
                </span>
                <span className='text-sm flex flex-1'>{task.name}</span>
                <span className="text-xs opacity-80 border border-grey-5 px-1 rounded inline">V3</span>
                {task.deliverable && <span className="text-xs opacity-80 border px-1 rounded inline ml-1" style={{ color: "#ffe927" }}>Deliverable</span>}
              </div>
            )
          })}
        </div>
      </div>}
    </div>
  );
};

export default MemberInfo;
