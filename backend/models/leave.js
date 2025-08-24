import mongoose from 'mongoose'

const leaveSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "user" },
    classId: { type: mongoose.Schema.Types.ObjectId, ref: "classroom" },
    reason: { type: String, required: true },
    status: { type: String, enum: ['pending', 'approved', 'declined'], default: 'pending' },
    startDate: { type: Date, required: true },
    endDate: { type: Date, required: true }
})

const leave = new mongoose.model('leave', leaveSchema)

export default leave