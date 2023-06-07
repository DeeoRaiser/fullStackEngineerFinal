const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const orderSchema = new Schema({
    userId: { type: String, required: true },
    arts: { type: Object, required: true },
    amount: { type: Number, required: true, minLength: 0, maxLength: 100000000 },
    status: {
        type: String,
        required: function() {
            return this.isNew;
        },
        enum: [
            'Pagada',
            'Procesada',
            'En Proceso de envio',
            'Entregada'
        ]
    }
});

orderSchema.pre('save', function(next) {
    if (!this.isModified('status')) {//solo modifico el status
        return next();
    }
    next();
});

module.exports = mongoose.model('Order', orderSchema);