import express from 'express'
import {
    createHomework,
    writeRemarks,
    studentRemarks,
    createNotes,
    createTimeTable,
    markAttendance,
    attedanceOfStudents,
    listOfAttendance
} from '../controllers/teacherController.js'

const teacherRouter = express.Router()


//Subject Teacher Management
teacherRouter.post('/subjects/homework', createHomework)

teacherRouter.post('/subjects/remarks', writeRemarks)

//Class Teacher Management
teacherRouter.post('/class/remarks', studentRemarks)

teacherRouter.post('/class/notes', createNotes)

teacherRouter.post('/class/timetable', createTimeTable)

teacherRouter.post('/class/markattendance', markAttendance)

teacherRouter.get('/class/studentattendance',attedanceOfStudents)

teacherRouter.get('/class/attendancelist',listOfAttendance)




export default teacherRouter