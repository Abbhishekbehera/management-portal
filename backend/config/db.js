//Importing Modules
import mongoose, { connect } from "mongoose";
import dotenv from "dotenv"
//Models
import '../models/user.js'
import '../models/student.js'
import '../models/teacher.js'
import '../models/class.js'
import '../models/subject.js'
//Environmental Variable
dotenv.config()
//Mongo URL Connection
const mongourl = process.env.MONGO_URL

const connectDb = async () => {
    try {
        await mongoose.connect(mongourl)
        console.log("Connected To MongoDB")
    }
    catch (e) {
        console.log("Connection Failed.")
    }
}

export default connectDb