import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true },
    password: String,
    role: { type: String, enum: ["admin", "teacher", "student"] }
})

const user=new mongoose.model("user",userSchema)

export default user