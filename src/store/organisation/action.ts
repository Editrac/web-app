import {
  OrganisationActionTypes,
  IOrganisation,
  SET_ORGANISATIONS,
  ADD_ORGANISATION,
  SET_SELECTED_ORGANISATION,
  IProject,
  SET_PROJECTS,
  ADD_PROJECT,
  SET_SELECTED_PROJECT,
  ADD_VIDEO_TO_PROJECT,
  UPDATE_PROJECT,
  UPDATE_ORGANISATION,
  ISelectedProject
} from './type';

export function setOrganisationsAction(payload: { organisations: IOrganisation[] }): OrganisationActionTypes {
  return {
    type: SET_ORGANISATIONS,
    payload
  }
}
export function addOrganisationAction(payload: { organisation: IOrganisation }): OrganisationActionTypes {
  return {
    type: ADD_ORGANISATION,
    payload
  }
}
export function setSelectedOrganisationAction(payload: { index: number, data: IOrganisation, _id: string }): OrganisationActionTypes {
  return {
    type: SET_SELECTED_ORGANISATION,
    payload
  }
}

export function setProjectsAction(payload: { organisationIndex: number, projects: IProject[] }): OrganisationActionTypes {
  return {
    type: SET_PROJECTS,
    payload
  }
}
export function addProjectAction(payload: { organisationIndex: number, project: IProject }): OrganisationActionTypes {
  return {
    type: ADD_PROJECT,
    payload
  }
}
export function setSelectedProjectAction(payload: { organisationIndex: number, selectedProject: ISelectedProject }): OrganisationActionTypes {
  return {
    type: SET_SELECTED_PROJECT,
    payload
  }
}

export function updateProjectAction(payload: { project: IProject }): OrganisationActionTypes {
  return {
    type: UPDATE_PROJECT,
    payload
  }
}

export function updateOrganisationAction(payload: { organisation: IOrganisation }): OrganisationActionTypes {
  return {
    type: UPDATE_ORGANISATION,
    payload
  }
}

export function addVideoToProjectAction(payload: any): OrganisationActionTypes {
  return {
    type: ADD_VIDEO_TO_PROJECT,
    payload
  }
}