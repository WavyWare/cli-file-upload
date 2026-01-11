import chalk, {ChalkInstance} from 'chalk';
import {Request, Response, NextFunction} from "express";

type HttpMethod = 'GET' | 'POST' | 'PUT' | 'DELETE';

const logger = (req: Request, res: Response, next: NextFunction) => {
    const methodColors: Record<string, ChalkInstance> = {
        GET: chalk.greenBright,
        POST: chalk.blueBright,
        PUT: chalk.yellowBright,
        DELETE: chalk.redBright,
        PATCH: chalk.rgb(255,0,255)
    }
    const statusColors: Record<string, ChalkInstance> = {
        '1': chalk.yellowBright,
        '2': chalk.greenBright,
        '3': chalk.yellowBright,
        '4': chalk.redBright,
        '5': chalk.red
    }

    const method = req.method as HttpMethod;
    const methodColor: ChalkInstance = methodColors[method] || chalk.white;
    res.on('finish', () => {
        const statusCode: number = res.statusCode;
        const statusColor: ChalkInstance = statusColors[statusCode.toString().substring(0,1)];
        console.log(
            `${methodColor.bold(req.method)} ${req.protocol}://${req.get('host')}${req.originalUrl} ${statusColor.bold(statusCode)}`
        );
    })
    next();
}

export default logger;