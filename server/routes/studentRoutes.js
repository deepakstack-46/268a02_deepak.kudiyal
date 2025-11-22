import express from "express";
import { authenticateToken } from "../middleware/authMiddleware.js";
import { authorizeRoles } from "../middleware/roleMiddleware.js";


const router = express.Router();

router.get("/dashboard", authenticateToken, authorizeRoles(["student", "teacher", "admin"]), (req, res) => {
    return res.json({
        success: true,
        data: {
            message: `Welcome to Student Dashboard`,
            user: req.user.email,
            role: req.user.role,
            classes: ["ITAS 268 - FIRST YEAR", "ITAS 255 - SECOND YEAR"]
        }
    });
});

export default router;