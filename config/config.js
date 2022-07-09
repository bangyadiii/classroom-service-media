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
        username: "root",
        password: null,
        database: "media_test",
        host: "127.0.0.1",
        dialect: "mysql",
    },
    production: {
        username: "root",
        password: null,
        database: "media_production",
        host: "127.0.0.1",
        dialect: "mysql",
    },
};
