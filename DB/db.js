const mongoose = require('mongoose');


const connectToDB = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: true });
        console.log(`Connected to DB on ${process.env.MONGODB_URI}`)
    } catch (e) {
        console.error(e);
        throw new Error('Something went wrong while trying to connect to DB', e)
    }
}

module.exports = connectToDB;