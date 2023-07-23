const mongoose = require('mongoose')
const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt')

const seekerSchema = new mongoose.Schema({
    name : {
        type : String,
        required : [true, 'Name must be provided.']
    },
    qualification : {
        type : String,
        enum : ['highSchool', 'secondarySchool', 'graduate', 'postGraduate'],
        required : [true, 'Please provide your Highest Qualification']
    },
    email : {
        type : String, 
        required : [true, 'Please provide Email'],
        unique : [true, 'Email is already in use.'],
        match : [/^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/, 'Please provide a valid email'],
    },
    number : {
        type : String,
        required : [true, 'Please provide Phone-Number'],
        minLength : [10, 'Number should be of Ten Digits.'],
        maxLength : [10, 'Number can be of 10 digits only.']
    },
    password : {
        type : String,
        required : [true, 'Please enter password'],
        minLength : [8, 'Minimum Length of password is 8.']
    }
})

seekerSchema.methods.createJWT = function() { // IMPORTANT : cant use arrow function here, only use "function" keyword 
    return jwt.sign({id : this._id, role : 'seeker'}, process.env.JWT_SECRET, {expiresIn : process.env.JWT_LIFETIME});
}

seekerSchema.pre('save', async function() {
    const salt = await bcrypt.genSalt()
    const hashedPassword = await bcrypt.hash(this.password, salt)

    this.password = hashedPassword;
})

seekerSchema.methods.comparePassword = async function(inputPassword) {
    return await bcrypt.compare(inputPassword, this.password);
}

const seekerModel = mongoose.model('seekerModel', seekerSchema)

module.exports = seekerModel;