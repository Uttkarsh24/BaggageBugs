import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors";
import passport from "passport";
import session from "express-session";

const app = express();

app.use(cors({
    origin: process.env.CLIENT_URL,
    credentials: true   
}));

app.use(session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: true,
    cookie: {
        secure: true,
        httpOnly: true,
        sameSite: "none"
    },
}));

app.use(express.json({
    limit: "16kb"
}));

app.use(express.urlencoded({
    extended: true,
    limit: "16kb"
}));

app.use(cookieParser());

app.use(passport.initialize());
app.use(passport.session());

import healthRouter from "./routes/healthcheck.routes.js";
app.use("/api/v1", healthRouter);

//user routes
import userRouter from "./routes/user.routes.js";
app.use("/api/v1/user", userRouter);

//partner routes
import partnerRouter from "./routes/partner.routes.js";
app.use("/api/v1/partner", partnerRouter);

//facility routes
import facilityRouter from "./routes/facility.routes.js";
app.use("/api/v1/facility", facilityRouter);

//booking routes
import bookingRouter from "./routes/booking.routes.js";
app.use("/api/v1/booking", bookingRouter);

//map routes
import mapRouter from "./routes/map.routes.js";
app.use("/api/v1/map", mapRouter);

//review routes
import reviewRouter from "./routes/review.routes.js";
app.use("/api/v1/review", reviewRouter);

//payment routes
import paymentRouter from "./routes/payment.routes.js";
app.use("/api/v1/payment", paymentRouter);

//admin routes
import adminRouter from "./routes/admin.routes.js";
app.use("/api/v1/admin", adminRouter);

export default app;