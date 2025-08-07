import { Router } from "express";

import {
    partnerRegister,
    partnerLogin,
    partnerGoogleCallback
} from "../controllers/partnerAuth.controller.js";

import partnerGoogleAuth from "../middlewares/partnerGoogleAuth.middleware.js";
import passport from "../libs/passport.libs.js";

const router = Router();

router.route("/register").post(partnerRegister);
router.route("/login").post(partnerLogin);
router.route("/auth/google").get(passport.authenticate("google", {
    scope: ["profile", "email"],
    prompt: "select_account",
}));
router.route("/auth/google/callback").get(passport.authenticate("google", {
    failureRedirect: `${process.env.CLIENT_URL}`,
}), partnerGoogleAuth, partnerGoogleCallback);

export default router;