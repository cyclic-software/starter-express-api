const { Patient } = require("../patient/model");
const { check, validationResult } = require("express-validator");
const {
  createNewPatient,
  authenticatePatient,
} = require("../patient/controller");

const validateProfile = [
  check("firstName").optional().isLength({ min: 2 }),
  check("lastName").optional().isLength({ min: 2 }),
  check("email").optional().isEmail(),
  check("password").optional().isLength({ min: 8 }),
  check("sex").optional().isIn(["Male", "Female"]),
  check("profession").optional().isLength({ min: 2 }),
  check("nationality").optional().isLength({ min: 2 }),
  check("phoneNumber").optional().isMobilePhone(),

  async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    //verify if email already exist
    const patient = await Patient.findOne({ email: req.body.email });
    if (patient) {
      return res.status(400).send("Email existe déjà");
    }

    next();
  },
];

const validateSignup = async (req, res) => {
  try {
    //getting data from form body
    let {
      firstName,
      lastName,
      email,
      password,
      cardId,
      sex,
      profession,
      nationality,
      phoneNumber,
    } = req.body;

    //removing blank spaces
    firstName = firstName.trim();
    lastName = lastName.trim();
    email = email.trim();
    password = password;
    cardId = cardId.trim();
    sex = sex.trim();
    profession = profession.trim();
    nationality = nationality.trim();
    phoneNumber = phoneNumber.trim();

    //data validation
    //testing empty fields
    if (
      !(
        firstName &&
        lastName &&
        email &&
        password &&
        cardId &&
        sex &&
        profession &&
        nationality &&
        phoneNumber
      )
    ) {
      throw Error("Un ou plusieurs champs vides!!!");
      //testing email,names,password
      //name test
    } else if (!/^[a-zA-Z ]*$/.test(firstName, lastName)) {
      throw Error("Un des noms est invalide!!!");
    } else if (
      !/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,4}))$/.test(
        email
      )
    ) {
      throw Error("l'email entré est invalide");
    } else if (password.length < 8) {
      throw Error("Le mot de passe doit contenir au moins de 8 caractères");
    } else {
      // good credentials, create new user function in controller file
      const newPatient = await createNewPatient({
        firstName,
        lastName,
        email,
        password,
        cardId,
        sex,
        profession,
        nationality,
        phoneNumber,
      });
      res.status(200).json(newPatient);
    }
  } catch (error) {
    res.status(400).send(error.message);
  }
};

const validateSignin = async (req, res) => {
  try {
    let { cardId, password } = req.body;
    cardId = cardId.trim();
    password = password.trim();
    //validation
    if (!(cardId && password)) {
      throw Error("L'un des champs est vide");
    }

    //authenticate patient with the infos provided
    const authenticatedPatient = await authenticatePatient({
      cardId,
      password,
    });
    res.status(200).json(authenticatedPatient);
  } catch (error) {
    res.status(400).send(error.message);
  }
};

module.exports = { validateSignup, validateProfile, validateSignin };
