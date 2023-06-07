const express = require('express');
const router = express.Router();
const cartControler = require('../controllers/cart.controller')
const jwtVerify = require('../middlewares/jwtVerify')
const isAdmin = require('../middlewares/isAdmin')


//Obtener datos de los articulos del carrito del usuario
router.post('/api/cart', jwtVerify, cartControler.getCart)

//Obtener datos de los articulos del carrito de cualquier usuario siempre que sea solicitado por un admin
router.get('/api/cart/:id', jwtVerify, isAdmin, cartControler.getCartById)

//Guardar el localstorage del cliente en mongo
router.post('/api/save-cart', jwtVerify, cartControler.saveCart)


module.exports = router