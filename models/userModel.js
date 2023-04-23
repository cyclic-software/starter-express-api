import mongoose from "mongoose";
import bcrypt from "bcrypt";
import validator from "validator";



const Schema = mongoose.Schema;

const userSchema = new Schema({
    username: {
        type: String,
        required: [true,"username area is required"],
        unique: true,
        lowercase:true,
        validate:[validator.isAlphanumeric, "only alphanumeric characters"]
    },
    email: {
        type: String,
        required:[true,"email area is required"],
        unique: true,
        validate:[validator.isEmail,"valid email is required"]
    },
    password: {
        type: String,
        required: [true,"password area is required"],
        minLength: [8,"at least 8 characters"],
    },
    
    

},
    {
        timestamps: true
    }
);

//basic
//premium
//admin
//superadmin



/// password  bcrypt
userSchema.pre("save", function (next) {
    const user = this
    bcrypt.hash(user.password, 10, (err, hash) => {
        user.password = hash;
        next();
    })
});

const User = mongoose.model("User", userSchema);

export default User;