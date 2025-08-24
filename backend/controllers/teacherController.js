import mongoose, { mongo } from 'mongoose'
import homeWork from '../models/homework.js'
import student from '../models/student.js'
import timetable from '../models/timetable.js'
import attendance from '../models/attendance.js'


//Class Teacher Management -> Student Remarks
export const studentRemarks = async (req, res) => {
    try {
        const teacherId = req.user.id
        if (!teacherId) {
            return res.status(400).json({ data: 'TeacherId is requried.' })
        }
        const studentID = new mongoose.Types.ObjectId(req.query.student)
        const { commonRemarks } = req.body
        if (!commonRemarks) {
            return res.status(400).json({ data: 'Common Remarks need to be filled.' })
        }
        const studentData = await student.findByIdAndUpdate(studentID, { commonRemarks }, { new: true })
        if (!studentData) {
            return res.status(404).json({ data: 'Student not found.' })
        }

        res.status(200).json({
            data: 'Successfully wrote remark for the student.',
            remark: studentData
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
        const teacherId = req.user.id
        if (!teacherId) {
            return res.status(400).json({ data: 'TeacherId is requried.' })
        }
        console.log(req.query)
        const classId = new mongoose.Types.ObjectId(req.query.classId)
        const { commonNote } = req.body
        if (!classId) {
            return res.status(400).json({ data: 'ClassId is required.' })
        }
        const startDate = new Date()
        startDate.setHours(0, 0, 0, 0)
        const endDate = new Date()
        endDate.setHours(23, 59, 59, 999)

        const updateData = await homeWork.findOneAndUpdate({ classId: classId, date: { $gte: startDate, $lte: endDate } }, { $set: { commonNote } }, { new: true, upsert: true })
        res.status(200).json({
            data: 'Successfully created common notes.',
            notice: updateData.commonNote
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
        const teacherId = req.user.id
        if (!teacherId) {
            return res.status(400).json({ data: 'TeacherId is requried.' })
        }
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

//Class Teacher Management -> Mark Attendance
export const markAttendance = async (req, res) => {
    try {
        const teacherId = req.user.id
        if (!teacherId) {
            return res.status(400).json({ data: 'TeacherId is requried.' })
        }
        const classId = new mongoose.Types.ObjectId(req.query.classId)
        const { user, status } = req.body
        if (!classId && user && status) {
            return res.status(400).json({ data: 'These fields are required.' })
        }
        const markAttendance = new attendance({
            user,
            classId,
            date: new Date(),
            status
        })
        await markAttendance.save()
        res.status(200).json({
            data: 'Successfully marked down the attendance.',
            attendanceData: markAttendance
        })
    }
    catch (e) {
        console.error(e)
        res.status(500).json({ data: 'Server is down while marking attendance.' })
    }
}

//Class Teacher Management -> List of Overall Attendance of Students
export const attedanceOfStudents = async (req, res) => {
    try {
        const teacherId = req.user.id
        if (!teacherId) {
            return res.status(400).json({ data: 'TeacherId is requried.' })
        }
        console.log(req.query.classId)
        const classId = new mongoose.Types.ObjectId(req.query.classId)
        if (!classId) {
            return res.status(400).json({ data: 'ClassId is required.' })
        }
        const records = await attendance.aggregate([{ $match: { classId: classId } },
        { $unwind: "$user" },
        {
            $group: {
                _id: { user: "$user", status: "$status" }, count: { $sum: 1 }
            }
        }, { $group: { _id: "$_id.user", stats: { $push: { status: "$_id.status", count: "$count" } } } }
            , { $lookup: { from: "users", localField: "_id", foreignField: "_id", as: "user" } },
        { $unwind: "$user" },
        { $project: { _id: 0, userName: "$user.name", stats: 1 } }])
        console.log(records)
        if (!records.length) {
            return res.status(404).json({ data: 'Attendance not found.' })
        }
        res.status(200).json({
            data: 'Successfully fetched overall attendance of the students.',
            records: records
        })
    }
    catch (e) {
        console.error(e)
        res.status(500).json({ data: 'Server error while fetching overall attendance of the students.' })
    }
}

//Subject Teacher Management -> Create Homework
export const createHomework = async (req, res) => {
    try {
        const classId = new mongoose.Types.ObjectId(req.query.classId);
        const { subject, description } = req.body;

        if (!classId && !subject && !description) {
            return res.status(400).json({ data: "ClassId, subject, and description are required." });
        }

        // Normalize date to only keep YYYY-MM-DD
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const todayEnd = new Date()
        todayEnd.setHours(23, 59, 59, 999)
        let homeWorkList = await homeWork.findOne({
            classId: classId,
            date: { $gte: today, $lte: todayEnd }
        });

        if (!homeWorkList) {
            homeWorkList = new homeWork({
                classId: classId,
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
        const teacherId = req.user.id
        if (!teacherId) {
            return res.status(400).json({ data: 'TeacherId is requried.' })
        }
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