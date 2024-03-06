// utils/logger.ts
import { existsSync, mkdirSync } from "fs"
import { join } from "path"

import { createLogger, format, transports } from "winston"

// Create a log directory if it doesn't exist
const logDirectory = join(__dirname, "../../", "logs")
if (!existsSync(logDirectory)) {
    mkdirSync(logDirectory)
}

const logFormat = format.combine(
    format.timestamp(),
    format.printf(({ timestamp, level, message }) => {
        return `${timestamp} ${level}: ${message}`
    })
)

const today = new Date()
const dateString = `${today.getFullYear()}-${today.getMonth() + 1}-${today.getDate()}`

const logger = createLogger({
    level: "info",
    format: logFormat,
    transports: [
        new transports.Console(),
        new transports.File({
            filename: join(logDirectory, dateString, "app.log"),
            maxsize: 1000000,
            maxFiles: 5,
        }),
    ],
})

export default logger
