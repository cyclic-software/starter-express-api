// custom error importation
import customError from '../../utils/error.js';

// render website index.ejs file
export const homepage = async (req, res, next) => {
  try {
    res.status(200).send("Welcome to LUCKYBUYSTORE")
  } catch (err) {
    next(err);
  }
};

