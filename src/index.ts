import express, {Request, Response} from "express";
import logger from "./middleware/logger";
import * as path from "node:path";
import * as fs from "node:fs";
import {validateUploadSize} from "./middleware/fileValidation";
import {recieveFile} from "./controllers/recieveFile";
import rateLimit from "express-rate-limit";

export const port = process.env.PORT || 3000;
const app = express();

app.use(logger)
app.use(rateLimit({
    windowMs: 60000,
    limit: 100
}))
app.use(express.urlencoded({ extended: true }));

app.get('/ping', (_req, res) => {
    res.status(200).send({msg: 'pong'});
})

app.put("/:name", validateUploadSize, recieveFile)

app.get("/:id/:filename", (req: Request, res: Response) => {
    const {id, filename} = req.params;

    if (typeof filename !== "string" || typeof id !== "string") {
        return res.status(400).send("Invalid parameter");
    }

    const safeFilename = path.basename(filename);
    const filePath = path.join(__dirname, "uploads", "public", id+"-"+safeFilename);
    if (!fs.existsSync(filePath)) {
        return res.status(404).send("File not found");
    }

    res.download(filePath);
});

app.listen(port, () => {
    console.log("Listening on port " + port);
})