const express = require('express')
const applicationRouter = express.Router()
const {createApplication, getAllApplications, getApplication, updateApplication, deleteApplication, getApplicationsofUser, deleteApplicationsOfJob} = require('../controllers/application')

applicationRouter.route('/').get(getApplicationsofUser)
applicationRouter.route('/:jobId/').post(createApplication).get(getAllApplications).delete(deleteApplicationsOfJob)
applicationRouter.route('/:jobId/:id').get(getApplication).patch(updateApplication).delete(deleteApplication)

module.exports = applicationRouter;