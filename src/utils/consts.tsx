import React from "react";
import CircleIcon from '@material-ui/icons/RadioButtonUnchecked';
import RadioButtonCheckedIcon from '@material-ui/icons/RadioButtonChecked';
import CheckCircleIcon from '@material-ui/icons/CheckCircle';
import { IProjectTask, IStatusColumns, TaskStatus } from 'src/store/organisation/type';
import PublishRoundedIcon from '@material-ui/icons/PublishRounded';

export const taskStatusMap: IStatusColumns = {
  [TaskStatus.NO_STATUS]: {
    name: TaskStatus.NO_STATUS,
    icon: <CircleIcon color="inherit" fontSize="inherit" />,
    color: "#848484",
    shade: "rgba(255,255,255,0.03)",
    label: "No Status",
    tasks: []
  },
  [TaskStatus.IN_PROGRESS]: {
    name: TaskStatus.IN_PROGRESS,
    icon: <RadioButtonCheckedIcon color='inherit' fontSize="inherit" />,
    color: "#2b9cff",
    shade: "rgba(0,136,255,0.15)",
    label: "In Progress",
    tasks: []
  },
  [TaskStatus.NEEDS_REVIEW]: {
    name: TaskStatus.NEEDS_REVIEW,
    icon: <CircleIcon color="inherit" fontSize="inherit" />,
    color: "#ffa500",
    shade: "rgba(252,163,2,0.1)",
    label: "Review",
    tasks: []
  },
  [TaskStatus.APPROVED]: {
    name: TaskStatus.APPROVED,
    icon: <CheckCircleIcon color="inherit" fontSize="inherit" />,
    color: "#00cf71",
    shade: "rgba(0, 207, 113,0.14)",
    label: "Approved",
    tasks: []
  },
  [TaskStatus.READY_FOR_DELIVERY]: {
    name: TaskStatus.READY_FOR_DELIVERY,
    icon: <PublishRoundedIcon color="inherit" fontSize="inherit" />,
    color: "#fff",
    shade: "rgba(0,136,255,0.15)",
    label: "Delivery",
    tasks: []
  }
};