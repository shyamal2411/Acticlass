const jwt = require('jsonwebtoken');
const { UserSchema } = require('../../../database');
const { hash, compare } = require('../../../services/bcrypt');
const { sendMail } = require('../../../services/nodeMailer');

const NodeCache = require('node-cache');
const cache = new NodeCache();

function storeResetPasswordCode(email, code) {
    cache.set(email, code, 300);
}


// Function to create a new user account
const register = async (req, res) => {
    const { name, email, institute, role, password } = req.body;

    if (!name || !email || !password || !role || !institute) {
        return res.status(400).json({ msg: 'Please enter all fields' });
    }

    const u = await UserSchema.findOne({ email });
    if (u) {
        return res.status(400).json({ msg: 'User already exists' });
    }

    hash(password).then(async (hashedPassword) => {
        const data = {
            name,
            email,
            role,
            institute,
            password: hashedPassword
        }
        const user = new UserSchema(data);
        await user.save();
        delete data.password;
        const token = jwt.sign({ user: { data } }, process.env.JWT_SECRET, { expiresIn: "7d" });
        return res.status(201).json({ user: data, token });
    });
}

// Function to log in an existing user
const login = async (req, res) => {
    // Implementation logic here
    const { email, password } = req.body;
    if (!email || !password) {
        return res.status(400).json({ msg: 'Please enter all fields' });
    }

    UserSchema.findOne({ email }).then((user) => {
        if (!user) {
            return res.status(400).json({ msg: 'User does not exist' });
        }
        compare(password, user.password).then((match) => {
            if (match) {
                const data = {
                    name: user.name,
                    email: user.email,
                    role: user.role,
                    institute: user.institute,
                }
                const token = jwt.sign({ data }, process.env.JWT_SECRET, { expiresIn: "7d" });
                return res.status(200).json({ user: data, token });
            }
            return res.status(400).json({ msg: 'Invalid credentials' });
        });
    });
}

// Function to send a code to reset password to a user's email
const forgotPassword = async (req, res) => {
    const { email } = req.body;
    const code = Math.floor(100000 + Math.random() * 900000);
    sendMail(email, 'Reset Password', `Your reset password code is ${code}`, (err) => {
        if (err) {
            return res.status(500).json({ msg: 'Internal server error' });
        }
        storeResetPasswordCode(email, code);
        return res.status(200).json({ msg: 'Code sent successfully' });
    });
}

// Function to verify reset password code from cache
const verifyResetPasswordCode = async (req, res) => {
    const { email, code } = req.body;
    const cachedCode = cache.get(email);
    if (cachedCode === code) {
        UserSchema.findOne({ email }).then((user) => {
            if (!user) {
                return res.status(400).json({ msg: 'User does not exist' });
            }
            const data = {
                name: user.name,
                email: user.email,
                role: user.role,
                institute: user.institute,
            }
            const token = jwt.sign({ data }, process.env.JWT_SECRET, { expiresIn: "7d" });
            return res.status(200).json({ token, msg: 'Code verified successfully' });
        });
    } else {
        return res.status(400).json({ msg: 'Invalid code' });
    }
}

// Function to change a user's password
const changePassword = async (req, res) => {
    const { email, password } = req.body;
    UserSchema.findOne({ email }).then((user) => {
        if (!user) {
            return res.status(400).json({ msg: 'User does not exist' });
        }
        hash(password).then(async (hashedPassword) => {
            await UserSchema.updateOne({ email }, { password: hashedPassword });
            return res.status(200).json({ msg: 'Password changed successfully' });
        });
    });
}


// Function to delete a user's profile
const deleteProfile = async (req, res) => {
    const { email } = req.user;
    if (!email) {
        return res.status(400).json({ msg: 'Email is required!' });
    }
    UserSchema.deleteOne({ email }).then(() => {
        return res.status(200).json({ msg: 'User deleted successfully' });
    });
}

module.exports = {
    register,
    login,
    forgotPassword,
    changePassword,
    verifyResetPasswordCode,
    deleteProfile
};
