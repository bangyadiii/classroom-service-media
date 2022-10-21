require("dotenv").config();
const express = require("express");
const path = require("path");
const cookieParser = require("cookie-parser");
const logger = require("morgan");
const cors = require("cors");
const indexRouter = require("./routes/index");
const mediaRouter = require("./routes/media");
const { ERROR } = require("./helpers/ResponseFormatter");
const app = express();

app.use(logger("dev"));
app.use(express.json({ limit: "45mb" }));
app.use(express.urlencoded({ extended: false, limit: "45mb" }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));
app.use(cors());

app.use("/", indexRouter);
app.use("/media", mediaRouter);

//add default error for not found endpoint
app.use((req, res, next) => {
    const error = new Error("NOT FOUND");
    error.status = 404;
    next(error);
});

//add default error handling
app.use((error, req, res, next) => {
    //
    const statusCode = error.status ?? 500;
    const message = error.message;
    const errors = error.data ?? null;
    return ERROR(statusCode, message, errors);
});

module.exports = app;
