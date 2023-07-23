const jobModel = require('../models/job')
const {StatusCodes} = require('http-status-codes')

const createJob = async(req,res)=> {
    
    const {role} = req.user;
    if(role !== 'employer') {
        return res.status(StatusCodes.UNAUTHORIZED).json({
            success : false,
            msg : 'You are not Authorized to create a Job, Try Login/Signup as an Employer.'
        })
    }

    req.body.employerId = req.user.id                    // Creating relations between models
    req.body.companyName = req.user.companyName
    
    const newJob = await jobModel.create({...req.body});
    res.status(StatusCodes.OK).json({
        success:true,
        msg : "Job Created Successfully",
        newJob
    })
}

const getJob = async (req,res)=> {
    const jobId = req.params.id;
    const empId = req.user.id

    const job = await jobModel.findOne({_id : jobId});
    if(!job) {
        return res.status(404).json({
            success : false,
            msg : 'No Job Found'
        })
    }

    res.status(StatusCodes.OK).json({
        success : true,
        msg : 'Job Found',
        job
    })
}

const updateJob = async (req,res)=> {

    const {
        body : newJob,
        params : {id : jobId},
        user : {id : empId}
    } = req

    const updatedJob = await jobModel.findOneAndUpdate({_id : jobId}, newJob, {
        new : true, 
        runValidators: true
    });

    if(!updatedJob) {
        return res.status(StatusCodes.NOT_FOUND).json({
            success : false,
            msg : `Job with id ${jobId} couldn't be updated`, 
        })
    }

    res.status(StatusCodes.OK).json({
        success : true, 
        msg : 'Job was updated Successfull',
        updatedJob
    })

}

const deleteJob = async(req,res)=> {
    const {
        user : {id : empId},
        params : {id : jobId}
    } = req

    const deletedJob = await jobModel.findOneAndDelete({_id : jobId, employerId : empId});

    if(!deletedJob) {
        return res.status(StatusCodes.NOT_FOUND).json({
            success : false,
            msg : `Job with id ${jobId} could not be deleted.`
        })
    }

    res.status(StatusCodes.OK).json({
        success : true,
        msg : 'Job Deleted Successfully.',
        deletedJob
    })
}

const getAllJobs = async(req,res) => {
    const empId = req.user.id;
    const {role} = req.user;

    if(role !== 'employer') {
        const allJobs = await jobModel.find()
        return res.status(StatusCodes.OK).json({
            success : true,
            msg : "Jobs were Fetched Successfully.",
            nbHits : allJobs.length,
            allJobs
        })
    }

    const allJobs = await jobModel.find({employerId : empId})

    if(!allJobs) {
        return res.status(StatusCodes.NOT_FOUND).json({
            success : false,
            msg : `No Job Found for Employer with id ${empId}`
        })
    }

    if(allJobs.length === 0) {
        return res.status(StatusCodes.OK).json({
            success : true,
            msg : 'No Jobs Found'
        })
    }

    res.status(StatusCodes.OK).json({
        success : true,
        msg : "Jobs were Fetched Successfully.",
        nbHits : allJobs.length,
        allJobs
    })
}

module.exports = {
    createJob,
    getJob,
    updateJob,
    deleteJob,
    getAllJobs
}

