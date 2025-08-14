import mongoose from "mongoose";
import attendance from "../models/attendance.js";
import homework from "../models/homework.js";


//Overall Attendance
export const getOverallAttendance = async (req, res) => {
    try {
        const studentId = mongoose.Schema.Types.ObjectId(req.user.id)
        const presentRecords = await attendance.find({
            user: studentId,
            status: 'present'
        })
        const absentRecords = await attendance.find({
            user: studentId,
            status: 'absent'
        })
        const totalDays = presentRecords.length + absentRecords.length;
        const presentDays = presentRecords.length
        const absentDays = absentRecords.length
        if (totalDays == 0) {
            return res.status(404).json({ data: 'No attendance is record found.' })
        }
        const percentage = ((presentDays / totalDays) * 100).toFixed(2)
        res.status(200).json({ data: 'Successfull in fetching the attendance of the student.', totalDays: totalDays, presentDays: presentDays, absentDays: absentDays, percentage: `${percentage}` })
    }
    catch (e) {
        console.log(e.message)
        res.status(500).json({ data: 'Server error while getting overall attendance of the student.', e: e.message })
    }
}

//Day-Wise Attendance
export const getDayWiseAttendance = async (req, res) => {
    try {
        const studentId = mongoose.Schema.Types.ObjectId(req.user.id)
        const records = await attendance.find({
            user: studentId
        }).select('data status -_id').sort({ date: -1 })
        if (!records.length) {
            return res.status(404).json({ data: 'No attendance record is found.' })
        }

        res.json({ data: 'Successfull in fetching the attendance of the student.', record: records })
    }
    catch (e) {
        console.log(e.message)
        res.status(500).json({ data: 'Server error while getting the day-wise attendance of the student.', e: e.message })
    }
}

//Homework Management by Subject and Date
export const viewHomeWork = async (req, res) => {
    try {
        const studentId = req.user._id
        const student = await student.findById(studentId).populate('classroom')
        if (!student) {
            return res.status(404).json({ data: 'Student does not exist.' })
        }
        let query = { classroom: student.classroom._id };
        if (date) {
            const start = new Date(date);
            start.setHours(0, 0, 0, 0);

            const end = new Date(date);
            end.setHours(23, 59, 59, 999);

            query.date = { $gte: start, $lte: end };
        }
        const getHomework = await homework.find(query).populate('classroom')
        if (!getHomework.length) {
            return res.status(404).json({ data: 'No Homework found.' })
        }
        res.status(200).json({ data: 'Successfully got the homework of the student.', homework: getHomework })
    }
    catch (e) {
        console.log(e.message)
        return res.status(500).json({ data: 'Server error while fetching the homework.', e: e.message })
    }
}

//Remarks and Improvement for a subject