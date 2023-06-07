const User = require('../schemas/user.schema')

const { responseCreator } = require('../utils/utils')
const bcrypt = require('bcrypt')
const saltRounds = 10;
const jwt = require('jsonwebtoken')
const secret = require('../config/secret')


async function postUser(req, res) {
    try {
        const { name, mail, pass, gender, country, bornDate, therms } = req.body

        // Verificar si el usuario ya existe
        const existingUser = await User.findOne({ mail })
        if (existingUser) {
            console.log(mail)
            return res.status(401).send({ msg: 'El mail ingresado ya existe' })
        }

        // Crear el nuevo usuario
        const user = new User({ name, mail, pass, gender, country, bornDate, therms })
        user.role = "CLIENT_ROLE"
        const passwordHash = bcrypt.hashSync(user.pass, saltRounds)
        user.pass = passwordHash
        const newUser = await user.save()

        return res.status(201).send({
            msg: 'Usuario creado correctamente',
            user: newUser,
        });
    } catch (error) {
        console.log(error);
        return res.status(500).send({ msg: 'Error al crear usuario' })
    }
}

async function getUser(req, res) {
    const id = req.params.id
    try {
        const user = await User.findById(_id, { password: 0, __v: 0 }) //esta es otra forma de descartar el password
        // const user1 = await User.findById(id, {password: 1}) //si yo pongo esto asi, solamente me traeria la contra

        if (!user) return responseCreator(res, 404, 'No se encontro el usuario')

        // user.password = undefined
        return responseCreator(res, 200, 'Usuario encontrado', { user })

    } catch (error) {
        console.log(error)
        return responseCreator(res, 500, 'No se pudo obtener el usuario')
    }
}

async function getUserName(req, res) {
    const searchTerm = req.params.name; // El término de búsqueda ingresado

    try {
        // Utilizamos una expresión regular para buscar por término parcial o completo
        const users = await User.find({ name: { $regex: searchTerm, $options: 'i' } }, { password: 0, __v: 0 })

        if (users.length === 0) {
            return responseCreator(res, 404, 'No se encontraron usuarios')
        }
        console.log(users)
        return responseCreator(res, 200, 'Usuarios encontrados', { users })
    } catch (error) {
        console.log(error)
        return responseCreator(res, 500, 'No se pudo obtener los usuarios')
    }
}

async function getAllUsers(req, res) {
    try {
        const users = await User.find();

        if (!users) return res.status(404).send({ msg: `No se encontraron usuarios` })
        return responseCreator(res, 200, 'Usuarios obtenidos correctamente', { users: users }) //se pone esto asi para que cada vez que enviemos el users se cree el objeto users en la respuesta como nombre y reciba el valor, clase 62 min 25-29

    } catch (error) {
        console.log(error);
        return responseCreator(res, 500, 'Error al obtener usuarios')
    }
}

async function deleteUser(req, res) {
    try {
        const id = req.params.id
        const deletedUser = await User.findByIdAndDelete(id)
        if (!deletedUser) return responseCreator(res, 404, 'No se encontro el usuario')

        return responseCreator(res, 200, 'Usuario borrado correctamente', { deleteUser })

    } catch (error) {   //clase 62 min 39 - 47 enseña como hacer funciones automatizadas, que vos escribas una palabra y te escriba algo que escribis muy seguido,//!- Snippet
        console.log(error)
        responseCreator(res, 500, 'No se pudo eliminar el usuario')
    }
}

const login = async (req, res) => {
    try {

        //email y contraseña
        const mailLogin = req.body.email;
        const passwordLogin = req.body.pass;

        //Checkeo que me hayan enviado todos los datos requeridos para el login
        if (!mailLogin || !passwordLogin) {
            return res.status(404).send({ msg: `Datos del login incomplentos` })
        }

        //Buscar si existe el mail
        const user = await User.findOne({ mail: mailLogin })

        if (!user) {
            return res.status(404).send({ msg: `El usuario y/o la contraseña son incorrectos` })
        }

        //Comparo password enviado con el pass del usuario en la DB
        const validatePass = await bcrypt.compare(passwordLogin, user.pass)

        if (!validatePass) {
            return res.status(404).send({ msg: `El usuario y/o la contraseña son incorrectos` })
        }

        const body = {
            user: user._id,
        }
        const token = jwt.sign(body, secret)

        console.log(user)
        return res.status(200).send({
            msg: `Login correcto`,
            user,
            token
        })


    } catch (error) {
        console.log(error);
        return res.status(500).send(`No se pudo realizar el login`)
    }
}

async function updateUser(req, res) {
    let data = {}

    if (req.body.img) {
        data = { name: req.body.img }
    } else {
        data = {
            name: req.body.name,
            mail: req.body.mail,
            bornDate: req.body.bornDate,
            country: req.body.country,
            gender: req.body.gender
        }
    }

    try {
        const updatedUser = await User.findByIdAndUpdate(req.user, data, { new: true })
        //TRUE:Si mi usuario se actualizo correctamente, me lo devuelve

        if (!updatedUser) responseCreator(res, 404, 'No se encontro el usuario')

        return responseCreator(res, 200, 'Usuario actualizado correctamente', { user: updatedUser })

    } catch (error) {
        console.log(error)
        responseCreator(res, 500, error.codeName)
    }
}

async function updateUserImage(req, res) {
    console.log(req.body)

    let data = {
        img: req.body.image
    }
    try {
        const updatedUser = await User.findByIdAndUpdate(req.user, data, { new: true })
        console.log(updatedUser)
        if (!updatedUser) responseCreator(res, 404, 'No se encontro el usuario')
        return responseCreator(res, 200, 'Usuario actualizado correctamente')
    } catch (error) {
        console.log(error)
        responseCreator(res, 500, error.codeName)
    }
}

async function updatePassword(req, res) {
    try {
        const id = req.params.id
        const oldPassword = req.body.oldPassword;
        let newPassword = req.body.newPassword;

        const user = await User.findById(id)

        if (!user) responseCreator(res, 412, 'No se encontro el usuario')
        const pwdCompare = await bcrypt.compare(oldPassword, user.password)

        if (!pwdCompare) responseCreator(res, 411, 'No se pudo modificar la contraseña') //porque no coincide con la contraseña vieja

        newPassword = await bcrypt.hash(newPassword, saltRounds);

        await User.findByIdAndUpdate(id, { password: newPassword })

        return responseCreator(res, 200, 'Password actualizado correctamente!')


    } catch (error) {
        console.log(error)
        responseCreator(res, 500, 'No se pudo actualizar el usuario')
    }
}

async function getProfileUser(req, res) {
    const user = await User.findOne({ _id: req.user })

    return res.status(200).send({
        msg: `User Profile`,
        user
    })
}

async function adminPanel(req, res) {
    ("\x1b[31m AdminPanel \x1b[0m ")
    return res.status(200).send({ msg: 'AdminUser' })
}


async function updateRole(req, res) {
    let data = {}
    console.log(req.body.role)

    data = {
        role: req.body.role,
    }
    
    try {
        const updatedUser = await User.findByIdAndUpdate(req.user, data, { new: true })
        //TRUE:Si mi usuario se actualizo correctamente, me lo devuelve

        if (!updatedUser) responseCreator(res, 404, 'No se encontro el usuario')

        return responseCreator(res, 200, 'Usuario actualizado correctamente', { user: updatedUser })

    } catch (error) {
        console.log(error)
        responseCreator(res, 500, error.codeName)
    }
}

module.exports = {
    postUser,
    getUser,
    getAllUsers,
    deleteUser,
    login,
    updateUser,
    updatePassword,
    updateUserImage,
    getProfileUser,
    adminPanel,
    updateRole,
    getUserName

}