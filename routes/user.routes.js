const express = require('express');
const router = express.Router();
const userController = require('../controllers/user.controller')
const jwtVerify = require('../middlewares/jwtVerify')
const isAdmin = require('../middlewares/isAdmin')


//GET - Leer todos los usuarios
router.post('/users',jwtVerify, isAdmin, userController.getAllUsers)

//POST - Crear usuario
router.post('/register', userController.postUser)

//GET - Leer usuario
//router.get('/users/:id', userController.getUser)

//GET - Profile
router.get('/api/profile', jwtVerify, userController.getProfileUser)

//POST - Login
router.post('/api/login', userController.login)

//DELETE - Borrar usuario
router.delete('/user/:id',jwtVerify, isAdmin, userController.deleteUser)

//PUT - Actualizar usuario
router.put('/user/profile', jwtVerify, userController.updateUser)

//PUT - Actualizar Contraseña
router.put('/users/password', jwtVerify, userController.updatePassword) //va a ser un endpoint especifico para cambiar el password

//router.get('/users/:id/password', userController.updatePassword)

router.post('/user/admin',jwtVerify,isAdmin,userController.adminPanel)

module.exports = router