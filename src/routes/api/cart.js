const {Router} = require('express')
const CartController = require('../../controllers/cart')

const router = Router()

router.get('/', CartController.get_carts)
router.get('/:id', CartController.get_carts_by_id)
router.post('/', CartController.create_cart)
router.put('/:id', CartController.update_cart)
router.delete('/:id', CartController.remove_cart)
router.get('/user/:id', CartController.get_carts_by_user_id)

module.exports = router