const {Router} = require('express')
const CartController = require('../../controllers/cart')
const { checkToken } = require("../../auth/token_validation");

const router = Router()

router.get('/', CartController.get_carts)
router.get('/:id', CartController.get_carts_by_id)
router.post('/', checkToken, CartController.create_cart)
router.put('/:id', CartController.update_cart)
router.delete('/:id', CartController.remove_cart)
router.get('/user', checkToken, CartController.get_carts_by_user_id)
router.put('/plus/:id', CartController.add_one_quantity)
router.put('/minus/:id', CartController.remove_one_quantity)

module.exports = router