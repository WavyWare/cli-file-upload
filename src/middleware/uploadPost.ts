import multer from "multer";
import crypto from "node:crypto";
import path from "node:path";

export const upload = multer({
    storage: multer.diskStorage({
        destination: (_req, _file, cb) => {
            cb(null, path.join(process.cwd(), "uploads/tmp"));
        },
        filename: (_req, file, cb) => {
            const ext = path.extname(file.originalname);
            const id = crypto.randomUUID();
            cb(null, `${id}${ext}`);
        }
    }),
    limits: {
        fileSize: 100 * 1024 * 1024
    }
});
