const mongoose = require('mongoose');
const { ACTIVITY_TYPES } = require('../../common/constants');

const activitySchema = new mongoose.Schema({
    type: {
        type: String,
        enum: Object.values(ACTIVITY_TYPES),
        required: true
    },
    timestamp: {
        type: Date,
        required: true,
        default: Date.now
    },
    group: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'groups',
        required: true
    },
    triggerBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'users',
        required: true
    },
    triggerFor: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'activities',
    },
    points: {
        type: Number,
    },
});

module.exports = mongoose.model('activities', activitySchema);
