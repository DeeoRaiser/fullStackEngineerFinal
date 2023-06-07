const express = require('express');
const router = express.Router();
const orderControler = require('../controllers/order.controller')
const jwtVerify = require('../middlewares/jwtVerify')
const isAdmin = require('../middlewares/isAdmin')



//Obtener datos de los articulos del carrito
//router.post('/api/order/:id', jwtVerify, orderControler.createOrder)

//Guardar el localstorage del cliente en mongo
router.post('/api/generate-order/:id', jwtVerify, orderControler.newOrder)

//Obtener las ordenes de un usuario por ID
router.get('/api/get-order-by-user/:id', jwtVerify, orderControler.getOrderByUser)

//Obtengo todas las ordenes
router.get('/api/get-orders', jwtVerify, isAdmin, orderControler.getOrders)

//Cambiar el status de una orden
router.put('/api/order/status', jwtVerify, isAdmin, orderControler.updateOrderStatus)

//Eliminar una orden
router.delete('/api/order/delete/:id', jwtVerify, isAdmin, orderControler.deleteOrder)

router.get('/api/order/getuser/:mail',jwtVerify, isAdmin, orderControler.getOrderByEmailUser)

module.exports = router