//Importing Modules
import mongoose, { connect } from "mongoose";
import dotenv from "dotenv"
import '../models/user.js'

dotenv.config()
//Mongo URL Connection
const mongourl = process.env.MONGO_URL

const connectDb = async () => {
    try {
        await mongoose.connect(mongourl)
        console.log("Connected To MongoDB")
    }
    catch(e){
        console.log("Connection Failed.")
    }
}

export default connectDb