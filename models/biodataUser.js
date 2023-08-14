const { DataTypes,Sequelize } = require('sequelize');
const { sequelize } = require('../config');


class BiodataUser {
    #model = sequelize.define('biodataUser', {
        id: {
            allowNull: false,
            autoIncrement: true,
            primaryKey: true,
            type: DataTypes.INTEGER
        },
        umur: { 
            type: DataTypes.INTEGER
        },
        city: {
            type: DataTypes.STRING
        },
        country: {
            type: DataTypes.STRING
        },
        userId: {
            allowNull: false,
            type: DataTypes.INTEGER
        },
        createdAt: {
            allowNull: false,
            type: DataTypes.DATE
        },   
            
    }, {
        modelName: 'biodataUser',
        tableName: 'biodata_user',
        underscored: true,
        updatedAt:true
    })


    // get biodata by id
    async getBioByUserId(userId) {
        try{            
            const data = await this.#model.findOne({
            where: {
                userId
            },
            attributes: ['umur','city','country','userId'],
            raw: true
            })
            return data 
        } catch(error) {
            console.log(error)
            return error
        }
    }

    // insert new biodata
    async insertBiodataUser(userId, umur, city, country) {
        try{            
            const insertData = await this.#model.create({ userId, umur, city, country })
            return insertData
        } catch(error) {
            console.log(error)
            return error
        }
    }


    // update biodata by id
    async updateData(userId, umur, city, country){
        try{            
            await this.#model.update({ 
                umur, 
                city,
                country,
                updatedAt: Sequelize.literal('NOW()')
                },
                { where: {userId} }
            );

        } catch(error) {
            console.log(error)
            return error
        }
    }
    
    // get the model
    async getModel(){
        return this.#model
    }
};

const biodataUser = new BiodataUser()
module.exports = { biodataUser }
