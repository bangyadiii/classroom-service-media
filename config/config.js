require("dotenv").config();

const { DB_HOST, DB_USER, DB_PASS, DB_NAME } = process.env;

module.exports = {
    development: {
        username: DB_USER || "root",
        password: DB_PASS || null,
        database: DB_NAME || "media_development",
        host: DB_HOST || "127.0.0.1",
        dialect: "mysql",
    },
    test: {
        username: DB_USER || "root",
        password: DB_PASS || null,
        database: DB_NAME || "media_development",
        host: DB_HOST || "127.0.0.1",
        dialect: "mysql",
    },
    production: {
        username: DB_USER || "root",
        password: DB_PASS || null,
        database: DB_NAME || "media_production",
        host: DB_HOST || "127.0.0.1",
        dialect: "mysql",
    },
};
