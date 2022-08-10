import axios from 'axios';

export default {
  getProjects: <V>(organisationId: V) => axios.get(`/api/organisation/${organisationId}/project`),
  getProject: <V extends { organisation: string, project: string }>(variables: V) => axios.get(`/api/organisation/${variables.organisation}/project/${variables.project}`),
  addEditors: <V extends { organisation: string, project: string, data: object }>(variables: V) => axios.post(`/api/organisation/${variables.organisation}/project/${variables.project}/editor`, variables.data),
  addManager: <V extends { organisation: string, project: string, data: object }>(variables: V) => axios.post(`/api/organisation/${variables.organisation}/project/${variables.project}/manager`, variables.data),
  getComments: <V>(video: V) => axios.get(`/api/video/${video}/comment`),
  addComment: <V extends { video: string, data: object }>(variables: V) => axios.post(`/api/video/${variables.video}/comment`, variables.data),
  createProject: <V extends { organisation: string, data: object }>(variables: V) => axios.post(`/api/organisation/${variables.organisation}/project`, variables.data),
  inviteEditor: <V extends { organisation: string, project: string, data: object }>(variables: V) => axios.post(`/api/organisation/${variables.organisation}/project/${variables.project}/editor`, variables.data),
  createProjectTasks: <V extends { organisation: string, project: string, data: object }>(variables: V) => axios.post(`/api/organisation/${variables.organisation}/project/${variables.project}/task`, variables.data),
  addVideoToProjectTask: <V extends { organisation: string, project: string, task: string, data: object }>(variables: V) => axios.post(`/api/organisation/${variables.organisation}/project/${variables.project}/task/${variables.task}/video`, variables.data),
  getProjectTask: <V extends { organisation: string, project: string, task: string }>(variables: V) => axios.get(`/api/organisation/${variables.organisation}/project/${variables.project}/task/${variables.task}`),
  updateTaskStatus: <V extends { organisation: string, project: string, task: string, data: object }>(variables: V) => axios.put(`/api/organisation/${variables.organisation}/project/${variables.project}/task/${variables.task}/status`, variables.data),
};