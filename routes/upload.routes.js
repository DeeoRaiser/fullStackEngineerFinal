const express = require('express');
const router = express.Router();
const uploadController = require('../controllers/upload.controller')
const productController = require('../controllers/product.controller')
const userController = require('../controllers/user.controller')
const isAdmin = require('../middlewares/isAdmin')
const jwtVerify = require('../middlewares/jwtVerify')


// Cargar image de producto
router.post('/product/upload/image',jwtVerify,isAdmin, uploadController.uploadProduct, productController.addProduct)

router.put('/product/:id',jwtVerify,isAdmin, uploadController.uploadProduct, productController.updateProduct)

router.put('/user/profile/image',jwtVerify, uploadController.uploadUserAvatar, userController.updateUserImage)

module.exports = router