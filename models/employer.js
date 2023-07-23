const mongoose = require('mongoose')
const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt')

const employerSchema = new mongoose.Schema({
    name : {
        type : String,
        required : [true, 'Name must be provided.']
    },
    companyName : {
        type : String, 
        required : [true, 'Please provide the name of your company.']
    },
    email : {
        type : String, 
        required : [true, 'Please provide Email'],
        unique : [true, 'Email is already in use.'],
        match : [/^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/, 'Please provide a valid email'],
    },
    number : {
        type : Number,
        required : [true, 'Please provide Phone-Number'],
        length : [10, 'Number should be of 10 digits.']
    },
    password : {
        type : String,
        minLength : [8, 'Minimum Length of password is 8.'],
        required : true
    }
})

employerSchema.methods.createJWT = function() {
    return jwt.sign({id:this._id, companyName:this.companyName, role : 'employer'}, process.env.JWT_SECRET, {expiresIn : process.env.JWT_LIFETIME});
}

employerSchema.pre('save', async function() {
    const salt = await bcrypt.genSalt()
    const hashedPassword = await bcrypt.hash(this.password, salt)

    this.password = hashedPassword;
})

employerSchema.methods.comparePassword = async function(inputPassword) {
    const match = await bcrypt.compare(inputPassword, this.password)
    return match;
}

const employerModel = mongoose.model("employerModel", employerSchema);

module.exports = employerModel;