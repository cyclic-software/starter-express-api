const { Sequelize } = require('sequelize')
const { sequelize } = require('../config')

// get model
const { userModel } = require('../models/UserModel');
const { biodataUser } = require('../models/biodataUser');
const { historyUser } = require('../models/history');

// get default avatar url
const { defaultAvatar } = require('../lib/Firebase');


class LandingPageModel {
    // get the summary of users information 
    static async getUserData () {
        // get model from each table
        const userTable = await userModel.getModel();
        const biodataTable = await biodataUser.getModel();
        const historyTable = await historyUser.getModel();


        // create association
        userTable.hasOne(biodataTable, {foreignKey: "userId"});
        userTable.hasMany(historyTable, {foreignKey: "userId"});
        

        // get data for community table
        const defaultAvatarUrl = await defaultAvatar()
        const [dataUser] = await sequelize.query(`
            SELECT 
                list.*,
                CASE WHEN score >= 200 THEN 'gold' WHEN score < 100 THEN 'bronze' ELSE 'silver' END as rank
            FROM (
                SELECT 
                    "user".id,
                    "user".username,
                    "user".email,
                    COALESCE("user".avatar, '${defaultAvatarUrl}') as avatar,
                    biodata_user.umur as age,
                    biodata_user.city,
                    biodata_user.country,
                    COALESCE(SUM(history.user_skor), 0) as score
                FROM "user"
                LEFT JOIN biodata_user ON biodata_user.user_id = "user".id
                LEFT JOIN history ON history.user_id = "user".id 
                GROUP BY                         
                    "user".id,
                    "user".username,
                    "user".email,
                    COALESCE("user".avatar, '${defaultAvatarUrl}'),
                    biodata_user.umur,
                    biodata_user.city,
                    biodata_user.country
            ) list 
            ORDER BY score DESC         
            ;`)

        return dataUser
    }

}

module.exports = { LandingPageModel }