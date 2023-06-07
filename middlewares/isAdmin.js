const jwt = require('jsonwebtoken')
const secret = require('../config/secret')
const { responseCreator } = require('../utils/utils')
const User = require('../schemas/user.schema')

async function isAdmin(req, res, next) {
    try {
        if (await admin(req.user)) {
            console.log("\x1b[33m Admin User \x1b[0m ")
            next()
        } else {
            console.log("\x1b[31m \x1b[33m NO Admin User \x1b[0m ")
            responseCreator(res, 200, 'Error al ingresar, acceso no autorizado')
        }

    } catch (error) {
        //console.log(error)
        responseCreator(res, 404, 'Error al ingresar')
    }
}

async function admin(id) {
    const user = await User.findById(id)
    if (user.role === 'ADMIN_ROLE') {
        return true
    } else {
        return false
    }

}

module.exports = isAdmin;