const Product = require('./../schemas/product.schema');
const { responseCreator } = require('../utils/utils')

const getAllProducts = (req, res) => {
    Product.find().then((productos) => {
        responseCreator(res, 200, 'Productos obtenidos correctamente', {
            productos
        })

    }).catch((error) => {
        console.log(error)
    })
} 

//Funcion para agregar un nuevo producto
function addProduct(req, res) {

    const product = new Product({
        img: req.body.image,
        title: req.body.title,
        description: req.body.description,
        date: dateToUnix(req.body.date),
        price: req.body.price,

    })
    product.save()
        .then((product) => {
            return res.status(200).send({
                msg: 'Productos guardado correctamente',
                product
            })
        }).catch(error => {
            console.log(error);
            return res.status(500).send(`El producto no se pudo guardar`)
        })
}

//Funcion para eliminar un producto
const deleteProduct = async (req,res) => {
    try {
        const id = req.params.id
        console.log("Id broducto a borrar  " + id)
        const delProd = await Product.findByIdAndDelete(id)
        if(!delProd){
            return res.status(401).send(res = 'No se encontro el producto a borrar')
            }
        return res.status(200).send(
            'Producto borrado correctamente'
        )
    
    }catch(error) {
        console.log(error)
        return res.status(500).send('Error')
    }
}

//Funcion para obtener todos los datos de un producto
function getProduct(req, res) {
    const id = req.params.id
    if (!id) {
        return res.status(400).send({
            msg: `Es necesario que mande un ID`
        })
    }
    Product.findById(id).then((product) => {
        if (!product) {
            return res.status(404).send({
                msg: `No se encontro el producto`
            })
        }
        return res.status(200).send({
            msg: `Producto encontrado`,
            product
        })
    }).catch((error) => {
        console.log(error);
        return res.status(500).send({
            msg: `Error al obtener el producto`
        })
    })

}


//Obtener los articulos por paginas
const page = (req, res) => {
    const page = parseInt(req.params.page) || 1 // La página actual, predeterminada a 1 si no se proporciona
    const limit = parseInt(req.query.limit) || 100 // El número de registros que se deben devolver por página, predeterminado a 10 si no se proporciona

    // Calcular el número de registros que se deben omitir en la consulta
    const skip = (page - 1) * limit

    // Consultar la base de datos para devolver los registros correctos
    Product.find()
        .skip(skip)
        .limit(limit)
        .exec()
        .then((registros) => {
            return res.json({
                registros,
                currentPage: page,
                totalPages: Math.ceil(12 / limit),
                totalCount: 12,
            });
        })
        .catch((err) => {
            console.log(err)
            return res.status(500).json({ error: err.message });
        })
}

//Actualizar un producto
const updateProduct = async (req, res) => {
    const productId = req.params.id;
    // Obtener los datos enviados en la solicitud para editar el producto
    const updatedProduct = new Product ({
        _id:productId,
        img: req.body.image,
        title: req.body.title,
        description: req.body.description,
        date: dateToUnix(req.body.date),
        price: req.body.price,
    })

    Product.findByIdAndUpdate(productId, updatedProduct, { new: true })
        .then((product) => {
            if (!product) {
                return res.status(404).send({
                    msg: 'Producto no encontrado',
                });
            }
            return res.status(200).send({
                msg: 'Producto editado correctamente',
                product
            });
        })
        .catch((error) => {
            console.log(error);
            return res.status(500).send(`No se pudo editar el producto`);
        });
}


//Funcion para transformar la fecha tradicional a una unix
function dateToUnix(dateString) {
    const [year, month, day] = dateString.split('-');
    const formattedDate = `${month}/${day}/${year}`;
    const unixDate = new Date(formattedDate).getTime() / 1000;
    return unixDate;
}

module.exports = {
    getAllProducts,
    addProduct,
    deleteProduct,
    getProduct,
    page,
    updateProduct
}