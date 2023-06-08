const Product = require('./../schemas/product.schema')
const { responseCreator } = require('../utils/utils')
const User = require('../schemas/user.schema')
const Order = require('./../schemas/order.schema')

//funcion que recive del localStorage el carrito y y devuelve los precios y las descripciones correctas, si hay articulos que no existen los elimina
async function createOrder(req, res) {
    try {
        const sendCart = req.body
        const id = req.params.id
        const user = await User.findById(id)

        if (user) {
            const cart = sendCart
            const Arts = []

            await Promise.all(
                cart.map(async (art) => {
                    try {
                        const product = await Product.findById(art._id)

                        if (product) {
                            const p = {
                                _id: art._id,
                                title: product.title,
                                description: product.description,
                                date: product.date,
                                price: product.price,
                                img: product.img,
                                quantity: art.quantity,
                            };

                            Arts.push(p);
                        } else {
                            console.warn(`No se encontró el producto con el _id: ${art._id}`)
                        }
                    } catch (error) {
                        console.error(`Error al buscar el producto con el _id: ${art._id}`, error)
                    }
                })
            );

            return responseCreator(res, 200, 'Articulos del carrito obtenidos correctamente', { Arts })
        } else {
            return responseCreator(res, 404, 'Usuario no encontrado');
        }
    } catch (error) {
        console.error('Error al obtener el carrito', error);
        return responseCreator(res, 500, 'Error al obtener el carrito')
    }
}

async function getOrderByEmailUser(req, res) {
    const mail = req.params.mail // Obtener el correo electrónico del usuario de la solicitud
    try {
        // Buscar el usuario por el campo 'mail'
        const user = await User.findOne({ mail }).lean()

        if (!user) {
            return responseCreator(res, 404, 'Usuario no encontrado.')
        }

        // Obtener las órdenes del usuario
        const orders1 = await Order.find({ userId: user._id }).lean()

        if (!orders1 || orders1.length === 0) {
            return responseCreator(res, 404, 'No se encontraron órdenes para el usuario.')
        }

        const orders = orders1.map(order => {
            return {
                ...order,
                _id: order._id.toHexString(),
                userName: user.name,
                userEmail: user.mail
            };
        });
        console.log(orders)
        return responseCreator(res, 200, 'Órdenes obtenidas correctamente', { orders })
    } catch (error) {
        console.log(error)
        return responseCreator(res, 500, 'Error al obtener las órdenes del usuario.')
    }
}


//Funcion que trae todas las ordenes de un usuario.
async function getOrderByUser(req, res) {
    let userId = req.params.id
    try {
        Order.find({ userId })
            .then(order => {
                if (!order) {
                    'No se encontró ninguna orden para el usuario especificado.'
                }
                responseCreator(res, 200, 'Ordenes obtenidas correctamente', { order })
            })
            .catch(error => {
                console.log(error.message)
            })
    } catch (error) {
        responseCreator(res, 500, 'Error', { error })
        console.log(error)
    }
}

//Trae todas las ordenes
async function getOrders(req, res) {
    try {
        const orders1 = await Order.find().lean()

        if (!orders1 || orders1.length === 0) {
            return responseCreator(res, 404, 'No se encontraron órdenes.')
        }

        const userIds = orders1.map(order => order.userId)
        const users = await User.find({ _id: { $in: userIds } }).lean()

        const orders = orders1.map(order => {
            let user = users.find(user => user._id.toString() === order.userId.toString())

            if(user){
                return {
                    ...order,
                    _id: order._id.toHexString(),
                    userName: user.name,
                    userEmail: user.mail
                }
            }

            
        })

        console.log(orders);
        return responseCreator(res, 200, 'Órdenes obtenidas correctamente', { orders })
    } catch (error) {
        console.log(error);
        return responseCreator(res, 500, 'Error al obtener las órdenes.')
    }
}



//funcion que recive del localStorage el carrito y lo guarda en el usuario
async function newOrder(req, res) {
    try {
        let userId = req.user
        let arts = req.body
        let status = "Pagada"
        let quantity = arts.quantity

        let cart = req.body
        console.log(req.body)

        const Arts = []
        let amount = 0
        await Promise.all(
            cart.map(async (art) => {
                try {
                    const product = await Product.findById(art._id)

                    if (product) {
                        const p = {
                            _id: art._id,
                            title: product.title,
                            description: product.description,
                            date: product.date,
                            price: product.price,
                            img: `/assets/img/store/${product.img}`,
                            quantity: art.quantity,
                        };
                        amount += (product.price * art.quantity)
                        Arts.push(p)
                    } else {
                        console.warn(`No se encontró el producto con el _id: ${art._id}`)
                    }
                } catch (error) {
                    console.error(`Error al buscar el producto con el _id: ${art._id}`, error)
                }
            })
        )
        arts = Arts //Guarto todos los datos del articulo, por si en un futuro es eliminado...
        const order = new Order({ userId, arts, amount, status })
        const newOrder = await order.save()

        let data = {
            cart: []
        }
        //Limpio el carrito del usuario
        const updatedUser = await User.findByIdAndUpdate(userId, data)
        return res.status(201).send({
            msg: 'Orden Generada Correctamente',
            order: newOrder,
        })
    } catch (error) {
        console.error('Error al limpiar el carrito:', error)
        return responseCreator(res, 500, 'Error al limpiar el carrito')
    }
}

async function updateOrderStatus(req, res) {

    const id = req.body.id
    const newStatus = req.body.status

    Order.findByIdAndUpdate(id, { status: newStatus }, { new: true })
        .then((updatedOrder) => {
            if (!updatedOrder) {
                return res.status(404).send({
                    msg: 'No se encontró la orden',
                })
            }
            return res.status(200).send({
                msg: 'Orden actualizada correctamente',
                order: updatedOrder,
            })
        })
        .catch((error) => {
            console.log(error);
            return res.status(500).send({
                msg: 'Error al actualizar la orden',
            })
        })
}

async function deleteOrder(req, res) {
    try {
        const id = req.params.id
        const delOrder = await Order.findByIdAndDelete(id)
        if (!delOrder) {
            return res.status(401).send(res = 'No se encontro la orden a borrar')
        }
        return res.status(200).send(res = 'Orden borrada correctamente')

    } catch (error) {
        console.log(error)
        return res.status(500).send('Error')
    }
}

module.exports = {
    createOrder,
    newOrder,
    getOrderByUser,
    getOrders,
    updateOrderStatus,
    deleteOrder,
    getOrderByEmailUser
}

