const bcrypt = require('bcrypt');


async function hash(password) {
    const salt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash(password, salt);
    return hash;
}

async function compare(password, hash) {
    const match = await bcrypt.compare(password, hash);
    return match;
}

module.exports = { hash, compare };
