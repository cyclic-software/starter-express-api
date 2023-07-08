const mongoose = require('mongoose')
const Schema = mongoose.Schema

const SubCategorySchema = new Schema({
    name: {
        type: String
    },
    main_category:{
        type: String
    }
})


module.exports = mongoose.model.SubCategory || mongoose.model("SubCategory", SubCategorySchema);