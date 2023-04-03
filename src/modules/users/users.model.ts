import mongoose from "mongoose";
import IUser from "./users.interface";

const UserSchema = new mongoose.Schema({
    first_name: {
        type: "string",
        require: true
    },
    last_name: {
        type: "string",
        require: true
    },
    email: {
        type: "string",
        require: true
    },
    password: {
        type: "string",
        require: true
    },
    avatar: {
        type: "string",
    },
    date: {
        type: Date,
        default: Date.now()
    }
});

export default mongoose.model<IUser & mongoose.Document>('user', UserSchema)