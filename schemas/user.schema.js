const mongoose = require('mongoose')
const Schema = mongoose.Schema

const UserSchema = new Schema({
    name: { type: String, required: true, minLength: 6, maxLength: 150 },
    mail: {
        type: String,
        required: true,
        minLength: 6,
        maxLength: 150,
        unique: true,
        index: true,
        validate: {
            validator: function (value) {
                return /^[\w-.]+@([\w-]+.)+[\w-]{2,4}$/.test(value)
            },
            message: props => `${props.value} no es un mail válido`
        }
    },
    pass: { type: String, required: true, minLength: 8, maxLength: 150 },
    role: {
        type: String,
        required: true,
        default: 'USER_ROLE',
        enum: [
            'ADMIN_ROLE',
            'USER_ROLE'
        ]
    },
    gender:{type: String},
    country: { type: String, required: true },
    wish: [],
    cart: [],
    img: { type: String },
    bornDate: { type: String },
    createdAt: { type: Date, default: Date.now },
    therms:{ type: Boolean, required: true },
})


module.exports = mongoose.model('User', UserSchema)
