import React, { useState, useEffect } from 'react';
import EditIcon from '@material-ui/icons/Edit';
import PublishRoundedIcon from '@material-ui/icons/PublishRounded';
import VideoLibraryIcon from '@material-ui/icons/VideoLibrary';
import AddIcon from '@material-ui/icons/Add';
import Button from "../../components/button/text.button";
import { IOrganisationType, IProject, IProjectTask } from 'src/store/organisation/type';
import VideoBrowser from './video-browser';
import CreateTaskDialog from './dialogs/create-task-dialog';
import VideoUploadDialog from './dialogs/video-upload';
import projectAPI from "src/apis/project"
import { useQuery } from 'src/utils/axios-hooks';
import { IVideo } from 'src/store/player/type';
import AuthComponent from 'src/components/auth/auth.component';
import { UserRole } from 'src/store/auth/type';
import CircularProgress from '@material-ui/core/CircularProgress';
import { taskStatusMap } from 'src/utils/consts';

interface IProps {
  organisationId: string;
  project: IProject
}

const ProjectTask: React.FC<IProps> = ({ project, organisationId }) => {
  const colors = ["#00aab1", "#00c000", "#ffff32", "#FF6800", "#E55151"];
  const [createTaskDialog, setCreateTaskDialog] = useState<boolean>(false);
  const [projectTasks, setProjectTasks] = useState<IProjectTask[]>(project.tasks)
  const [selectedTask, setSelectedTask] = useState<IProjectTask | undefined>();
  const [videoUploadDailog, setVideoUploadDailog] = useState<boolean>(false);

  const { query: getProjectTask, loading: taskLoading } = useQuery<any, any>(projectAPI.getProjectTask, {
    onSuccess: (res) => {
      setSelectedTask(res.data.projectTask)
    },
    onError: () => {
      setSelectedTask(undefined)
    }
  });

  const handleTaskChange = (taskId: string) => {
    setSelectedTask(project.tasks.find((task) => task._id === taskId));
    getProjectTask({
      organisation: organisationId,
      project: project._id,
      task: taskId
    });
  }

  useEffect(() => {
    if (project.tasks.length) {
      handleTaskChange(project.tasks[0]._id)
    }
  }, [])

  return (
    <div className="absolute inset-0">
      <CreateTaskDialog
        onAddTask={(task: IProjectTask) => {
          setProjectTasks(prev => [...prev, task])
        }}
        open={createTaskDialog}
        setOpen={(open: boolean) => setCreateTaskDialog(open)}
        organisationId={organisationId} project={project}
      />
      {selectedTask && (
        <VideoUploadDialog
          open={videoUploadDailog}
          onClose={(video?: IVideo) => {
            setVideoUploadDailog(false)
            if (video && selectedTask) {
              setSelectedTask({
                ...selectedTask,
                videos: [...selectedTask?.videos, video]
              })
            }
          }}
          taskId={selectedTask._id}
        />
      )}
      <div className="absolute inset-x-0 overflow-y-auto border-b border-bg pb-2">
        <div className="h-full flex items-start px-5">
          <div className="flex pr-6">
            {projectTasks.map((task, index) => (
              <div
                key={index}
                onClick={() => handleTaskChange(task._id)}
                className={`pt-3 px-4 pb-4 text-sm rounded-md bg-bg w-60 h-28 m-1 cursor-pointer flex flex-col border hover:bg-bg-light ${task._id === selectedTask?._id ? "border-accent" : " border-transparent"}`}
              >
                <div className='flex flex-1'>
                  <p className="font-semibold overflow-hidden overflow-ellipsis whitespace-nowrap">{task.name}</p>
                </div>
                <div className="flex items-center">
                  {task.videos.length ? <p className="h-6 mr-2 rounded-md inline-flex items-center text-xs">v{task.videos.length}</p> : null}
                  <div className="h-6 rounded-md inline-flex items-center text-xs">
                    <VideoLibraryIcon fontSize="inherit" />
                    <span className='ml-0.5'>{task.videos.length}</span>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center -ml-0.5">
                    <p className=" rounded-md inline-flex items-center text-xs">
                      <span className='flex items-center text-sm' style={{ color: taskStatusMap[task.status].color || "initial" }}>
                        {taskStatusMap[task.status].icon || null}
                        <span className="ml-1 text-primary">{taskStatusMap[task.status].label || ""}</span>
                      </span>
                    </p>
                  </div>
                  <AuthComponent allowedRoles={[UserRole.ADMIN, UserRole.PROJECT_MANAGER, UserRole.EDITOR]} organisationType={IOrganisationType.EDITING}>
                    <div className="w-7 h-7 rounded-full bg-bg overflow-hidden" style={{ backgroundColor: colors[index] }}>
                      {false ?
                        <img src={`${process.env.PUBLIC_URL}`} className="h-full w-full object-cover" /> :
                        <div className="h-full w-full flex items-center justify-center text-sm font-semibold">
                          <span>{task.editor?.firstName[0]}{task.editor?.lastName[0]}</span>
                        </div>
                      }
                    </div>
                  </AuthComponent>
                </div>
              </div>
            ))}
            <AuthComponent allowedRoles={[UserRole.ADMIN, UserRole.PROJECT_MANAGER]} organisationType={IOrganisationType.EDITING}>
              <div
                onClick={() => setCreateTaskDialog(true)}
                className="text-sm rounded-md w-28 h-28 m-1 cursor-pointer flex items-center justify-center flex-col border border-dashed border-bg-light hover:bg-bg"
              >
                <AddIcon fontSize="small" />
                <p className="text-xs font-bold">Add Task</p>
              </div>
            </AuthComponent>
          </div>
        </div>
      </div>
      <div className="absolute inset-x-0 bottom-0 top-32 flex flex-col">
        {selectedTask && (
          <>
            <div className="py-6 px-10 flex items-start">
              <div className="flex flex-1 flex-col pr-6">
                <div className="text-sm font-bold">
                  {selectedTask.name}
                </div>
                <div className="text-sm text-grey-5">
                  {selectedTask.description.length > 100 ? `${selectedTask.description.slice(0, 100)}...` : selectedTask.description}
                </div>
              </div>
              <span className="px-1"></span>
              <AuthComponent allowedRoles={[UserRole.ADMIN, UserRole.PROJECT_MANAGER, UserRole.EDITOR]} organisationType={IOrganisationType.EDITING}>
                <>
                  <Button onClick={() => setVideoUploadDailog(true)} type="button" size="regular" variant="fill-accent" >
                    <span className="mr-1 font-semibold">Upload</span>
                    <PublishRoundedIcon fontSize="inherit" />
                  </Button>
                  <span className="px-1"></span>
                  <Button type="button" size="medium" variant="fill-accent" >
                    <EditIcon style={{ fontSize: 16 }} />
                  </Button>
                </>
              </AuthComponent>
            </div>
            {taskLoading ? <div className="mt-16 mx-6 flex justify-center">
              <CircularProgress color="secondary" size={20} thickness={5} />
            </div> : <div className="flex flex-1 overflow-hidden">
              <VideoBrowser project={project} projectTask={selectedTask} />
            </div>}
          </>
        )}
      </div>
    </div>
  )
};

export default ProjectTask;
