import express from 'express'
import { getOverallAttendance,getDayWiseAttendance, viewHomeWork } from '../controllers/studentController.js'


const studentRouter= express.Router()





//Attendance Management
studentRouter.get('/attendance/overall',getOverallAttendance)

studentRouter.get('/attendance/daywise',getDayWiseAttendance)

//Homework Management
studentRouter.get('/homework',viewHomeWork)




export default studentRouter