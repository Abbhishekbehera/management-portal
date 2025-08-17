import mongoose from "mongoose";
import attendance from "../models/attendance.js";
import homework from "../models/homework.js";
import student from '../models/student.js'


//Overall Attendance
export const getOverallAttendance = async (req, res) => {
    try {
        const studentId = req.user.id
        const classId = new mongoose.ObjectId(req.user.classId)
        const { startdate, endDate } = req.query
        if (!classId && !studentId) {
            return res.status(400).json({ data: 'ClassID and StudentID are required.' })
        }
        let dateFilter = {}
        if (startdate && endDate && startdate !== "all" && endDate !== "all") {
            dateFilter = {
                date: {
                    $gte: new Date(startdate),
                    $lte: new Date(endDate)
                }
            }
        }
        const totalDays = attendance.countDocuments({ classId: classId, ...dateFilter })
        const presentDays = attendance.countDocuments({ user: { $in: [studentId] }, status: 'present', ...dateFilter })
        const absentDays = attendance.countDocuments({ user: { $in: [studentId] }, status: 'absent', ...dateFilter })
        const percentage = totalDays > 0 ? ((presentDays / totalDays) * 100).toFixed(2) : "0.00"
        res.status(200).json({
            data: 'Successfull in fetching the attendance of the student.',
            totalDays: totalDays,
            presentDays: presentDays,
            absentDays: absentDays, percentage: `${percentage}`
        })
    }
    catch (e) {
        console.log(e.message)
        res.status(500).json({ data: 'Server error while getting overall attendance of the student.', e: e.message })
    }
}

//Homework Management Overall
export const viewOverallHomework = async (req, res) => {
    try {
        const classId = req.user.id
        const { startdate, endDate } = req.query
        if (!classId) {
            return res.status(400).json({ data: 'ClassID are required.' })
        }
        let dateFilter = {}
        if (startdate && endDate && startdate !== "all" && endDate !== "all") {
            dateFilter = {
                date: {
                    $gte: new Date(startdate),
                    $lte: new Date(endDate)
                }
            }
        }
        const homeworkList = await homework.find({ classRoom: classId, ...dateFilter })
        if (!homeworkList.length) {
            return res.status(404).json({ data: 'No homework found for this class.' })
        }
        console.log(homeworkList)
        res.status(200).json({ data: 'Successfully fetched homework list.', homework: homeworkList });
    }
    catch (e) {
        console.log(e)
        res.status(500).json({ data: 'Server is down while getting overall homework.', e: e.message })
    }
}

//Homework Management Day-Wise
export const viewDaywiseHomework = async (req, res) => {
    try {
        const classId = req.user.id
        if (!classId) {
            return res.status(400).json({ data: 'ClassId required.' })
        }
        const startdate = new Date();
        startOfDay.setHours(0, 0, 0, 0)
        const enddate = new Date()
        endOfDay.setHours(23, 59, 59, 999)
        const Homework = await homework.find({
            classRoom: classId,
            date: { $gte: startdate, $lte: enddate }
        })
        if (!homework.length) {
            return res.status(404).json({ data: 'No homework found.' })
        }
        console.log(Homework)
        res.status(200).json({ data: 'Successfully fetched day-wise homework.', homework: Homework })
    }
    catch (e) {
        console.error("Error fetching homework by date:", e)
        res.status(500).json({ data: 'Server error while fetching homework.' })
    }
}

//Remarks and Improvement for a subject
export const viewRemarks = async (req, res) => {
    try {
        
    }
    catch (e) {
        console.log(e)
        res.status(500).json({ data: 'Server error while fetching remarks.', e: e.message })
    }
}