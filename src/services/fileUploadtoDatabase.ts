import { db } from "..";
import fileDataInterface from "../interfaces/fileDataInterface";
import {filesTable} from "../db/schema";
import {generateRandomString} from "../util";

export const fileUploadtoDatabase = async (fileData: fileDataInterface): Promise<boolean> => {
    const insert = await db.insert(filesTable)
        .values({id: fileData.id, filename: fileData.filename})
        .onConflictDoUpdate({
            target: filesTable.id,
            set: { id: generateRandomString(8)}
        }).returning({id: filesTable.id});
    return insert.length > 0;
}