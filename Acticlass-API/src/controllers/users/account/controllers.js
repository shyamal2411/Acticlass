const jwt = require('jsonwebtoken');
const { UserSchema, PointBucketSchema, GroupSchema } = require('../../../database');
const { hash, compare } = require('../../../services/bcrypt');
const { sendMail } = require('../../../services/nodeMailer');

const NodeCache = require('node-cache');
const { isEmpty } = require('lodash');
const { Roles, JWT_EXPIRATION_TIME } = require('../../../common/constants');
const cache = new NodeCache();

function storeResetPasswordCode(email, code) {
    cache.set(email, code, 300);
}

const generateToken = (user) => {
    const data = {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        institute: user.institute,
    }
    const token = jwt.sign({ data }, process.env.JWT_SECRET, { expiresIn: JWT_EXPIRATION_TIME });
    return token;
}



// Function to create a new user account
const register = async (req, res) => {
    const { name, email, institute, role, password } = req.body;

    if (!name || isEmpty(name)) {
        return res.status(400).json({ msg: 'Name is required!' });
    }
    if (!email || isEmpty(email)) {
        return res.status(400).json({ msg: 'Email is required!' });
    }
    if (!institute || isEmpty(institute)) {
        return res.status(400).json({ msg: 'Institute is required!' });
    }
    if (!role || isEmpty(role) || !Object.values(Roles).includes(role)) {
        return res.status(400).json({ msg: 'Role is required!' });
    }
    if (!password || isEmpty(password)) {
        return res.status(400).json({ msg: 'Password is required!' });
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
        data.id = user._id;
        delete data.password;
        const token = generateToken(user);
        return res.status(201).json({ user: data, token });
    });
}

// Function to log in an existing user
const login = async (req, res) => {
    // Implementation logic here
    const { email, password } = req.body;
    if (!email || isEmpty(email)) {
        return res.status(400).json({ msg: 'Email is required!' });
    }
    if (!password || isEmpty(password)) {
        return res.status(400).json({ msg: 'Password is required!' });
    }

    UserSchema.findOne({ email }).then((user) => {
        if (!user) {
            return res.status(400).json({ msg: 'User does not exist' });
        }
        compare(password, user.password).then((match) => {
            if (match) {
                const data = {
                    id: user._id,
                    name: user.name,
                    email: user.email,
                    role: user.role,
                    institute: user.institute,
                }
                const token = generateToken(user);
                return res.status(200).json({ user: data, token });
            }
            return res.status(400).json({ msg: 'Invalid credentials' });
        });
    });
}

// Function to send a code to reset password to a user's email
const forgotPassword = async (req, res) => {
    const { email } = req.body;
    if (!email) {
        return res.status(400).json({ msg: 'Email is required!' });
    }
    UserSchema.findOne({ email }).then((user) => {
        if (!user) {
            return res.status(400).json({ msg: 'User does not exist' });
        }
        else {
            const code = Math.floor(100000 + Math.random() * 900000);
            sendMail(email, 'Reset Password', `Your reset password code is ${code}. It is valid for 5 mins only.`, (err) => {
                if (err) {
                    return res.status(500).json({ msg: 'Internal server error' });
                }
                storeResetPasswordCode(email, code);
                return res.status(200).json({ msg: 'Code sent successfully' });
            });
        }
    });

}

// Function to verify reset password code from cache
const verifyResetPasswordCode = async (req, res) => {
    const { email, code } = req.body;
    if (!email || isEmpty(email)) {
        return res.status(400).json({ msg: 'Email is required!' });
    }
    if (!code || isNaN(code)) {
        return res.status(400).json({ msg: 'Code is required!' });
    }

    const cachedCode = cache.get(email);
    if (cachedCode === code) {
        UserSchema.findOne({ email }).then((user) => {
            if (!user) {
                return res.status(400).json({ msg: 'User does not exist' });
            }
            const token = generateToken(user);
            cache.del(email); // Delete the code from cache
            return res.status(200).json({ token, msg: 'Code verified successfully' });
        });
    } else {
        return res.status(400).json({ msg: 'Invalid code' });
    }
}

// Function to reset a user's password
const resetPassword = async (req, res) => {
    const { email, password } = req.body;
    if (!email || isEmpty(email)) {
        return res.status(400).json({ msg: 'Email is required!' });
    }
    if (!password || isEmpty(password)) {
        return res.status(400).json({ msg: 'Password is required!' });
    }
    UserSchema.findOne({ email }).then((user) => {
        if (!user) {
            return res.status(400).json({ msg: 'User does not exist' });
        }
        hash(password).then(async (hashedPassword) => {
            await UserSchema.updateOne({ email }, { password: hashedPassword });
            cache.del(email); // Delete the code from cache
            return res.status(200).json({ msg: 'Password changed successfully' });
        });
    });
}

//Function to change the password
const changePassword = async (req, res) => {
    const user = req.user;
    const { oldPassword, newPassword } = req.body;
    if (!oldPassword || isEmpty(oldPassword)) {
        return res.status(400).json({ msg: 'old Password is required!' });
    }
    if (!newPassword || isEmpty(newPassword)) {
        return res.status(400).json({ msg: 'new Password is required!' });
    }
    UserSchema.findOne({ _id: user._id }).then((user) => {
        if (!user) {
            return res.status(400).json({ msg: 'User does not exist' });
        }
        if (!compare(oldPassword, user.password)) {
            return res.status(400).json({ msg: 'Invalid old password' });
        }
        hash(newPassword).then(async (hashedPassword) => {
            await UserSchema.updateOne({ _id: user._id }, { password: hashedPassword });
            return res.status(200).json({ msg: 'Password changed successfully' });
        });
    });
}

// Function to delete a user's profile
const deleteProfile = async (req, res) => {
    const { email, _id, role } = req.user;
    if (!email) {
        return res.status(400).json({ msg: 'Email is required!' });
    }
    UserSchema.deleteOne({ email }).then(async () => {
        if (role === Roles.STUDENT) {
            PointBucketSchema.deleteMany({ user: _id }).then(() => {
                return res.status(200).json({ msg: 'User deleted successfully' });
            });
        } else if (role === Roles.TEACHER) {
            let ids = await GroupSchema.find({ createdBy: _id }).select('_id');
            Promise.all([GroupSchema.deleteMany({ createdBy: _id }), PointBucketSchema.deleteMany({ group: { $in: ids } })]).then(() => {
                return res.status(200).json({ msg: 'User deleted successfully' });
            });
        }
    }).catch((err) => {
        return res.status(500).json({ msg: 'Internal server error', err });
    });
}

module.exports = {
    register,
    login,
    forgotPassword,
    resetPassword,
    changePassword,
    verifyResetPasswordCode,
    deleteProfile
};
