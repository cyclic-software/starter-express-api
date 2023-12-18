// importing contact model
import Contact from '../../model/contact/contact.js';

// import custom error
import customError from '../../utils/error.js';

// create contacts controller
export const createMessage = async (req, res, next) => {
  try {
    const newMessage = new Contact({
      ...req.body,
    });

    const message = await newMessage.save();

    res.status(201).json({
      status: 'success',
      message: `Contact message sent successfully`,
      message
    });
  } catch (err) {
    next(err);
  }
};

// list all contacts controller
export const allMessage = async (req, res, next) => {
  try {
    const messages = await Contact.find();
    if (!messages) {
      return next(customError(404, 'unable to list all contact message'));
    }
    res.status(200).json({
      status: 'success',
      messages,
    });
  } catch (err) {
    next(err);
  }
};

// find a single contacts controller
export const singleMessage = async (req, res, next) => {
  try {
    const singleMessage = req.params.id;
    const message = await Contact.findById(singleMessage);
    if (!message) {
      return next(
        customError(
          404,
          `contact message with id ${singleMessage} does not exist`,
        ),
      );
    }
    res.status(200).json({
      status: 'success',
      message,
    });
  } catch (err) {
    next(err);
  }
};

// delete a single contacts controller
export const deleteMessage = async (req, res, next) => {
  try {
    const singleMessage = req.params.id;
    const message = await Contact.findByIdAndDelete(singleMessage);
    if (!message) {
      return next(
        customError(
          404,
          `contact message with id ${singleMessage} does not exist`,
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




