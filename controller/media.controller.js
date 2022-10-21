const isBase64 = require("is-base64");
const base64Img = require("base64-img");
const { Media } = require("../models");
const fs = require("fs");
const { ERROR, SUCCESS } = require("../helper/ResponseFormatter");

function post(req, res, next) {
    const { image } = req.body;
    if (!isBase64(image, { mimeRequired: true })) {
        return ERROR(415, "Unsupported Media Type.", "Invalid base64 images");
    }
    base64Img.img(
        image,
        "./public/images",
        Date.now(),
        async (err, filepath) => {
            //
            if (err) {
                return ERROR(400, "Bad Request", err.message);
            }
            const newFilepath = filepath.replaceAll(/\\/g, "/");

            const filename = newFilepath.split("/").pop();

            try {
                const media = await Media.create({
                    image: `images/${filename}`,
                });

                if (!media) {
                    return ERROR(
                        400,
                        "Bad Request",
                        "Error occur while creating new resource."
                    );
                }
                media.image = `${req.get("host")}/${media.image}`;
                return SUCCESS(200, "OK", media);
            } catch (err) {
                return ERROR(err.status, err.message, err.message);
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
            return ERROR(500, "Error occur while getting data");
        }

        const mappedMedia = result.map((m) => {
            m.image = `${req.get("host")}/${m.image}`;
            return m;
        });

        return SUCCESS(200, "Getting data successfull", mappedMedia);
    } catch (error) {
        return ERROR(error.status, error.message, error.message);
    }
}

async function destroy(req, res, next) {
    const { id } = req.params;
    try {
        //
        const result = await Media.findByPk(id);

        if (!result) {
            return ERROR(404, "NOT FOUND", "Media not found with this id");
        }

        fs.unlink(`./public/${result.image}`, async (err) => {
            if (err) {
                return ERROR(err.code ?? 500, err.message, err.message);
            }

            const deleted = await result.destroy();

            if (!deleted) {
                return ERROR(
                    err.code ?? 500,
                    "Internal Server Error",
                    "Error while deleting data"
                );
            }
            return SUCCESS(200, "Delete data successfully", null);
        });
    } catch (error) {
        return ERROR(
            error.status ?? 500,
            error.message ?? "Internal server error",
            error.data ?? null
        );
    }
}

module.exports = { post, findAll, destroy };
