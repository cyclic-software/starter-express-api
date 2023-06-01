import mongoose from "mongoose";



const { Schema } = mongoose;

const contactSchema = new Schema({
    location: {
        type: String,
        default: "na"
    },
    gmail: {
        type: String,
        default: "na"
    },
    tel: {
        type: String,
        default: "des"
    },
    fb: {
        type: String,
        default: "https://www.facebook.com/"
    },
    inst: {
        type: String,
        default: "https://www.instagram.com/"
    },
    youtube: {
        type: String,
        default: "https://www.youtube.com/"
    }
},
    {
        timestamps: true,
    }
);




const Contact = mongoose.model('Contact', contactSchema);

export default Contact;