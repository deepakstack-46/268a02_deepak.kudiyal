import { generateId } from "../config/db.js";



export default class User {
    constructor(email, phoneNumber, hashedPassword, role) {
        this.id = generateId();
        this.email = email;
        this.phoneNumber = phoneNumber;
        this.password = hashedPassword;
        this.role = role || "student";
        this.isVerified = false;

        this.otp = null;
        this.otpExpiry = otpExpires.toISOString(),
        this.otpMethod = this.otpMethod;

        const now = new Date().toISOString();
        this.createdAt = now;
        this.updatedAt = now;

    }
}