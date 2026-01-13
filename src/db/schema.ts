import {sqliteTable, text} from "drizzle-orm/sqlite-core";
import {generateRandomString} from "../util";

export const filesTable = sqliteTable("files", {
    id: text().$default(() => {
        return generateRandomString(8)
    }).notNull().unique(),
    filename: text().notNull(),
    expiration_date: text().notNull().default((Date.now()+(1000*60*60)).toString())
})