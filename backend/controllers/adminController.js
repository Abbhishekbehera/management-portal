//Importing Modules
import mongoose from 'mongoose'
import user from '../models/user.js'
import student from '../models/student.js'
import bcrypt from 'bcrypt'
import classroom from '../models/classroom.js'
import attendance from '../models/attendance.js'
import XLSX from 'xlsx'
import fs from 'fs'

//Create Teacher Credentials
export const createTeacher = async (req, res) => {
    try {
        const { name, email, password, phoneNumber } = req.body
        if (!name || !email || !password || !phoneNumber) {
            return res.status(400).json({ data: 'All fields are required.' })
        }
        const existingTeacher = await user.findOne({ email })
        if (existingTeacher) {
            return res.status(400).json({ data: 'Teacher already exists.' })
        }
        const hashedPassword = await bcrypt.hash(password, 10)

        const newTeacher = await new user({
            name,
            email,
            password: hashedPassword,
            phoneNumber,
            role: "teacher"
        })
        await newTeacher.save()
        console.log(newTeacher)
        return res.status(201).json({ data: 'Teacher created successfully.', newTeacher })
    }
    catch (e) {
        console.log(e.message)
        return res.status(500).json({ data: 'Server is down while creating teacher.' })
    }
}

//View All Teachers
export const viewAllTeacher = async (req, res) => {
    try {
        const getAllTeacher = await user.find({ role: 'teacher' }).select('-password')
        if (!getAllTeacher) {
            return res.status(404).json({ data: 'No Teacher exists.' })
        }
        console.log(getAllTeacher)
        res.status(200).json({ data: 'Fetched all teacher information', getAllTeacher })
    }
    catch (e) {
        console.log(e.message)
        return res.status(500).json({ data: 'Server is down while fetching all teachers.' })
    }
}

//View Teacher by ID
export const viewTeacherById = async (req, res) => {
    try {
        const getTeacher = await user.findById({ _id: req.params.id, role: 'teacher' }).select('-password')
        if (!getTeacher) {
            return res.status().json({ data: 'Teacher not found.', getTeacher })
        }
        console.log(getTeacher)
        return res.status(200).json({ data: 'Fetched the particular teacher details', getTeacher })
    }
    catch (e) {
        console.log(e.message)
        return res.status(500).json({ data: 'Server is down while fetching the teacher.' })
    }
}

//Update Teacher by ID 
export const updateTeacherById = async (req, res) => {
    try {
        const { email, phoneNumber } = req.body

        let updateData = {}
        if (email) updateData.email = email
        if (phoneNumber) updateData.phoneNumber = phoneNumber

        const updateTeacher = await user.findByIdAndUpdate(
            req.params.id,
            { $set: updateData },
            { new: true }
        ).select("-password") //select("-password") deselective password

        if (!updateTeacher) {
            return res.status(404).json({ data: 'Teacher not found.' })
        }
        console.log(updateTeacher)
        res.json({ data: 'Teacher updated successfully.', updateTeacher })
    }
    catch (e) {
        res.status(500).json({ data: 'Server is down while updating the teacher.', e: error.message })
    }

}

//Create ClassRoom 
export const createClassroom = async (req, res) => {
    try {
        const { standard, section, classTeacher, subject } = req.body;

        if (!standard || !section) {
            return res.status(400).json({ data: 'Standard and Section are required.' })
        }

        if (classTeacher && !mongoose.Types.ObjectId.isValid(classTeacher)) {
            return res.status(400).json({ data: 'Invalid classTeacher ID.' })
        }
        let subjectData = subject
        if (subject && typeof subject === "object") {
            for (const [key, value] of Object.entries(subject)) {
                if (!value.subjectname || !value.teacher) {
                    return res.status(400).json({ data: `Subject '${key}' is missing subjectname or teacher.` })
                }
                if (!mongoose.Types.ObjectId.isValid(value.teacher)) {
                    return res.status(400).json({ data: `Invalid teacher ID for subject '${key}'.` })
                }
                value.teacher = new mongoose.Types.ObjectId(value.teacher)
            }
            subjectData = subject
        }

        const newClassroom = new classroom({
            standard,
            section,
            classTeacher,
            subject: subjectData
        })

        await newClassroom.save()
        console.log(newClassroom)
        res.status(201).json(newClassroom)
    }
    catch (e) {
        console.log(e.message)
        res.status(500).json({ data: 'Server is down while creating classroom', e: e.message })
    }
}

//Get Classroom
export const getAllClassroom = async (req, res) => {
    try {
        let classes = await classroom.find()
            .populate('classTeacher', 'name email')
            .lean();

        for (let cls of classes) {
            for (let [key, subj] of Object.entries(cls.subject || {})) {
                if (subj.teacher) {
                    const teacher = await user.findById(subj.teacher)
                        .select("name email")
                        .lean();
                    subj.teacher = teacher;
                }
            }
        }

        return res.status(200).json({
            data: 'Classroom fetched successfully.',
            GetClass: classes
        });

    } catch (e) {
        console.error(e.message);
        return res.status(500).json({
            data: 'Server is down while getting classroom.',
            e: e.message
        });
    }
};

//Get Classroom by ID
export const getClassroomById = async (req, res) => {
    try {
        let classroomData = await classroom.findById(req.params.id)
            .populate('classTeacher', 'name email')
            .lean();

        if (!classroomData) {
            return res.status(404).json({ data: 'This classroom is not found.' });
        }

        for (let [key, subj] of Object.entries(classroomData.subject || {})) {
            if (subj.teacher) {
                const teacher = await user.findById(subj.teacher)
                    .select("name email")
                    .lean();
                subj.teacher = teacher;
            }
        }

        return res.status(200).json({
            data: 'Classroom fetched successfully.',
            GetClassById: classroomData
        });

    } catch (e) {
        console.error(e.message);
        return res.status(500).json({
            data: 'Server is down while getting classroom.',
            e: e.message
        });
    }
};


// Create Student Credentials
export const createStudent = async (req, res) => {
    try {
        const { name, email, password, phoneNumber, rollNo, classId, dob, guardianName, address } = req.body
        if (!name || !email || !password || !phoneNumber || !rollNo || !classId || !dob || !guardianName || !address) {
            return res.status(400).json({ data: 'All fields are required.' })
        }

        const existingClassroom = await classroom.findById(classId);
        if (!existingClassroom) {
            return res.status(404).json({ data: 'Classroom not found.' })
        }

        const existingUser = await user.findOne({ $or: [{ email }, { phoneNumber }] })
        if (existingUser) {
            return res.status(400).json({ data: 'User already exists.' })
        }

        const existingRoll = await student.findOne({ rollNo })
        if (existingRoll) {
            return res.status(400).json({ message: "Roll number already exists" })
        }

        const hashed = await bcrypt.hash(password, 10);

        const newUser = await user.create({
            name,
            email,
            password: hashed,
            phoneNumber,
            role: 'student'
        });

        const newStudent = await new student({
            principal: req.user?.id || null,
            student: newUser._id,
            rollNo,
            standard: existingClassroom.standard,
            section: existingClassroom.section,
            dob,
            guardianName,
            address
        })
        await newStudent.save()
        console.log(newStudent)
        res.status(201).json({
            data: 'Student Profile created successfully.', newUser, newStudent,
        })
    }
    catch (e) {
        console.log(e.message)
        return res.status(500).json({
            data: 'Cannot create student profile as server is down.', e: e.message
        })
    }
}

//View All Student Information
export const getAllStudents = async (req, res) => {
    try {
        const getStudents = await student.find().populate('student', '-password -role')
        console.log(getStudents)
        return res.status(200).json({ data: 'Fetched all the student information', getStudents })
    }
    catch (e) {
        console.log(e.message)
        return res.status(500).json({ data: 'Cannot fetch all student information.', e: e.message })
    }
}

//View Student by ID
export const getStudentById = async (req, res) => {
    try {
        const studentProfile = await student.findById(req.params.id).populate('student', '-password -role')
        console.log(studentProfile)
        if (!studentProfile) {
            return res.status(404).json({ data: "This student does not exist" })
        }
        res.status(200).json({ data: 'Fetched particular student information successfully.', studentProfile })
    }
    catch (e) {
        console.log(e.message)
        return res.status(500).json({ data: 'Cannot fetch this student profile information.', e: e.message })
    }
}

//Update Specific Student Details 
export const updateStudent = async (req, res) => {
    try {
        const { rollNo, classId, dob, guardianName, address } = req.body
        let updateData = {}
        if (rollNo) updateData.rollNo = rollNo
        if (dob) updateData.dob = new Date(dob)
        if (guardianName) updateData.guardianName = guardianName
        if (address) updateData.address = address
        if (classId) updateData.classId = classId
        const updateStudent = await student.findByIdAndUpdate(req.params.id, { $set: updateData }, { new: true })
        if (!updateStudent) {
            return res.status(404).json({ data: "Student not found." })
        }
        console.log(updateStudent)
        res.json({ data: "Student updated successfully", updateStudent })
    }
    catch (e) {
        res.status(500).json({ data: 'Server down while updating the student profile', e: error.message })
    }
}

//Delete Specific Student Details
export const deleteStudent = async (req, res) => {
    try {
        const delStudent = await student.findById(req.params.id)
        if (!delStudent) {
            return res.status(404).json({ data: 'Student not found' })
        }
        await user.findByIdAndDelete(delStudent.student);
        await student.deleteOne();

        return res.status(202).json({ data: 'Deleted particular student profile successfully.', delStudent })
    }
    catch (e) {
        return res.status().json({
            data: 'Server error during deletion.',
            e: e.message
        })
    }
}

//Upload Excel of Students
export const uploadStudentsExcel = async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ data: "No file uploaded." })
        }

        const filePath = req.file.path

        const workbook = XLSX.readFile(filePath)
        const sheetName = workbook.SheetNames[0]
        const sheetData = XLSX.utils.sheet_to_json(workbook.Sheets[sheetName])

        if (!sheetData.length) {
            fs.unlinkSync(filePath) // Delete file
            return res.status(400).json({ data: "Excel file is empty." })
        }

        const students = sheetData.map(row => ({
            name: row.Name,
            email: row.Email,
            rollNo: row.RollNo,
            classId: row.ClassId, dob: row.DOB ? new Date(row.DOB) : null
        }))

        // Save to DataBase
        await student.insertMany(students)

        // Delete file after saving
        fs.unlinkSync(filePath)

        return res.status(201).json({ data: "Students uploaded in excel successfully.", totalInserted: students.length })

    }
    catch (e) {
        console.error(e)
        res.status(500).json({ data: "Server error while uploading students", e: e.message })
    }
}

//Create Attendance
export const createAttendance = async (req, res) => {

}