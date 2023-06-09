const allowedOrigins = require('./allowedOrigins')

const corsOptions = {
    //lookup callback
    origin: (origin, callback) => {
        if (allowedOrigins.indexOf(origin) !== -1 || !origin) {
            callback(null, true)
        } else {
            callback(new Error('Not allowed by CORS'))
        }
    },
    credentials: true,
    optionsSuccessStatus: 200
}

//token ile de yapılabilir

module.exports = corsOptions