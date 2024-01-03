import express from "express";
import cookieParser from "cookie-parser";
import dotenv from "dotenv";
import {v2 as cloudinary} from 'cloudinary';
import { router as user } from "./Routes/userRoute.js";
dotenv.config({path: "Config/config.env"});

          
cloudinary.config({ 
  cloud_name: 'dltdrg3rn',
  api_key: process.env.CLOUDINARY_KEY, 
  api_secret: process.env.CLOUDINARY_SECRET,
});
const app = express();
app.use(express.json());
app.use(
    express.urlencoded({extended: true})
);
app.use(cookieParser());
app.use("/api/v1", user)
export {app,cloudinary} 

