import mongoose from "mongoose";

const attendanceSchema = new mongoose.Schema({
    user: [{ type: mongoose.Schema.Types.ObjectId, ref: 'user' }],
    classId: { type: mongoose.Schema.Types.ObjectId, ref: 'classroom' },
    date: { type: Date, default: Date.now },
    status: { type: String, enum: ['present', 'absent'], default: 'present' }
})

const attendance = new mongoose.model('attendance', attendanceSchema)

export default attendance