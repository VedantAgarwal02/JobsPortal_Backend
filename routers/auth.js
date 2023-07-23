const express = require("express")
const authRouter = express.Router()

const {signup, login} = require('../controllers/auth')

authRouter.route('/login').post(login)
authRouter.route('/signup').post(signup)

module.exports = authRouter;