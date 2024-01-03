import { json } from "express";
import { User } from "../Model/userModel.js";
import { cloudinary } from "../app.js";
export const registerUser = async (req, res)=>{
try {
    const {name, email, password, phone} = req.body;
    const file = req.file;
    if(!file){
        return res.status(400).json({
            success: false,
            message: "Upoad an Image"
        })
    }
    
    let user = await User.findOne({email});
    if(user){
        return res.status(400).json({
            success: false,
            message: "User already exists"
        })
    }
    const userImg = file.path;
    if(!userImg){
        return res.status(400).json({
            success: false,
            message: "Upoad an Image"
        })
    }
    if(userImg){
     const userImgData = await cloudinary.uploader.upload(userImg);
     const userImgUrl = userImgData.url;
     const userImgId = userImgData.public_id;
     user = await User.create({
        name,
        role:"User",
        email,
        password,
        phone,
        avatar: {
            public_id: userImgId,
            url: userImgUrl
        }
    });
    }

    await user.save();
    const token = await user.generateToken();
    return res.status(201).cookie("token", token, {
        expires: new Date(Date.now() + 2*24*60*60*1000),
        httpOnly: true,
    }).json({
        success: true,
        user,
        token,
    });
} catch (error) {
    res.status(500).json({
        success: false,
        message: error.message,
    });
}
} 
export const login = async (req, res)=>{
    try {
        const {email, password, phone} = req.body;
        let user = await User.findOne({email});
        if(!user){
            return res.status(400).json({
                success: false,
                message: "User not exists"
            })
        }
        if(user.phone !== phone){
            return res.status(400).json({
                success: false,
                message: "Please enter valid Phone no."
            })
        }
        const isMatch = await user.matchPassword(password);
        if(!isMatch){
            return res.status(400).json({
                success: false,
                message: "Please enter valid password"
            });
        
        }

       const token = await  user.generateToken();
    
        return res.status(200).cookie("token", token, {
            expires: new Date(Date.now() + 2*24*60*60*1000),
            httpOnly: true,
        }).json({
            success: true,
            user,
            token,
        })
    } catch (error) {
        return res.status(404).json({
            success: false,
            message: error.message
        })
    }
}
export const getProfile = async(req, res)=>{
try {
    const user = req.user;
    return res.status(200).json({
        success: true,
        user
    })
} catch (error) {
    res.status(500).json({
        success: false,
        message: error.message
    })
}
}
export const updateUserProfile = async (req, res)=>{
    try {
        const {name} = req.body;
        const file = req.file;

        if(!name && !file){
            return res.status(400).json({
                success: false,
                message: "Enter valid name or image"
            })
        }
        const user = req.user;
        if(name){
            user.name = name;
        }

        if(file){
            const userImg = file.path;
            const userImgData = await cloudinary.uploader.upload(userImg);
            const userImgUrl = userImgData.url;
            const userImgId = userImgData.public_id;
            user.avatar = {
                url: userImgUrl,
                public_id: userImgId
            }
        }
       await user.save();
       return res.status(200).json({
        success: true,
        message: "Updated successfully"
       })        
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        })
    }
}
export const deleteUserProfile = async(req, res)=>{
    try {
        const {userEmail} = req.body;
        if(userEmail){
            const user = await User.findOne({email: userEmail});
            if(!user){
                return res.status(400).json({
                    success: false,
                    message: "User not exists"
                })
            }
           await User.deleteOne({ email: userEmail});
           return res.status(200).json({
            success: true,
            message: "User successfully Deleted"
           })
        }
        const user = req.user;
        await User.deleteOne({_id: user._id});
        res.cookie("token", null, {
            expires: new Date(Date.now()),
            httpOnly: true
        })
        return res.status(200).json({
            success: true,
            message: "Profile deleted"
        })
        
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        })
    }
}
export const registerAdmin = async(req, res)=>{
    try {
        const {name, email, password, phone} = req.body;
        let user = await User.findOne({email});
        if(user){
            return res.status(401).json({
                success: false,
                message: "Admin already exists"
            })
        }
       user =  await User.create({
        name,
        role:"Admin",
        email,
        password,
        phone,
        avatar: {
            public_id: "sample_id",
            url: "Sample url"
        }
       })
       await user.save();
       const token = await user.generateToken();
       return res.status(201).cookie("token", token, {
        expires: new Date(Date.now() + 2*24*60*60*1000),
        httpOnly: true
       }).json({
        success: true,
        message: "Account Created"
       })
    } catch (error) {
        
    }
}
export const getAllUser = async (req, res)=>{
   try {
    const user = req.user;
    if(user.role !== "Admin"){
        return res.status(404).json({
            success: false,
            message: "You are not Authorized"
        })
    }
    const users = await User.find();
    return res.status(200).json({
        success: true,
        users
    })
   } catch (error) {
    return res.status(500).json({
        success: false,
        message: error.message
    })
   }
}
