//Importing Modules
import user from '../models/user.js'
import student from '../models/student.js'
import bcrypt from 'bcrypt'
import classroom from '../models/classroom.js'


// Create Student Credentials
export const createStudent = async (req, res) => {
    const { name, email, password, rollNo, className, dob, guardianName,     } = req.body;

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
            role: 'student'
        });

        let existingClass = await classroom.findOne({ className });

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
