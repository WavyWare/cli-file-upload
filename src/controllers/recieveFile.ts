import { Request, Response } from "express";
import { uploadFile } from "../services/fileUpload";

export const recieveFile = async (req: Request, res: Response) => {
    try {
        const result = await uploadFile(req);
        if (result == null) {
            return res.status(400).send("Invalid file upload");
        }
        const [id, filename] = result.filename.split("-");
        return res.status(201).send(
            "File saved successfully: " +result.filename + "\n" +
            "File SHA256 checksum: " + result.sha256 + "\n" +
            "File size: " + result.size + "\n" +
            "File URI: "+ req.protocol + "://" + req.hostname + `/${id}/${filename}`
        );
    } catch (err) {
        console.error(err);
        res.status(500).send("File save error");
    }
};