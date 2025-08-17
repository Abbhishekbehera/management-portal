import express from 'express'
import { getOverallAttendance, getDayWiseAttendance, viewOverallHomework, viewDaywiseHomework, viewRemarks } from '../controllers/studentController.js'


const studentRouter = express.Router()





//Attendance Management
studentRouter.get('/attendance/overall', getOverallAttendance)

//Homework Management
studentRouter.get('/homework/overall', viewOverallHomework)

studentRouter.get('/homework/daywise', viewDaywiseHomework)

//Remarks Management
studentRouter.get('/remarks', viewRemarks)




export default studentRouter