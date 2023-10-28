const mongoose = require('mongoose');
const { DEFAULT_RADIUS, ATTENDANCE_FREQUENCY } = require('../../common/constants');


const groupSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    institute: {
        type: String,
        required: true
    },
    members: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'users'
    }],
    createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'users',
        required: true
    },
    radius: {
        type: Number,
        default: DEFAULT_RADIUS,
        required: true,
        min: 0
    },
    passingPoints: {
        type: Number,
        default: 0
    },
    attendanceFrequency: {
        type: Number,
        default: 0, // in minutes
        validate: {
            validator: function (value) {
                return ATTENDANCE_FREQUENCY.includes(value);
            },
            message: 'Invalid attendance frequency'
        },
        required: true
    },
    attendanceReward: {
        type: Number,
        default: 0,
        min: 0
    },
    penalty: {
        type: Number,
        default: 0,
        min: 0
    },
});

module.exports = mongoose.model('groups', groupSchema);