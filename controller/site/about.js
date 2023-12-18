// importing About model
import Company from '../../model/about/about.js';

// import custom error
import customError from '../../utils/error.js';

// create About controller
export const createAbout = async (req, res, next) => {
  try {
    const newAbout = new Company({
      ...req.body,
    });

    const About = await newAbout.save();

    res.status(201).json({
      status: 'success',
      message: `About created successfully`,
      About,
    });
  } catch (err) {
    next(err);
  }
};

// list all About controller
export const allAbout = async (req, res, next) => {
  try {
    const About = await Company.find();
    if (!About) {
      return next(customError(404, 'unable to list all About'));
    }
    res.status(200).json({
      status: 'success',
      About,
    });
  } catch (err) {
    next(err);
  }
};

// find a single About controller
export const singleAbout = async (req, res, next) => {
  try {
    const singleAbout = req.params.id;
    const about = await Company.findById(singleAbout);
    if (!about) {
      return next(
        customError(404, `About with id ${singleAbout} does not exist`),
      );
    }
    res.status(200).json({
      status: 'success',
      about,
    });
  } catch (err) {
    next(err);
  }
};


// update a single About controller
export const updateAbout = async (req, res, next) => {
  try {
    const singleAbout = req.params.id;
    const About = await Company.findByIdAndUpdate(
      singleAbout,
      { $set: req.body },
      { new: true, runValidators: true },
    );
    if (!About) {
      return next(
        customError(404, `About with id ${singleAbout} does not exist`),
      );
    }
    res.status(200).json({
      status: 'success',
      message: `About updated successfully `,
      About,
    });
  } catch (err) {
    next(err);
  }
};

// delete a single About controller
export const deleteAbout = async (req, res, next) => {
  try {
    const singleAbout = req.params.id;
    const About = await Company.findByIdAndDelete(singleAbout);
    if (!About) {
      return next(
        customError(
          404,
          `contact message with id ${singleAbout} does not exist`,
        ),
      );
    }
    res.status(204).json({
      status: 'success',
    });
  } catch (err) {
    next(err);
  }
};
