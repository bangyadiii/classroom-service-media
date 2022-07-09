const isBase64 = require("is-base64");
const base64Img = require("base64-img");
const { Media } = require("../models");

function post(req, res, next) {
    //
    const { image } = req.body;
    if (!isBase64(image, { mimeRequired: true })) {
        //
        const error = new Error("invalid base64 images");
        error.status = 400;
        return next(error);
    }
    base64Img.img(
        image,
        "./public/images",
        Date.now(),
        async (err, filepath) => {
            //
            if (err) {
                const error = new Error(err.message);
                error.status = 400;
                next(error);
            }
            filename = filepath.split("/").pop();
            try {
                const media = await Media.create({ image: filename });

                if (!media) {
                    const error = new Error("what error, " + media);
                    error.status = 400;
                    next(error);
                }

                return res.status(200).json({
                    status: true,
                    message: "Berhasil upload gambar.",
                    data: media,
                });
            } catch (err) {
                next(err);
            }
        }
    );
}

module.exports = { post };
