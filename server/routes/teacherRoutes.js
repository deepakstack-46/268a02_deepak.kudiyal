import express from "express";
import { authenticateToken } from "../middleware/authMiddleware.js";
import { authorizeRoles } from "../middleware/roleMiddleware.js";

const router = express.Router();



router.get("/dashboard", authenticateToken, authorizeRoles(["teacher", "admin"]), (req, res) => {
    return res.json({
        success: true,
        data: {
            message: `Welcome to Teacher Dashboard`,
            user: req.user.email,
            role: req.user.role,
            classes: ["ITAS 268 - FIRST YEAR", "ITAS 255 - SECOND YEAR"],
            totalStudents: 45
        }
    });
});



export default router;

