import mongoose from "mongoose";
import user from "../models/user.js"
import attendance from "../models/attendance.js";
import homework from "../models/homework.js";
import student from '../models/student.js'
import leave from "../models/leave.js";
import Redis from 'ioredis';
import axios from 'axios';
import dotenv from 'dotenv';
import nodemailer from 'nodemailer'
import jwt from 'jsonwebtoken'
import student from "../models/student.js";

dotenv.config()

//Secret Key
const secret_key = process.env.SECRET

//Redis 
const redis = new Redis()


function generateOTP() {
    return Math.floor(1000000 + Math.random() * 9000000)
}

//Register Management of the Student
export const registerStudent = async (req, res) => {
    try {
        const { name, phoneNumber, role } = req.body
        const Student = await user.findOne({ name: name, phoneNumber: phoneNumber, role: role })
        if (!Student) {
            return res.status(400).json({ data: 'Student not found.' })
        }
        const otp = generateOTP()
        await redis.set(`otp:${phoneNumber}`, otp, "Ex", 300)
        const transporter = nodemailer.createTransport({
            secure: false, // true for port 465, false for other ports
            host: "smtp.gmail.com",
            port: 587,
            auth: {
                user: process.env.USER_EMAIL,
                // pass: "ykce lxeb uyzd mazs"
                pass: process.env.USER_PASSWORD
            },
        });

        // Async function to send mail
        const sendMail = async () => {
            try {
                const info = await transporter.sendMail({
                    from: "Abbhishek Behera",
                    to: Student.email,
                    subject: "Hello ✔",
                    text: `${otp}`, // plain text
                    html: `<h3>Your OTP is:</h3> <b>${otp}</b>` // HTML body
                });

                console.log("Message sent:", info.messageId);
            } catch (error) {
                console.error("Error sending email:", error);
            }
        };

        sendMail();
        res.status(200).json({ data: 'OTP send successfully.' })
    }
    catch (e) {
        console.log(e)
        res.status(500).json({ data: 'Server is down while generating OTP.' })
    }
}

//Verification
export const verifyOTP = async (req, res) => {
    try {
        const { name, phoneNumber, otp } = req.body
        const storedOTP = await redis.get(`otp:${phoneNumber}`)
        console.log(storedOTP, otp)
        if (!storedOTP) {
            return res.status(400).json({ data: 'OTP not found.' })
        }
        if (storedOTP !== otp) {
            return res.status(400).json({ data: 'OTP is wrong.' })
        }
        console.log("dsadf")
        await redis.del(`otp:${phoneNumber}`)
        console.log("Ok")
        const user = await user.findOne({ name: name, phoneNumber: phoneNumber, role: 'student' })
        console.log(user)

        const studentDoc= await student.find({student:user._id})
        const classId= student.classId
        const  studenData={}

        studenData._id=user?._id
        studenData.classId= studentDoc?.classId


        const token = jwt.sign({
            studenData,
        }, secret_key, { expiresIn: '5h' })
        res.status(200).json({ token })
    }
    catch (e) {
        console.error
        res.status(500).json({ data: 'Server error while verifying otp.' })
    }
}

//Overall Attendance
export const getOverallAttendance = async (req, res) => {
    try {
        const studentId = req.user?.id || req.query.studentId
        const classId = req.query.classId
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
        const totalDays = await attendance.countDocuments({ user: { $in: [studentId] }, ...dateFilter })
        const presentDays = await attendance.countDocuments({ user: { $in: [studentId] }, status: 'present', ...dateFilter })
        const absentDays = await attendance.countDocuments({ user: { $in: [studentId] }, status: 'absent', ...dateFilter })

        const percentage = totalDays > 0 ? ((presentDays / totalDays) * 100).toFixed(2) : "0.00"

        res.status(200).json({
            data: 'Successfull in fetching the attendance of the student.',
            totalDays,
            presentDays,
            absentDays,
            percentage
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
        const classId = req.query.classId
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
        const homeworkList = await homework.find({ classId: classId, ...dateFilter })
        if (!homeworkList.length) {
            return res.status(404).json({ data: 'No homework found for this class.' })
        }
        console.log(homeworkList)
        console.log(homeworkList.length)
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
        const classId = req.query.classId
        if (!classId) {
            return res.status(400).json({ data: 'ClassId required.' })
        }
        const startDate = new Date();
        startDate.setHours(0, 0, 0, 0)
        const endDate = new Date()
        endDate.setHours(23, 59, 59, 999)
        const Homework = await homework.find({
            classId: classId,
            date: { $gte: startDate, $lte: endDate }
        })
        if (!Homework.length) {
            return res.status(404).json({ data: 'No homework found.' })
        }
        console.log(Homework)
        console.log(Homework.length)
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
        const studentId = req.user.id
        // const studentId = req.query.studentId
        const studentData = await student.findById(studentId).select('commonRemarks subjectWiseRemark')
        if (!studentData) {
            return res.status(404).json({ data: 'Student data not found.' })
        }
        res.status(200).json({ data: 'Successfully fetched remarks.', commonRemarks: studentData.commonRemarks, subjectWiseRemark: studentData.subjectWiseRemark })
    }
    catch (e) {
        console.log(e)
        res.status(500).json({ data: 'Server error while fetching remarks.', e: e.message })
    }
}

//Leave Management -> By Students
export const applyLeave = async (req, res) => {
    try {
        const userId = req.user.id
        const Classroom = req.user.classId
        const { reason, startDate, endDate } = req.body
        if (!reason && !startDate && !endDate) {
            return res.status(404).json({ data: 'All fields are required.' })
        }
        const leaveReq = new leave({
            userId,
            Classroom,
            reason,
            startDate,
            endDate
        })
        await leaveReq.save()
        res.status(201).json({ data: 'Successfully created.', leaveReq: leaveReq })
    }
    catch (e) {
        console.error(e)
        res.status(500).json({ data: "Server error while requesting leave." })
    }
}