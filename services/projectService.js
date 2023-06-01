import Project from "../models/projectModel.js"

export const getProjects = async (page, limit, language) => {
  const options = {
    page,
    limit,
  };

  const projects = await Project.paginate({}, options);
  const totalPages = projects.totalPages;

  let mappedProjects = [];

  switch (language) {
    case 'az':
      mappedProjects = projects.docs.map(project => ({
        ...project.toObject(),
        title: project.titleAz,
        description: project.descriptionAz
      }));
      break;
    case 'ge':
      mappedProjects = projects.docs.map(project => ({
        ...project.toObject(),
        title: project.titleGe,
        description: project.descriptionGe
      }));
      break;
    default:
      mappedProjects = projects.docs.map(project => ({
        ...project.toObject(),
        title: project.titleAz,
        description: project.descriptionAz
      }));
      break;
  }

  return {
    projects: mappedProjects,
    totalPages,
  };
};