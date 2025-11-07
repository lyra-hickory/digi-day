
const { format } = require("date-fns")
const { v4: uuid } = require("uuid");

const fs = require("fs");
const fsPromises = require("fs").promises;
const path = require("path");


const logEvents = async(msg, logName) => {
    const dateTime = `${format(new Date(), 'yyyyMMdd\tHH:mm:ss')}`
    const logItem = `${dateTime}\t${uuid()}\t${msg}\n`

    const logPath = path.join(__dirname, 'logs');

    try {
        if(!fs.existsSync(logPath)) {
            await fsPromises.mkdir(logPath)
        }
        await fsPromises.appendFile(path.join(logPath, logName), logItem);
    } catch(err) {
        console.log(err);
    }
}

module.exports = logEvents;
