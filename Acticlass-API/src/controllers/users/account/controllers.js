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

function getResetPasswordCode(email) {
    return cache.get(email);
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
    return { token, data };
}



// Function to create a new user account
const register = async (req, res) => {
    const { name, email, institute, role, password } = req.body;
    let msg = "";
    if (!name || isEmpty(name)) {
        msg = "Name is required!";
    } else if (!email || isEmpty(email)) {
        msg = "Email is required!";
    } else if (!institute || isEmpty(institute)) {
        msg = "Institute is required!";
    } else if (!role || isEmpty(role) || !Object.values(Roles).includes(role)) {
        msg = "Role is required!";
    } else if (!password || isEmpty(password)) {
        msg = "Password is required!";
    }
    if (!isEmpty(msg)) {
        return res.status(400).json({ msg });
    }

    const u = await UserSchema.findOne({ email });
    if (u) {
        return res.status(400).json({ msg: 'User already exists' });
    }

    await hash(password).then(async (hashedPassword) => {
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
        const { token } = generateToken(user);
        return res.status(201).json({ user: data, token });
    });
}

// Function to log in an existing user
const login = async (req, res) => {
    const { email, password } = req.body;
    let msg = "";
    if (!email || isEmpty(email)) {
        msg = "Email is required!";
    } else if (!password || isEmpty(password)) {
        msg = "Password is required!";
    }
    if (!isEmpty(msg)) {
        return res.status(400).json({ msg });
    }

    await UserSchema.findOne({ email }).then(async (user) => {
        if (!user) {
            return res.status(400).json({ msg: 'User does not exist' });
        }
        await compare(password, user.password).then((match) => {
            if (match) {
                const { token, data } = generateToken(user);
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
    await UserSchema.findOne({ email }).then((user) => {
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
    let msg = "";
    if (!email || isEmpty(email)) {
        msg = "Email is required!";
    } else if (!code || isNaN(code)) {
        msg = "Code is required!";
    } else if (!isEmpty(msg)) {
        return res.status(400).json({ msg });
    }

    const cachedCode = cache.get(email);
    if (cachedCode === code) {
        UserSchema.findOne({ email }).then((user) => {
            if (!user) {
                return res.status(400).json({ msg: 'User does not exist' });
            }
            const { token } = generateToken(user);
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
    let msg = "";
    if (!email || isEmpty(email)) {
        msg = "Email is required!";
    } else if (!password || isEmpty(password)) {
        msg = "Password is required!";
    }
    if (!isEmpty(msg)) {
        return res.status(400).json({ msg });
    }
    await UserSchema.findOne({ email }).then(async (user) => {
        if (!user) {
            return res.status(400).json({ msg: 'User does not exist' });
        }
        await hash(password).then(async (hashedPassword) => {
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
    let msg = "";
    if (!oldPassword || isEmpty(oldPassword)) {
        msg = "Old Password is required!";
    } else if (!newPassword || isEmpty(newPassword)) {
        msg = "New Password is required!";
    }
    if (!isEmpty(msg)) {
        return res.status(400).json({ msg });
    }

    await UserSchema.findOne({ _id: user._id }).then(async (user) => {
        if (!user) {
            return res.status(400).json({ msg: 'User does not exist' });
        }
        await compare(oldPassword, user.password).then(async (match) => {
            if (!match) {
                return res.status(400).json({ msg: 'Invalid old password' });
            }
            await hash(newPassword).then(async (hashedPassword) => {
                await UserSchema.updateOne({ _id: user._id }, { password: hashedPassword });
                return res.status(200).json({ msg: 'Password changed successfully' });
            });
        });
    });
}

// Function to delete a user's profile
const deleteProfile = async (req, res) => {
    const { email, _id, role } = req.user;
    if (!email) {
        return res.status(400).json({ msg: 'Email is required!' });
    }
    await UserSchema.deleteOne({ email }).then(async () => {
        if (role === Roles.STUDENT) {
            await PointBucketSchema.deleteMany({ user: _id }).then(() => {
                return res.status(200).json({ msg: 'User deleted successfully' });
            });
        } else if (role === Roles.TEACHER) {
            let ids = await GroupSchema.find({ createdBy: _id }).select('_id');
            await Promise.all([GroupSchema.deleteMany({ createdBy: _id }), PointBucketSchema.deleteMany({ group: { $in: ids } })]).then(() => {
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
    deleteProfile,
    getResetPasswordCode
};
