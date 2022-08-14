const isBase64 = require("is-base64");
const base64Img = require("base64-img");
const { Media } = require("../models");
const fs = require("fs");

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
            newFilepath = filepath.replaceAll(/\\/g, "/");

            filename = newFilepath.split("/").pop();

            try {
                const media = await Media.create({
                    image: `images/${filename}`,
                });

                if (!media) {
                    const error = new Error(media);
                    error.status = 400;
                    next(error);
                }
                media.image = `${req.get("host")}/${media.image}`;
                return res.status(200).json({
                    success: true,
                    message: "Berhasil upload gambar.",
                    data: media,
                });
            } catch (err) {
                next(err);
            }
        }
    );
}

async function findAll(req, res, next) {
    try {
        //
        const result = await Media.findAll({
            attributes: { exclude: ["createdAt", "updatedAt"] },
        });

        if (!result) {
            return res.status(500).json({
                success: false,
                message: "Error occur while getting data.",
                data: null,
            });
        }

        const mappedMedia = result.map((m) => {
            //
            m.image = `${req.get("host")}/${m.image}`;
            return m;
        });

        res.status(200).json({
            success: true,
            message: "Get data successful.",
            data: mappedMedia,
        });
    } catch (error) {
        next(error);
    }
}

async function destroy(req, res, next) {
    const { id } = req.params;
    try {
        //
        const result = await Media.findByPk(id);

        if (!result) {
            return res.status(400).json({
                success: false,
                message: "No data with that id.",
                data: null,
            });
        }

        fs.unlink(`./public/${result.image}`, async (err) => {
            if (err) {
                const error = new Error("Media not found.");
                error.status = 500;
                next(error);
            }

            const deleted = await result.destroy();

            if (!deleted) {
                return res.status(500).json({
                    success: false,
                    message: "Error while delete data.",
                    data: null,
                });
            }
            return res.status(200).json({
                success: true,
                message: "Delete data successfully",
                data: null,
            });
        });
    } catch (error) {
        next(error);
    }
}

module.exports = { post, findAll, destroy };
