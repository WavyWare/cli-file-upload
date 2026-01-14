import {Request, Response} from "express";
import path from "node:path";
import fs from "node:fs";
import {sendFileFromDatabase} from "../services/sendFileFromDatabase";

export const sendFile = async (req: Request, res: Response) => {
    const {id, filename} = req.params;

    if (typeof filename !== "string" || typeof id !== "string") {
        return res.status(400).send("Invalid parameter");
    }

    let query = await sendFileFromDatabase(id, filename);

    if (!query) {
        return res.status(400).send("Invalid parameter");
    }

    const safeFilename = path.basename(filename);
    const filePath = path.join(__dirname, "..", "uploads", "public", id+"-"+safeFilename);
    console.log(filePath)
    if (!fs.existsSync(filePath)) {
        return res.status(404).send("File not found");
    }

    res.download(filePath);
}