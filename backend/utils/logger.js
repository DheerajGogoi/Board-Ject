const { createLogger, transports, format } = require('winston');

const logger = createLogger({
    transports: [
        new transports.Console({
            filename: 'activity.log',
            level: 'info',
            format: format.combine(format.timestamp(), format.json())
        }),
        new transports.Console({
            filename: 'activity.log',
            level: 'error',
            format: format.combine(format.timestamp(), format.json())
        }),
        new transports.Console({
            filename: 'activity.log',
            level: 'activity',
            format: format.combine(format.timestamp(), format.json())
        }),
    ]
})

module.exports = logger;
