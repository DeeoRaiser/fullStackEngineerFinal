const express = require('express')
const router = express.Router()
const jwtVerify = require('../middlewares/jwtVerify')
const isAdmin = require('../middlewares/isAdmin')

const productController = require('./../controllers/product.controller')
const uploadController = require('./../controllers/upload.controller')

//Obtener todos los productos
router.get('/products', productController.getAllProducts)

//Obtener un producto por ID
router.get('/product/:id', productController.getProduct)

//Eliminar un producto por ID
router.delete('/product/:id', jwtVerify, isAdmin, productController.deleteProduct)


router.get('/api/page/:page', productController.page)


module.exports = router

