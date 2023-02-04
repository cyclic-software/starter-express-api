const bcrypt = require("bcrypt");

//cryptage du mot de passe
const cryptage = async (data, saltRounds = 10) => {
  try {
    const crypté = await bcrypt.hash(data, saltRounds);
    return crypté;
  } catch (error) {
    throw error;
  }
};

//vérifier le mot de passe avec le hash en bd
const verifyHashedData = async (unhashed, hashed) => {
  try {
    const match = await bcrypt.compare(unhashed, hashed);
    return match;
  } catch (error) {
    throw error;
  }
};

module.exports = { cryptage, verifyHashedData };
