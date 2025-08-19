import express from 'express'
//Student Management Controllers
import {
    getOverallAttendance,
    viewOverallHomework,
    viewDaywiseHomework,
    viewRemarks,
    applyLeave,
    registerStudent,
    verifyOTP
} from '../controllers/studentController.js'

const studentRouter = express.Router()

//Register Management
studentRouter.post('/register', registerStudent)

//Verification
studentRouter.post('/register/verify', verifyOTP)

//Attendance Management
studentRouter.get('/attendance/overall', getOverallAttendance)

//Homework Management
studentRouter.get('/homework/overall', viewOverallHomework)

studentRouter.get('/homework/daywise', viewDaywiseHomework)

//Remarks Management
studentRouter.get('/remarks', viewRemarks)

//Leave Management
studentRouter.post('/leave', applyLeave)


export default studentRouter