const mongoose = require('mongoose')

const connectDB = async(link)=> {
    console.log("connection Established")
    return mongoose.connect(link, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    })
}

module.exports = connectDB;