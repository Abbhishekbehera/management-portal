import mongoose from "mongoose";


const studentSchema = new mongoose.Schema({
    principal: { type: mongoose.Schema.Types.ObjectId, ref: "user" },
    student: { type: mongoose.Schema.Types.ObjectId, ref: "user" },
    rollNo: { type: String, required: true, unique: true },
    standard: { type: String, required: true },
    section: { type: String, required: true },
    classId: { type: mongoose.Schema.Types.ObjectId, ref: "classroom" },
    dob: Date,
    guardianName: { type: String, required: true },
    address: String
})

const student = new mongoose.model("student", studentSchema)

export default student