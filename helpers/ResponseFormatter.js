const SUCCESS = (res, code = 500, message, data = null) => {
    return res.status(500).json({
        meta: {
            success: true,
            code: code,
            message: message,
        },
        data: data,
    });
};

const ERROR = (res, code, message, errors = null) => {
    return res.status(code).json({
        meta: {
            success: false,
            code: code,
            message,
        },

        errors,
    });
};

module.exports = { SUCCESS, ERROR };
