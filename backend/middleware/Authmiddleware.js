// middleware/Authmiddleware.js
import Users from "../model/user.js";


export const isAdmin = async (req, res, next) => {
  try {
    
    const userId = req.user.userId; // assuming the user ID is set by authenticateJWT middleware

    const user = await Users.findById(userId);

    if (!user || user.role !== "admin") {
      return res.status(403).json({ status: "error", message: "Unauthorized" });
    }

    req.user = user; // Attach the user object to the request for use in the next middleware
    next();
  } catch (err) {
    console.error(err);
    res.status(500).json({ status: "error", message: "Server error" });
  }
};
// middleware/Authmiddleware.js

