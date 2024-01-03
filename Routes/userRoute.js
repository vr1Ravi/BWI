import express from "express";
import {registerUser, login, updateUserProfile, getProfile, deleteUserProfile, getAllUser, registerAdmin} from "../Controller/userController.js"
import { isAuthenticated } from "../Middlewares/auth.js";
import multer from "multer";

const upload = multer({dest: "uploads/"})
const router = express.Router();

router.route("/register").post(upload.single("profileImg") ,registerUser);
router.route("/admin/register").post(registerAdmin);
router.route("/login").post(login);
router.route("/me").get(isAuthenticated, getProfile)
router.route("/user/all").get(isAuthenticated, getAllUser);
router.route("/user/delete").delete(isAuthenticated, deleteUserProfile)
router.route("/update/profile").put(upload.single("profileImg"),isAuthenticated, updateUserProfile);
export {router}