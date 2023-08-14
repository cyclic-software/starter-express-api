// import models
const { LandingPageModel } = require('../models/landingPage')
const { gameListModel } = require('../models/gameListModel');

class LandingPageController {

    // get list of community
    static async playerCommunity(req, res) {
        try {
            // get all data related with user
            const communityList = await LandingPageModel.getUserData();      
            
            // send data
            return res.json({ status: 'success', data: communityList });
            
        } catch (error) {
            console.log(error);
            res.status(500).json({ status: 'failed', data: [] });
        }
    }


    // get list of leaderboard
    static async playerLeaderboard(req, res) {
        try {
            // get all data related with user
            const leaderboardList = await LandingPageModel.getUserData();      
            
            // send data, take only top 5 users
            return res.json({ status: 'success', data: leaderboardList.slice(0, 5) });
            
        } catch (error) {
            console.log(error);
            res.status(500).json({ status: 'failed', data: [] });
        }
    }


    // get list of trending games for carousel
    static async trendingGames(req, res) {
        try {
            // get all data related with user
            const trendingGameList = await gameListModel.getTrendingGameList();      

            // send data
            return res.json({ status: 'success', data: trendingGameList });
            
        } catch (error) {
            console.log(error);
            res.status(500).json({ status: 'failed', data: [] });
        }
    }


    // get list of popular games for landing page
    static async popularGames(req, res) {
        try {
            // get all data related with user
            const popularGameList = await gameListModel.getPopularGameList();      

            // send data
            return res.json({ status: 'success', data: popularGameList });
            
        } catch (error) {
            console.log(error);
            res.status(500).json({ status: 'failed', data: [] });
        }
    }

    // get list of coming soon games for component
    static async comingSoonGames(req, res) {
        try {
            // get all data related with user
            const comingSoonGameList = await gameListModel.getComingSoonGameList();      

            // send data
            return res.json({ status: 'success', data: comingSoonGameList });
            
        } catch (error) {
            console.log(error);
            res.status(500).json({ status: 'failed', data: [] });
        }
    }
}

module.exports = { LandingPageController }