import mongoose, { mongo } from 'mongoose'
import homeWork from '../models/homework.js'
import classroom from '../models/classroom.js'
import student from '../models/student.js'
import timetable from '../models/timetable.js'


//Class Teacher Management -> Student Remarks
export const studentRemarks = async (req, res) => {
    try {
        // const teacherId = req.user.id
        // if (!teacherId) {
        //     return res.status(400).json({ data: 'TeacherId is requried.' })
        // }
        const studentID = new mongoose.Types.ObjectId(req.query.student)
        const { commonRemarks } = req.body
        if (!commonRemarks) {
            return res.status(400).json({ data: 'Common Remarks need to be filled.' })
        }
        const studentData = await student.findById(studentID)
        if (!studentData) {
            return res.status(404).json({ data: 'Student not found.' })
        }
        const newRemark = new student({ commonRemarks })
        await newRemark.save();
        res.status(200).json({
            data: 'Successfully wrote remark for the student.',
            remark: newRemark
        })
    }
    catch (e) {
        console.error(e)
        res.status(500).json({ data: 'Server error while writing the remarks.' })
    }
}

//Class Teacher Management -> Common Notes
export const createNotes = async (req, res) => {
    try {
        // const teacherId = req.user.id
        // if (!teacherId) {
        //     return res.status(400).json({ data: 'TeacherId is requried.' })
        // }
        const classID = new mongoose.Types.ObjectId(req.query.classId)
        const { commonNote } = req.body
        if (!classID) {
            return res.status(400).json({ data: 'ClassId is required.' })
        }
        let noteList = await homeWork.findOne({
            classRoom: classID,
            commonNote
        });

        if (!noteList) {
            noteList = new homeWork({
                classRoom: classID,
                commonNote
            });
        }
        await noteList.save()
        res.status(200).json({
            data: 'Successfully created common notes.',
            notice: commonNote
        })
    }
    catch (e) {
        console.error(e)
        res.status(500).json({ data: 'Server error while creating commonNote.' })
    }
}

//Class Teacher Management -> Create Timetable
export const createTimeTable = async (req, res) => {
    try {
        // const teacherId = req.user.id
        // if (!teacherId) {
        //     return res.status(400).json({ data: 'TeacherId is requried.' })
        // }
        const { classId, schedule } = req.body
        let existingTimetable = await timetable.findOne({ classRoom: classId })
        if (!existingTimetable) {
            existingTimetable = new timetable({
                classRoom: classId,
                schedule
            })
        } else {
            existingTimetable.schedule = schedule
        }
        await existingTimetable.save()
        res.status(200).json({ data: 'Successfully created timetable.' })
    } catch (e) {
        console.error(e)
        res.status(500).json({ data: 'Server error while creating timetable.' })
    }
}

//Subject Teacher Management -> Create Homework
export const createHomework = async (req, res) => {
    try {
        const classId = new mongoose.Types.ObjectId(req.query.classId);
        const { subject, description } = req.body;

        if (!classId || !subject || !description) {
            return res.status(400).json({ data: "ClassId, subject, and description are required." });
        }

        // Normalize date to only keep YYYY-MM-DD
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        let homeWorkList = await homeWork.findOne({
            classRoom: classId,
            date: today
        });

        if (!homeWorkList) {
            homeWorkList = new homeWork({
                classRoom: classId,
                date: today,
                homeWork: new Map(),
            });
        }

        // Add/Update homework for the subject
        homeWorkList.homeWork.set(subject, { subject, description });

        await homeWorkList.save();

        res.status(200).json({
            data: "Successfully created Homework.",
            homeWork: homeWorkList
        });
    } catch (e) {
        console.error(e);
        res.status(500).json({ data: "Server error while creating homework." });
    }
}

//Subject Teacher Management -> Write Remarks and Improvement
export const writeRemarks = async (req, res) => {
    try {
        // const teacherId = req.user.id
        // if (!teacherId) {
        //     return res.status(400).json({ data: 'TeacherId is requried.' })
        // }
        console.log(req.query)
        const studentId = new mongoose.Types.ObjectId(req.query.student)
        const { subjectName, remark } = req.body
        if (!subjectName && !remark) {
            res.status(400).json({ data: 'Fill the details.' })
        }
        const studentData = await student.findById(studentId)
        console.log(studentId)
        if (!studentData) {
            return res.status(404).json({ data: 'Student not found.' })
        }
        studentData.subjectWiseRemark.push({ subjectName, remark })
        await studentData.save()
        res.status(200).json({
            data: 'Successfully written remarks for the subject.',
            student: studentData
        })
    }
    catch (e) {
        console.error(e)
        res.status(500).json({ data: 'Server is down while writing remarks.' })
    }
}