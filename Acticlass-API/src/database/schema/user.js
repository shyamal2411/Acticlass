const mongoose = require('mongoose');
const { Roles } = require('../../common/constants');

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    institute: {
        type: String,
        required: true
    },
    role: {
        type: String,
        enum: Object.values(Roles),
        required: true
    },
    password: {
        type: String,
        required: true
    }
});

module.exports = mongoose.model('users', userSchema);
