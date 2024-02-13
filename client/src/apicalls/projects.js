const { apiRequest } = require(".");
export const createProject = async (project) =>
  apiRequest("post", "/api/projects/create-project", project);
export const getAllProjects = async (filters) =>
  apiRequest("post", "/api/projects/get-all-projects", filters);
export const EditProject = async (project) =>
  apiRequest("post", "/api/projects/edit-project", project);
export const GetProjectById = async (id) =>
  apiRequest("post", "/api/projects/get-project-by-id", { _id: id });

export const DeleteProject = async (id) =>
  apiRequest("post", "/api/projects/delete-project", { _id: id });
export const GetAllProjectsByRole = async (userId) =>
  apiRequest("post", "/api/projects/get-projects-by-role", { userId });

export const AddMemberToproject = async (data) =>
  apiRequest("post", "/api/projects/add-member", data);
  export const RemoveMemberToproject = async (data) =>
  apiRequest("post", "/api/projects/remove-member", data);
