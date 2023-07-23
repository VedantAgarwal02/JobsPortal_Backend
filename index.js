require('dotenv').config();
require('express-async-errors')
const express = require('express');
const app = express();
const cors = require('cors')
const port = process.env.port || 3000;
const auth = require('./middleware/authentication')
const authRouter = require('./routers/auth')
const jobRouter = require('./routers/job')
const applicationRouter = require('./routers/application')
const notFound = require('./middleware/notFound')
const connectDB = require('./db/connect')
app.use(express.json())
app.use(cors())

app.use('/api/v1/auth', authRouter)
app.use('/api/v1/job', auth, jobRouter)
app.use('/api/v1/application', auth, applicationRouter)

app.use(notFound)

const startApp = async()=> {
    try {
        await connectDB(process.env.MONGO_LINK);
        app.listen(port, ()=> {
            console.log("Server is running at", port)
        })
    }
    catch(error) {
        console.log(error)
    }
}

startApp();