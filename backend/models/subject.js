import mongoose from "mongoose";

const subjectSchema = new mongoose.Schema({
    subjectName: String,
    assignedTeacher: { type: mongoose.Schema.Types.ObjectId, ref: "teacher" },
})

const subject = new mongoose.model('subject', subjectSchema)

export default subject