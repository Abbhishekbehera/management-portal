//Importing Modules
import express from 'express'
import dotenv from 'dotenv'
import connectDb from './config/db.js'
import authRouter from './routes/auth.js'
import adminRouter from './routes/admin.js'
import studentRouter from './routes/student.js'
import teacherRouter from './routes/teacher.js'

//Environmental Variable
dotenv.config()

//Database connection
connectDb()

//Initialise app to express
const app = express()

//Defining PORT
const port = process.env.PORT

//Middlewares
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use('/api/auth', authRouter)
app.use('/api/admin', adminRouter)
app.use('/api/students', studentRouter)
app.use('/api/teachers', teacherRouter)

//Server listen
app.listen(port, () => {
    console.log(`App is listening to the port ${port}`)
})
