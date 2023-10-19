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
        ref: 'users'
    },
    radius: {
        type: Number,
        default: DEFAULT_RADIUS,
        required: true
    },
    passingPoints: {
        type: Number,
        default: 0
    },
    attendanceFrequency: {
        type: Number,
        default: 0, // in minutes
        enum: ATTENDANCE_FREQUENCY, // in minutes
        required: true
    },
    attendanceReward: {
        type: Number,
        default: 0
    },
    penalty: {
        type: Number,
        default: 0
    },
});

module.exports = mongoose.model('groups', groupSchema);