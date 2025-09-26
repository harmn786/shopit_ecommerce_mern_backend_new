import catchAsyncErrors from "../middlewares/catchAsyncErrors.js";
import User from "../models/User.js";
import { delete_file, upload_file } from "../utils/cloudinary.js";
import { getResetPasswordTemplate } from "../utils/emailTemplate.js";
import ErrorHandler from "../utils/errorHandler.js";
import { sendEmail } from "../utils/sendEmail.js";
import sendToken from "../utils/sendToken.js";
import crypto from "crypto";

export const registerUser = catchAsyncErrors(async (req,res)=>{
    const {name,email,password}= req.body;
    const user = await User.create({
        name,email,password,
    })
    sendToken(user,201,res)
    // const token = user.getJwtToken();
    // res.status(201).json({
    //     token: token,
    //     success:true
    // })
})
export const loginUser = catchAsyncErrors(async (req,res,next)=>{
    const {email,password}= req.body;
    if(!email || !password){
        return next(new ErrorHandler('Please enter email and password',400))
    }
    // find user
    const user = await User.findOne({email}).select("+password");
    if(!user){
        return next(new ErrorHandler('Invalid email or password',401))
    }
    const isPasswordMatched = await user.comparePassword(password);
    if(!isPasswordMatched){
        return next(new ErrorHandler('Invalid email or password',401))
    }
    sendToken(user,201,res)
    // const token = user.getJwtToken();
    // res.status(201).json({
    //     token: token,
    //     success:true
    // })
})
export const logoutUser = catchAsyncErrors(async (req,res,next)=>{
   res.cookie("token",null,{
       expires: new Date(Date.now()),
       httpOnly:true
   })
   res.status(200).json({
       success:true,
       message:"Logged out successfully"
   })
})

export const uploadAvatar = catchAsyncErrors(async (req,res,next)=>{
    const avatarResponse = await upload_file(req?.body?.avatar,'shopit/avatars')
    if(req?.user?.avatar?.url){
        await delete_file(req?.user?.avatar?.public_id)
    }
    const user = await User.findByIdAndUpdate(req?.user?._id,{
        avatar:avatarResponse,
    })
   res.status(200).json({
       user
   })
})
export const forgotPassword = catchAsyncErrors(async (req,res,next)=>{
    // find user
    const user = await User.findOne({email:req.body.email});
    if(!user){
        return next(new ErrorHandler('User not found with this email you have entered',401))
    }
   const resetToken = await user.getResetPasswordToken();

   await user.save()
   const resetUrl = process.env.FRONTEND_URL + `/password/reset/${resetToken}`;
   const message = getResetPasswordTemplate(user?.name, resetUrl);
   try{
    await sendEmail({
        email:user.email,
        subject:"ShopIT Ecommerce - Password Recovery",
        message:message,
    })
    res.status(200).json({
        success:true,
        message:`Email sent to ${user.email} successfully`
    })

   }
   catch(error){
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;
    return next(new ErrorHandler(error.message,500));
   }
})
export const resetPassword = catchAsyncErrors(async (req,res,next)=>{
    // find user
   const resetPasswordToken = crypto.createHash("sha256").update(req.params.token).digest("hex");
   const user = await User.findOne({
    resetPasswordToken,
    resetPasswordExpire: {$gt: Date.now()}
   })
     if(!user){
        return next(new ErrorHandler('Password reset token is invalid or expired',400))
    }
    if(req.body.password !== req.body.confirmPassword){
        return next(new ErrorHandler('Password does not match',400))
    }
    user.password = req.body.password;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;
    await user.save();
    sendToken(user,200,res);
})

// Get current user profile
export const getUserProfile = catchAsyncErrors(async (req,res,next)=>{
    // find user
   const user = await User.findById(req?.user?.id)
     if(!user){
        return next(new ErrorHandler(`User Not found against this ID${req?.user?.id}`,404))
    }
    res.status(200).json({
        success:true,
        user
    })
})
export const updatePassword = catchAsyncErrors(async (req,res,next)=>{
    // find user
   const user = await User.findById(req?.user?.id).select("+password")
     if(!user){
        return next(new ErrorHandler(`User Not found against this ID${req?.user?.id}`,404))
    }
    const isPasswordMatched = await user.comparePassword(req.body.oldPassword)
    if(!isPasswordMatched){
        return next(new ErrorHandler(`Old Password is incorrect`,400))
    }

    if(req.body.newPassword !== req.body.confirmPassword){
        return next(new ErrorHandler(`New Password and Confirm Password does not match`,400))
    }
    user.password = req.body.newPassword;
    await user.save();

    res.status(200).json({
        success:true,
        message:"Password updated successfully"})
})
export const updateProfile = catchAsyncErrors(async (req,res,next)=>{
    // find user
    const newUserData = {
        name: req.body.name,
        email:req.body.email,
    }
   const user = await User.findByIdAndUpdate(req?.user?.id,newUserData,{new:true})

    res.status(200).json({
        success:true,
        message:"Profile updated successfully"})
})
export const allUsers = catchAsyncErrors(async (req,res,next)=>{
    // find user
   const users = await User.find()

    res.status(200).json({
        users})
})
export const getUserDetails = catchAsyncErrors(async (req,res,next)=>{
    // find user
   const user = await User.findById(req?.params?.id)
    if(!user){
        return next(new ErrorHandler(`User Not found against this ID${req?.params?.id}`,404))
    }

    res.status(200).json({
        user})
})


// Admin Update User Details
export const updateUser = catchAsyncErrors(async (req,res,next)=>{
    // find user
    const newUserData = {
        name: req.body.name,
        email:req.body.email,
        role:req.body.role
    }
   const user = await User.findByIdAndUpdate(req.params.id,newUserData,{new:true})

    res.status(200).json({
        success:true,
        message:"User Profile updated successfully"})
})
// Admin Delete User
export const deleteUser = catchAsyncErrors(async (req, res, next) => {
    // find user by ID from params
    const user = await User.findById(req.params.id);

    if (!user) {
        return next(new ErrorHandler(`User not found with ID: ${req.params.id}`, 404));
    }

    // delete avatar if exists
    if (user.avatar && user.avatar.public_id) {
        await delete_file(user.avatar.public_id);
    }

    // delete user
    await user.deleteOne();

    res.status(200).json({
        success: true,
        message: "User deleted successfully"
    });
});
