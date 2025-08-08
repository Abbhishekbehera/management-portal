import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: String,
    phoneNumber: { type: String, required: true, unique: true },
    school: { type: String },
    role: { type: String, required: true, enum: ["admin", "teacher", "student"] }

})

const user = new mongoose.model("user", userSchema)

export default user