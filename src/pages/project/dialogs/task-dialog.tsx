import React, { useEffect, useState } from 'react';
import CloseRoundedIcon from '@material-ui/icons/CloseRounded';
import IconButton from '@material-ui/core/IconButton';
import Dialog from '@material-ui/core/Dialog';
import * as Yup from 'yup';
import { useDispatch, useSelector } from 'react-redux';
import { useMutation, useQuery } from 'src/utils/axios-hooks';
import projectAPI from 'src/apis/project'
import { IUser } from 'src/store/auth/type';
import orgAPI from "src/apis/organisation"
import useAutocomplete from '@material-ui/lab/useAutocomplete';
import DialogTitle from '@material-ui/core/DialogTitle';
import DialogContent from '@material-ui/core/DialogContent';
import Grid from '@material-ui/core/Grid';
import { testProject } from '../testdata';
import { withStyles } from '@material-ui/core/styles';
import Switch from '@material-ui/core/Switch';
import { taskStatusMap } from 'src/utils/consts';
import { StyledInputBase } from 'src/components/input';
import Button from 'src/components/button/text.button';
import Avatar from 'src/components/avatar';
import { avatarColors } from 'src/utils/colors';

const AntSwitch = withStyles((theme) => ({
  root: {
    width: 30,
    height: 18,
    padding: 0,
    display: 'flex',
  },
  switchBase: {
    padding: 2,
    color: 'var(--grey-5)',
    '&$checked': {
      transform: 'translateX(12px)',
      color: theme.palette.common.white,
      '& + $track': {
        opacity: 1,
        backgroundColor: theme.palette.primary.main,
        borderColor: theme.palette.primary.main,
      },
    },
  },
  thumb: {
    width: 14,
    height: 14,
    boxShadow: 'none',
  },
  track: {
    border: `1px solid var(--grey-2)`,
    borderRadius: 18 / 2,
    opacity: 1,
    backgroundColor: 'var(--bg-light)',
  },
  checked: {},
}))(Switch);

interface IProps {
  open: boolean;
  setOpen: (open: boolean) => void;
}

const TaskDialog: React.FC<IProps> = (props) => {
  const dispatch = useDispatch();
  const colors = ["#00aab1", "#00c000", "#ffff32", "#FF6800", "#E55151"];
  const [users, setUsers] = useState<IUser[]>([])

  const { mutate: createProjectTask, loading: taskCreating } = useMutation<any, any>(projectAPI.createProjectTasks, {
    onSuccess: (res) => {
      let task = res.data.projectTask;
      if ((task)) {
        task.editor = users.find((user) => user._id === task.editor)
      }
      // props.onAddTask(task)
      handleDialogueClose();
    }
  });

  const { query: getUsers, loading: usersLoading } = useQuery(orgAPI.getUsers, {
    onSuccess: (res) => {
      setUsers(res.data.users)
    }
  });

  useEffect(() => {
    if (props.open) {
      getUsers();
    }
  }, [props.open])

  const handleDialogueClose = () => {
    props.setOpen(false)
  };

  const createProjectSchema = Yup.object().shape({
    name: Yup.string().required(),
    description: Yup.string().required(),
    editor: Yup.string().required()
  });

  const {
    getInputProps,
    getListboxProps,
    getOptionProps,
    groupedOptions,
    value: selectedEditor
  } = useAutocomplete({
    id: 'use-autocomplete-demo',
    options: users,
    getOptionLabel: (option) => `${option.firstName} ${option.lastName}`
  });

  const task = testProject.tasks[0];
  const taskStatus = taskStatusMap[task.status];
  const { label, color, shade } = taskStatus

  return (
    <Dialog
      open={props.open}
      onClose={handleDialogueClose}
      scroll="paper"
      aria-labelledby="scroll-dialog-title"
      aria-describedby="scroll-dialog-description"
      maxWidth="xl"
    >
      <DialogTitle className="text-base font-bold" style={{ padding: "0.75rem 2rem 0 2rem" }}>
        <div className="flex items-center pt-1">
          <p className='flex flex-1 flex-col'>
            <p className='text-sm opacity-40'>Task / <span className='border rounded text-xs px-1 py-0.5'>{task.name.slice(0, 3).toUpperCase()}-01</span></p>
            <p className="px-2 -ml-2 py-1 rounded-md cursor-pointer text-xl bold hover:bg-bg-shade mb-2">{task.name}</p>
          </p>
          <IconButton onClick={handleDialogueClose} edge="end" aria-label="options" color="secondary">
            <CloseRoundedIcon style={{ fontSize: 20 }} />
          </IconButton>
        </div>
      </DialogTitle>
      <DialogContent className='text-primary' style={{ padding: "0rem 2rem 2rem 2rem", overflowX: "hidden", width: 1000 }}>
        <div className='flex mb-4'>
          <p className=" rounded-md inline-flex items-center text-xs pl-1 pr-2 py-0.5 border" style={{ backgroundColor: shade, color: color }}>
            <span className='flex items-center text-xs' >
              {taskStatus.icon || null}
              <span className="ml-1">{label}</span>
            </span>
          </p>
          <span className="text-xs opacity-80 border border-grey-5 px-1 rounded flex items-center ml-1">V3</span>
          {task.deliverable && <span className="text-xs opacity-60 border px-1 rounded flex items-center ml-1" style={{ color: "#ffe927" }}>Deliverable</span>}
          {task.internal && <span className="text-xs border px-1 rounded flex items-center ml-1" style={{ color: "#9253ff" }}>Internal</span>}
        </div>
        <p className='text-sm font-semibold mt-1 mb-1 opacity-50'>Description</p>
        <p className="flex flex-1 px-2 -ml-2 py-2 rounded-md cursor-pointer text-sm bold hover:bg-bg-shade">{task.description}</p>
        {/* <p className='border-b border-grey-1 mt-4 mb-4'></p> */}
        {/* <p className="text-md font-bold mb-3 pb-4 border-b border-grey-1">{project.name}</p> */}
        <div className='flex mt-6'>
          <div className='w-52 border border-grey-1 border-dashed rounded-lg mr-2 px-3 py-5'>
            <p className='text-xs font-semibold opacity-50 mb-1'>Assignee</p>
            <div className='flex items-center px-2 -mx-2 py-2 rounded-md cursor-pointer bold hover:bg-bg-shade'>
              <Avatar size={6} initials="AB" image="" color={colors[3]} />
              <span className='text-sm ml-1'>Abhishek Bhaslar</span>
            </div>
            <div className='flex mt-6 items-center'>
              <AntSwitch name="checkedC" />
              <span className='flex flex-1 text-sm ml-2'>Deliverable</span>
            </div>
            <div className='flex mt-4 items-center'>
              <AntSwitch name="checked" />
              <span className='flex flex-1 text-sm ml-2'>Internal</span>
            </div>
          </div>
          <div className='flex flex-1 border border-grey-1 rounded-lg flex-col relative py-5' style={{ minHeight: 500 }}>
            <div className='border-b border-grey-1 pb-3 mx-5 absolute inset-x-0 whitespace-nowrap overflow-x-auto'>
              {[5, 4, 3, 2, 1].map((num) => (
                <div className='rounded-md bg-bg-light w-56 mr-2 inline-block overflow-hidden'>
                  <div className='h-26 w-full'>
                    <img className='object-cover h-full w-full' src={`https://picsum.photos/id/${num}/272/120`} />
                  </div>
                  <div className='p-2 flex justify-between items-center'>
                    <p className='text-xs font-semibold'>Video.mp4</p>
                    <span className="text-xs opacity-60 border border-grey-5 px-1 rounded inline">V{num}</span>
                  </div>
                </div>
              ))}
            </div>
            <div className='flex flex-1 flex-col p-5 mt-40'>
              <p className='text-sm font-semibold opacity-50 mb-1'>Comments</p>
              <div className="flex py-3 rounded-xl text-sm">
                <Avatar size={7} initials="CK" image="" color={colors[1]} />
                <div className='flex flex-1 flex-col ml-2'>
                  <span className='font-semibold'>Calvin klein <span className='ml-2 opacity-30'>5 min</span></span>
                  <p className=''>
                    {/* <span className="mr-2 font-semibold text-accent">{`${minute >= 10 ? minute : `0${minute}`}:${second >= 10 ? second : `0${second}`}`}</span> */}
                    Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris
                  </p>
                </div>
              </div>
              <div className="flex py-3 rounded-xl text-sm">
                <Avatar size={7} initials="AB" image="" color={colors[0]} />
                <div className='flex flex-1 flex-col ml-2'>
                  <span className='font-semibold'>{"Abhishek"} {"Bhaskar"} <span className='ml-2 opacity-30'>5 min</span></span>
                  <p className=''>
                    {/* <span className="mr-2 font-semibold text-accent">{`${minute >= 10 ? minute : `0${minute}`}:${second >= 10 ? second : `0${second}`}`}</span> */}
                    Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris
                  </p>
                </div>
              </div>
              <div className="flex items-center py-3 rounded-xl text-sm">
                <Avatar size={7} initials="AB" image="" color={colors[4]} />
                <div className='flex flex-1 flex-col ml-2'>
                  <StyledInputBase
                    placeholder='Add a comment'
                  />
                </div>
              </div>
              {/* <div className='ml-9'>
                    <Button variant='fill-accent' size='regular' >Save</Button>
                  </div> */}
            </div>
          </div>
        </div>

      </DialogContent>
      {/* <DialogActions className="text-base font-bold" style={{ padding: "0.75rem 2rem 1rem 2rem" }}>
            <Button
              variant="fill-accent"
              size="regular"
              type="button"
            // onClick={() => setDialogue({ open: true, data: initialQuestionData, questionIndex: undefined })}
            >
              <span className="font-semibold text-base mx-6">Save</span>
            </Button>
          </DialogActions> */}
    </Dialog >
  )
};

export default TaskDialog;
