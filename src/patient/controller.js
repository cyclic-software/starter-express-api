const { Patient } = require("./model");
const { Identifiant, bloquer } = require("../admin/models");
const { cryptage, verifyHashedData } = require("../services/cryptage");
const { createToken } = require("../services/creerToken");
const jwt = require("jsonwebtoken");

//signin
const authenticatePatient = async (data) => {
  try {
    const { cardId, password } = data;
    const fetchedPatient = await Patient.findOne({ cardId });
    const isBlockedcardId = await bloquer.findOne({ cardId });

    //checking if cardId is blocked
    if (isBlockedcardId) {
      throw Error("Access denied due to some reasons");
    } else if (!fetchedPatient) {
      throw Error("L'Identifiants invalides!!");
    } else {
      const hashedPassword = fetchedPatient.password;
      //utiliser la fonction du service pour comparer les mot de passe
      const passwordMatch = await verifyHashedData(password, hashedPassword);
      if (!passwordMatch) {
        throw Error("Mot de passe invalide!!");
      }

      //si le mdp est bon, alors on crée le token en utilisant la fonction du service
      const tokenData = { patientId: fetchedPatient._id, cardId };
      const token = await createToken(tokenData);

      //assign patient token to the etched patient data
      fetchedPatient.token = token;
      return fetchedPatient;
    }
  } catch (error) {
    throw error;
  }
};

//Create neww patient
const createNewPatient = async (data) => {
  try {
    const {
      firstName,
      lastName,
      email,
      password,
      cardId,
      sex,
      profession,
      nationality,
      phoneNumber,
      token,
    } = data;

    //checking if CardId belongs to the system
    //checking if patient already exists
    //checking if CardId is already used
    const existingNewId = await Identifiant.findOne({ cardId });
    const existingPatient = await Patient.findOne({ email });
    const existingcardId = await Patient.findOne({ cardId });

    if (!existingNewId) {
      throw Error("L'identifiants n'existe pas");
    } else if (existingPatient) {
      throw Error("Un Patient avec cet email exist deja");
    } else if (existingcardId) {
      throw Error("Un Patient avec cet Identifiant exist deja");
    }

    //hash password with the cryptage function in the services folder
    const hashedPassword = await cryptage(password);
    const newPatient = new Patient({
      firstName,
      lastName,
      email,
      password: hashedPassword,
      cardId,
      sex,
      profession,
      nationality,
      phoneNumber,
      token,
    });
    const createdPatient = await newPatient.save();
    return createdPatient;
  } catch (error) {
    throw error;
  }
};

//Afficher profile
const getProfile = async (req, res) => {
  try {
    const token =
      req.body.token || req.query.token || req.headers["x-access-token"];
    if (!token) {
      return res.status(401).send("Authentication token is required");
    }
    const decodedToken = await jwt.verify(token, process.env.TOKEN_KEY);
    const patient = await Patient.findById({ _id: decodedToken.patientId });
    if (!patient) {
      return res.status(404).send("Patient non trouvé");
    }
    return res.status(200).json(patient);
  } catch (error) {
    return res.status(401).send("Token invalide");
  }
};

//Mettre à jour le profile patient
const editProfile = async (req, res) => {
  try {
    const token =
      req.body.token || req.query.token || req.headers["x-access-token"];
    if (!token) {
      return res.status(401).send("Authentication token is required");
    }
    const decodedToken = await jwt.verify(token, process.env.TOKEN_KEY);
    const patient = await Patient.findById({ _id: decodedToken.patientId });
    if (!patient) {
      return res.status(404).send("Patient non trouvé");
    }

    const {
      firstName,
      lastName,
      email,
      password,
      sex,
      profession,
      nationality,
      phoneNumber,
    } = req.body;

    if (firstName) {
      patient.firstName = firstName;
    }
    if (lastName) {
      patient.lastName = lastName;
    }
    if (email) {
      patient.email = email;
    }
    if (password) {
      patient.password = await cryptage(password);
    }
    if (sex) {
      patient.sex = sex;
    }
    if (profession) {
      patient.profession = profession;
    }
    if (nationality) {
      patient.nationality = nationality;
    }
    if (phoneNumber) {
      patient.phoneNumber = phoneNumber;
    }

    const updatedPatient = await patient.save();
    return res.status(200).json(updatedPatient);
  } catch (error) {
    return res.status(401).send("Token invalide");
  }
};

//Exporter les fonctions
module.exports = {
  createNewPatient,
  authenticatePatient,
  getProfile,
  editProfile,
};
