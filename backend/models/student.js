import mongoose from "mongoose";


const studentSchema = new mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: "user" },
    rollNo: { type: String, required: true, unique: true },
    className: { type: mongoose.Schema.Types.ObjectId, ref: "classroom" },
    dob: String,
    guardianName: { type: String, required: true, unique: true },
    address: String
})

const student = new mongoose.model("student", studentSchema)

export default student