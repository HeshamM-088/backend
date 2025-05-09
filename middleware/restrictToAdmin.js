module.exports = (req, res, next) => {
  if (!req.user || req.user.role !== "admin") {
    return res.status(403).json({
      status: "fail",
      message: "Only admins are allowed to perform this action",
    });
  }
  next();
};
