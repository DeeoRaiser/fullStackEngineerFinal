const express = require('express')
const app = express()
const viewsRouter = require('./routes/views.routes')
const uploadRouter = require('./routes/upload.routes')
const productRoutes = require('./routes/product.routes')
const userRoutes = require('./routes/user.routes')
const cartRoutes = require('./routes/cart.routes')
const wishListRouter = require('./routes/wishlist.routes')
const orderRouter = require('./routes/order.routes')
const cors = require('cors')
const path = require('path');



//Cargar configuracion de plantillas JS
app.set('view engine', 'ejs')
app.set('views', path.join(__dirname, 'views'))

//Middlewares
app.use(express.json())

//Evitar Cors Error
app.use(cors())

//Rutas a usar con mi app express
app.use(viewsRouter)
app.use('/', [productRoutes, userRoutes, cartRoutes, wishListRouter, orderRouter, uploadRouter])
app.use(express.static('public'));



module.exports = app 