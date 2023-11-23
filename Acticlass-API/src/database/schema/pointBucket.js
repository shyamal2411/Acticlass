const mongoose = require('mongoose');
const { Roles } = require('../../common/constants');

const pointBucketSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'users',
        required: true
    },
    group: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'groups',
        required: true
    },
    isActive: {
        type: Boolean,
        default: true
    },
    points: {
        type: Number,
        default: 0
    }
});

module.exports = mongoose.model('pointBuckets', pointBucketSchema);
