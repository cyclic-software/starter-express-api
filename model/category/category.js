import mongoose from "mongoose"

const categorySchema = new mongoose.Schema({
    name:{
        type: String,
        required: true
    },
},
{timestamps: true},
{
    toJSON:{virtuals: true},
    toObject:{virtuals: true}
}
)

const Category = mongoose.model("Category", categorySchema)

export default Category