import { generate } from 'randomstring';

// importing cart model
import Cart from '../../model/cart/cart.js';

// importing products controller
import Products from '../../model/product/products.js';

// importing custom error
import customError from '../../utils/error.js';


// controller to create cart items
export const createCartItem = async (req, res, next) => {
  try {
    // Check if the request body has products array
    if (!req.body.products) req.body.products = [{}];

    // Set product ID from request params if not provided in body
    if (!req.body.products[0].productId) {
      req.body.products[0].productId = req.params.id;
    }

    // Check if user is authenticated
    if (!req.user) {
      return next(customError(401, 'Unauthorized access'));
    }

    // Associate user with the cart
    req.body.user = req.user.id;

    // Check if product exists
    const productId = await Products.findById(req.body.products[0].productId);
    if (!productId) {
      return next(customError(404, `Product with id ${req.body.products[0].productId} does not exist`));
    }

    // Check if cart exists for the user
    let cart = await Cart.findOne({ user: req.user.id });
    let numberCode = generate(20);

    // Validate and update existing cart item or add a new item
    if (cart) {
      const existingItemIndex = cart.products.findIndex((p) =>
        p.productId._id.equals(productId._id),
      );

      if (existingItemIndex > -1) {
        // Update existing item quantity
        const existingItem = cart.products[existingItemIndex];
        existingItem.quantity += parseInt(req.body.products[0].quantity, 10) || 1;
        existingItem.price = productId.price;
        cart.products[existingItemIndex] = existingItem;
      } else {
        // Add new item to the existing cart
        const newItem = {
          productId: productId._id,
          price: productId.price,
          image: productId.image[0],
          name: productId.name,
          quantity: parseInt(req.body.products[0].quantity, 10) || 1,
        };
        cart.products.push(newItem);
      }
    } else {
      // Create a new cart instance
      cart = new Cart({
        identityNumber: numberCode,
        totalPrice: 0,
        products: [
          {
            productId: productId._id,
            price: productId.price,
            name: productId.name,
            image: productId.image[0],
            quantity: parseInt(req.body.products[0].quantity, 10) || 1,
          },
        ],
        user: req.user.id,
      });
    }

    // Calculate total price of items in the cart
    let totalPrice = cart.products.reduce((acc, item) => acc + item.price * item.quantity, 0);

    // Update total price of the existing cart or set it for the new cart
    cart.totalPrice = totalPrice;

    // Calculate and set shipping fee (ex: 10% of total)
    cart.shipping_fee = 0.1 * totalPrice;

    // Calculate and set tax (ex: 7% of total)
    cart.tax = 0.07 * totalPrice;

    // Update total price including shipping and tax
    cart.total = totalPrice + cart.shipping_fee + cart.tax;

    // Save changes to the database
    await cart.save();

    res.status(201).json({
      status: 'success',
      message: `Item added to cart successfully`,
      cart,
    });
  } catch (err) {
    console.error('Error:', err);
    next(err);
  }
};

// Controller to get all products in the user's cart
export const getAllCartProducts = async (req, res, next) => {
  try {
    // Check if user is authenticated
    if (!req.user) {
      return next(customError(401, 'Unauthorized access'));
    }

    // Find the cart for the user
    const cart = await Cart.findOne({ user: req.user.id });

    // Check if the cart exists
    if (!cart) {
      return res.status(404).json({
        status: 'success',
        message: 'Cart not found',
        products: [],
      });
    }

    // Extract products from the cart
    const cartProducts = cart.products;

    res.status(200).json({
      status: 'success',
      message: 'Products in the cart retrieved successfully',
      products: cartProducts,
    });
  } catch (err) {
    console.error('Error:', err);
    next(err);
  }
};

// Controller to get a single product from the user's cart
export const getSingleCartProduct = async (req, res, next) => {
  try {
    // Check if user is authenticated
    if (!req.user) {
      return next(customError(401, 'Unauthorized access'));
    }

    // Find the cart for the user
    const cart = await Cart.findOne({ user: req.user.id });

    // Check if the cart exists
    if (!cart) {
      return res.status(404).json({
        status: 'success',
        message: 'Cart not found',
        product: null,
      });
    }

    // Extract product ID from request params
    const productIdToFind = req.params.productId;

    // Find the product in the cart based on the provided product ID
    const productInCart = cart.products.find(
      (product) => product.productId._id.equals(productIdToFind)
    );

    // Check if the product exists in the cart
    if (!productInCart) {
      return res.status(404).json({
        status: 'success',
        message: 'Product not found in the cart',
        product: null,
      });
    }

    res.status(200).json({
      status: 'success',
      message: 'Product in the cart retrieved successfully',
      product: productInCart,
    });
  } catch (err) {
    console.error('Error:', err);
    next(err);
  }
};


// Controller to update a single product in the user's cart
export const updateCartProduct = async (req, res, next) => {
  try {
    // Check if user is authenticated
    if (!req.user) {
      return next(customError(401, 'Unauthorized access'));
    }

    // Find the cart for the user
    const cart = await Cart.findOne({ user: req.user.id });

    // Check if the cart exists
    if (!cart) {
      return res.status(404).json({
        status: 'success',
        message: 'Cart not found',
        updatedProduct: null,
      });
    }

    // Extract product ID from request params
    const productIdToUpdate = req.params.productId;

    // Find the index of the product in the cart array
    const productIndex = cart.products.findIndex(
      (product) => product.productId._id.equals(productIdToUpdate)
    );

    // Check if the product exists in the cart
    if (productIndex === -1) {
      return res.status(404).json({
        status: 'success',
        message: 'Product not found in the cart',
        updatedProduct: null,
      });
    }

    // Update product details based on the request body
    const updatedProduct = cart.products[productIndex];
    if (req.body.quantity) {
      updatedProduct.quantity = parseInt(req.body.quantity, 10) || 1;
    }
    // Add more fields to update as needed

    // Update the total price of the cart after the product is updated
    cart.totalPrice = cart.products.reduce((acc, item) => acc + item.price * item.quantity, 0);

    // Update other relevant fields if needed (e.g., shipping_fee, tax)

    // Save changes to the database
    await cart.save();

    res.status(200).json({
      status: 'success',
      message: 'Product in the cart updated successfully',
      updatedProduct,
    });
  } catch (err) {
    console.error('Error:', err);
    next(err);
  }
};

// Controller to delete a single product from the user's cart
export const deleteCartProduct = async (req, res, next) => {
  try {
    // Check if user is authenticated
    if (!req.user) {
      return next(customError(401, 'Unauthorized access'));
    }

    // Find the cart for the user
    const cart = await Cart.findOne({ user: req.user.id });

    // Check if the cart exists
    if (!cart) {
      return res.status(404).json({
        status: 'success',
        message: 'Cart not found',
        deletedProduct: null,
      });
    }

    // Extract product ID from request params
    const productIdToDelete = req.params.productId;

    // Find the index of the product in the cart array
    const productIndex = cart.products.findIndex(
      (product) => product.productId._id.equals(productIdToDelete)
    );

    // Check if the product exists in the cart
    if (productIndex === -1) {
      return res.status(404).json({
        status: 'success',
        message: 'Product not found in the cart',
        deletedProduct: null,
      });
    }

    // Remove the product from the cart array
    const deletedProduct = cart.products.splice(productIndex, 1)[0];

    // Update the total price of the cart after the product is deleted
    cart.totalPrice = cart.products.reduce((acc, item) => acc + item.price * item.quantity, 0);

    // Update other relevant fields if needed (e.g., shipping_fee, tax)

    // Save changes to the database
    await cart.save();

    res.status(204).json({
      status: 'success',
      message: 'Product deleted from the cart successfully',
      deletedProduct,
    });
  } catch (err) {
    console.error('Error:', err);
    next(err);
  }
};

// Controller to get the user's cart
export const getUserCart = async (req, res, next) => {
  try {
    // Check if user is authenticated
    if (!req.user) {
      return next(customError(401, 'Unauthorized access'));
    }

    // Find the cart for the user
    const cart = await Cart.findOne({ user: req.user.id });

    // Check if the cart exists
    if (!cart) {
      return res.status(404).json({
        status: 'success',
        message: 'Cart not found',
        cart: null,
      });
    }

    res.status(200).json({
      status: 'success',
      message: 'User cart retrieved successfully',
      cart,
    });
  } catch (err) {
    console.error('Error:', err);
    next(err);
  }
};

// Controller to delete the user's cart
export const deleteCart = async (req, res, next) => {
  try {
    // Check if user is authenticated
    if (!req.user) {
      return next(customError(401, 'Unauthorized access'));
    }

    // Find and delete the cart for the user
    const deletedCart = await Cart.findOneAndDelete({ user: req.user.id });

    // Check if the cart exists
    if (!deletedCart) {
      return res.status(404).json({
        status: 'success',
        message: 'Cart not found',
        deletedCart: null,
      });
    }

    res.status(204).json({
      status: 'success',
      message: 'User cart deleted successfully',
      deletedCart,
    });
  } catch (err) {
    console.error('Error:', err);
    next(err);
  }
};

