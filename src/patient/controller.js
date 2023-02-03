const { Patient } = require("./model");
const { Identifiant, bloquer } = require("../admin/models");
const { cryptage, verifyHashedData } = require("../services/cryptage");
const { createToken } = require("../services/creerToken");
const jwt = require("jsonwebtoken");
const {
  validateProfile,
  validateSignup,
  validateSignin,
} = require("../middleware/dataValidation");

//signin
const authenticatePatient = async (req, res) => {
  try {
    await validateSignin(req);
    const { cardId, password } = req.body;
    const fetchedPatient = await Patient.findOne({ cardId });
    const isBlockedcardId = await bloquer.findOne({ cardId });

    if (isBlockedcardId) {
      return res.status(401).json({
        message: "Access denied due to some reasons!!",
      });
    } else if (!fetchedPatient) {
      return res.status(400).json({ message: "Invalid credentials" });
    } else {
      const hashedPassword = fetchedPatient.password;
      const passwordMatch = await verifyHashedData(password, hashedPassword);
      if (!passwordMatch) {
        return res.status(400).json({ message: "Invalid credentials" });
      }
      const tokenData = { patientId: fetchedPatient._id, cardId };
      const token = await createToken(tokenData);

      return res.status(200).json({
        token,
        message: "User login successfully",
      });
    }
  } catch (error) {
    return res.status(500).json({ error });
  }
};

//Create neww patient
const createNewPatient = async (req, res, next) => {
  await validateSignup(req);
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
    } = req.body;

    //checking if CardId belongs to the system
    //checking if patient already exists
    //checking if CardId is already used
    const existingNewId = await Identifiant.findOne({ cardId });
    const existingPatient = await Patient.findOne({ email });
    const existingcardId = await Patient.findOne({ cardId });

    if (!existingNewId) {
      return res.status(400).json({ error: "Invalid Id card" });
    } else if (existingPatient) {
      return res.status(400).json({ error: "email already used" });
    } else if (existingcardId) {
      return res.status(400).json({ error: "Id card already used" });
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
    await newPatient.save();
    res.status(201).json({ message: "User registered successfully!!" });
  } catch (error) {
    return res.status(500).json({ error });
  }
};

//Afficher profile
const getProfile = async (req, res) => {
  try {
    const token =
      req.body.token || req.query.token || req.headers["x-access-token"];
    if (!token) {
      return res.status(401).send("Authentication token is required!!");
    }
    const decodedToken = await jwt.verify(token, process.env.TOKEN_KEY);
    const patient = await Patient.findById({ _id: decodedToken.patientId });
    if (!patient) {
      return res.status(404).send("No user found!!");
    }
    return res.status(200).json(patient);
  } catch (error) {
    return res.status(401).send("Invalid token provided");
  }
};

//Mettre à jour le profile patient
const editProfile = async (req, res) => {
  try {
    // await validateProfile(req);
    const token =
      req.body.token || req.query.token || req.headers["x-access-token"];
    if (!token) {
      return res
        .status(400)
        .json({ error: "Authentication token is required!!" });
    }
    const decodedToken = await jwt.verify(token, process.env.TOKEN_KEY);
    const patient = await Patient.findById({ _id: decodedToken.patientId });
    if (!patient) {
      return res.status(404).json({ error: "User not found!!" });
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
    return res.status(200).json("Profil updated successfully");
  } catch (error) {
    return res.status(200).json("Invalid token");
  }
};

//Exporter les fonctions
module.exports = {
  createNewPatient,
  authenticatePatient,
  getProfile,
  editProfile,
};
