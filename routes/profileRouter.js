const express = require("express");
const User = require("../models/users");
const profileRouter = express.Router();

profileRouter.get("/profile", async (req, res) => {
  console.log("Session User ID:", req.session.userId); // Debugging line

  if (!req.session.userId) {
    return res.redirect("/accounts/login");
  }

  try {
    const user = await User.findById(req.session.userId);
    if (!user) {
      return res.redirect("/accounts/login");
    }
    res.render("profile", {
      title: "Your Profile",
      username: user.username,
      email: user.email,
    });
  } catch (error) {
    console.error("Error fetching user data:", error);
    res.status(500).send("Server error");
  }
});

module.exports = profileRouter;
