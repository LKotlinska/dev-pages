import jwt from "jsonwebtoken";

export default function auth(req, res, next) {
  const token = req.cookies.token;

  if (!token) {
    return res.redirect("/login");
  }

  try {
    jwt.verify(token, process.env.SECRET);
    req.user = user;
    next();
  } catch (error) {
    return res.redirect("/login");
  }
}
