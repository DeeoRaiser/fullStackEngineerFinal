const Product = require('./../schemas/product.schema');
const { responseCreator } = require('../utils/utils')
const User = require('../schemas/user.schema')

//funcion que recive del localStorage el carrito y y devuelve los precios y las descripciones correctas, si hay articulos que no existen los elimina
async function getCart(req, res) {
    try {
        const sendCart = req.body
        console.log("Usuario del carrito" + req.user)
        console.log(req.body)

        const id = req.user
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


//Funcion para los Admin, recupera el carrito de cualquier usuario por su ID
async function getCartById(req, res){

}



//funcion que recive del localStorage el carrito y lo guarda en el usuario
async function saveCart(req, res) {

    console.log(req.user)
    try {
        let userId = req.user
        let cart = req.body

        let userCart = await User.findById(userId)

        if (userCart) {
            let newCart = []
            for (const art of cart) {
                const { _id, quantity } = art

                // Validar que los campos _id y quantity existan y sean del tipo esperado
                if (_id && typeof _id === 'string' && quantity && typeof quantity === 'number') {
                    // Guardar los campos _id y quantity en la colección de datos válidos
                    newCart.push({ _id, quantity })
                }
            }

            let data = {
                cart: newCart
            }

            const updatedUser = await User.findByIdAndUpdate(userId, data)

            if (updatedUser) {
                return responseCreator(res, 200, 'El carrito se guardó con éxito')
            }
        } else {
            return responseCreator(res, 400, 'Error: No se pudo encontrar el usuario')
        }
    } catch (error) {
        console.error('Error al guardar el carrito:', error)
        return responseCreator(res, 500, 'Error al guardar el carrito')
    }
}



module.exports = {
    getCart,
    saveCart,
    getCartById
}