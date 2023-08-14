const { DataTypes } = require('sequelize');
const { sequelize } = require('../config');

class History {
    #model = sequelize.define('history', {
        id: {
            allowNull: false,
            autoIncrement: true,
            primaryKey: true,
            type: DataTypes.INTEGER
        },
        userSkor: {
            type: DataTypes.INTEGER
        },
        userId: {
            allowNull: false,
            type: DataTypes.INTEGER
        },
        createdAt: {
            allowNull: false,
            type: DataTypes.DATE
        }
    }, {
        tableName: 'history',
        underscored: true,
        updatedAt:false
    })

    // get the model
    async getModel(){
        return this.#model
    }

    // insert new player score
    async insertScore(user_id, user_skor){
        try {
            await this.#model.create({ 
            userId: user_id, 
            userSkor: user_skor
        });
        } catch(error) {
            console.log(error)
            return error
        }
    }   
};

const historyUser = new History()
module.exports = { historyUser }