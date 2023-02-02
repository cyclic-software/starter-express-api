const app = require("./app");
const { PORT } = process.env;

//Lancer l'application
const startApp = () => {
  app.listen(PORT, () => {
    console.log(`Backend running on port ${PORT}`);
  });
};

startApp();
