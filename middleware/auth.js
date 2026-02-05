import jwt from "jsonwebtoken";

export default function auth(req, res, next) {
  const token = req.cookies.token;

  if (!token) {
    return res.redirect("/login");
  }

  try {
    const decoded = jwt.verify(token, process.env.SECRET);
    // Decoded is logged in user
    req.user = decoded;
    next();
  } catch (error) {
    return res.redirect("/login");
  }
}
