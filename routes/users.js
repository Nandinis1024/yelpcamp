const express = require("express");
const router = express.Router();
const passport = require("passport");
const catchAsync = require("../utils/catchAsync");
const { storeReturnTo } = require('../middleware');
const users = require("../controllers/users");

router.get('/register', users.registerForm);

router.post('/register', catchAsync(users.newRegister));

router.get("/login", users.loginForm);

router.post("/login", storeReturnTo, passport.authenticate("local", { failureFlash: true, failureRedirect: "/login"}), users.login);


router.get('/logout', users.logout);

module.exports = router;