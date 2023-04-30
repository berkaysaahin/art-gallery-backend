const { logEvents } = require('./logger')

const errorHandler = (err, req, res, next) => {
    logEvents(`${err.name}: ${err.message}\t${req.method}\t${req.url}\t${req.headers.origin}`, 'errLog.log')
    console.log(err.stack)

    const status = res.statusCode ? res.statusCode : 500 //server error

    // ternary, an alternative to if...else. takes three operands: a condition followed by ?, then two conditions, which are truthy and falsy 
    res.status(status)

    res.json({ message: err.message })

}

module.exports = errorHandler