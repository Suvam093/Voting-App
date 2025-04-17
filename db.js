const mongoose = require('mongoose');

// const mongoURL = process.env.MONGODB_LOCAL_URL;
const mongoURL = process.env.MONGODB_URI;
console.log(mongoURL);

const db = async () => {
    try {
        const conn = await mongoose.connect(process.env.MONGO_URI);
        console.log(`MongoDB Connected: ${conn.connection.host}`);
    } catch (error) {
        console.error(`Error: ${error.message}`);   
    }   
}

module.exports = db; 