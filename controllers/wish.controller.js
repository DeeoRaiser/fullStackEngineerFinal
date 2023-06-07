const Product = require('./../schemas/product.schema');
const { responseCreator } = require('../utils/utils')
const User = require('../schemas/user.schema')

//funcion que recive del localStorage el carrito y y devuelve los precios y las descripciones correctas, si hay articulos que no existen los elimina
async function getWish(req, res) {
    
    try {
        const id = req.params.id
        const user = await User.findById(id)

        if (user) {
            const wish = Object.values(req.query)
            const Arts = []
            console.log(wish)
            await Promise.all(
                wish.map(async (art) => {
                    try {
                        const product = await Product.findById(art)
                        if (product) {
                            Arts.push(product);
                        } else {
                            console.warn(`No se encontró el producto con el _id: ${art._id}`)
                        }
                    } catch (error) {
                        console.error(`Error al buscar el producto con el _id: ${art._id}`, error)
                    }
                })
            )
            return responseCreator(res, 200, 'Articulos de la lista de deseos obtenidos correctamente', { Arts })
        } else {
            return responseCreator(res, 404, 'Usuario no encontrado');
        }
    } catch (error) {
        console.error('Error al obtener la lista de deseos', error);
        return responseCreator(res, 500, 'Error al obtener la lista de deseos')
    }
}


//funcion que recive del localStorage el carrito y lo guarda en el usuario
async function saveWish(req, res) {
    try {
        let userId = req.body.data.user
        let cart = req.body.obj

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
    getWish,
    saveWish
}