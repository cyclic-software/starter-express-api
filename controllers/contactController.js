import Contact from "../models/contactModel.js";



const getContact = async(req, res) => {
    const contact = await Contact.find({})
    res.render('contact', {

        contact
    })
}

export {getContact};