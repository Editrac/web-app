import React, { useState, useEffect, useCallback } from 'react';
import PersonAddIcon from '@material-ui/icons/PersonAdd';
import InfoOutlinedIcon from '@material-ui/icons/InfoOutlined';
import Button from "../../components/button/text.button";
import InviteDialog from './dialogs/invite-dialog';
import { useQuery } from 'src/utils/axios-hooks';
import projectAPI from "src/apis/project";
import CircularProgress from '@material-ui/core/CircularProgress';
import ProjectInfoDialog from './dialogs/project-info-dialog';
import AuthComponent from '../../components/auth/auth.component';
import { UserRole } from 'src/store/auth/type';
import { IOrganisationType, IProject, IStatusColumns, TaskStatus } from 'src/store/organisation/type';
import { useParams } from 'react-router-dom';
import ProjectBoard from './projectboard/project-board';
import SettingsIcon from '@material-ui/icons/Settings';
import { avatarColors } from 'src/utils/colors';
import Avatar from 'src/components/avatar';
import { testProject } from './testdata';
import { taskStatusMap } from 'src/utils/consts';

const ProjectPage: React.FC = () => {
  const colors = ["#00aab1", "#00c000", "#ffff32", "#FF6800", "#E55151"];
  const [managerDialog, setManagerDialog] = useState<boolean>(false);
  const [projectInfoDialog, setProjectInfoDialog] = useState<boolean>(false);
  const [project, setProject] = useState<IProject | undefined>();
  const { orgId: organisationId, projectId } = useParams<{ orgId: string, projectId: string }>();
  const [statusColumns, setStatusColumns] = useState<IStatusColumns>(taskStatusMap);

  const { query: getProject, loading: projectsLoading } = useQuery<any, any>(projectAPI.getProject, {
    onSuccess: (res) => {
      const _project = res.data.project;
      const tasks = _project.tasks.map((task: any, index: number) => {
        return {
          ...task,
          editor: _project.editors.find((editor: any, idx: number) => editor._id === task.editor)
        }
      })
      setProject({
        ..._project,
        tasks
      })
    }
  });

  useEffect(() => {
    if (testProject) {
      let _columns = JSON.parse(JSON.stringify(taskStatusMap));
      testProject.tasks.forEach(task => {
        _columns[task.status].tasks.push(task)
      });
      setStatusColumns(_columns);
    }
    setProject(testProject)
  }, [])

  useEffect(() => {
    // getProject({
    //   organisation: organisationId,
    //   project: projectId
    // })
  }, [projectId]);

  const handleSetStatusColumns = useCallback((statusColumns: IStatusColumns) => setStatusColumns(statusColumns), [])

  if (!organisationId || !project || projectsLoading) {
    return (
      <div className="absolute inset-x-0 h-12 top-0 flex items-end mx-6">
        <div className="flex flex-1 items-center">
          <CircularProgress color="secondary" size={20} thickness={5} />
        </div>
      </div>
    )
  }
  return (
    <>
      <div className="absolute inset-x-0 h-12 top-0 flex items-end mx-6">
        <div className="flex flex-1 items-center">
          <p className="text-xl font-bold mr-2">{project.name || ""}</p>
        </div>
      </div>
      <InviteDialog open={managerDialog} setOpen={(open: boolean) => setManagerDialog(open)} organisationId={organisationId} project={project} />
      <ProjectInfoDialog open={projectInfoDialog} setOpen={(open: boolean) => setProjectInfoDialog(open)} organisationId={organisationId} project={project} statusColumns={statusColumns} />
      <div className="absolute inset-x-0 top-16 h-16 mx-6 flex items-center ">
        <AuthComponent allowedRoles={[UserRole.ADMIN, UserRole.PROJECT_MANAGER, UserRole.EDITOR]} organisationType={IOrganisationType.EDITING}>
          <>
            {project.editors.map((editor, index) => (
              index < 5 && <Avatar size={8} initials={`${editor.firstName[0]}${editor.lastName[0]}`} image="" color={avatarColors[index]} />
            ))}
            <Avatar size={8} initials="+23" image="" />
            {project.editors.length > 4 && <div className="w-7 h-7 rounded-full bg-bg-dark text-sm flex items-center justify-center cursor-pointer mr-2" style={{ boxShadow: `0 0 0 2px ${colors[4]}` }}>
              {`+${project.editors.length - 4}`}
            </div>}
            {project.editors.length ? <span className="px-1"></span> : null}
          </>
        </AuthComponent>
        {/* {avatarColors.map(color => <Avatar size={8} initials="AB" image="" color={color} />)} */}
        <Avatar size={8} initials="RM" image="" color={avatarColors[4]} crown />
        <span className='mx-1' />
        <div className="h-8 flex flex-1 items-center">
          {/* <AuthComponent allowedRoles={[UserRole.ADMIN]} organisationType={IOrganisationType.EDITING}>
            <>
              {project.manager ?
                <div onClick={() => setManagerDialog(true)}
                  className="pr-3 p-0.5 bg-bg rounded-full flex items-center cursor-pointer "
                  style={{ boxShadow: `0 0 0 1px ${colors[4]}` }}
                >
                  <div className="w-7 h-7 bg-bg-dark rounded-full overflow-hidden" >
                    {false ?
                      <img src={`${process.env.PUBLIC_URL}`} className="h-full w-full object-cover" /> :
                      <div className="h-full w-full flex items-center justify-center text-xs font-semibold">
                        <span>{project.manager.firstName[0]}{project.manager.lastName[0]}</span>
                      </div>
                    }
                  </div>
                  <span className="ml-2 text-xs">Manager</span>
                </div>
                : <Button
                  onClick={() => setManagerDialog(true)}
                  type="button"
                  size="regular"
                  variant="fill-accent"
                >
                  <PersonAddIcon fontSize="inherit" />
                  <span className="ml-1 font-semibold">Add Manager</span>
                </Button>
              }
              <span className="px-1"></span>
            </>
          </AuthComponent> */}
          <AuthComponent allowedRoles={[UserRole.ADMIN]} organisationType={IOrganisationType.PRODUCING}>
            <>
              {false ?
                <div onClick={() => setManagerDialog(true)}
                  className="pr-3 p-0.5 bg-bg rounded-full flex items-center cursor-pointer "
                  style={{ boxShadow: `0 0 0 1px ${colors[4]}` }}
                >
                  <div className="w-7 h-7 bg-bg-dark rounded-full overflow-hidden" >
                    {false ?
                      <img src={`${process.env.PUBLIC_URL}`} className="h-full w-full object-cover" /> :
                      <div className="h-full w-full flex items-center justify-center text-xs font-semibold">
                        {/* <span>{project.manager.firstName[0]}{project.manager.lastName[0]}</span> */}
                      </div>
                    }
                  </div>
                  <span className="ml-2 text-xs">Manager</span>
                </div>
                : <Button
                  onClick={() => setManagerDialog(true)}
                  type="button"
                  size="regular"
                  variant="fill-accent"
                >
                  <PersonAddIcon fontSize="inherit" />
                  <span className="ml-1 font-semibold">Add Viewers</span>
                </Button>
              }
              <span className="px-1"></span>
            </>
          </AuthComponent>
          <Button onClick={() => setProjectInfoDialog(true)} variant="text-accent" size="regular">
            <span className="flex items-center">
              <SettingsIcon fontSize="small" />
              <span className="font-semibold ml-0.5">Manage</span>
            </span>
          </Button>
          <div className='flex flex-1 justify-end'></div>
          {/* <div className=' relative w-40 bg-bg-light h-2 rounded-xl overflow-hidden'>
            <div className=' absolute inset-0' style={{ right: "unset", width: "40%", backgroundColor: "#176742" }}></div>
          </div> */}
        </div>

      </div>
      <div className="absolute top-32 bottom-0 inset-x-0">
        <ProjectBoard project={project} organisationId={organisationId} statusColumns={statusColumns} setStatusColumns={handleSetStatusColumns} />
      </div>
    </>
  )
};

export default ProjectPage;
