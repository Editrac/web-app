import axios from 'axios';

export default {
  addUser: <V>(data: V) => axios.post('/api/user', data),
  getUsers: () => axios.get('/api/user'),
  getOrganisations: () => axios.get('/api/organisation'),
  createOrganisation: <V>(data: V) => axios.post('/api/organisation', data),
  updateOrganisation: <V extends { organisation: string, data: object }>(variables: V) => axios.put(`/api/organisation/${variables.organisation}`, variables.data),
  getProjectTemplates: <V extends { organisation: string }>(variables: V) => axios.get(`/organisation/${variables.organisation}/ptemplate`),
  createProjectTemplate: <V extends { organisation: string, data: object }>(variables: V) => axios.post(`/organisation/${variables.organisation}/ptemplate`, variables.data),
  updateProjectTemplate: <V extends { organisation: string, template: string, data: object }>(variables: V) => axios.put(`/organisation/${variables.organisation}/ptemplate/${variables.template}`, variables.data),
};