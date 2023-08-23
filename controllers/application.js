const applicationModel = require("../models/application")
const jobModel = require('../models/job')
const {StatusCodes} = require('http-status-codes')

const createApplication = async (req,res) => {
    const {resume} = req.body;

    if(!resume) {
        return res.status(StatusCodes.BAD_REQUEST).json({
            success : false,
            msg : 'Incomplete Information'
        })
    }

    req.body.seekerId = req.user.id;
    req.body.jobId = req.params.jobId;
    try {
        const newApplication = await applicationModel.create({...req.body})
        res.status(StatusCodes.OK).json({
            success : true,
            msg : 'Application Submitted',
            newApplication
        })
    }
    catch(error) {
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
            success : false,
            msg : error.message
        })
    }
}

const getAllApplications = async (req,res) => {

    const jobId = req.params.jobId
    const applications = await applicationModel.find({jobId})

    let message="All Applications Fetched Successfully.";
    if(applications.length===0) 
    message = 'No Applications Yet.'

    return res.status(StatusCodes.OK).json({
        success : true,
        msg : message,
        nbHits : applications.length,
        applications
    })
}

const getApplicationsofUser = async(req,res) => {
    const applications = await applicationModel.find({seekerId:req.user.id});

    let message="All Applications Fetched Successfully.";
    if(applications.length===0) 
    message = 'No Applications Yet.'

    return res.status(StatusCodes.OK).json({
        success : true,
        msg : message,
        nbHits : applications.length,
        applications
    })
}

const getApplication = async (req,res) => {
    const seekerId = req.user.id;
    const jobId = req.params.jobId
    
    try {
        const application = await applicationModel.findOne({jobId, seekerId});
        if(!application) {
            return res.status(StatusCodes.OK).json({
                success : false,
                msg : 'No Application Found'
            })
        }

        res.status(200).json({
            success : true,
            msg : 'Application Found',
            application
        })
    }
    catch(error) {
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
            success : false,
            msg : error
        })
    }
}

const updateApplication = async (req,res) => {

    const id = req.params.id
    const updatedApplication = await applicationModel.findOneAndUpdate({_id : id}, req.body, {
        new : true,
        runValidators : true
    })

    if(!updatedApplication) {
        return res.status(StatusCodes.NOT_FOUND).json({
            success : false,
            msg : 'Application Not Found.'
        })
    }

    res.status(StatusCodes.OK).json({
        success : true,
        msg : "Application updated successfully.",
        updatedApplication
    })
}

const deleteApplication = async (req,res) => {
    const id = req.params.id;

    const deletedApplication = await applicationModel.findOneAndDelete({_id : id});

    if(!deletedApplication) {
        return res.status(StatusCodes.NOT_FOUND).json({
            success : false,
            msg : "No Application Found."
        })
    }

    res.status(StatusCodes.OK).json({
        success : true,
        msg : 'Application Deleted Successfully',
        deletedApplication
    })
}

const deleteApplicationsOfJob = async(req,res) => {
    const jobId = req.params.jobId

    try {
        const applicationsDeleted = await applicationModel.deleteMany({jobId});
        console.log(applicationsDeleted.deletedCount)
        return res.status(StatusCodes.OK).json({
            success:true,
            totalDeleted:applicationsDeleted.deletedCount
        })
    }
    catch(error) {
        console.log(error)
    }
}

module.exports = {
    createApplication,
    getAllApplications,
    getApplication,
    updateApplication,
    deleteApplication,
    getApplicationsofUser,
    deleteApplicationsOfJob
}

