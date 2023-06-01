import Contact from "../../../models/contactModel.js"





const getContactDetail = async(req,res)=>{
    try {
        const contact = await Contact.findById({_id:req.params.id});
        res.status(200).render('../areas/admin/views/contact/detail',{
            contact,
            
        })
    } catch (error) {
        res.status(500).json({
            succeded:false,
            error
        })
    }
}

const getContactUpdate = async(req, res) => {
    const contact = await Contact.findById(req.params.id)
    
    res.status(200).render("../areas/admin/views/contact/update", {
        contact
    });
  }




const getContact =async(req,res)=>{
    const contact = await Contact.find({});
    res.render('../areas/admin/views/contact/contact',{
        contact
    })
}

const createContact = async (req, res) => {
    try {
      const contact = await Contact.create(req.body);
  
      res.status(201).redirect("/admin/contact")
    } catch (error) {
      res.status(500).json({
        succeded: false,
        error
      })
    }
  };
  const updateContact = async (req, res) => {
    try {
      const contact = await Contact.findById(req.params.id);
  
      // Diğer alanları güncelleme
      contact.location = req.body.location;
      contact.gmail = req.body.gmail;
      contact.tel = req.body.tel;
      contact.fb = req.body.fb;
      contact.inst =  req.body.inst;
      contact.youtube = req.body.youtube;

      await contact.save();
  
      res.status(200).redirect('/admin/contact');
    } catch (error) {
      res.status(500).json({
        succeeded: false,
        error: error.message
      });
    }
  };

export  {getContact,getContactUpdate,createContact,getContactDetail,updateContact};