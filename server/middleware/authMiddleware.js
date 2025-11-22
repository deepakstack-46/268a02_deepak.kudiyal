import jwt from "jsonwebtoken";

export function authenticateToken(req, res, next) {
    const authHead = req.headers['authorization'];
    const token = authHead && authHead.split(" ")[1];

    if(!token) {
        return res.status(401).json({
            success: false,
            message: "Access denied"
        });
    }

    try {
        const decode = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decode;
        next();
    } catch (error) {
        return res.status(401).json({
            success: false,
            message: "Invalid or expired token."
        });
    }
}