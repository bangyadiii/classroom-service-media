const SUCCESS = (res, code = 200, message, data = null) => {
    return res.status(200).json({
        meta: {
            success: true,
            code: code,
            message: message,
        },
        data: data,
    });
};

const ERROR = (res, code = 500, message, errors = null) => {
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
