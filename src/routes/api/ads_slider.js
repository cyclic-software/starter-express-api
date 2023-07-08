const {Router} = require('express')
const AdsSliderController = require('../../controllers/ads_slider')

const router = Router()

router.get('/', AdsSliderController.get_ads_sliders)
router.get('/:id', AdsSliderController.get_ads_sliders_by_id)
router.post('/', AdsSliderController.create_ads_slider)
router.put('/:id', AdsSliderController.update_ads_slider)
router.delete('/:id', AdsSliderController.remove_ads_slider)

module.exports = router