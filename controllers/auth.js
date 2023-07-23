const employerModel = require('../models/employer')
const seekerModel = require('../models/seeker')
const {StatusCodes} = require('http-status-codes')
const jwt = require('jsonwebtoken')

const signup = async (req,res) => {
    const {role} = req.body;
    if(role === "employer") {
        // Create new employer
        try {
            const {name, companyName, email, number} = req.body;

            if(!name || !companyName || !email || !number) {
                return res.status(StatusCodes.BAD_REQUEST).json({
                    success : false,
                    msg : "Incomplete information"
                })
            }

            const newEmployer = await employerModel.create(req.body);
            const token = newEmployer.createJWT()

            res.status(StatusCodes.OK).json({
                success : true,
                msg : "Signup Success",
                newEmployer,
                token
            })
        }
        catch(error) {
            return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
                success : false,
                msg : 'Server Error',
                err : error.message
            })
        }
    }
    else if(role === 'seeker') {
        // Create new Job Seeker
        try {
            const {name, qualification, email, number} = req.body;

            if(!name || !qualification || !email || !number) {
                return res.status(StatusCodes.BAD_REQUEST).json({
                    success : false,
                    msg : "Incomplete information"
                })
            }

            const newSeeker = await seekerModel.create(req.body);
            const token = newSeeker.createJWT()

            res.status(StatusCodes.OK).json({
                success : true,
                msg : "Signup Success",
                newSeeker,
                token
            })
        }
        catch(error) {
            return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
                success : false,
                msg : 'Server Error',
                err : error.message
            })
        }
    }
    else {
        res.status(StatusCodes.BAD_REQUEST).json({
            success : false,
            msg : "Undefined Role"
        })
    }
}

const login = async(req,res) => {
    
    const {role, email, password} = req.body;

    if(!email || !password) {
        return res.status(StatusCodes.BAD_REQUEST).json({
            success : false,
            msg : 'Incomplete Information'
        })
    }

    if(role === "employer") {
        // Verify employer
        const employer = await employerModel.findOne({email});
        if(!employer) {
            return res.status(StatusCodes.UNAUTHORIZED).json({
                success : false,
                msg : 'Invalid Credentials'
            })
        }

        const hasAccess = await employer.comparePassword(password)
        if(hasAccess) {
            const token = employer.createJWT()
            return res.status(StatusCodes.OK).json({
                success : true,
                msg : 'Login Success',
                employer,
                token
            })
        }
        else {
            return res.status(StatusCodes.UNAUTHORIZED).json({
                success : false,
                msg : 'Invalid Credentials'
            })
        }
    }
    else if(role === 'seeker') {
        // Verify Job Seeker
        const seeker = await seekerModel.findOne({email});
        if(!seeker) {
            return res.status(StatusCodes.UNAUTHORIZED).json({
                success : false,
                msg : 'Invalid Credentials'
            })
        }

        if(seeker.comparePassword(seeker.password)) {
            const token = seeker.createJWT()
            return res.status(StatusCodes.OK).json({
                success : true,
                msg : 'Login Success',
                seeker,
                token
            })
        }
        else {
            return res.status(StatusCodes.UNAUTHORIZED).json({
                success : false,
                msg : 'Invalid Credentials'
            })
        }
    }
    else {
        return res.status(StatusCodes.BAD_REQUEST).json({
            success : false,
            msg : 'Undefined request'
        })
    }
}

module.exports = {
    signup,
    login
}