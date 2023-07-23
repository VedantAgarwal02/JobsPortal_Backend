const express = require('express')
const jobRouter = express.Router()
const {createJob, getJob, updateJob, deleteJob, getAllJobs} = require('../controllers/job')

jobRouter.route('/').post(createJob).get(getAllJobs)
jobRouter.route('/:id').get(getJob).patch(updateJob).delete(deleteJob);

module.exports = jobRouter;