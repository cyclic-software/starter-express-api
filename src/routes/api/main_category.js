const {Router} = require('express')
const MainCategoryController = require('../../controllers/main_category')

const router = Router()

router.get('/', MainCategoryController.get_mainCategory)
router.get('/:id', MainCategoryController.get_mainCategory_by_id)
router.post('/', MainCategoryController.add_mainCategory)
router.put('/:id', MainCategoryController.update_mainCategory)
router.delete('/:id', MainCategoryController.delete_mainCategory)

module.exports = router