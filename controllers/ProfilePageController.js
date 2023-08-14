// import models
const { userModel } = require('../models/UserModel');
const { biodataUser } = require('../models/biodataUser')
const { ProfilePageModel } = require('../models/profilePage');


class ProfilePageController {
    
    // get data dan biodata user
    static async getProfilePage(req,res) {
        try{
            // get all data related with user
            const userProfile = await ProfilePageModel.getUserData(Number(req.params.id));
            console.log(userProfile);
            // send data
            return res.json({ status: 'success', data: userProfile });
        } catch(error) {
            console.log(error);
            res.status(500).send({ status: 'failed', data: [] });
        }
    }

    // update or insert data of user
    static async upsertProfile(req,res) {
        try {
            // get data from req
            const userId = Number(req.params.id)
            const newUsername = req.body.username
            const newEmail = req.body.email
            const newUmur = Number(req.body.umur)
            const newCity = req.body.city        
            const newCountry = req.body.country

            // Cek apakah username sudah ada di DB
            const existingUsername = await userModel.getData(newUsername)
            if (existingUsername) {
                return res.status(200).json({ status: "failed", message: "USERNAME ALREADY REGISTERED" });                
            }

            // Cek apakah email sudah ada di DB
            const existingEmail = await userModel.getDataByEmail(newEmail)
            if (existingEmail) {
                return res.status(200).json({ status: "failed", message: "EMAIL ALREADY REGISTERED" });                
            }

            // Mengecek Ketersediaan Data Biodata
            const existingBio = await biodataUser.getBioByUserId(userId)

            // Mengambil data eksisting dari kedua tabel
            const existingUser = await ProfilePageModel.getUserData(userId);            

            // Update tabel user jika ada email/username yang diganti
            if (newUsername !== "" || newEmail !== "") {
                const updatedUserData = {
                    username: newUsername ? newUsername : existingUser.username, 
                    email: newEmail ? newEmail : existingUser.email
                }
                await userModel.updateData(userId, updatedUserData.username, updatedUserData.email)
            }

            // Update tabel biodata jika ada umur/city/country yang diganti
            if (newUmur !== "" || newCity !== "" || newCountry !== "") {

                if (!existingBio) {
                    await biodataUser.insertBiodataUser(userId, newUmur, newCity, newCountry);
                } else {
                    const updatedBiodata = {
                        umur: newUmur ? newUmur : existingUser.umur, 
                        city: newCity ? newCity : existingUser.city,
                        country: newCountry ? newCountry : existingUser.country,
                    }
                    const updateProfile = await biodataUser.updateData(userId, updatedBiodata.umur, updatedBiodata.city, updatedBiodata.country);
                }
            }

            return res.status(200).json({ status: "success", username: newUsername ? newUsername : existingUser.username });                
            

        } catch (error) {
            console.log(error);
            res.status(500).json({ status: 'failed', message: 'Update Profile Failed' })
        }
    }

}

module.exports = { ProfilePageController }