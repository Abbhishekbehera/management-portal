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
import authMiddleware from '../middlewares/authMiddleware.js'

const studentRouter = express.Router()

//Register Management
studentRouter.post('/register', authMiddleware, authorizeRoles('student'), registerStudent)

//Verification
studentRouter.post('/register/verify', authMiddleware, authorizeRoles('student'), verifyOTP)

//Attendance Management
studentRouter.get('/attendance/overall', authMiddleware, authorizeRoles('student'), getOverallAttendance)

//Homework Management
studentRouter.get('/homework/overall', authMiddleware, authorizeRoles('student'), viewOverallHomework)

studentRouter.get('/homework/daywise', authMiddleware, authorizeRoles('student'), viewDaywiseHomework)

//Remarks Management
studentRouter.get('/remarks', authMiddleware, authorizeRoles('student'), viewRemarks)

//Leave Management
studentRouter.post('/leave', authMiddleware, authorizeRoles('student'), applyLeave)


export default studentRouter