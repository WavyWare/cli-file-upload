import {filesTable} from "../db/schema";
import {db} from "../index";
import {inArray} from "drizzle-orm/sql/expressions/conditions";
import fs from "node:fs";
import path from "node:path";

export const checkExpirationDate = async () => {
    let result = await db.select({id: filesTable.id, expirationDate: filesTable.expiration_date}).from(filesTable);
    result = result.filter((file) => parseInt(file.expirationDate) <= Date.now() );
    let idsArray: string[] = result.map((file) => file.id);
    let deletion = await db.delete(filesTable).where(inArray(filesTable.id, idsArray)).returning({id: filesTable.id, filename: filesTable.filename});
    if (deletion) {
        deletion.forEach((item) => {
            const sanitizedPath = path.join(__dirname, "..", "uploads", "public", item.id + item.filename);
            fs.unlinkSync(sanitizedPath);
        })
    }
    console.log(`Deleted ${deletion.length} expired objects`);
}