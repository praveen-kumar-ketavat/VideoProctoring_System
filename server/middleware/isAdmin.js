export const isAdmin = (req, res, next) => {
  console.log("Auth user:", req.user);  // 🔍 debug
  if (req.user && req.user.role === "admin") {
    next();
  } else {
    res.status(403).json({ error: "Access denied. Admins only." });
  }
};
