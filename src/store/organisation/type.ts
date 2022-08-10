import { IVideo } from 'src/store/player/type';
import Evaporate from "evaporate";
import { IUser } from '../auth/type';
export interface IOrganisation {
  _id: string;
  name: string;
  bucketId: string;
  picture?: string;
  organisationType: IOrganisationType;
  editingOrgs: string[];
  producingOrgs: string[];
  address?: IAddress;
  projects: IProject[];
  selectedProject?: ISelectedProject
}

export interface ISelectedProject {
  index: number;
  _id: string;
  data: IProject;
}

export interface IProject {
  _id: string;
  name: string;
  createdAt: string;
  documents: string[];
  editors: IUser[];
  manager?: IUser;
  producerOrg: string;
  editorOrg: string;
  status: string;
  updatedAt: string;
  videos: IVideo[];
  tasks: IProjectTask[];
  questions: IQuestionInput[];
}

export interface IProjectTask {
  _id: string,
  name: string;
  description: string;
  videos: IVideo[];
  editor?: IUser;
  documents: string[];
  status: TaskStatus;
  project: string;
  deliverable?: boolean;
  internal?: boolean;
  thumb?: string;
  deliveryDetail?: IDeliveryDetail
}

interface IDeliveryDetail {
  paid: boolean;
  paymentLink: string;
  assetLink: string;
  noAsset: boolean;
}

export enum TaskStatus {
  NEEDS_REVIEW = "NEEDS_REVIEW",
  IN_PROGRESS = "IN_PROGRESS",
  APPROVED = "APPROVED",
  NO_STATUS = "NO_STATUS",
  READY_FOR_DELIVERY = "READY_FOR_DELIVERY"
}

export interface IStatusColumn {
  name: TaskStatus;
  icon: JSX.Element;
  color: string;
  shade: string;
  label: string;
  tasks: IProjectTask[]
}

export type IStatusColumns = {
  [key in TaskStatus]: IStatusColumn
}


export interface IAddress {
  street: string;
  city: string;
  state: string;
  country: string;
}

export enum IOrganisationType {
  PRODUCING = 'PRODUCING',
  EDITING = 'EDITING',
}

export interface IQuestion {
  question: string,
  answerType: ANSWER_TYPES,
  required: boolean,
  expectedAnswer?: string,
  options?: string[],
  errorMessage?: string,
}

export enum ANSWER_TYPES {
  RADIO = "RADIO",
  TEXT = "TEXT",
}

export interface IQuestionInput {
  question: string;
  answer?: boolean | string;
  answerType: ANSWER_TYPES;
}

export interface IProjectTemplate {
  _id?: string;
  name: string;
  questions: IQuestion[];
}

export enum ProjectTaskStatus {
  PENDING = 'PENDING',
  IN_PROGRESS = 'IN_PROGRESS',
  REVIEW = 'REVIEW',
  REVISION = 'REVISION',
  COMPLETED = 'COMPLETED'
}

export interface IOrganisationState {
  selectedOrganisation?: ISelectedOrganisation;
  organisations: IOrganisation[];
}

export interface ISelectedOrganisation {
  index: number;
  _id: string;
  data: IOrganisation;
}

export const SET_ORGANISATIONS = 'SET_ORGANISATIONS';
export const ADD_ORGANISATION = 'ADD_ORGANISATION';
export const SET_SELECTED_ORGANISATION = "SET_SELECTED_ORGANISATION";
export const SET_PROJECTS = 'SET_PROJECTS';
export const ADD_PROJECT = 'ADD_PROJECT';
export const SET_SELECTED_PROJECT = "SET_SELECTED_PROJECT";
export const UPDATE_PROJECT = "UPDATE_PROJECT";
export const UPDATE_ORGANISATION = "UPDATE_ORGANISATION";
export const ADD_VIDEO_TO_PROJECT = 'ADD_VIDEO_TO_PROJECT';


interface SetOrganisationsAction {
  type: typeof SET_ORGANISATIONS,
  payload: { organisations: IOrganisation[] }
}
interface AddOrganisationAction {
  type: typeof ADD_ORGANISATION,
  payload: { organisation: IOrganisation }
}
interface SetSelectedOrganisationAction {
  type: typeof SET_SELECTED_ORGANISATION,
  payload: { index: number, data: IOrganisation, _id: string }
}

interface SetProjectsAction {
  type: typeof SET_PROJECTS,
  payload: { organisationIndex: number, projects: IProject[] }
}
interface AddProjectAction {
  type: typeof ADD_PROJECT,
  payload: { organisationIndex: number, project: IProject }
}
interface SetSelectedProjectAction {
  type: typeof SET_SELECTED_PROJECT,
  payload: { organisationIndex: number, selectedProject: ISelectedProject }
}
interface UpdateProjectAction {
  type: typeof UPDATE_PROJECT,
  payload: { project: IProject }
}

interface UpdateOrganisationAction {
  type: typeof UPDATE_ORGANISATION,
  payload: { organisation: IOrganisation }
}
interface AddVideoToProjectAction {
  type: typeof ADD_VIDEO_TO_PROJECT,
  payload: any
}

export type OrganisationActionTypes = SetOrganisationsAction | AddOrganisationAction | SetSelectedOrganisationAction | SetProjectsAction | AddProjectAction | SetSelectedProjectAction | UpdateProjectAction | UpdateOrganisationAction | AddVideoToProjectAction;