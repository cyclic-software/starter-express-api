const {Router} = require('express')
const SubCategoryRouter = require('../../controllers/sub_category')

const router = Router()

router.get('/', SubCategoryRouter.get_subcategory)
router.get('/:id', SubCategoryRouter.get_subcategory_by_id)
router.post('/', SubCategoryRouter.add_subcategory)
router.put('/:id', SubCategoryRouter.update_subcategory)
router.delete('/:id', SubCategoryRouter.delete_subcategory)

module.exports = router