import * as crypto from "node:crypto";
export function generateRandomString(length: number) {
    return crypto.randomBytes(length).toString('hex').slice(0, length);
}