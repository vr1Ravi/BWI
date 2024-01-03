import mongoose from "mongoose";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, "Please enter a name"],
    },
    role: {
        type: String
    },
    avatar:{
        public_id: String,
        url: String,
    },
    email:{
        type: String,
        required: [true, "Please enter an email"],
        unique:[true, "Email already exists"]
    },
    password: {
        type: String,
        required: [true, "Please enter a password"],
        minLength: [8, "Password must be greater than 7"]
    },
    phone:{
        type: Number
    }
});
userSchema.pre("save", async function(){
    if(this.isModified("password")){
        this.password = await bcrypt.hash(this.password, 10)
    }
})
userSchema.methods.matchPassword = async function (password){
    try {
        
        return await bcrypt.compare(password, this.password);
    } catch (error) {
        return false;
    }
}
userSchema.methods.generateToken = async function(){
    return  jwt.sign({_id: this._id}, process.env.JWT_SECRET)
}

export const User = mongoose.model("User", userSchema);