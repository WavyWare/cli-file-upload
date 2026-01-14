import {NextFunction, Response, Request} from "express";
import {checkExpirationDate} from "../services/checkExpirationDate";

export const checkExpirationDateOnDownload = async (req: Request, res: Response, next: NextFunction) => {
    await checkExpirationDate();
    next();
}