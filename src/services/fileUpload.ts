import path from "node:path";
import {generateRandomString} from "../util";
import fs from "node:fs";
import crypto from "node:crypto";
import {Request} from "express";

export const uploadFile = async (req: Request) => {
    let originalName = req.params.name as string | undefined;
    if (!originalName) {
        originalName = generateRandomString(7 )
    }
    const safeName = generateRandomString(5) + "-" + path.basename(originalName).replace(/[^a-zA-Z0-9\-_.]/g, "_");

    fs.mkdirSync(path.join(__dirname, "uploads", "tmp"), { recursive: true });
    fs.mkdirSync(path.join(__dirname, "uploads", "public"), { recursive: true });

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
    return new Promise<{filename: string, size: number, sha256: string}>((resolve, reject) => {
        writeStream.on("finish", () => {
            fs.rename(tmpPath, finalPath, (err) => {
                if (err) return reject(err);
                resolve({
                    filename: safeName,
                    size: bytes,
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