import mongoose from "mongoose";

const studentSchema = new mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: "user" },
    rollNo: String,
    section: { type: mongoose.Schema.Types.ObjectId, ref: "classroom" },
    dob: String,
    guardianName: String,
    address: String
})

const student = new mongoose.model("student", studentSchema)

export default student