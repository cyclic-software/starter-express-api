const {Router} = require('express')
const product_category = require('../../controllers/product_category')

const router = Router()

router.get('/',product_category.AllProduct_categorys)
router.get('/:id',product_category.getCategory)
router.post('/',product_category.CreateProduct_category)
router.put('/:id',product_category.UpdateProduct_category)
router.delete('/:id',product_category.DeleteProduct_category)

module.exports = router