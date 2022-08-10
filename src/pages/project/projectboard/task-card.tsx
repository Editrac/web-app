import React, { useState, useEffect } from 'react';
import AuthComponent from 'src/components/auth/auth.component';
import Avatar from 'src/components/avatar';
import { UserRole } from 'src/store/auth/type';
import { IOrganisationType, IProjectTask, TaskStatus } from 'src/store/organisation/type';
import { taskStatusMap } from 'src/utils/consts';

interface ICardProps {
  task: IProjectTask;
  onClick?: () => void;
  hideThumb?: boolean
}

export const TaskCard: React.FC<ICardProps> = ({ task, onClick, hideThumb }) => {
  const colors = ["#00aab1", "#00c000", "#ffff32", "#FF6800", "#E55151"];
  const taskStatus = taskStatusMap[task.status];
  const { label, color, shade } = taskStatus
  return (
    <div className={`${task.thumb && !hideThumb ? "pt-20" : "pt-3"} px-4 pb-4 text-sm relative hover:bg-bg-light`} style={{ backgroundColor: "var(--bg-light)" }} onClick={onClick}>
      {task.thumb && !hideThumb && <div className=' absolute inset-x-1 top-1 h-16 bg-bg rounded-md overflow-hidden mb-3'>
        <img src={task.thumb} className='h-full w-full object-cover opacity-90' />
      </div>}
      <p className="font-semibold mb-3">{task.name}</p>
      {task.status !== TaskStatus.READY_FOR_DELIVERY &&
        <>
          <span className="text-xs opacity-60 border border-grey-5 px-1 rounded inline">V3</span>
          {task.deliverable && <span className="text-xs opacity-60 border px-1 rounded inline ml-1" style={{ color: "#ffe927" }}>Deliverable</span>}
          {task.internal && <span className="text-xs border px-1 rounded inline ml-1" style={{ color: "#9253ff" }}>Internal</span>}
        </>
      }
      {task.status === TaskStatus.READY_FOR_DELIVERY && task.deliveryDetail && <span className="text-xs border px-1 rounded inline ml-0.5" style={{ color: "#ff6262" }}>{task.deliveryDetail.paid ? "Paid" : "Unpaid"}</span>}
      <div className="flex items-center justify-between mt-1">
        <div className="flex items-center">
          <p className=" rounded-md inline-flex items-center text-xs pl-1 pr-2 py-0.5 border border-grey-1" style={{ backgroundColor: shade, color: color }}>
            <span className='flex items-center text-xs' >
              {taskStatus.icon || null}
              <span className="ml-1">{label}</span>
            </span>
          </p>
        </div>
        {task.status !== TaskStatus.READY_FOR_DELIVERY && <AuthComponent allowedRoles={[UserRole.ADMIN, UserRole.PROJECT_MANAGER, UserRole.EDITOR]} organisationType={IOrganisationType.EDITING}>
          <Avatar size={6} initials={"AB"} image={task.editor?.picture} color={colors[4]} />
        </AuthComponent>}
      </div>
    </div>
  )
}

export default TaskCard