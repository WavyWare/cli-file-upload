import { Request, Response } from "express";
import { uploadFile } from "../services/fileUpload";
import {port} from "../index";

export const recieveFile = async (req: Request, res: Response) => {
    try {
        const result = await uploadFile(req);
        if (result == null) {
            return res.status(400).send("Invalid file upload");
        }
        const uri = result.filename.split("-");
        const id = uri[0];
        const filename = uri.slice(1).join("-");
        return res.status(201).send(
            "File saved successfully: " +result.filename + "\n" +
            "File SHA256 checksum: " + result.sha256 + "\n" +
            "File size: " + result.size + "\n" +
            "File URI: "+ req.protocol + "://" + req.hostname + ":" + port + `/${id}/${filename}\n`
        );
    } catch (err) {
        console.error(err);
        res.status(500).send("File save error");
    }
};