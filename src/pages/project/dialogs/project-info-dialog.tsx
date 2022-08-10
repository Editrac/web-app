import React from 'react';
import CloseRoundedIcon from '@material-ui/icons/CloseRounded';
import IconButton from '@material-ui/core/IconButton';
import Dialog from '@material-ui/core/Dialog';
import { IProject, IStatusColumns, TaskStatus } from 'src/store/organisation/type';
import DialogTitle from '@material-ui/core/DialogTitle';
import DialogContent from '@material-ui/core/DialogContent';
import Grid from '@material-ui/core/Grid';
import Button from 'src/components/button/text.button';
import TaskCard from '../projectboard/task-card';
import { testProject } from '../testdata';
import PlayCircleOutlineIcon from '@material-ui/icons/PlayCircleOutline';
import ClearIcon from '@material-ui/icons/Clear';
import EditIcon from '@material-ui/icons/Edit';
import { ProgressRound } from 'src/components/progress';

interface IProps {
  open: boolean;
  setOpen: (open: boolean) => void;
  organisationId: string;
  project: IProject;
  statusColumns: IStatusColumns
}

const ProjectInfoDialog: React.FC<IProps> = ({ project, open, setOpen, statusColumns }) => {
  const handleDialogueClose = () => {
    setOpen(false)
  };

  const getEffort = () => {
    let total = 0;
    Object.keys(statusColumns).forEach((key) => {
      total += statusColumns[key as TaskStatus].tasks.length
    });
    const inProgressCount = statusColumns[TaskStatus.IN_PROGRESS].tasks.length;
    const reviewCount = statusColumns[TaskStatus.NEEDS_REVIEW].tasks.length;
    const approvedCount = statusColumns[TaskStatus.APPROVED].tasks.length;
    const deliveryCount = statusColumns[TaskStatus.READY_FOR_DELIVERY].tasks.length
    return {
      percentage: Math.round((1 * ((approvedCount + deliveryCount) / total) + 0.8 * (reviewCount / total) + 0.25 * (inProgressCount / total)) * 100),
      total: total,
      approved: approvedCount,
      delivery: deliveryCount
    }
  }

  const effort = getEffort();

  return (
    <Dialog
      open={open}
      onClose={handleDialogueClose}
      scroll="paper"
      aria-labelledby="scroll-dialog-title"
      aria-describedby="scroll-dialog-description"
      maxWidth="xl"
    >
      <DialogTitle className="text-base font-bold border-b border-grey-1" style={{ padding: "0.5rem 2rem" }}>
        <span className="flex justify-between py-1 items-center">
          <p>
            <p className='text-sm opacity-40 pb-1'>Project / <span className='border rounded text-xs px-1 py-0.5'>PEP-01</span></p>
            <span className="text-xl bold">{project.name}</span>
          </p>
          <IconButton onClick={handleDialogueClose} edge="end" aria-label="options" color="secondary">
            <CloseRoundedIcon style={{ fontSize: 20 }} />
          </IconButton>
        </span>
      </DialogTitle>
      <DialogContent style={{ padding: "0 2rem 0 2rem", overflowX: "hidden" }}>
        {/* <p className="text-md font-bold mb-3 pb-4 border-b border-grey-1">{project.name}</p> */}
        <div className='flex text-primary' style={{ width: 1000 }}>
          <div className='border-r border-grey-1 border-solid flex flex-col pr-6 py-4' style={{ minHeight: 600, width: 440 }}>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <p className='text-sm py-1 mb-1 font-semibold'>Description</p>
                <p className='text-sm font-semibold'>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation</p>
              </Grid>
              <Grid item xs={12}>
                <p className='border-b border-grey-1 border-dashed'></p>
              </Grid>
              <Grid item xs={3}>
                <div className='flex items-center'>
                  <ProgressRound value={effort.percentage} />
                  <div className='ml-2'>
                    <p className='text-base'>{effort.percentage}%</p>
                    <p className='text-sm opacity-40 -mt-0.5'>done</p>
                  </div>
                </div>
              </Grid>
              <Grid item xs={3}>
                <p className='text-base text-center'>{effort.approved}<span className='opacity-50 mx-0.5'>/</span>{effort.total}</p>
                <p className='text-sm opacity-40 -mt-0.5 text-center'>tasks</p>
              </Grid>
              <Grid item xs={3}>
                <p className='text-base text-center'>{effort.delivery}<span className='opacity-50 mx-0.5'>/</span>{effort.total}</p>
                <p className='text-sm opacity-40 -mt-0.5 text-center'>delivery</p>
              </Grid>
              <Grid item xs={3}>
                <p className='text-base text-right'>12 days</p>
                <p className='text-sm opacity-40 -mt-0.5 text-right'>to target</p>
              </Grid>
              <Grid item xs={12}>
                <p className='border-b border-grey-1 border-dashed'></p>
              </Grid>
              {project.questions.map((question, index) => (
                <Grid item xs={6} md={6}>
                  <p className='opacity-50 text-sm '>{question.question}</p>
                  <p className='text-sm font-semibold'>{question.answer}</p>
                </Grid>
              ))}
            </Grid>
          </div>
          <div className='flex flex-1 border-r border-solid border-grey-1 flex-col px-4 py-4'>
            <p className='text-sm font-semibold flex items-center justify-between'>
              <span className='mr-2'>Deliverables</span>
              <Button
                variant="text-accent"
                size="regular"
                type="button"
              // onClick={() => setDialogue({ open: true, data: initialQuestionData, questionIndex: undefined })}
              >
                <span className="font-semibold text-sm">+ Add</span>
              </Button>
            </p>
            <div className='rounded-lg mt-2 overflow-hidden'>
              <TaskCard task={testProject.tasks[1]} hideThumb />
            </div>
            <div className='rounded-lg mt-2 overflow-hidden'>
              <TaskCard task={testProject.tasks[2]} hideThumb />
            </div>
            <div className='rounded-lg mt-2 overflow-hidden'>
              <TaskCard task={testProject.tasks[3]} hideThumb />
            </div>
          </div>
          <div className='flex flex-1 flex-col pl-4 py-4 relative'>
            {/* <div className='absolute inset-0 flex pt-28 justify-center items-start'>
              <p className='text-sm font-semibold border border-grey-2 py-2 px-4 rounded-lg  bg-bg-light'>Payments coming soon!</p>
            </div> */}
            <div className='  select-none'>
              <p className='text-sm font-semibold flex items-center justify-between'>
                <span className='mr-2'>Payments</span>
                <Button
                  variant="text-accent"
                  size="regular"
                  type="button"
                // onClick={() => setDialogue({ open: true, data: initialQuestionData, questionIndex: undefined })}
                >
                  <span className="font-semibold text-sm">+ Add</span>
                </Button>
              </p>
              <div className='border border-yellow border-opacity-20 border-dashed rounded-lg mt-2 p-3'>
                <p className='flex justify-between items-center'>
                  <span className='text-base font-semibold text-yellow'>₹40000</span>
                  <IconButton size='small'>
                    <EditIcon fontSize='inherit' color='primary' />
                  </IconButton>
                </p>
                <p className='text-sm font-semibold opacity-40 mt-2 mb-1'>Deliverables Included</p>
                <p className='text-sm flex items-center ap'>
                  <PlayCircleOutlineIcon fontSize='inherit' />
                  <span className='ml-1 flex flex-1'>Wedding highlight</span>
                  {/* <ClearIcon fontSize='inherit' color='error' /> */}
                </p>
                <p className='text-sm flex items-center'>
                  <PlayCircleOutlineIcon fontSize='inherit' />
                  <span className='ml-1'>5 to 7 mintes</span>
                </p>
              </div>
              <div className='border border-yellow border-opacity-20 border-dashed rounded-lg mt-2 p-3'>
                <p className='flex justify-between items-center'>
                  <span className='text-base font-semibold text-yellow'>₹12000</span>
                  <IconButton size='small'>
                    <EditIcon fontSize='inherit' color='primary' />
                  </IconButton>
                </p>
                <p className='text-sm font-semibold opacity-40 mt-2 mb-1'>Deliverables Included</p>
                <p className='text-sm flex items-center'>
                  <PlayCircleOutlineIcon fontSize='inherit' />
                  <span className='ml-1'>5 to 7 mintes</span>
                </p>
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
      {/* <DialogActions className="text-base font-bold border-t border-grey-1" style={{ padding: "0.75rem 2rem" }}>
        <Button
          variant="fill-accent"
          size="regular"
          type="button"
        // onClick={() => setDialogue({ open: true, data: initialQuestionData, questionIndex: undefined })}
        >
          <span className="font-semibold text-base mx-8">Save</span>
        </Button>
      </DialogActions> */}
    </Dialog >
  )
};

export default ProjectInfoDialog;
