import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

import { readUsers, writeUsers, findUserByEmail, generateId } from "../config/db.js";

import { generateOTP, getOtpExpiry } from "../utils/otpService.js";
import { sendEmailOTP } from "../utils/emailService.js";
import { sendSmsOTP } from "../utils/smsService.js";


// ------------- PART 1: REGISTER ----------------
export async function register(req, res) {
  try {
    const { email, phoneNumber, password, role, otpMethod } = req.body;

    // Validate input
    if (!email || !password || !otpMethod) {
      return res.status(400).json({
        success: false,
        message: "Email, password and OTP method are required"
      });
    }

    if (otpMethod === "sms" && !phoneNumber) {
      return res.status(400).json({
        success: false,
        message: "Phone number is required for SMS OTP"
      });
    }

    // Check if user exists
    const exists = await findUserByEmail(email);

    if (exists) {
      return res.status(409).json({
        success: false,
        message: "User already exists, please login"
      });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Generate OTP
    const otp = generateOTP();
    const otpExpiry = getOtpExpiry();

    const newUser = {
      id: generateId(),
      email,
      phoneNumber,
      password: hashedPassword,
      role: role || "user",
      otpMethod,
      otp,
      otpExpiry,
      isVerified: false,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    const users = await readUsers();
    users.push(newUser);
    await writeUsers(users);

    // Send OTP
    if (otpMethod === "email") {
      await sendEmailOTP(email, otp);
    } else {
      await sendSmsOTP(phoneNumber, otp);
    }

    return res.status(201).json({
      success: true,
      message: "Registration successful. OTP sent.",
      userId: newUser.id
    });

  } catch (error) {
    console.error("Error in register:", error.message);
    return res.status(500).json({ success: false, message: "Registration failed" });
  }
}



// ------------- PART 2: VERIFY ACCOUNT OTP ----------------
export async function verifyOTP(req, res) {
  try {
    const { userId, otp } = req.body;

    if (!userId || !otp) {
      return res.status(400).json({
        success: false,
        message: "User Id and OTP are required"
      });
    }

    const users = await readUsers();
    const user = users.find(u => u.id === userId);

    if (!user) {
      return res.status(400).json({ success: false, message: "User not found" });
    }

    if (user.otp !== otp) {
      return res.status(400).json({ success: false, message: "Invalid OTP" });
    }

    if (new Date() > new Date(user.otpExpiry)) {
      return res.status(400).json({ success: false, message: "OTP expired" });
    }

    user.isVerified = true;
    user.otp = null;
    user.otpExpiry = null;
    user.updatedAt = new Date().toISOString();
    await writeUsers(users);

    const token = jwt.sign(
      { id: user.id, email: user.email, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRE }
    );

    return res.json({
      success: true,
      message: "Account verified successfully",
      token,
      user: { id: user.id, email: user.email, role: user.role }
    });

  } catch (error) {
    console.error("Verify OTP Error:", error);
    return res.status(500).json({ success: false, message: "Verification failed" });
  }
}



// ------------- PART 3: LOGIN ----------------
export async function login(req, res) {
  try {
    const { email, password, otpMethod } = req.body;

    if (!email || !password || !otpMethod) {
      return res.status(400).json({
        success: false,
        message: "Email, password and OTP method are required"
      });
    }

    const users = await readUsers();
    const user = users.find(u => u.email === email);

    if (!user) {
      return res.status(401).json({ success: false, message: "User does not exist" });
    }

    const match = await bcrypt.compare(password, user.password);
    if (!match) {
      return res.status(401).json({ success: false, message: "Password does not match" });
    }

    if (!user.isVerified) {
      return res.status(401).json({
        success: false,
        message: "Account not verified. Verify OTP first."
      });
    }

    const otp = generateOTP();
    const otpExpiry = getOtpExpiry();
    user.otp = otp;
    user.otpExpiry = otpExpiry;
    user.updatedAt = new Date().toISOString();

    await writeUsers(users);

    if (otpMethod === "email") {
      await sendEmailOTP(user.email, otp);
    } else {
      await sendSmsOTP(user.phoneNumber, otp);
    }

    return res.json({
      success: true,
      message: "OTP sent to your selected method",
      userId: user.id
    });

  } catch (error) {
    console.error("Login Error:", error);
    return res.status(500).json({ success: false, message: "Login failed" });
  }
}



// ------------- PART 4: VERIFY LOGIN OTP ----------------
export async function verifyLoginOTP(req, res) {
  try {
    const { userId, otp } = req.body;

    const users = await readUsers();
    const user = users.find(u => u.id === userId);

    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    if (user.otp !== otp) {
      return res.status(400).json({ success: false, message: "Invalid OTP" });
    }

    if (new Date() > new Date(user.otpExpiry)) {
      return res.status(400).json({ success: false, message: "OTP expired" });
    }

    user.otp = null;
    user.otpExpiry = null;
    user.updatedAt = new Date().toISOString();
    await writeUsers(users);

    const token = jwt.sign(
      { id: user.id, email: user.email, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRE }
    );

    return res.json({
      success: true,
      message: "Login successful",
      token,
      user: { id: user.id, email: user.email, role: user.role }
    });

  } catch (error) {
    console.error("Verify Login OTP Error:", error);
    return res.status(500).json({ success: false, message: "Verification failed" });
  }
}



// ------------- PART 5: RESEND OTP ----------------
export async function resendOTP(req, res) {
  try {
    const { userId, otpMethod } = req.body;

    const users = await readUsers();
    const user = users.find(u => u.id === userId);

    if (!user) return res.status(404).json({ success: false, message: "User not found" });

    const otp = generateOTP();
    const otpExpiry = getOtpExpiry();

    user.otp = otp;
    user.otpExpiry = otpExpiry;
    user.updatedAt = new Date().toISOString();
    await writeUsers(users);

    if (otpMethod === "email") {
      await sendEmailOTP(user.email, otp);
    } else {
      await sendSmsOTP(user.phoneNumber, otp);
    }

    return res.json({ success: true, message: "OTP resent successfully" });

  } catch (error) {
    console.error("Resend OTP Error:", error);
    return res.status(500).json({ success: false, message: "Failed to resend OTP" });
  }
}
