import { db } from ".."
import {filesTable} from "../db/schema";
import {and, eq} from "drizzle-orm";

export const sendFileFromDatabase= async (id: string, filename: string): Promise<boolean> => {
    const query = await db.select({id: filesTable.id, filename: filesTable.filename})
        .from(filesTable)
        .where(
            and(
                eq(filesTable.id, id),
                eq(filesTable.filename, filename)
            ));

    console.log(query);
    return query.length > 0;
}