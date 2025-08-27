import express from 'express'
import {
    createHomework,
    writeRemarks,
    studentRemarks,
    createNotes,
    createTimeTable,
    markAttendance,
    attedanceOfStudents,
    viewLeaveRequests,
    approveRequests,
    applyLeave,
} from '../controllers/teacherController.js'
import authMiddleware from '../middlewares/authMiddleware.js'
const teacherRouter = express.Router()


//Subject Teacher Management
teacherRouter.post('/subjects/homework', authMiddleware, authorizeRoles('teacher'), createHomework)

teacherRouter.post('/subjects/remarks', authMiddleware, authorizeRoles('teacher'), writeRemarks)

//Class Teacher Management
teacherRouter.post('/class/remarks', authMiddleware, authorizeRoles('teacher'), studentRemarks)

teacherRouter.post('/class/notes', authMiddleware, authorizeRoles('teacher'), createNotes)

teacherRouter.post('/class/timetable', authMiddleware, authorizeRoles('teacher'), createTimeTable)

teacherRouter.post('/class/markattendance', authMiddleware, authorizeRoles('teacher'), markAttendance)

teacherRouter.get('/class/studentattendance', authMiddleware, authorizeRoles('teacher'), attedanceOfStudents)

teacherRouter.post('/leave', authMiddleware, authorizeRoles('teacher'), applyLeave)

teacherRouter.get('/class/leave/view', viewLeaveRequests)

teacherRouter.put('/class/leave/view/:id', approveRequests)


export default teacherRouter