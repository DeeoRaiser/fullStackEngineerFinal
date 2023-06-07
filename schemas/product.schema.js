const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const productSchema = new Schema({
    title: { type: String, required: true, minLength: 3, maxLength: 30 },
    date: { type: String, required: true },
    price: { type: Number, required: true, minLength: 0, maxLength: 10000000 },
    description: { type: String, required: true, minLength: 10, maxLength: 10000000 },
    img: { type: String } // No se establece como requerido inicialmente, pero si es requerido en el new
});

productSchema.path('img').required(function() {
    // Se verifica si el documento está siendo creado (isNew) o editado (!isNew)
    return !this.isNew || (this.isNew && this.img);
});

module.exports = mongoose.model('Product', productSchema);