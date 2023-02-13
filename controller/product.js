const Product = require("../model/product");
const { validationResult } = require("express-validator");
const { Op } = require("sequelize");

exports.createProduct = (req, res, next) => {
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

  Product.create({
    name: req.body.name,
    description: req.body.description,
    cost: req.body.cost,
    categoryId: req.body.categoryId,
  }).then((product) => {
    res.status(201).json({
      message: "Product Created Successsully",
      product
    });
  });
};

exports.getProduct = (req, res, next) => {
  Product.findOne({
    where: {
      id: req.params.id,
    },
  })
    .then((product) => {
      if (product)
        res.status(200).json({
          product,
        });
      else
        res.status(404).json({
          message: "Product not found",
        });
    })
    .catch((err) => {
      if (!err.statusCode) err.statusCode = 500;
      next(err);
    });
};

exports.getProducts = (req, res, next) => {
  // let totalItems = 0;

  let page = req.query.page || 1;
  let limit = 5;

  let minCost = req.query.minCost || Number.MIN_VALUE;
  let maxCost = req.query.maxCost || Number.MAX_VALUE;

  console.log("Filter Query: ", req.query);

  return Product.findAll({
    where: {
      cost: {
        [Op.gte]: minCost,
        [Op.lte]: maxCost,
      },
    },
    limit: limit,
    offset: (page - 1) * limit,
  }).then((products) => {
    res.status(200).json({
      products,
    });
  });

  // Product.count()
  // .then(count => {
  //   totalItems = count;
  // });
};

exports.updateProduct = (req, res, next) => {
  Product.findOne({
    where: {
      id: req.params.id,
    },
  })
    .then((product) => {
      if (product) {
        product.name = req.body.name;
        product.description = req.body.description;
        product.cost = req.body.cost;
        product.save().then((result) => {
          //res.status(204).json({
          res.status(200).json({
            message: "Product updated Successfully",
            product,
          });
        });
      } else {
        return res.status(404).json({
          message: "Product not found",
        });
      }
    })
    .catch((err) => {
      if (!err.statusCode) err.statusCode = 500;
      next(err);
    });
};

exports.deleteProduct = (req, res, next) => {
  Product.findOne({
    where: {
      id: req.params.id,
    },
  })
    .then((product) => {
      if (product) {
        product.destroy().then((product) => {
          //res.status(204).json({
          res.status(200).json({
            message: "Product deleted Successfully",
            product
          });
        });
      } else {
        return res.status(404).json({
          message: "Product not found",
        });
      }
    })
    .catch((err) => {
      if (!err.statusCode) err.statusCode = 500;
      next(err);
    });
};
