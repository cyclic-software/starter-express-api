const {Router} = require('express')
const order_details_controller = require('../../controllers/order_details')

const router = Router()
router.get('/',order_details_controller.Read_order_details)
router.post('/create',order_details_controller.Create_order_details)
router.get('/:id',order_details_controller.Read_order_detail)
router.delete('/:id',order_details_controller.Delete_order_details)
router.put('/:id',order_details_controller.Update_order_details)

module.exports = router