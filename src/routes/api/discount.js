const {Router} = require('express')
const discount_controller = require('../../controllers/discount')

const router = Router()

router.get('/',discount_controller.AllDiscounts)
router.get('/:id',discount_controller.getDiscount)
router.post('/',discount_controller.CreateDiscount)
router.put('/:id',discount_controller.UpdateDiscount)
router.delete('/:id',discount_controller.DeleteDiscount)

module.exports = router