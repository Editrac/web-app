import React, { useState } from 'react';
import { IProject, IStatusColumns, TaskStatus } from 'src/store/organisation/type';
import { taskStatusMap } from 'src/utils/consts';
import { DragDropContext, Draggable, DropResult, ResponderProvided } from "react-beautiful-dnd";
import TaskDialog from '../dialogs/task-dialog';
import TaskCard from './task-card';
import TaskColumn from './task-column';

interface IProps {
  organisationId: string;
  project: IProject;
  statusColumns: IStatusColumns;
  setStatusColumns: (statusColumns: IStatusColumns) => void
}

const ProjectBoard: React.FC<IProps> = ({ project, organisationId, statusColumns, setStatusColumns }) => {
  const [taskDialog, setTaskDialog] = useState<boolean>(false);

  async function onDragEnd(result: DropResult, provided: ResponderProvided) {
    const { source, destination } = result;
    if (!destination) {
      return;
    }
    const sStatus = source.droppableId as TaskStatus;
    const dStatus = destination.droppableId as TaskStatus;
    if (statusColumns && (sStatus === dStatus) && (source.index !== destination.index)) {
      let _columns = { ...statusColumns };
      const _task = _columns[sStatus].tasks[source.index];
      _columns[dStatus].tasks.splice(destination.index > source.index ? destination.index + 1 : destination.index, 0, _task);
      _columns[sStatus].tasks.splice(source.index > destination.index ? source.index + 1 : source.index, 1)
      setStatusColumns(_columns);
    }
    if (statusColumns && (sStatus !== dStatus)) {
      let _columns = { ...statusColumns };
      const _task = _columns[sStatus].tasks[source.index];
      _task.status = dStatus;
      if (dStatus === TaskStatus.READY_FOR_DELIVERY) {
        _task.deliveryDetail = {
          paid: false,
          paymentLink: "",
          assetLink: "",
          noAsset: false
        }
      }
      _columns[dStatus].tasks.splice(destination.index, 0, _task);
      _columns[sStatus].tasks.splice(source.index, 1)
      setStatusColumns(_columns);
    }
  }

  if (!statusColumns) {
    return <></>
  }

  return (
    <>
      <TaskDialog open={taskDialog} setOpen={(open: boolean) => setTaskDialog(open)} />
      <div className='absolute inset-0 mx-3 rounded-t-xl' style={{ backgroundColor: "rgba(0,0,0,0.3)" }}>
        <div className=' absolute inset-0 top-2 overflow-x-auto whitespace-nowrap overflow-y-hidden'>
          <div className=' inline-block h-full overflow-hidden mr-2' />
          <DragDropContext onDragEnd={onDragEnd}>
            {Object.keys(taskStatusMap).map((key, index) => (
              <TaskColumn statusColumn={statusColumns[key as TaskStatus]}>
                {statusColumns[key as TaskStatus].tasks.map((task, index) => (
                  <Draggable
                    key={task._id}
                    draggableId={task._id}
                    index={index}
                  >
                    {(provided, snapshot) => (
                      <div
                        className='bg-bg-dark mb-2 rounded-md cursor-pointer overflow-hidden border border-grey-1'
                        ref={provided.innerRef}
                        {...provided.draggableProps}
                        {...provided.dragHandleProps}
                      >
                        <TaskCard task={task} onClick={() => setTaskDialog(true)} />
                      </div>
                    )}
                  </Draggable>
                ))}
              </TaskColumn>

            ))}
          </DragDropContext>
        </div>
      </div>
    </>
  )
};

export default ProjectBoard;
