import { IProject, TaskStatus } from 'src/store/organisation/type';

export const testProject: IProject = {
  name: "Test Project",
  _id: "sfjdsnkjd",
  createdAt: "",
  documents: [],
  editors: [],
  producerOrg: "sfdfs",
  editorOrg: "sdfsd",
  status: "75%",
  updatedAt: "",
  videos: [],
  tasks: [{
    _id: "1",
    name: "Demo task onw",
    description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris",
    videos: [],
    documents: [],
    status: TaskStatus.IN_PROGRESS,
    project: "sdds",
    deliverable: true,
    thumb: "https://picsum.photos/id/237/272/60"
  },
  {
    _id: "2",
    name: "Demo task two",
    description: "description",
    videos: [],
    documents: [],
    status: TaskStatus.NO_STATUS,
    project: "sdds",
    internal: true
  }, {
    _id: "3",
    name: "Demo task onw",
    description: "description",
    videos: [],
    documents: [],
    status: TaskStatus.IN_PROGRESS,
    project: "sdds",
    thumb: "https://picsum.photos/id/27/272/60"
  }, {
    _id: "4",
    name: "Wedding highlight",
    description: "description",
    videos: [],
    documents: [],
    status: TaskStatus.READY_FOR_DELIVERY,
    project: "sdds",
    deliverable: true
  }, {
    _id: "5",
    name: "One task",
    description: "description",
    videos: [],
    documents: [],
    status: TaskStatus.IN_PROGRESS,
    project: "sdds",
    internal: true
  }, {
    _id: "6",
    name: "This is a task",
    description: "description",
    videos: [],
    documents: [],
    status: TaskStatus.NEEDS_REVIEW,
    project: "sdds"
  }, {
    _id: "7",
    name: "A task name",
    description: "description",
    videos: [],
    documents: [],
    status: TaskStatus.APPROVED,
    project: "sdds",
    thumb: "https://picsum.photos/id/43/272/60"
  }, {
    _id: "8",
    name: "Loooong taaask naaame with random words blah blah",
    description: "description",
    videos: [],
    documents: [],
    status: TaskStatus.NO_STATUS,
    project: "sdds",
    deliverable: true
  }, {
    _id: "9",
    name: "Task with random name",
    description: "description",
    videos: [],
    documents: [],
    status: TaskStatus.NEEDS_REVIEW,
    project: "sdds"
  }, {
    _id: "10",
    name: "Demo demo demo",
    description: "description",
    videos: [],
    documents: [],
    status: TaskStatus.IN_PROGRESS,
    project: "sdds",
    thumb: "https://picsum.photos/id/47/272/60"
  }, {
    _id: "11",
    name: "Task task task",
    description: "description",
    videos: [],
    documents: [],
    status: TaskStatus.IN_PROGRESS,
    project: "sdds",
    internal: true
  }],
  questions: []
}