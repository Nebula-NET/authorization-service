import App from './app';
import * as  morgan from 'morgan'
import * as bodyParser from 'body-parser';
import * as cors from 'cors'
import {createConnection} from 'typeorm';
import './cron';
import { checkLanguage } from 'middlewares/checkLang';

const { createLogger, format, transports } = require("winston");
const { combine, splat, timestamp, printf } = format;
const myFormat = printf(({ level, message, timestamp, ...metadata }) => {
    let msg = `[${level}] ${message} `;
    return msg;
});
  
export const logger = createLogger({
    format: combine(format.colorize(), splat(), timestamp(), myFormat),
    transports: [new transports.Console({ level: "info" })],
});
  

require('dotenv').config()

async function main(){        

    await createConnection({
        "type": "mysql",
        "host": process.env.DATABASE_HOST,
        "port": parseInt(process.env.DATABASE_PORT),
        "username": process.env.DATABASE_USERNAME,
        "password": process.env.DATABASE_PASSWORD,
        "database": process.env.DATABASE_NAME,
        "synchronize": true,
        "logging": false,
        "entities": [ 
           __dirname + "/entities/*.entity."+`${process.env.ENVIROMENT == 'dev' ? 'ts' : 'js'}`
        ]
    })

     
    



    const app = new App({
        port: process.env.PORT ? parseInt(process.env.PORT) : 5000,
        controllers: [
            
        ],
        middleWares: [
            cors(),
            bodyParser.json(),
            bodyParser.urlencoded({extended : false}),
            morgan(':method :url :status - :response-time ms'),
            checkLanguage
        ]
    })
    app.listen() 
}

main()