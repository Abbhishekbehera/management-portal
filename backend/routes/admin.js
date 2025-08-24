import express from 'express'
import { upload } from '../middlewares/upload.js'
import authMiddleware from '../middlewares/authMiddleware.js'
//Admin Management of Student, Teacher and Classroom Creation Controllers
import {
    createStudent,
    getAllStudents,
    getStudentById,
    updateStudent,
    deleteStudent,
    createClassroom,
    getAllClassroom,
    getClassroomById,
    createTeacher,
    viewAllTeacher,
    viewTeacherById,
    updateTeacherById,
    uploadStudentsExcel
} from '../controllers/adminController.js'

const adminRouter = express.Router()

//Teacher Management
adminRouter.post('/teachers', authMiddleware, authorizeRoles('admin'), createTeacher)

adminRouter.get('/teachers', authMiddleware, authorizeRoles('admin'), viewAllTeacher)

adminRouter.get('/teachers/:id', authMiddleware, authorizeRoles('admin'), viewTeacherById)

adminRouter.put('/teachers/:id', authMiddleware, authorizeRoles('admin'), updateTeacherById)

//ClassRoom Management
adminRouter.post('/classrooms', authMiddleware, authorizeRoles('admin'), createClassroom)

adminRouter.get('/classrooms', authMiddleware, authorizeRoles('admin'), getAllClassroom)

adminRouter.get('/classrooms/:id', authMiddleware, authorizeRoles('admin'), getClassroomById)

//Student Management
adminRouter.post('/students', authMiddleware, authorizeRoles('admin'), createStudent)

adminRouter.get('/students', authMiddleware, authorizeRoles('admin'), getAllStudents)

adminRouter.get('/students/:id', authMiddleware, authorizeRoles('admin'), getStudentById)

adminRouter.put('/students/:id', authMiddleware, authorizeRoles('admin'), updateStudent)

adminRouter.delete('/students/:id', authMiddleware, authorizeRoles('admin'), deleteStudent)

//Attendance Management
adminRouter.post('/students/upload', authMiddleware, authorizeRoles('admin'), upload.single("file"), uploadStudentsExcel)

export default adminRouter