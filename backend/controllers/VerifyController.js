
export const Verify = (req, res) => {
  if (!req.user) {
    return res.status(401).json({ success: false, error: "User not authenticated" });
  }

  res.status(200).json({
    success: true,
    user: req.user,
  });
};


