import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken"
import crypto from "crypto"
const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, "Please enter a your name"],
        maxLength: [50, "Your name cann't exceed 50 characters"]
    },
    email: {
        type: String,
        required: [true, "Please enter Your Email"],
        unique:true,
        match: [/.+\@.+\..+/, "Please enter a valid Email"]
    },
    password: {
        type: String,
        required: [true, "Please enter your Password"],
        minLength: [6, "Your Password must be longer then 6 characters"],
        select:false
    },
    avatar: {
        public_id: {
            type: String,
        },
        url: {
            type: String,
        }
    },
   role:{
    type: String,
    default:"user",
   },
   resetPasswordToken: String,
   resetPasswordExpire: Date
},{timestamps:true});
userSchema.pre("save",async function (next) {
    if(!this.isModified("password")){
        next();
    }
    this.password = await bcrypt.hash(this.password,10);
})
// return jwt token
userSchema.methods.getJwtToken = function(){
   return jwt.sign({
        id:this._id,
    },
    process.env.JWT_SECRET,{
        expiresIn: process.env.JWT_EXPIRE_TIME
    }
)

}
userSchema.methods.comparePassword = async function(enteredPassword){
    return await bcrypt.compare(enteredPassword, this.password);
}
userSchema.methods.getResetPasswordToken = async function(){
    const resetToken =  crypto.randomBytes(20).toString("hex");
    this.resetPasswordToken = crypto.createHash("sha256").update(resetToken).digest("hex");
    this.resetPasswordExpire = Date.now() + 30 * 60 * 1000; // 30 minutes
    return resetToken;
}
export default mongoose.model("User",userSchema);
