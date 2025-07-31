import mongoose from "mongoose";

const teacherSchema = new mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: "user" },
    subject: { type: mongoose.Schema.Types.ObjectId, ref: "subject" },
    assignedClass: { type: mongoose.Schema.Types.ObjectId, ref: "classroom" },
    isClassTeacher: { type: Boolean, default: false }
})

const teacher = new mongoose.model("teacher", teacherSchema)

export default teacher