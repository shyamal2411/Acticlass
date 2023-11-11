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

// Delete all point buckets associated with this group
groupSchema.pre('deleteOne', function (next) {
    const groupId = this.getQuery()["_id"];
    mongoose.model('pointBuckets').deleteMany({ group: groupId }).then((result) => {
        next();
    }).catch((err) => {
        next(err);
    });
});

module.exports = mongoose.model('groups', groupSchema);