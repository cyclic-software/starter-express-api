import Contact from "../models/contactModel.js"


const getContact =async (req,res)=>{
    try {
      const contact =await Contact.find({});
        res.locals.contact = contact
      
    } catch (error) {
      res.status(500).json({
          succeded:false,
          error
      })
    }
  };

export default getContact
