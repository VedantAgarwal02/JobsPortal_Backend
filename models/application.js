const mongoose = require('mongoose')

const applicationSchema = new mongoose.Schema({
    jobId : {
        type : mongoose.Types.ObjectId
    },
    seekerId : {
        type : mongoose.Types.ObjectId
    },
    applicantName: {
        type:String,
        required:[true, 'Please provide the name of applicant.']
    },
    companyName: {
        type:String
    },
    qualification : {
        type:String
    },
    jobTitle: {
        type:String
    },
    status : {
        type : String,
        enum : ['pending', 'interview', 'hired', 'rejected'],
        default : 'pending'
    },
    resume : {
        type : String,
        required : [true, 'Please provide Google Drive Link of your Resume.']
    }
})

const applicationModel = mongoose.model('applicationModel', applicationSchema)

module.exports = applicationModel;