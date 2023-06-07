const express = require('express')
const router = express.Router()
const viewsController = require('../controllers/views.controller.js')



router.get('/', (req, res)=>{res.render('index')})

router.get('/contact', (req, res)=>{res.render('contact')})

router.get('/register', (req, res)=>{res.render('register')})

router.get('/profile', (req, res)=>{res.render('profile')})

router.get('/login', (req, res)=>{res.render('login')})

router.get('/cart', (req, res)=>{res.render('cart')})

router.get('/wishlist',(req, res)=>{res.render('wishlist')})

router.get('/error',(req, res)=>{res.render('errorAuth')})

router.get('/admin',(req, res)=>{res.render('admin')})

router.get('/orders',(req, res)=>{res.render('orders')})
router.get('/about-us',(req, res)=>{res.render('aboutus')})

module.exports = router