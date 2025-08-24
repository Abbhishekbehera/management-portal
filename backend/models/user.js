import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String },
    password: String,
    phoneNumber: { type: String, unique: true }, //login purpose with phoneNumber send otp to the registered number of the student and generate token
    school: { type: String },
    role: { type: String, required: true, enum: ["admin", "teacher", "student"] }
})

const user = new mongoose.model("user", userSchema)

export default user