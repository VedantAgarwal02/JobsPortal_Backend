const mongoose = require('mongoose')

const jobSchema = new mongoose.Schema ({
    employerId : {
        type : mongoose.Types.ObjectId, 
        required:true
    },
    companyName : {
        type: String
    },
    jobTitle : {
        type : String,
        required : [true, 'Please provide Job Title']
    },
    date : {
        type : Date,
        default : new Date()
    },
    mode : {
        type : String,
        enum : ['online', 'on-site'],
        required : [true, 'Mode of Employment must be provided']
    },
    package : {
        type : Number,
        required : [true, 'Please provide the amount of Package Offered']
    },
    type : {
        type : String,
        enum : ['tech', 'non-tech'],
        required : [true, 'Please provide the type of Job Offered']
    },
    totalApplications : {
        type : Number,
        default : 0
    }
})

const jobModel = mongoose.model('jobModel', jobSchema)

module.exports = jobModel