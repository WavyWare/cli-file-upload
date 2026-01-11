import {Request, Response, NextFunction} from "express";

const MAX_SIZE = 100 * 1024 * 1024; //100mb

export const validateUploadSize = (req: Request, res: Response, next: NextFunction) => {
    let bytes = 0;
    req.on('data', (chunk: Buffer) => {
        bytes += chunk.length;
        if (bytes > MAX_SIZE) {
            req.destroy()
            return res.status(413).send({msg: 'File too large'})
        }
    })

    next()
}