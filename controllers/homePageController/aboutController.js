import About from "../../models/homePage/aboutModel.js";

 const createAbout = (req,res)=>{
    const about = About.create(req.body);
    res.status(201).json({
        succeded:true,
        about
    })

 }

 export {createAbout}; 