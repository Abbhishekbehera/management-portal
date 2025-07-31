//Importing Modules
import express from 'express'
import dotenv from 'dotenv'
import connectDb from './config/db.js'


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



//Server listen
app.listen(port, () => {
    console.log(`App is listening to the port ${port}`)
})