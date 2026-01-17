import { Request, Response } from "express";
import {port} from "../index";
import {generateRandomString} from "../util";
import path from "node:path";
import {fileUploadtoDatabase} from "../services/fileUploadtoDatabase";
import fs from "node:fs";
import crypto from "node:crypto";
import chalk from "chalk";

export const receiveFile = async (req: Request, res: Response) => {
    try {
        const result = await uploadFile(req);
        if (result == null) {
            return res.status(400).send("Invalid file upload");
        }
        const uri = result.filename.split("-");
        const id = uri[0];
        const filename = uri.slice(1).join("-");
        return res.status(201).send(
            chalk.blueBright.bold("File SHA256 checksum: ") + chalk.whiteBright(result.sha256) + "\n" +
            chalk.blueBright.bold("File URI: ") + chalk.whiteBright(req.protocol + "://" + req.hostname + `/${id}/${filename}\n`)
        );
    } catch (err) {
        console.error(err);
        res.status(500).send("File save error");
    }
};

const uploadFile = async (req: Request) => {
    let originalName = req.params.name as string | undefined;
    if (!originalName) {
        originalName = generateRandomString(7 )
    }
    const prefix = generateRandomString(8);
    const basename = path.basename(originalName).replace(/[^a-zA-Z0-9\-_.]/g, "_")
    const safeName = prefix + "-" + basename;

    const insertion = await fileUploadtoDatabase({id: prefix, filename: basename})

    if (!insertion) {
        return null;
    }

    fs.mkdirSync(path.join(__dirname, "..", "uploads", "tmp"), { recursive: true });
    fs.mkdirSync(path.join(__dirname, "..", "uploads", "public"), { recursive: true });

    const tmpPath = path.join(__dirname, "..", "uploads", "tmp", safeName);
    const finalPath = path.join(__dirname, "..", "uploads", "public", safeName);

    const writeStream = fs.createWriteStream(tmpPath);
    const hash = crypto.createHash("sha256");
    let bytes = 0;

    req.on('data', (chunk: Buffer) => {
        bytes += chunk.length;
        hash.update(chunk);
    })

    req.pipe(writeStream);
    return new Promise<{filename: string, sha256: string}>((resolve, reject) => {
        writeStream.on("finish", () => {
            fs.rename(tmpPath, finalPath, (err) => {
                if (err) return reject(err);
                resolve({
                    filename: safeName,
                    sha256: hash.digest("hex"),
                });
            });
        });

        writeStream.on("error", (err) => {
            fs.unlink(tmpPath, () => {});
            reject(err);
        });

        req.on("error", (err) => {
            writeStream.destroy();
            fs.unlink(tmpPath, () => {});
            reject(err);
        });
    })
}