import mongoose, { Mongoose } from "mongoose";

const homeWorkSchema = new mongoose.Schema({
    classId: { type: mongoose.Schema.Types.ObjectId, ref: 'classroom' },
    date: Date,
    homeWork: {
        type: Map,
        of: new mongoose.Schema({ subject: String, description: String }),
        default: {}
    },
    commonNote: { type: String }

})

const homeWork = new mongoose.model('homeWork', homeWorkSchema)

export default homeWork