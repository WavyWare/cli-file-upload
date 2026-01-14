import {filesTable} from "../db/schema";
import {db} from "../index";
import {inArray} from "drizzle-orm/sql/expressions/conditions";

export const checkExpirationDate = async () => {
    let result = await db.select({id: filesTable.id, expirationDate: filesTable.expiration_date}).from(filesTable);
    result = result.filter((file) => parseInt(file.expirationDate) <= Date.now() );
    let idsArray: string[] = result.map((file) => file.id);
    await db.delete(filesTable).where(inArray(filesTable.id, idsArray));
}