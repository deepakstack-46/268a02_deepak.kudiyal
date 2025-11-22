import express from "express";
import { authenticateToken } from "../middleware/authMiddleware.js";
import { authorizeRoles } from "../middleware/roleMiddleware.js";

const router = express.Router();



router.get("/dashboard", authenticateToken, authorizeRoles(["admin"]), (req, res) => {
    return res.json({
        success: true,
        data: {
            message: `Welcome to Admin Dashboard`,
            user: req.user.email,
            role: "admin",
            stats: {
                totalUsers: 150,
                totalStudents: 120,
                totalTeachers: 29,
                totalAdmins: 1   
            }
        }
    });
});



export default router;

