import mongoose from 'mongoose'


const classSchema = new mongoose.Schema({
    className: { type: String, required: true, unique: true },
    student: [{ type: mongoose.Schema.Types.ObjectId, ref: "student" }],
    classTeacher: { type: mongoose.Schema.Types.ObjectId, ref: "teacher" },
})

const classroom = new mongoose.model("classroom", classSchema)

export default classroom