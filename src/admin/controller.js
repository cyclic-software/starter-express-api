const { Identifiant, bloquer } = require("./models");

//Create neww patient
const createNewcardId = async (data) => {
  try {
    const { cardId } = data;

    //checking if CardId belongs to the system
    //checking if patient already exists
    const existingcardId = await Identifiant.findOne({ cardId });

    if (existingcardId) {
      throw Error("Cet Identifiant exist deja");
    }
    const newcardId = new Identifiant({
      cardId,
    });
    const createdcardId = await newcardId.save();
    return createdcardId;
  } catch (error) {
    throw error;
  }
};

//block a user
const bloquecardId = async (data) => {
  try {
    const { cardId } = data;

    const existingcardId = await Identifiant.findOne({ cardId });

    //checking if CardId belongs to the blocked collection
    //checking if patient is already blocked
    const isBlockedcardId = await bloquer.findOne({ cardId });
    if (!existingcardId) {
      throw Error("Identifiant non trouvé");
    } else if (isBlockedcardId) {
      throw Error("Cet Identifiant est deja bloqué");
    } else {
      const newcardId = new bloquer({
        cardId,
      });
      const blockedcardId = await newcardId.save();
      return "User blocked successfully";
    }
  } catch (error) {
    throw error;
  }
};

module.exports = { createNewcardId, bloquecardId };

//TO DO
//get any id and block the corresponding account
