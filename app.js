require("dotenv").config();
var express = require("express");
var path = require("path");
var cookieParser = require("cookie-parser");
var logger = require("morgan");

var indexRouter = require("./routes/index");
var mediaRouter = require("./routes/media");

var app = express();

app.use(logger("dev"));
app.use(express.json({ limit: "45mb" }));
app.use(express.urlencoded({ extended: false, limit: "45mb" }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));

app.use("/", indexRouter);
app.use("/media", mediaRouter);

//add default error for not found endpoint
app.use((req, res, next) => {
    const error = new Error("Not Found");
    error.status = 404;
    next(error);
});

//add default error handling
app.use((error, req, res, next) => {
    //
    const statusCode = error.status || 500;
    const status = false;
    const message = error.message;
    const data = error.data || null;

    res.status(statusCode).json({
        status,
        message,
        data,
    });
});

module.exports = app;
