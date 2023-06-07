const express = require('express');
const router = express.Router();
const wishControler = require('../controllers/wish.controller')
const jwtVerify = require('../middlewares/jwtVerify')



//Obtener datos de los articulos de la lista de deseos
router.get('/api/wish/:id', jwtVerify, wishControler.getWish)

//Guardar el localstorage del cliente en mongo
router.post('/api/save-wish/:id', jwtVerify, wishControler.saveWish)


module.exports = router