import mongoose from "mongoose";

const dbConn = async (req, res) => {
    try {
        // const connect = await mongoose.connect(process.env.ONLINE_DB);
        // const connect = await mongoose.connect(process.env.DB_CONNECTION||process.env.ONLINE_DB);       
        const connect = await mongoose.connect(process.env.ONLINE_DB);       
       console.log(`Established connection to database ${connect.connection.host}`), connect.connection.name;
    } catch (err) {
        console.error(err);
    }
};

export default dbConn;