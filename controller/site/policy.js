// importing policy model
import Policy from '../../model/policy/policy.js';

// import custom error
import customError from '../../utils/error.js';

// create policy controller
export const createPolicy = async (req, res, next) => {
  try {
    const newPolicy = new Policy({
      ...req.body,
    });

    const policy = await newPolicy.save();

    res.status(201).json({
      status: 'success',
      message: `Policy created successfully`,
      policy,
    });
  } catch (err) {
    next(err);
  }
};

// list all policy controller
export const allPolicy = async (req, res, next) => {
  try {
    const policy = await Policy.find();
    if (!policy) {
      return next(customError(404, 'unable to list all Policy'));
    }
    res.status(200).json({
      status: 'success',
      policy,
    });
  } catch (err) {
    next(err);
  }
};

// find a single policy controller
export const singlePolicy = async (req, res, next) => {
  try {
    const singlePolicy = req.params.id;
    const policy = await Policy.findById(singlePolicy);
    if (!policy) {
      return next(
        customError(404, `Policy with id ${singlePolicy} does not exist`),
      );
    }
    res.status(200).json({
      status: 'success',
      policy,
    });
  } catch (err) {
    next(err);
  }
};

// update a single policy controller
export const updatePolicy = async (req, res, next) => {
  try {
    const singlePolicy = req.params.id;
    const policy = await Policy.findByIdAndUpdate(
      singlePolicy,
      { $set: req.body },
      { new: true, runValidators: true },
    );
    if (!policy) {
      return next(
        customError(404, `Policy with id ${singlePolicy} does not exist`),
      );
    }
    res.status(200).json({
      status: 'success',
      message: `Policy updated successfully `,
      policy,
    });
  } catch (err) {
    next(err);
  }
};

// delete a single policy controller
export const deletePolicy = async (req, res, next) => {
  try {
    const singlePolicy = req.params.id;
    const policy = await Policy.findByIdAndDelete(singlePolicy);
    if (!policy) {
      return next(
        customError(
          404,
          `policy with id ${singlePolicy} does not exist`,
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
