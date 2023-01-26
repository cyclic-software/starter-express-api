import mongoose from "mongoose";

const createConnection = (url) => {
    mongoose.connect(url);
}

class DB {
    constructor(url) {
        if(!DB.instance) {
            DB.instance = createConnection(url)
        } 
        return DB.instance;
    }
    connect() {
        return this.instance
    }
}

new DB(process.env.DB_URL);
const db = mongoose.connection;

const handleOpen = () => console.log("Connected to DB 🎄");
const handleError = (error) => console.log("DB Error", error);
db.on("error", handleError);
db.once("open", handleOpen);
