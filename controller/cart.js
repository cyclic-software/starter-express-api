const Cart = require("../model/cart");
const CartItem = require("../model/cartitem");
const Product = require("../model/product");
const { validationResult } = require("express-validator");

// exports.getCart = async (req, res, next) => {
//   const cart = await Cart.findByPk(req.params.id);

//   if (!cart) {
//     return res.status(404).json({
//       message: "Cart not found",
//     });
//   }

//   const products = await cart.getProducts();

//   let totalCost = 0;
//   console.log("\nCart: ", cart.dataValues);

//   console.log("\nProducts:");
//   for (const product of products) {
//     console.log("Name:", product.dataValues.name, "|", "Quanity:", product.cartitem.quantity, "|", "Cost:", product.dataValues.cost);
//     totalCost += product.cost * product.cartitem.quantity;
//   }

//   console.log("\nTotal Cost =", totalCost);

//   res.status(200).json({
//     products: products,
//     totalCost: totalCost
//   });
// };

exports.getCart = async (req, res, next) => {
    const cart = await Cart.findOne({
        where: {
            userId: req.body.userId,
        },
    });

    if (!cart) {
        return res.status(404).json({
            message: "Cart not found",
        });
    }

    const products = await cart.getProducts();

    let totalCost = 0;

    for (const product of products) {
        totalCost += product.cost * product.cartitem.quantity;
    }

    res.status(200).json({
        products: products,
        totalCost: totalCost,
    });
};

exports.addToCart = async (req, res, next) => {
    const cart = await Cart.findOne({
        where: {
            userId: req.body.userId,
        },
    });

    if (!cart) {
        return res.status(404).json({
            message: "Cart not found",
        });
    }

    const product = await Product.findOne({
        where: {
            id: req.body.productId,
        },
    });

    if (!product) {
        return res.status(404).json({
            message: "Product not found in table",
        });
    }

    const cartItem = await CartItem.create({
        quantity: req.body.quantity,
        cartId: cart.dataValues.id,
        productId: req.body.productId,
    });

    res.status(200).json({
        message: "Product added to cart successfully",
        product: product.dataValues,
    });
};

exports.updateCart = async (req, res, next) => {
    const productInTable = await Product.findOne({
        where: {
            id: req.body.productId,
        },
    });

    if (!productInTable) {
        return res.status(404).json({
            message: "Product not found in table",
        });
    }

    const cart = await Cart.findOne({
        where: {
            userId: req.body.userId,
        },
    });

    if (!cart) {
        return res.status(404).json({
            message: "Cart not found",
        });
    }

    const cartItem = await CartItem.update(
        {
            quantity: req.body.quantity,
        },
        {
            where: {
                cartId: cart.dataValues.id,
                productId: productInTable.dataValues.id,
            },
        }
    );

    return res.status(200).json({
        message: "Cart updated successfully",
    });
};

exports.deleteFromCart = async (req, res, next) => {
    const productInTable = await Product.findOne({
        where: {
            id: req.body.productId,
        },
    });

    if (!productInTable) {
        return res.status(404).json({
            message: "Product not found in table",
        });
    }

    const cart = await Cart.findOne({
        where: {
            userId: req.body.userId,
        },
    });

    if (!cart) {
        return res.status(404).json({
            message: "Cart not found",
        });
    }

    const cartItem = await CartItem.destroy({
        where: {
            cartId: cart.dataValues.id,
            productId: productInTable.dataValues.id,
        },
    });

    return res.status(200).json({
        message: "Product deleted from cart successfully",
    });
};
