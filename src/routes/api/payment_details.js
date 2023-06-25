const {Router} = require('express')
const payment_details_controller = require('../../controllers/payment_details')

const router = Router()

router.get('/',payment_details_controller.Read_payment_details)
router.get('/:id',payment_details_controller.Read_payment_detail)
router.post('/create',payment_details_controller.Create_payment_details)
router.put('/:id',payment_details_controller.Update_payment_detail)
router.delete('/:id',payment_details_controller.Delete_payment_detail)

module.exports = router