const jwt = require('jsonwebtoken')
const secret = require('../config/secret')
const { responseCreator } = require('../utils/utils')


async function jwtVerify(req, res, next) {
    try {
        const token = req.headers.authorization
        
        const payload = jwt.verify(token, secret)
        req.user = payload.user
        if(payload){
            console.log(`\x1b[35m Token valido \x1b[0m User Id: ${payload.user}`)
            next()
        }else{
            console.log("\x1b[31m Token invalido \x1b[0m ")
            //responseCreator(res, 201, 'Error al ingresar, token no valido')
        }
    } catch (error) {
        console.log(error)
        console.log("\x1b[31m Token invalido \x1b[0m ")
        responseCreator(res, 201, 'Error al ingresar, token no valido')
    }
}

module.exports = jwtVerify;