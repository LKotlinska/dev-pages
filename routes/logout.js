import { Router } from "express";

const router = Router();

const logoutRouter = router.get("/", (req, res) => {
  const isProd = process.env.NODE_ENV === "production";

  res.clearCookie("token", {
    httpOnly: true,
    secure: isProd,
    sameSite: isProd ? "strict" : "lax",
  });

  res.redirect("/home");
});

export default logoutRouter;
