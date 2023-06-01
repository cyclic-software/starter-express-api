import About from "../../../models/aboutModel.js"
import { v2 as cloudinary } from "cloudinary";
import fs from "fs";




const getAboutDetail = async(req,res)=>{
    try {
        const about = await About.findById({_id:req.params.id});
        res.status(200).render('../areas/admin/views/about/detail',{
            about,
            
        })
    } catch (error) {
        res.status(500).json({
            succeded:false,
            error
        })
    }
}

const getAboutUpdate = async(req, res) => {
    const about = await About.findById(req.params.id)
    
    res.status(200).render("../areas/admin/views/about/update", {
     about
    });
  }

const updateAbout = async (req, res) => {
    try {
      const about = await About.findById(req.params.id);
  
      if (req.files && req.files.image) {
        if (about.image_id) {
          await cloudinary.uploader.destroy(about.image_id);
        }
  
        const result = await cloudinary.uploader.upload(req.files.image.tempFilePath, {
          use_filename: true,
          folder: 'damvev_de'
        
        });
  
        if (result.error) {
          throw new Error(result.error.message);
        }
  
        about.url = result.secure_url;
        about.image_id = result.public_id;
  
        fs.unlinkSync(req.files.image.tempFilePath);
      }
  
      // Diğer alanları güncelleme
      about.titleAz = req.body.titleAz;
      about.titleGe = req.body.titleGe;
      about.descriptionAz = req.body.descriptionAz;
      about.descriptionGe = req.body.descriptionGe
      about.fb = req.body.fb;
      about.inst =  req.body.inst;
      about.youtube = req.body.youtube;

      await about.save();
  
      res.status(200).redirect('/admin/about');
    } catch (error) {
      res.status(500).json({
        succeeded: false,
        error: error.message
      });
    }
  };
  


const getAbout =async(req,res)=>{
    const about = await About.find({});
    res.render('../areas/admin/views/about/about',{
        about
    })
}

const createAbout = async (req, res) => {
    try {
      const about = await About.create(req.body);
  
      res.status(201).redirect("/admin/about")
    } catch (error) {
      res.status(500).json({
        succeded: false,
        error
      })
    }
  };

export  {getAbout,updateAbout,getAboutUpdate,createAbout,getAboutDetail};