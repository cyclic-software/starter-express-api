class WelcomePageController {
    static async welcome(req, res) {
        return res.send("WELCOME TO HIDAN GAME WEBPAGE API !!!");
    }
};


module.exports = { WelcomePageController }