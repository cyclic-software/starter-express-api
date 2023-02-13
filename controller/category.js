const Category = require("../model/category");
const { validationResult } = require("express-validator");

exports.createCategory = (req, res, next) => {
  let errors = validationResult(req);

  // console.log(errors.array());

  if (!errors.isEmpty()) {
    errors = errors.array();

    if (errors[0].param == "name") {
      return res.status(400).json({
        message: "Name cannot be empty",
      });
    }
  }

  Category.create({
    name: req.body.name,
    description: req.body.description,
  }).then((result) => {
    res.status(201).json({
      message: "Category Created Successsully",
    });
  });
};

exports.getCategory = (req, res, next) => {
  Category.findOne({
    where: {
      id: req.params.id,
    },
  })
    .then((category) => {
      if (category)
        res.status(200).json({
          category,
        });
      else
        res.status(404).json({
          message: "Category not found",
        });
    })
    .catch((err) => {
      if (!err.statusCode) err.statusCode = 500;
      next(err);
    });
};

exports.getCategories = (req, res, next) => {
  Category.findAll().then((categories) => {
    res.status(200).json({
      categories,
    });
  });
};

exports.updateCategory = (req, res, next) => {
  Category.findOne({
    where: {
      id: req.params.id,
    },
  })
    .then((category) => {
      if (category) {
        category.name = req.body.name;
        category.description = req.body.description;
        category.save().then((result) => {
          //res.status(204).json({
          res.status(200).json({
            message: "Category updated Successfully",
            category,
          });
        });
      } else {
        return res.status(404).json({
          message: "Category not found",
        });
      }
    })
    .catch((err) => {
      if (!err.statusCode) err.statusCode = 500;
      next(err);
    });
};

exports.deleteCategory = (req, res, next) => {
  Category.findOne({
    where: {
      id: req.params.id,
    },
  })
    .then((category) => {
      if (category) {
        category.destroy().then((category) => {
          //res.status(204).json({
          res.status(200).json({
            message: "Category deleted Successfully",
            category
          });
        });
      } else {
        return res.status(404).json({
          message: "Category not found",
        });
      }
    })
    .catch((err) => {
      if (!err.statusCode) err.statusCode = 500;
      next(err);
    });
};
