import express from "express";
import logger from "./middleware/logger";
import {validateUploadSize} from "./middleware/fileValidation";
import {recieveFile} from "./controllers/recieveFile";
import rateLimit from "express-rate-limit";
import {sendFile} from "./controllers/sendFile";
import 'dotenv/config';
import { drizzle } from 'drizzle-orm/libsql';
import {filesTable} from "./db/schema";
import {eq, sql} from "drizzle-orm";

export const port = process.env.PORT || 3000;
const app = express();
app.use(logger)
app.use(express.urlencoded({ extended: true }));
app.use(rateLimit({
    windowMs: 60000,
    limit: 100
}))

app.put("/:name", validateUploadSize, recieveFile)
app.get("/:id/:filename", sendFile);

export const db = drizzle(process.env.DB_FILE_NAME!);

app.listen(port, () => {
    console.log("Listening on port " + port);
})


setInterval(async () => {
    let result = await db.select({id: filesTable.id}).from(filesTable).where(eq(filesTable.expiration_date, sql`${Date.now}`));
    let ids = "";
    result.forEach((block, index) => {
        ids += block.id + (index !== result.length ? ", ": "");
    })
    db.delete(filesTable).where(sql`IN (${ids})`)
}, 60*5)