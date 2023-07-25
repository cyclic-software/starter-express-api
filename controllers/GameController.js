// import models
const { gameListModel } = require('../models/gameListModel');
const { historyUser } = require('../models/history');

class GameController {
    //controller untuk melihat gameList
    static async getGameList(req, res) {
        try {
            // ambil semua data game dari model
            const gameList = await gameListModel.getGameList();
            // kirim semua data ke user
            return res.json({ status: 'success', data: gameList });
        } catch (error) {
            console.log(error);
            res.status(500).send(' Internal Server Error !');
        }
    }

    // controller to insert game score
    static async insertRPSscore(req, res) {
        try {
            console.log(req.body)
            const data = req.body;
            const user_id = Number(data.user_id);
            const user_skor = Number(data.skor);
            await historyUser.insertScore(user_id, user_skor);
            return res.json({ status: 'success', message: "Score updated!" }); 
        } catch (error) {
            console.log(error);
            return res.status(500).send(' Internal Server Error !');
        }
    }
}

module.exports = { GameController }