const {Router} = require('express')
const product_controller = require('../../controllers/product')

const router = Router()

router.get('/',product_controller.AllProducts)
router.get('/:id',product_controller.getProduct)
router.get('/category/:id', product_controller.getProductBySubCategory)
router.post('/type/:id', product_controller.getProductByType)
router.post('/',product_controller.CreateProduct)
router.put('/:id',product_controller.UpdateProduct)
router.delete('/:id',product_controller.DeleteProduct)

module.exports = router