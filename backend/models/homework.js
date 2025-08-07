import mongoose, { Mongoose } from "mongoose";

const homeWorkSchema = new mongoose.Schema({
    classRoom: { type: mongoose.Schema.Types.ObjectId, ref: 'classroom' },
    date: Date,
    homeWork: {
        type: Map,
        of: new mongoose.Schema({ description: String, title: String }),
        default: {}
    }

})

const homeWork = new mongoose.model('homeWork', homeWorkSchema)

export default homeWork