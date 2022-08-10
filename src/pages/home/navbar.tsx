import React, { useState } from 'react';
import AddIcon from '@material-ui/icons/Add';
import IconButton from '@material-ui/core/IconButton';
import { useSelector } from 'react-redux';
import CreateProjectDialog from './dialogs/create-project-dialog';
import { useEffect } from 'react';
import { useQuery } from 'src/utils/axios-hooks';
import projectAPI from "src/apis/project";
import { IProject } from "src/store/organisation/type";
import CircularProgress from '@material-ui/core/CircularProgress';
import { IState } from 'src/store/config';
import AuthComponent from 'src/components/auth/auth.component';
import { UserRole } from 'src/store/auth/type';
import { NavLink, useNavigate, useLocation, useParams } from 'react-router-dom';
import PersonIcon from '@material-ui/icons/Person';
import { ProgressRound } from 'src/components/progress';
import Avatar from 'src/components/avatar';
import { avatarColors } from 'src/utils/colors';

interface IProps {
}

const NavBar: React.FC<IProps> = () => {
  const colors = ["#00aab1", "#00c000", "#ffff32", "#FF6800", "#E55151"];
  const location = useLocation();
  const navigate = useNavigate()
  const { organisations } = useSelector((state: IState) => state.organisationReducer);
  const [projects, setProjects] = useState<IProject[]>([])
  const [createProjectDialog, setCreateProjectDialog] = useState<boolean>(false);
  const { orgId: selectedOrgId } = useParams<{ orgId: string }>();

  const selectedOrganisation = organisations.find(org => org._id === selectedOrgId);

  const { query: getProjects, loading: projectsLoading } = useQuery(projectAPI.getProjects, {
    onSuccess: (res) => {
      const _projects: IProject[] = res.data.projects || []
      const projectsModified: IProject[] = _projects.map((project, idx) => {
        return {
          ...project,
          editors: [],
          tasks: [],
          manager: undefined
        }
      });
      setProjects(projectsModified);
      if (projectsModified.length && !location.pathname.includes("project")) {
        navigate(`/org/${selectedOrgId}/project/${projectsModified[0]._id}`)
      }
    }
  });

  useEffect(() => {
    if (selectedOrgId) {
      setProjects([])
      getProjects(selectedOrgId);
    }
  }, [selectedOrgId]);

  if (!selectedOrganisation) {
    return <></>
  }

  return (
    <>
      <CreateProjectDialog
        selectedOrganisation={selectedOrganisation}
        open={createProjectDialog}
        setOpen={setCreateProjectDialog}
        onAddProject={(project: IProject) => {
          const _project = {
            ...project, editors: [],
            tasks: [],
            manager: undefined
          }
          setProjects(prev => [...prev, _project]);
          navigate(`/org/${selectedOrgId}/project/${project._id}`)
        }}
      />
      <div className="flex bg-bg rounded-md">
        <div className="flex items-center pl-2">
          <div className="w-8 h-8 rounded-full bg-bg overflow-hidden">
            {selectedOrganisation.picture ?
              <img src={selectedOrganisation.picture} className="h-full w-full object-contain" /> :
              <div className="h-full w-full flex items-center justify-center text-base font-bold">
                <span>{selectedOrganisation.name.slice(0, 2)}</span>
              </div>
            }
          </div>
        </div>
        <div className="flex flex-1 items-center pl-2 pr-1 py-4">
          <span className="text-sm font-semibold">{selectedOrganisation?.name}</span>
        </div>
        {/* <AuthComponent allowedRoles={[UserRole.ADMIN]}>
          <div className="flex items-center pr-1">
            <IconButton aria-label="options" size="small" color="secondary">
              <MoreVertIcon style={{ fontSize: 20 }} />
            </IconButton>
          </div>
        </AuthComponent> */}
      </div>
      <div className="my-3 mt-5 pl-1 pb-2 flex items-center border-b border-bg">
        <span className="flex flex-1 text-md font-bold">Projects</span>
        <AuthComponent allowedRoles={[UserRole.ADMIN]}>
          <div className="rounded-full flex justify-center items-center bg-bg hover:bg-accent ml-2">
            <IconButton onClick={() => setCreateProjectDialog(true)} aria-label="delete" size="small" color="secondary" >
              <AddIcon fontSize="inherit" />
            </IconButton>
          </div>
        </AuthComponent>
      </div>
      {projects.map((project, index) => (
        <NavLink
          key={index}
          to={`/org/${selectedOrgId}/project/${project._id}`}
          className={({ isActive }) => isActive ? 'group flex rounded-md px-3 py-3 mb-1 cursor-pointer hover:bg-bg bg-bg' : `group flex rounded-md px-3 py-3 mb-1 cursor-pointer hover:bg-bg `}
        >
          <div className="flex flex-1 flex-col">
            <span className='text-sm font-semibold'>{project.name}</span>
            <div className='flex items-center mt-1'>
              <span className="opacity-40 text-xs mr-3 font-semibold">JUL 9, 22</span>
              <ProgressRound value={19 * (index + 1)} size={16} thickness={6} />
              <span className="opacity-40 text-xs ml-1 font-semibold">{19 * (index + 1)}%</span>
            </div>
            {false &&
              <div className="flex items-center mt-1 text-lg opacity-50">
                {/* <PersonIcon fontSize='inherit' className='-ml-0.5' /> */}
                <span className="text-sm">Abhishek Bhaskar</span>
              </div>}
          </div>
          {/* <AuthComponent allowedRoles={[UserRole.ADMIN, UserRole.PROJECT_MANAGER]}>
            <div className="flex items-center opacity-0 group-hover:opacity-100">
              <IconButton aria-label="options" size="small" color="secondary">
                <MoreVertIcon style={{ fontSize: 20 }} />
              </IconButton>
            </div>
          </AuthComponent> */}
        </NavLink>
      ))}
      {projectsLoading && <div className="pl-3 mt-2">
        <CircularProgress color="secondary" size={20} thickness={5} />
      </div>}
    </>

  );
};

export default NavBar;
