import express from 'express'
//Student Profile Controllers
import { createStudent,getStudents,studentInfo,updateStudent,deleteStudent } from '../controllers/adminController.js'

const adminRouter = express.Router()

//Creating Student Profile
adminRouter.post('/students',createStudent)
//Get all Student Information
adminRouter.get('/students',getStudents)
//Get individual student information
adminRouter.get('/students/:id',studentInfo)
//Update individual student profile
adminRouter.put('/students/:id',updateStudent)
//Delete individual student profile
adminRouter.delete('/students/:id',deleteStudent)


export default adminRouter