const mongoose = require('mongoose');

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
        enum: ['Teacher', 'Student'],
        required: true
    },
    password: {
        type: String,
        required: true
    }
});

module.exports = mongoose.model('users', userSchema);
