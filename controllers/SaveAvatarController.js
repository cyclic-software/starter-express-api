const formidable = require('formidable');

// import models
const { userModel } = require('../models/UserModel') 

const { uploadFile, downloadFile } = require('../lib/Firebase');

class SaveAvatar {
    // save avatar to firebase and get the url
    static async postAvatar(req, res) {
        try {
            const form = new formidable.IncomingForm();

            form.parse(req, async (err, fields, files) => {
                const id = Number(req.query.id)

                // upload photo to Firebase
                await uploadFile(files.avatar.filepath, `avatar/user${id}`);

                // get the Firebase url
                const fileUrl = await downloadFile(`avatar/user${id}`);

                // save the URL to database
                await userModel.saveAvatar(id, fileUrl[0]); 
                
                // get updated data list
                setTimeout(async function() {
                    const userdata = await userModel.getAvatar(id, '')
                    res.status(200).json({status: "success", data: {avatar: userdata.avatar}})
                }, 2000) 
               
            })
            
        } catch (error) {
            console.log(error)
            res.render('error', { error, message: 'SAVE FILE ERROR'})
        }
    }
}


module.exports = { SaveAvatar }