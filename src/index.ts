import express from "express";
import logger from "./middleware/logger";
import {validateUploadSize} from "./middleware/fileValidation";
import {postReceive, receiveFile} from "./controllers/receiveFile";
import rateLimit from "express-rate-limit";
import {sendFile} from "./controllers/sendFile";
import 'dotenv/config';
import { drizzle } from 'drizzle-orm/libsql';
import {checkExpirationDate} from "./services/checkExpirationDate";
import {checkExpirationDateOnDownload} from "./middleware/checkExpirationDateOnDownload";
import cors from "cors";
import {upload} from "./middleware/uploadPost";

export const port = process.env.PORT || 3000;
const app = express();
app.use(logger)
app.use(express.urlencoded({ extended: true }));
app.use(rateLimit({
    windowMs: 60000,
    limit: 100
}));
app.use(cors());

app.put("/:name", validateUploadSize, receiveFile)
app.post("/", upload.single("file"), postReceive)
app.get("/:id/:filename", checkExpirationDateOnDownload, sendFile);

export const db = drizzle(process.env.DB_FILE_NAME!);

app.listen(port, async () => {
    console.log("Listening on port " + port);
})

setInterval(async () => {
    await checkExpirationDate();
},1000*60*5)