// add all schemas here
module.exports.UserSchema = require('./schema/user');
module.exports.GroupSchema = require('./schema/group');
module.exports.PointBucketSchema = require('./schema/pointBucket');
module.exports.ActivitySchema = require('./schema/activity');

// connect to the database
const mongoose = require('mongoose');
try {
    mongoose.set('strictQuery', false);
    if (process.env.NODE_ENV !== 'test') {
        mongoose.connect(process.env.MONGO_DB_SRV, {
            useUnifiedTopology: true,
            useNewUrlParser: true,
        }).then(({ connection }) => {
            console.log(`Service [Mongoose]: Connected Database \x1b[32m\x1b[1m${connection?.name}\x1b[0m`);
        }, (error) => {
            console.error('Service [Mongoose]: ' + error)
            process.exit(1)
        })
    }

} catch (error) {
    console.error('Service [Mongoose]: ' + error)
    process.exit(1);
}