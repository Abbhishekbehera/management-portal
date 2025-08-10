import express from 'express'
//Student, Teacher and Classroom Management Controllers
import {
    createStudent, getAllStudents, getStudentById, updateStudent, deleteStudent, createClassroom,
    getAllClassroom, getClassroomById, createTeacher, viewAllTeacher, viewTeacherById, updateTeacherById,
    uploadStudentsExcel
} from '../controllers/adminController.js'
import { upload } from '../middlewares/upload.js'

const adminRouter = express.Router()
//Teacher Management
adminRouter.post('/teachers', createTeacher)

adminRouter.get('/teachers', viewAllTeacher)

adminRouter.get('/teachers/:id', viewTeacherById)

adminRouter.put('/teachers/:id', updateTeacherById)

//ClassRoom Management
adminRouter.post('/classrooms', createClassroom)

adminRouter.get('/classrooms', getAllClassroom)

adminRouter.get('/classrooms/:id', getClassroomById)

//Student Management
adminRouter.post('/students', createStudent)

adminRouter.get('/students', getAllStudents)

adminRouter.get('/students/:id', getStudentById)

adminRouter.put('/students/:id', updateStudent)

adminRouter.delete('/students/:id', deleteStudent)

//Attendance Management
adminRouter.post('/students/upload', upload.single("file"), uploadStudentsExcel)

export default adminRouter