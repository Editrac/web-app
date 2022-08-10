import produce, { Draft } from "immer"
import {
  OrganisationActionTypes,
  IOrganisationState,
  SET_ORGANISATIONS,
  ADD_ORGANISATION,
  SET_SELECTED_ORGANISATION,
  SET_PROJECTS,
  ADD_PROJECT,
  SET_SELECTED_PROJECT,
  ADD_VIDEO_TO_PROJECT,
  UPDATE_PROJECT,
  UPDATE_ORGANISATION
} from './type'

const initialState: IOrganisationState = {
  organisations: []
}

export const OrganisationReducer = produce((
  draft: Draft<IOrganisationState>,
  action: OrganisationActionTypes
) => {
  switch (action.type) {
    case SET_ORGANISATIONS:
      draft.organisations = action.payload.organisations;
      break;

    case SET_SELECTED_ORGANISATION:
      draft.selectedOrganisation = action.payload;
      break;

    case ADD_ORGANISATION:
      draft.organisations.push(action.payload.organisation);
      break;

    case SET_PROJECTS:
      draft.organisations[action.payload.organisationIndex].projects = action.payload.projects;
      if (draft.selectedOrganisation && action.payload.organisationIndex === draft.selectedOrganisation.index) {
        draft.selectedOrganisation.data.projects = action.payload.projects
      }
      break;

    case SET_SELECTED_PROJECT:
      draft.organisations[action.payload.organisationIndex].selectedProject = action.payload.selectedProject;
      if (action.payload.organisationIndex === draft.selectedOrganisation?.index) {
        draft.selectedOrganisation.data.selectedProject = action.payload.selectedProject
      }
      break;

    case ADD_VIDEO_TO_PROJECT:
      if (draft.selectedOrganisation && draft.selectedOrganisation.data.selectedProject) {
        draft.selectedOrganisation.data.selectedProject.data.videos.push(action.payload);
      }
      break;

    case ADD_PROJECT:
      draft.organisations[action.payload.organisationIndex].projects.push(action.payload.project);
      if (draft.selectedOrganisation && action.payload.organisationIndex === draft.selectedOrganisation.index) {
        draft.selectedOrganisation.data.projects.push(action.payload.project)
      }
      break;
    case UPDATE_PROJECT:
      if (draft.selectedOrganisation && draft.selectedOrganisation.data.selectedProject) {
        draft.selectedOrganisation.data.selectedProject = {
          index: draft.selectedOrganisation.data.selectedProject.index,
          _id: action.payload.project._id,
          data: action.payload.project
        }
      }
      break;
    case UPDATE_ORGANISATION:
      const organisationIndex = draft.organisations.findIndex((org, idx) => org._id === action.payload.organisation._id);
      if (organisationIndex >= 0) {
        draft.organisations[organisationIndex] = action.payload.organisation;
        if (draft.selectedOrganisation && draft.selectedOrganisation._id === action.payload.organisation._id) {
          draft.selectedOrganisation = {
            ...draft.selectedOrganisation,
            data: action.payload.organisation
          };
        }
      }
      break;

  }
}, initialState);

export default OrganisationReducer;
