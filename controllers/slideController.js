import Slide from "../models/slideModel.js";

const createSlide = async(req,res)=>{

    try {
        const slide =await Slide.create(req.body)
        res.status(201).json({
            succeded:true,
            slide,
        });
    } catch (error) {
        res.status(500).json({
            succeded:false,
            error
        })
    }
   
};

const getAllSlide = async(req,res)=>{
    try {
        const slides = await Slide.find({})
        res.status(200).render("./partials/_slide",{
            slides ,
        });
        
    } catch (error) {
        res.status(500).json({
            succeded:false,
            error
        })
    }
}   

const getASlideItem = async(req,res)=>{
    try {
        const slideItem = await Slide.findById({_id:req.params.id})
        res.status(200).render("./partials/slide",{
            slideItem,
        });
        
    } catch (error) {
        res.status(500).json({
            succeded:false,
            error
        })
    }
}   

export {createSlide,getAllSlide,getASlideItem} ;

