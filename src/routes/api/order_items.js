const {Router} = require('express')
const order_items_controller = require('../../controllers/order_items')

const router = Router()

router.post('/create',order_items_controller.Create_order_item)
router.get('/',order_items_controller.Read_order_items)
router.get('/:id', order_items_controller.Read_order_item)
router.delete('/:id',order_items_controller.Delete_order_item)
router.put('/:id',order_items_controller.Update_order_item)

module.exports = router