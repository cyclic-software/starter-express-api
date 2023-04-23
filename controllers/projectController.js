import Project from "../models/projectModel.js";
import cloudinary from "cloudinary";



const createProject = async (req, res) => {

   // console.log("req===>",req.files.image)

    var file=req.files.image

 
 let msg=""

    let result = await cloudinary.uploader.upload(
        req.files.image.tempFilePath,
        {
            use_filename: true,
            folder: "damvev_de",
        } 
       ).then(res=>{
        console.log("SUCCESS1___");
        return res
        
             })
             .catch(err=>{
                msg=err.response.message
        console.log("ERR1___");
        return null;
    })    
  

    try {
        await Project.create({ 
            project_title:req.body.project_title,
            project_description:req.body.project_description,
            user:res.locals.user._id,
            url:result.secure_url,
         })
        res.status(201).redirect("/projects");
    } catch (error) {
        res.status(500).json({
            succeded: false,
            error,
        })
    }

};

const getAllProjects = async (req, res) => {
    try {
        const projects = await Project.find({});
        res.status(200).render("projects", {
            projects,
            link: "projects"
        });

    } catch (error) {
        res.status(500).json({
            succeded: false,
            error
        })
    }
}

const getAProject = async (req, res) => {
    try {
        const project = await Project.findById({ _id: req.params.id });
        res.status(200).render("project", {
            project,
            link: "projects"
        });

    } catch (error) {
        res.status(500).json({
            succeded: false,
            error
        })
    }
}

export { createProject, getAllProjects, getAProject };