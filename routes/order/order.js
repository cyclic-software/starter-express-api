import express from 'express';
const orderRoute = express.Router();

import {
  checkoutOrder,
  cancelOrder,
  getAllOrders,
  shipOrder,
  deliverOrder,
  getUserOrders,
} from '../../controller/order/order.js';

// import authorization function
import { protect, restrictTo } from '../../controller/auth/authorize.js';

orderRoute.post('/cart-items/:id/checkout', protect, checkoutOrder);
orderRoute.get('/order-items', protect, restrictTo("Admin"), getUserOrders);
orderRoute.get('/my-orders', protect, getAllOrders);
orderRoute.route('/order-item/:id/cancel-order').patch(protect, restrictTo("DeliveryCrew", "Admin"), cancelOrder);
orderRoute.route('/order-item/:id/order-shipped').patch(protect, restrictTo("DeliveryCrew", "Admin"), shipOrder);
orderRoute.route('/order-item/:id/order-delivered').patch(protect, restrictTo("DeliveryCrew", "Admin"), deliverOrder);

export default orderRoute;
