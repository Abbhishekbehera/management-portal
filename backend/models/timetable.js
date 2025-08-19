import mongoose from "mongoose";

const timeSlotSchema = new mongoose.Schema({
  day: {
    type: String,
    enum: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"],
    required: true,
  },
  periods: [
    {
      periodNumber: { type: Number, required: true }, // 1st, 2nd, 3rd period
      subjectName: { type: String, required: true },
      teacher: { type: mongoose.Schema.Types.ObjectId, ref: "Teacher", required: true },
      startTime: { type: String, required: true }, // "09:00 AM"
      endTime: { type: String, required: true },   // "09:45 AM"
    },
  ],
});

const timetableSchema = new mongoose.Schema({
  classRoom: { type: mongoose.Schema.Types.ObjectId, ref: "Classroom", required: true },
  schedule: [timeSlotSchema], // one per day
});

export default mongoose.model("timetable", timetableSchema);