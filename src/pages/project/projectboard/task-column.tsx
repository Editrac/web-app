import React from 'react';
import { IStatusColumn, TaskStatus } from 'src/store/organisation/type';
import { taskStatusMap } from 'src/utils/consts';
import { Droppable } from "react-beautiful-dnd";

interface IProps {
  statusColumn: IStatusColumn;
}

const TaskColumn: React.FC<IProps> = ({ statusColumn, ...props }) => {
  const getColumnFill = (highlighted: boolean) => {
    return highlighted ? `'rgba(4, 95, 255, 0.04)'` : `'rgba(203, 206, 255, 0.025)'`
  }

  return (
    <div className=' inline-block h-full overflow-hidden m-0' style={{ width: 272 }}>
      <div className='bg-bg rounded-t-lg relative mr-2 h-full flex flex-col overflow-hidden' style={{ background: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' height='100%25' width='100%25'%3E%3Cdefs%3E%3Cpattern id='doodad' width='8' height='8' viewBox='0 0 40 40' patternUnits='userSpaceOnUse' patternTransform='rotate(46)'%3E%3Crect width='100%25' height='100%25' fill=${getColumnFill(statusColumn.name === TaskStatus.READY_FOR_DELIVERY)}/%3E%3Ccircle cx='20' cy='20' r='1' fill='rgba(247, 250, 252,0)'/%3E%3Ccircle cx='20' cy='20' r='4' fill='rgba(0, 0, 0,0.5)'/%3E%3Ccircle cx='-20' cy='20' r='4' fill='rgba(0, 0, 0,0.8)'/%3E%3C/pattern%3E%3C/defs%3E%3Crect fill='url(%23doodad)' height='200%25' width='200%25'/%3E%3C/svg%3E ")` }}>
        <div className='bg-bg-dark rounded-t-lg'>
          <div className='bg-bg-light px-4 py-3 text-sm font-semibold' style={{ backgroundColor: statusColumn.name === TaskStatus.READY_FOR_DELIVERY ? "rgba(4, 95, 255, 0.15)" : "var(--bg-lighter)" }}>
            {taskStatusMap[statusColumn.name].label}
            <span className='opacity-40 ml-2'>({statusColumn.tasks.length})</span>
          </div>
        </div>
        <div className='flex flex-1 flex-col overflow-y-auto p-2'>
          <Droppable key={statusColumn.name} droppableId={`${statusColumn.name}`}>
            {(provided, snapshot) => (
              <div
                ref={provided.innerRef}
                className="flex flex-col flex-1"
                {...provided.droppableProps}
              >
                {props.children}
                {provided.placeholder}
              </div>
            )}
          </Droppable>
        </div>
      </div>
    </div>
  )
};

export default TaskColumn;
