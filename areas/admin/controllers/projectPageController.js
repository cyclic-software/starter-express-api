import Project from "../../../models/projectModel.js";



const createProject = async (req, res) => {
    try {
      const projects = await Project.create(req.body);
      res.status(201).redirect("/admin/projects")
    } catch (error) {
      res.status(500).json({
        succeded: false,
        error
      })
    }
  };


  const getAllProject = async (req, res) => {
   
    const projects = await Project.find({})
  
    res.render('../areas/admin/views/project/projects', {
     projects
    })
  }
  const getUpdateProject = async (req, res) => {
    try {
      const project = await Project.findById({ _id: req.params.id });
      res.status(200).render('../areas/admin/views/project/update', {
       project
      })
    } catch (error) {
      res.status(500).json({
        succeded: false,
        error
      })
    }
  }

  const updateProject = async (req, res) => {
    try {
      const project = await Project.findById(req.params.id);
      project.title = req.body.title;
      project.description = req.body.description;
      project.videoUrl = req.body.videoUrl;
    
  
      await project.save();
      res.redirect("/admin/projects");
    } catch (error) {
      res.status(500).json({
        success: false,
        error: error.message,
      });
    }
  };
  // const deleteProject = async (req, res) => {
  //   try {
     
  //     // Haberi sil
  //     await Project.findByIdAndDelete(req.params.id);
  //     res.redirect("/admin/projects");
  //   } catch (error) {
  //     res.status(500).json({
  //       succeeded: false,
  //       error
  //     });
  //   }
  // };

  const  deleteProject =async (req, res) => {
    try {
      await Project.findByIdAndDelete(req.params.id)

      res.redirect("/admin/projects")
      
    } catch (error) {
      res.status(500).json({
        succeded: false,
        error
      })
    }
    
  };
  const getProjectDetail = async (req, res) => {
    try {
      const project = await Project.findById({ _id: req.params.id });
      
      res.status(200).render('../areas/admin/views/project/detail', {
        project,
      });
      
    } catch (error) {
      res.status(500).json({
        succeeded: false,
        error,
      });
    }
  };
  
  
  export { createProject,getAllProject,getUpdateProject ,updateProject,deleteProject,getProjectDetail};