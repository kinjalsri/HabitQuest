const {Schema, model} = require('mongoose');

const userSchema = new Schema({
    username: {
        type: String,
        required: true,
        unique: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    passwordHash: {
        type: String,
        required: true
    },
    xpTotal: {
        type: Number,
        default: 0
    },
}, {timestamps: true});

const User = model('User', userSchema);

module.exports = User;  