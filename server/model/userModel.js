import mongoose from "mongoose"


const userSchema = new mongoose.Schema ({
    name: {
        type:String,
        required:true,
        unique:false
    },
    password: {
        type:String,
        required:true,
        unique:false
    },
    email: {
        type:String,
        required:true,
        unique: true
    },
    description: {
        type: String,
        required: false,
        unique:false
    },
    profilepicture: {
        type:String,
        required: false,
        unique:false
    }
})

export default mongoose.model("Users", userSchema)