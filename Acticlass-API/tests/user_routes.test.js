const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');
const { getMockReq, getMockRes } = require('@jest-mock/express');

const { register, login, forgotPassword, getResetPasswordCode, verifyResetPasswordCode, resetPassword, changePassword, deleteProfile } = require('../src/controllers/users/account/controllers');
const UserSchema = require('../src/database/schema/user');
const PointBucketSchema = require('../src/database/schema/pointBucket');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const nodemailer = require('nodemailer');
const { GroupSchema } = require('../src/database');


const { res, mockClear } = getMockRes();

let mongoServer;

jest.setTimeout(150000);

// Create a URI for unit testing
// BEGIN: ed8c6549bwf9

beforeAll(async () => {
    mongoServer = await MongoMemoryServer.create();
    const mongoUri = mongoServer.getUri();
    await mongoose.connect(mongoUri, { useNewUrlParser: true, useUnifiedTopology: true });
    jwt.sign = jest.fn().mockResolvedValue('testToken');
});


afterAll(async () => {
    await mongoose.disconnect();
    await mongoServer.stop();
});

describe('register', () => {
    beforeEach(() => {
        // Reset the mock response object before each test
        mockClear();
    });
    it('should register a user successfully', async () => {
        const req = getMockReq({
            body: {
                name: 'Test User',
                email: 'test@example.com',
                institute: 'Test Institute',
                role: 'Teacher',
                password: 'testPassword',
            }
        });
        jest.spyOn(UserSchema, 'findOne').mockImplementationOnce(() => {
            return Promise.resolve(null);
        });
        jest.spyOn(UserSchema.prototype, 'save').mockImplementationOnce(() => {
            return Promise.resolve({
                _id: 'testId',
                name: 'Test User',
                email: 'test@example.com',
                institute: 'Test Institute',
                role: 'Teacher',
                password: 'testPassword'
            });
        });
        jest.spyOn(jwt, 'sign').mockImplementationOnce(() => {
            return 'testToken';
        });

        UserSchema.constructor = jest.fn().mockResolvedValue({
            _id: 'testId',
            name: 'Test User',
            email: 'test@example.com',
            institute: 'Test Institute',
            role: 'Teacher',
            password: 'testPassword'
        });
        await register(req, res);
        expect(res.status).toHaveBeenCalledWith(201);
        expect(res.json).toHaveBeenCalledWith({
            user: expect.any(Object)
            , token: 'testToken'
        });
    });

    it('should fail to register a user with missing fields', async () => {
        const req = getMockReq({
            body: {
                name: 'Test User',
                email: 'test@example.com',
                institute: 'Test Institute',
                role: 'Teacher',
            }
        });

        await register(req, res);

        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.json).toHaveBeenCalledWith({ msg: 'Password is required!' });
    });

    it('should fail to register a user with an existing email', async () => {
        const req = getMockReq({
            body: {
                name: 'Test User',
                email: 'test@example.com',
                institute: 'Test Institute',
                role: 'Teacher',
                password: 'testPassword',
            }
        });

        await register(req, res);
        await register(req, res);

        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.json).toHaveBeenCalledWith({ msg: 'User already exists' });
    });
});

describe('login', () => {
    beforeEach(() => {
        // Reset the mock response object before each test
        mockClear();
    });

    it('should return status 200 and a JWT token if login is successful', async () => {
        // Mock the request object
        const req = getMockReq({
            body: {
                email: 'test@example.com',
                password: 'password123',
            },
        });

        bcrypt.compare = jest.fn().mockResolvedValue(true);

        // Mock the UserSchema.findOne method to return a user object
        UserSchema.findOne = jest.fn().mockResolvedValue({
            _id: 'user_id',
            email: 'test@example.com',
            password: 'hashed_password',
        });
        jest.spyOn(jwt, 'sign').mockImplementationOnce(() => {
            return 'testToken';
        });

        // Call the login function
        await login(req, res);

        // Assert that the response status is 200
        expect(res.status).toHaveBeenCalledWith(200);

        // Assert that the response JSON contains a JWT token
        expect(res.json).toHaveBeenCalledWith({
            token: expect.any(String),
            user: expect.any(Object),
        });
    });

    it('should return status 401 if email is not found', async () => {
        // Mock the request object
        const req = getMockReq({
            body: {
                email: 'test@example.com',
                password: 'password123',
            },
        });

        // Mock the UserSchema.findOne method to return null
        UserSchema.findOne = jest.fn().mockResolvedValue(null);

        // Call the login function
        await login(req, res);

        // Assert that the response status is 400
        expect(res.status).toHaveBeenCalledWith(400);
    });

    it('should return status 400 if password is incorrect', async () => {
        // Mock the request object
        const req = getMockReq({
            body: {
                email: 'test@example.com',
                password: 'password123',
            },
        });

        // Mock the UserSchema.findOne method to return a user object
        UserSchema.findOne = jest.fn().mockResolvedValue({
            _id: 'user_id',
            email: 'test@example.com',
            password: 'hashed_password',
        });

        bcrypt.compare = jest.fn().mockResolvedValue(false);

        // Call the login function
        await login(req, res);

        // Assert that the response status is 400
        expect(res.status).toHaveBeenCalledWith(400);
    });
});

describe('forgotPassword', () => {
    beforeEach(() => {
        mockClear();
    });

    it('should send a password reset code successfully', async () => {
        const forgotPasswordReq = getMockReq({
            body: {
                email: 'test@example.com',
            }
        });

        jest.spyOn(UserSchema, 'findOne').mockImplementationOnce(() => {
            return Promise.resolve({
                _id: 'testId',
                name: 'Test User',
                email: 'test@example.com'
            });
        });


        // Mock the createTransport function
        nodemailer.createTransport = jest.fn().mockReturnValue({
            sendMail: jest.fn().mockResolvedValueOnce({
                from: 'Acticlass'
            })
        });

        await forgotPassword(forgotPasswordReq, res);

        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.json).toHaveBeenCalledWith({ msg: 'Code sent successfully' });
    });

    it('should fail to send a password reset code with missing fields', async () => {
        const req = getMockReq({
            body: {}
        });

        await forgotPassword(req, res);

        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.json).toHaveBeenCalledWith({ msg: 'Email is required!' });
    });

    it('should fail to send a password reset code for a user that does not exist', async () => {
        const req = getMockReq({
            body: {
                email: 'nonexistent@example.com',
            }
        });

        UserSchema.findOne = jest.fn().mockResolvedValueOnce(null);

        await forgotPassword(req, res);

        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.json).toHaveBeenCalledWith({ msg: 'User does not exist' });
    });

    it('should handle internal server error while sending email', async () => {
        const forgotPasswordReq = getMockReq({
            body: {
                email: 'test@example.com',
            }
        });

        jest.spyOn(UserSchema, 'findOne').mockImplementationOnce(() => {
            return Promise.resolve({
                _id: 'testId',
                name: 'Test User',
                email: 'test@example.com'
            });
        });

        nodemailer.createTransport = jest.fn().mockReturnValue({
            sendMail: jest.fn().mockRejectedValueOnce(new Error('this Error is expected: Internal server error'))
        });

        await forgotPassword(forgotPasswordReq, res);

        expect(res.status).toHaveBeenCalledWith(500);
        expect(res.json).toHaveBeenCalledWith({ msg: 'Internal server error' });
    });

    it('should send a password reset code successfully and verify it', async () => {
        const req = getMockReq({
            body: {
                email: 'test@example.com',
            }
        });

        jest.spyOn(UserSchema, 'findOne').mockImplementation(() => {
            return Promise.resolve({
                _id: 'testId',
                name: 'Test User',
                email: 'test@example.com'
            });
        });


        const nodemailer = require('nodemailer');

        // Mock the createTransport function
        nodemailer.createTransport = jest.fn().mockReturnValue({
            sendMail: jest.fn().mockResolvedValueOnce({
                from: 'Acticlass'
            })
        });


        await forgotPassword(req, res);

        let code = getResetPasswordCode(req.body.email);

        mockClear();

        verifyResetPasswordCodeReq = getMockReq({
            body: {
                email: 'test@example.com',
                code: code
            }
        });

        await verifyResetPasswordCode(verifyResetPasswordCodeReq, res);


        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.json).toHaveBeenCalledWith({ msg: 'Code verified successfully', token: expect.any(Object) });
    });
});

describe('resetPassword', () => {
    beforeEach(() => {
        mockClear();
    });

    it('should reset the password successfully', async () => {
        const req = getMockReq({
            body: {
                email: 'test@example.com',
                password: 'newPassword',
            },
        });

        UserSchema.findOne = jest.fn().mockResolvedValueOnce({
            email: 'test@example.com',
        });

        bcrypt.hash = jest.fn().mockResolvedValueOnce('hashedPassword');

        jest.spyOn(UserSchema, 'updateOne').mockImplementationOnce(() => {
            return Promise.resolve({
                email: 'test@example.com',
                password: 'hashedPassword',
            });
        });


        await resetPassword(req, res);

        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.json).toHaveBeenCalledWith({ msg: 'Password changed successfully' });
        expect(UserSchema.findOne).toHaveBeenCalledWith({ email: 'test@example.com' });
        expect(UserSchema.updateOne).toHaveBeenCalledWith({ email: 'test@example.com' }, { password: 'hashedPassword' });
    });

    it('should return status 400 if email is missing', async () => {
        const req = getMockReq({
            body: {
                password: 'newPassword',
            },
        });

        await resetPassword(req, res);

        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.json).toHaveBeenCalledWith({ msg: 'Email is required!' });
    });

    it('should return status 400 if password is missing', async () => {
        const req = getMockReq({
            body: {
                email: 'test@example.com',
            },
        });

        await resetPassword(req, res);

        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.json).toHaveBeenCalledWith({ msg: 'Password is required!' });
    });

    it('should return status 400 if user does not exist', async () => {
        const req = getMockReq({
            body: {
                email: 'test@example.com',
                password: 'newPassword',
            },
        });

        UserSchema.findOne = jest.fn().mockResolvedValueOnce(null);

        await resetPassword(req, res);

        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.json).toHaveBeenCalledWith({ msg: 'User does not exist' });
    });
});

describe('changePassword', () => {
    beforeEach(() => {
        mockClear();
    });

    it('should change the password successfully', async () => {
        const req = getMockReq({
            user: {
                _id: 'testId',
                email: 'test@example.com',
                password: 'oldPassword',
            },
            body: {
                oldPassword: 'oldPassword',
                newPassword: 'newPassword',
            },
        });

        UserSchema.findOne = jest.fn().mockResolvedValueOnce({
            _id: 'testId',
            email: 'test@example.com',
            password: 'oldPassword',
        });

        bcrypt.compare = jest.fn().mockReturnValueOnce(true);

        hash = jest.fn().mockResolvedValueOnce('hashedPassword');

        UserSchema.updateOne = jest.fn().mockResolvedValueOnce({
            _id: 'testId',
            email: 'test@example.com',
            password: 'hashedPassword',
        });

        await changePassword(req, res);

        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.json).toHaveBeenCalledWith({ msg: 'Password changed successfully' });
    });

    it('should return status 400 if old password is missing', async () => {
        const req = getMockReq({
            user: {
                _id: 'testId',
                email: 'test@example.com',
                password: 'oldPassword',
            },
            body: {
                newPassword: 'newPassword',
            },
        });

        await changePassword(req, res);

        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.json).toHaveBeenCalledWith({ msg: 'Old Password is required!' });
    });

    it('should return status 400 if new password is missing', async () => {
        const req = getMockReq({
            user: {
                _id: 'testId',
                email: 'test@example.com',
                password: 'oldPassword',
            },
            body: {
                oldPassword: 'oldPassword',
            },
        });

        await changePassword(req, res);

        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.json).toHaveBeenCalledWith({ msg: 'New Password is required!' });
    });

    it('should return status 400 if user does not exist', async () => {
        const req = getMockReq({
            user: {
                _id: 'testId',
                email: 'test@example.com',
                password: 'oldPassword',
            },
            body: {
                oldPassword: 'oldPassword',
                newPassword: 'newPassword',
            },
        });

        UserSchema.findOne = jest.fn().mockResolvedValueOnce(null);

        await changePassword(req, res);

        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.json).toHaveBeenCalledWith({ msg: 'User does not exist' });
    });

    it('should return status 400 if old password is invalid', async () => {
        const req = getMockReq({
            user: {
                _id: 'testId',
                email: 'test@example.com',
                password: 'oldPassword',
            },
            body: {
                oldPassword: 'invalidPassword',
                newPassword: 'newPassword',
            },
        });

        UserSchema.findOne = jest.fn().mockResolvedValueOnce({
            _id: 'testId',
            email: 'test@example.com',
            password: 'oldPassword',
        });

        bcrypt.compare = jest.fn().mockResolvedValue(false);
        await changePassword(req, res);

        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.json).toHaveBeenCalledWith({ msg: 'Invalid old password' });
    });
});


describe('deleteProfile', () => {
    beforeEach(() => {
        mockClear();
    });

    it('should delete a student profile successfully', async () => {
        const req = getMockReq({
            user: {
                email: 'test@example.com',
                _id: 'testId',
                role: 'Student'
            }
        });

        UserSchema.deleteOne = jest.fn().mockResolvedValueOnce();
        PointBucketSchema.deleteMany = jest.fn().mockResolvedValueOnce();

        await deleteProfile(req, res);

        expect(UserSchema.deleteOne).toHaveBeenCalledWith({ email: 'test@example.com' });
        expect(PointBucketSchema.deleteMany).toHaveBeenCalledWith({ user: 'testId' });
        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.json).toHaveBeenCalledWith({ msg: 'User deleted successfully' });
    });

    it('should delete a teacher profile successfully', async () => {
        const req = getMockReq({
            user: {
                email: 'test@example.com',
                _id: 'testId',
                role: 'Teacher'
            }
        });

        const groupIds = ['groupId1', 'groupId2'];
        UserSchema.deleteOne = jest.fn().mockResolvedValueOnce();
        GroupSchema.find = jest.fn().mockImplementationOnce(() => {
            return {
                select: jest.fn().mockResolvedValueOnce(groupIds)
            }
        });
        GroupSchema.deleteMany = jest.fn().mockResolvedValueOnce();
        PointBucketSchema.deleteMany = jest.fn().mockResolvedValueOnce();

        await deleteProfile(req, res);

        expect(GroupSchema.find).toHaveBeenCalledWith({ createdBy: 'testId' });
        expect(GroupSchema.deleteMany).toHaveBeenCalledWith({ createdBy: 'testId' });
        // expect(PointBucketSchema.deleteMany).toHaveBeenCalledWith({ group: { $in: groupIds } });
        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.json).toHaveBeenCalledWith({ msg: 'User deleted successfully' });
    });


    it('should return status 400 if email is missing', async () => {
        const req = getMockReq({
            user: {
                _id: 'testId',
                role: 'Student'
            }
        });

        await deleteProfile(req, res);

        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.json).toHaveBeenCalledWith({ msg: 'Email is required!' });
    });

    it('should handle internal server error', async () => {
        const req = getMockReq({
            user: {
                email: 'test@example.com',
                _id: 'testId',
                role: 'Teacher'
            }
        });

        UserSchema.deleteOne = jest.fn().mockRejectedValueOnce(new Error('Internal server error'));

        await deleteProfile(req, res);

        expect(UserSchema.deleteOne).toHaveBeenCalledWith({ email: 'test@example.com' });
        expect(res.status).toHaveBeenCalledWith(500);
        expect(res.json).toHaveBeenCalledWith({ msg: 'Internal server error', err: expect.any(Error) });
    });
});

