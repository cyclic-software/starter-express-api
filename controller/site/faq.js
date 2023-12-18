// importing faqs model
import Faq from '../../model/faq/faq.js';
// import custom error
import customError from '../../utils/error.js';

// create faqs controller
export const createFaq = async (req, res, next) => {
  try {
    const newFaq = new Faq({
      ...req.body,
    });
    const faq = await newFaq.save();

    res.status(201).json({
      status: 'success',
      message: `faq created successfully`,
      faq,
    });
  } catch (err) {
    next(err);
  }
};

// list all faqs controller
export const allFaq = async (req, res, next) => {
  try {
    const faq = await Faq.find();
    if (!faq) {
      return next(customError(404, 'unable to list all faq'));
    }
    res.status(200).json({
      status: 'success',
      faq,
    });
  } catch (err) {
    next(err);
  }
};

// find a single Faq controller
export const singleFaq = async (req, res, next) => {
  try {
    const singleFaq = req.params.id;
    const faq = await Faq.findById(singleFaq);
    if (!faq) {
      return next(
        customError(404, `Faq with id ${singleFaq} does not exist`),
      );
    }
    res.status(200).json({
      status: 'success',
      faq,
    });
  } catch (err) {
    next(err);
  }
};


// update a single faqs controller
export const updateFaq = async (req, res, next) => {
  try {
    const singleFaq = req.params.id;
    const faq = await Faq.findByIdAndUpdate(
      singleFaq,
      { $set: req.body },
      { new: true, runValidators: true },
    );
    if (!faq) {
      return next(customError(404, `faq with id ${singleFaq} does not exist`));
    }
    res.status(200).json({
      status: 'success',
      message: `faq updated successfully `,
      faq,
    });
  } catch (err) {
    next(err);
  }
};

// delete a single faqs controller
export const deleteFaq = async (req, res, next) => {
  try {
    const singleFaq = req.params.id;
    const faq = await Faq.findByIdAndDelete(singleFaq);
    if (!faq) {
      return next(
        customError(404, `faq with id ${singleFaq} does not exist`),
      );
    }
    res.status(204).json({
      status: 'success',
    });
  } catch (err) {
    next(err);
  }
};



