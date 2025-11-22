import { Router } from "express";
import { 
    register,
    verifyOTP,
    login,
    verifyLoginOTP,
    resendOTP

 } from "../controllers/authController.js"

const router = Router();

//Register
router.post("/register", register);

//verify registration otp
router.post("/verify-otp", verifyOTP);

//login
router.post('/login', login);

//verify login otp
router.post("/verify-login-otp", verifyLoginOTP);

//resend otp
router.post("/resend-otp", resendOTP);

export default router;