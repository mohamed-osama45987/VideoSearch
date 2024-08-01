import { Router, Request, Response, NextFunction } from "express";
import { IError } from "../middlewares/errorHandler";
import { makeScenes, searchScenes } from "../utils/scenes";
import fileUpload from "express-fileupload";
import Joi from "joi";

const handleUpload = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { error, value } = Joi.object({
            file: Joi.object({
                name: Joi.string().required(),
                data: Joi.binary().required(),
                mimetype: Joi.string().required(),
                size: Joi.number().required()
            }).required().unknown(true)
        }).validate(req.files);
        if (error) {
            throw new Error(error.message);
        }
        const { file } = value
        const tempFilePath = `./temp/${file.name}`;
        await file.mv(tempFilePath);
        const scenes = await makeScenes(tempFilePath);
        res.status(200).json({ message: "File uploaded successfully", scenes });
    } catch (error) {
        next(error);
    }
}

const handleSearch = async (req: Request, res: Response, next: NextFunction) => {
    try {

        const { error, value } = Joi.object({
            instruction: Joi.string().required(),
            avalibleScenes: Joi.array().items(Joi.object({
                time: Joi.string().required(),
                description: Joi.string().required()
            }).unknown(true)).required()
        }).validate(req.body);

        if (error) {
            throw new Error(error.message);
        }

        const { instruction, avalibleScenes } = value
        const scene = await searchScenes(avalibleScenes, instruction);
        res.status(200).json({ message: "Scene found successfully", scene });
    } catch (error) {
        next(error);
    }
}

const router = Router();

router.post(
    "/upload",
    fileUpload({
        createParentPath: true,
        limits: { fileSize: 100 * 1024 * 1024, }, // 100 MB file
    }),
    handleUpload
);

router.post("/search", handleSearch);

export default router;
