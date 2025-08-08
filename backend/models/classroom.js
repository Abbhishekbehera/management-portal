import mongoose from 'mongoose'


const classSchema = new mongoose.Schema({
    standard: { type: String, required: true, },
    section: { type: String, required: true, },
    classTeacher: { type: mongoose.Schema.Types.ObjectId, ref: "user" },
    subject: {
        type: Map,
        of: new mongoose.Schema({
            subjectname: { type: String, required: true },
            teacher: { type: mongoose.Schema.Types.ObjectId, ref: 'user', required: true }
        }, { _id: false }),
        default: {}
    }
})
const classroom = new mongoose.model("classroom", classSchema)

export default classroom