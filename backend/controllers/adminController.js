//Importing Modules
import mongoose from 'mongoose'
import user from '../models/user.js'
import student from '../models/student.js'
import bcrypt from 'bcrypt'
import classroom from '../models/classroom.js'

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
        const updates = req.body
        delete updates.role //Dont change the role
        delete updates.password //Dont change the password

        const updateTeacher = await user.findOneAndUpdate(
            { _id: req.params.id, role: "teacher" },
            updates,
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

        if (subject && typeof subject === "object") {
            for (const [key, value] of Object.entries(subject)) {
                if (!value.subjectname || !value.teacher) {
                    return res.status(400).json({ data: `Subject '${key}' is missing subjectname or teacher.` })
                }
                if (!mongoose.Types.ObjectId.isValid(value.teacher)) {
                    return res.status(400).json({ data: `Invalid teacher ID for subject '${key}'.` })
                }
            }
        }

        const newClassroom = new classroom({
            standard,
            section,
            classTeacher,
            subject
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
        const GetClass = await classroom.find().populate('classTeacher', 'name email').populate({
            path: "subject",
            populate: {
                path: "teacher",
                model: "user",
                select: "name email"
            }
        })
        console.log(GetClass)
        return res.status(200).json({ data: 'Classroom fetched Succcessfully.', GetClass })
    }
    catch (e) {
        console.log(e.message)
        return res.status(500).json({ data: 'Server is down while getting classroom.', e: e.message })
    }
}

//Get Classroom by ID
export const getClassroomById = async (req, res) => {
    try {
        const GetClassById = await classroom.findById(req.params.id).populate('classTeacher', 'name email').populate({
            path: "subject",
            populate: {
                path: "teacher",
                model: "user",
                select: "name email"
            }
        })
        if (!GetClassById) {
            return res.status(404).json({ data: 'This classroom is not found.' })
        }
        console.log(GetClassById)
        return res.status(200).json({ data: 'Classroom fetched Succcessfully.', GetClassById })
    }
    catch (e) {
        console.log(e.message)
        return res.status().json({ data: 'Server is down while getting classroom.', e: e.message })
    }
}

// Create Student Credentials
export const createStudent = async (req, res) => {
    const { name, email, password, phoneNumber, rollNo, standard, section, dob, guardianName, address } = req.body;

    try {
        const studentExists = await user.findOne({ email });
        if (studentExists) {
            return res.status(400).json({ data: 'Student Profile already exists.' });
        }

        const hashed = await bcrypt.hash(password, 10);

        const newUser = await user.create({
            name,
            email,
            password: hashed,
            phoneNumber,
            role: 'student'
        });

        let existingClass = await classroom.findOne({ classId });

        if (!existingClass) {
            existingClass = await classroom.create({
                className,
            });
        }

        const newStudent = await student.create({
            user: newUser._id,
            rollNo,
            className: existingClass._id,
            dob,
            guardianName,
            address
        });

        //Push student into classroom's student array
        await classroom.findByIdAndUpdate(
            existingClass._id,
            { $push: { student: newStudent._id } },
            { new: true }
        );

        res.status(201).json({
            data: 'Student Profile created successfully.',
            newUser,
            newStudent,
            classAssigned: existingClass.className
        });
    }
    catch (e) {
        console.log("Error:", e.message);
        return res.status(500).json({
            e: 'Cannot create student profile as server is down.',
            message: e.message
        });
    }
};

//View All Student Information
export const getStudents = async (req, res) => {
    try {
        const students = await student.find().populate('user', 'name email').populate('className', 'className')
        console.log(students)
        return res.status(200).json({ data: 'Fetched all the student information', info: students })
    }
    catch (e) {
        console.log("Error:", e.message)
        return res.status(500).json({ e: 'Cannot fetch student information.', e: e.message })
    }
}

//View Specific Student
export const studentInfo = async (req, res) => {
    try {
        const studentProfile = await student.findById(req.params.id).populate('user', 'name email').populate('className', 'className')
        console.log(studentProfile)
        if (!studentProfile) {
            return res.status(404).json({ data: "This student does not exist" })
        }
        res.status(200).json({ data: studentProfile })
    }
    catch (e) {
        console.log(e.message)
        return res.status(500).json({ data: 'Cannot fetch this student profile information.', e: e.message })
    }
}

//Update Specific Student Details
export const updateStudent = async (req, res) => {
    const { name, email, password, rollNo, className, dob, guardianName, address } = req.body;
    try {
        const existingStudent = await student.findById(req.params.id);
        if (!existingStudent) {
            return res.status(404).json({ data: 'Student not found.' });
        }
        const existingUser = await user.findById(existingStudent.user);
        if (!existingUser) {
            return res.status(404).json({ message: 'User not found.' });
        }
        // Update User Details
        if (name) existingUser.name = name;
        if (email) existingUser.email = email;
        if (password) {
            const hashedPass = await bcrypt.hash(password, 10);
            existingUser.password = hashedPass;
        }
        await existingUser.save();

        let newClass = existingStudent.className;
        if (className) {
            const classExists = await classroom.findOne({ className });
            if (!classExists) {
                newClass = (await classroom.create({ className }))._id;
            }
            else {
                newClass = classExists._id;
            }

            //Remove from old class, push into new class
            await classroom.updateOne(
                { _id: existingStudent.className },
                { $pull: { student: existingStudent._id } }
            );
            await classroom.updateOne(
                { _id: newClass },
                { $addToSet: { student: existingStudent._id } }
            );
        }

        // Update Student details
        existingStudent.rollNo = rollNo ?? existingStudent.rollNo; //If rollNo is given take it,Otherwise use the existing rollNo
        existingStudent.className = newClass;
        existingStudent.dob = dob ?? existingStudent.dob;
        existingStudent.guardianName = guardianName ?? existingStudent.guardianName;
        existingStudent.address = address ?? existingStudent.address;

        await existingStudent.save();

        console.log(existingStudent)
        res.status(200).json({
            data: 'Student profile details updated successfully.',
            student: existingStudent
        });

    } catch (e) {
        console.log("Update Error:", e.message);
        return res.status(500).json({
            data: 'Server error during update.',
            e: e.message
        });
    }
};

//Delete Specific Student Details
export const deleteStudent = async (req, res) => {
    try {
        const delStudent = await student.findById(req.params.id)
        if (!delStudent) {
            return res.status(404).json({ data: 'Student not found' })
        }
        await classroom.findByIdAndUpdate(
            delStudent.className,
            { $pull: { student: delStudent._id } },
            { new: true }
        );
        await user.findByIdAndDelete(delStudent.user)
        await student.findByIdAndDelete(req.params.id)

        return res.status(202).json({ data: 'Deleted particular student profile successfully.', delStudent })
    }
    catch (e) {
        return res.status().json({
            data: 'Server error during deletion.',
            e: e.message
        })
    }
}

//Upload Student Details in Excel
