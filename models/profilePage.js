const { Sequelize } = require('sequelize');
const { col } = Sequelize;

// get models
const { userModel } = require('../models/UserModel');
const { biodataUser } = require('../models/biodataUser');

// get default avatar url
const { defaultAvatar } = require('../lib/Firebase')

class ProfilePageModel {    

    // get all user profile data
    static async getUserData(id) {
        // get model from each table
        const userTable = await userModel.getModel();
        const biodataTable = await biodataUser.getModel();
        const defaultAvatarUrl = await defaultAvatar();

        // create association
        userTable.hasOne(biodataTable, {foreignKey: "userId"});

        const dataUser = await userTable.findOne({
            where: {
                id
            },
            attributes: [
                'id',
                'username',
                'email', 
                [Sequelize.literal(`COALESCE("user".avatar, '${defaultAvatarUrl}')`), 'avatar'],
                [col('"biodataUser"."umur"'), 'umur'],
                [col('"biodataUser"."city"'), 'city'],
                [col('"biodataUser"."country"'), 'country']
            ],
            include: [
                {
                    model: biodataTable,
                    attributes: []
                }
            ],
            raw: true
        })
        return dataUser
    }

}

    
module.exports = { ProfilePageModel }