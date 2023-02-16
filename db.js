const mongoose = require('mongoose');
//mongoose.connect('mongodb+srv://akram:Solanki167@travesycluster0.sg3iqyi.mongodb.net/DreamCoder')

const ConnectDB = async () => {
    try {
        const conn = await mongoose.connect("mongodb+srv://akram:Solanki167@travesycluster0.sg3iqyi.mongodb.net/DreamCoder")
        //console.log("=====>", conn)
    }
    catch (error) {
        console.log("==error==", error);
        process.exit(1);
    }
}

module.exports = ConnectDB;
