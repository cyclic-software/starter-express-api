const {Router} = require('express')
const product_inventory = require('../../controllers/product_inventory')

const router = Router()

router.get('/',product_inventory.AllProduct_inventorys)
router.get('/:id',product_inventory.getInventory)
router.post('/',product_inventory.CreateProduct_inventory)
router.put('/:id',product_inventory.UpdateProduct_inventory)
router.delete('/:id',product_inventory.DeleteProduct_inventory)

module.exports = router