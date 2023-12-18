// import cart model
import Cart from '../../model/cart/cart.js';

// import order model
import Order from '../../model/order/order.js';

// import custom error
import customError from '../../utils/error.js';

// checkoutOrder function
export const checkoutOrder = async (req, res, next) => {
  try {
    const cart = await Cart.findById(req.params.id);

    if (!cart) {
      return next(customError(404, 'Cart not found'));
    }

    // Check if the current user is the owner of the cart
    if (req.user.id !== cart.user.toString()) {
      return next(
        customError(403, 'You do not have permission to checkout this cart'),
      );
    }

    const order = new Order({
      cartId: cart._id,
      status: 'processing',
    });

    await order.save();

    // Set the active status of the cart to true
    cart.active = true;
    await cart.save();

    res.status(200).json({
      status: 'success',
      message: 'Order checked out successfully',
      order,
    });
  } catch (err) {
    next(err);
  }
};

// cancel order function
export const cancelOrder = async (req, res, next) => {
  try {
    const order = await Order.findById(req.params.id);

    if (!order) {
      return next(customError(404, 'Order not found'));
    }

    // Retrieve the cart associated with the order and populate the user
    const cart = await Cart.findById(order.cartId).populate('user');

    // Check if the user is authenticated
    if (!req.user || !req.user.id) {
      return next(
        customError(401, 'You need to be logged in to cancel an order'),
      );
    }

    // Check if the current user is the owner of the order
    if (req.user.id !== cart.user._id.toString()) {
      return next(
        customError(403, 'You do not have permission to cancel this order'),
      );
    }

    // Instead of deleting, we change the status of the order
    order.status = 'cancelled';
    await order.save();

    // Set the active status of the cart to false
    cart.active = false;
    await cart.save();

    res.status(200).json({
      status: 'success',
      message: 'Order cancelled successfully',
      data: {
        order,
      },
    });
  } catch (err) {
    next(err);
  }
};

// shipOrder function
export const shipOrder = async (req, res, next) => {
  try {
    const order = await Order.findById(req.params.id);

    if (!order) {
      return next(customError(404, 'Order not found'));
    }

    // Check if the user is authenticated
    if (!req.user || !req.user.id) {
      return next(
        customError(401, 'You need to be logged in to ship an order'),
      );
    }

    // Check if the current user has the role of 'Admin' or 'DeliveryCrew'
    if (req.user.acctType !== 'Admin' && req.user.acctType !== 'DeliveryCrew') {
      return next(
        customError(403, 'You do not have permission to ship this order'),
      );
    }

    // Change the status of the order to 'shipped'
    order.status = 'shipped';
    await order.save();

    res.status(200).json({
      status: 'success',
      message: 'Order shipped successfully',
      data: {
        order,
      },
    });
  } catch (err) {
    next(err);
  }
};

// deliverOrder function
export const deliverOrder = async (req, res, next) => {
  try {
    const order = await Order.findById(req.params.id);

    if (!order) {
      return next(customError(404, 'Order not found'));
    }

    // Check if the user is authenticated
    if (!req.user || !req.user.id) {
      return next(
        customError(401, 'You need to be logged in to deliver an order'),
      );
    }

    // Check if the current user has the role of 'Admin' or 'DeliveryCrew'
    if (req.user.acctType !== 'Admin' && req.user.acctType !== 'DeliveryCrew') {
      return next(
        customError(403, 'You do not have permission to deliver this order'),
      );
    }

    // Change the status of the order to 'delivered'
    order.status = 'delivered';
    await order.save();

    // Retrieve the cart associated with the order
    const cart = await Cart.findById(order.cartId);

    // Set the active status of the cart to false
    cart.active = false;
    await cart.save();

    res.status(200).json({
      status: 'success',
      message: 'Order delivered successfully',
      data: {
        order,
      },
    });
  } catch (err) {
    next(err);
  }
};

// get all Order function
export const getAllOrders = async (req, res, next) => {
  try {
    const orders = await Order.find();

    res.status(200).json({
      status: 'success',
      results: orders.length,
      data: {
        orders,
      },
    });
  } catch (error) {
    next(error);
  }
};

// get specific User Orders function
export const getUserOrders = async (req, res, next) => {
  try {
    // Check if the user is authenticated
    if (!req.user || !req.user.id) {
      return next(
        customError(401, 'You need to be logged in to view your orders'),
      );
    }

    // Retrieve all orders associated with the user's carts
    const orders = await Order.find({ 'cartId.user': req.user.id }).populate('cartId');

    res.status(200).json({
      status: 'success',
      results: orders.length,
      data: {
        orders,
      },
    });
  } catch (err) {
    next(err);
  }
};