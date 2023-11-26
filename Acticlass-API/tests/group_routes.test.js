const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');
const { getMockReq, getMockRes } = require('@jest-mock/express');
const { createGroup, getGroups, getGroupById, updateGroupById, deleteGroupById, joinGroupById, leaveGroupById, kickUserById, getGroupMembers, getMemberDetails } = require('../src/controllers/groups/group/controllers');
const GroupSchema = require('../src/database/schema/group');
const { Roles } = require('../src/common/constants');
const { PointBucketSchema, ActivitySchema } = require('../src/database');
const { populate } = require('../src/database/schema/user');

const { res, mockClear } = getMockRes();

let mongoServer;

jest.setTimeout(150000);

// Create a URI for unit testing
// BEGIN: ed8c6549bwf9

beforeAll(async () => {
    mongoServer = await MongoMemoryServer.create();
    const mongoUri = mongoServer.getUri();
    await mongoose.connect(mongoUri, { useNewUrlParser: true, useUnifiedTopology: true });
});

afterAll(async () => {
    await mongoose.disconnect();
    await mongoServer.stop();
});

describe('createGroup', () => {
    beforeEach(() => {
        // Reset the mock response object before each test
        mockClear();
    });

    it('should create a group successfully', async () => {
        const req = getMockReq({
            user: {
                role: 'Teacher',
                institute: 'Test Institute',
                _id: 'testUserId'
            },
            body: {
                name: 'Test Group',
                radius: 10,
                passingPoints: 100,
                attendanceFrequency: 5,
                attendanceReward: 50,
                penalty: 10
            }
        });

        GroupSchema.prototype.save = jest.fn().mockResolvedValueOnce({
            _id: 'testGroupId',
            name: 'Test Group',
            institute: 'Test Institute',
            radius: 10,
            passingPoints: 100,
            attendanceFrequency: 5,
            attendanceReward: 50,
            penalty: 10,
            createdBy: 'testUserId'
        });

        await createGroup(req, res);

        expect(res.status).toHaveBeenCalledWith(201);
        expect(res.json).toHaveBeenCalledWith({ msg: 'Group created successfully.' });
    });

    it('should return 400 if user is not a teacher', async () => {
        const req = getMockReq({
            user: {
                role: 'Student',
                institute: 'Test Institute',
                _id: 'testUserId'
            },
            body: {
                name: 'Test Group',
                radius: 10,
                passingPoints: 100,
                attendanceFrequency: 5,
                attendanceReward: 50,
                penalty: 10
            }
        });

        await createGroup(req, res);

        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.json).toHaveBeenCalledWith({ msg: 'Only teachers can create groups.' });
    });

    it('should return 400 if group name is missing', async () => {
        const req = getMockReq({
            user: {
                role: 'Teacher',
                institute: 'Test Institute',
                _id: 'testUserId'
            },
            body: {
                radius: 10,
                passingPoints: 100,
                attendanceFrequency: 5,
                attendanceReward: 50,
                penalty: 10
            }
        });

        await createGroup(req, res);

        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.json).toHaveBeenCalledWith({ msg: 'Group name is required.' });
    });

    it('should return 400 if institute is missing', async () => {
        const req = getMockReq({
            user: {
                role: 'Teacher',
                _id: 'testUserId'
            },
            body: {
                name: 'Test Group',
                radius: 10,
                passingPoints: 100,
                attendanceFrequency: 5,
                attendanceReward: 50,
                penalty: 10
            }
        });

        await createGroup(req, res);

        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.json).toHaveBeenCalledWith({ msg: 'Institute is required.' });
    });

    it('should return 500 if there is an error while creating group', async () => {
        const req = getMockReq({
            user: {
                role: 'Teacher',
                institute: 'Test Institute',
                _id: 'testUserId'
            },
            body: {
                name: 'Test Group',
                radius: 10,
                passingPoints: 100,
                attendanceFrequency: 5,
                attendanceReward: 50,
                penalty: 10
            }
        });

        GroupSchema.prototype.save = jest.fn().mockRejectedValueOnce(new Error('Test Error'));

        await createGroup(req, res);

        expect(res.status).toHaveBeenCalledWith(500);
        expect(res.json).toHaveBeenCalledWith({ msg: 'Something went wrong.' });
    });
});

describe('getGroups', () => {
    beforeEach(() => {
        mockClear();
    });

    it('should return groups created by teacher', async () => {
        const user = {
            _id: 'teacher_id',
            role: Roles.TEACHER
        };
        const req = getMockReq({ user });

        const groups = [
            {
                _id: 'group_id_1',
                name: 'Group 1',
                institute: 'Institute 1',
                createdBy: 'teacher_id',
                radius: 10,
                passingPoints: 100,
                attendanceFrequency: 5,
                attendanceReward: 50,
                penalty: 10
            },
            {
                _id: 'group_id_2',
                name: 'Group 2',
                institute: 'Institute 2',
                createdBy: 'teacher_id',
                radius: 15,
                passingPoints: 150,
                attendanceFrequency: 3,
                attendanceReward: 30,
                penalty: 5
            }
        ];

        jest.spyOn(GroupSchema, 'find').mockResolvedValue(groups);

        await getGroups(req, res);

        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.json).toHaveBeenCalledWith({
            groups: [
                {
                    id: 'group_id_1',
                    name: 'Group 1',
                    institute: 'Institute 1',
                    createdBy: 'teacher_id',
                    radius: 10,
                    passingPoints: 100,
                    attendanceFrequency: 5,
                    attendanceReward: 50,
                    penalty: 10
                },
                {
                    id: 'group_id_2',
                    name: 'Group 2',
                    institute: 'Institute 2',
                    createdBy: 'teacher_id',
                    radius: 15,
                    passingPoints: 150,
                    attendanceFrequency: 3,
                    attendanceReward: 30,
                    penalty: 5
                }
            ]
        });
    });

    it('should return groups associated with student', async () => {
        const user = {
            _id: 'student_id',
            role: Roles.STUDENT
        };
        const req = getMockReq({ user });

        const pointBuckets = [
            {
                group: {
                    _id: 'group_id_1',
                    name: 'Group 1',
                    institute: 'Institute 1',
                    createdBy: 'teacher_id',
                    radius: 10,
                    passingPoints: 100,
                    attendanceFrequency: 5,
                    attendanceReward: 50,
                    penalty: 10
                },
                points: 50
            },
            {
                group: {
                    _id: 'group_id_2',
                    name: 'Group 2',
                    institute: 'Institute 2',
                    createdBy: 'teacher_id',
                    radius: 15,
                    passingPoints: 150,
                    attendanceFrequency: 3,
                    attendanceReward: 30,
                    penalty: 5
                },
                points: 100
            }
        ];
        jest.spyOn(PointBucketSchema, 'find').mockImplementation(() => ({
            populate: jest.fn().mockResolvedValue(pointBuckets)
        }));

        await getGroups(req, res);

        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.json).toHaveBeenCalledWith({
            groups: [
                {
                    id: 'group_id_1',
                    name: 'Group 1',
                    institute: 'Institute 1',
                    createdBy: 'teacher_id',
                    radius: 10,
                    passingPoints: 100,
                    attendanceFrequency: 5,
                    attendanceReward: 50,
                    penalty: 10,
                    points: 50
                },
                {
                    id: 'group_id_2',
                    name: 'Group 2',
                    institute: 'Institute 2',
                    createdBy: 'teacher_id',
                    radius: 15,
                    passingPoints: 150,
                    attendanceFrequency: 3,
                    attendanceReward: 30,
                    penalty: 5,
                    points: 100
                }
            ]
        });
    });

    it('should handle error while getting groups', async () => {
        const user = {
            _id: 'teacher_id',
            role: Roles.TEACHER
        };
        const req = getMockReq({ user });

        jest.spyOn(GroupSchema, 'find').mockRejectedValue(new Error('Database error'));

        await getGroups(req, res);

        expect(res.status).toHaveBeenCalledWith(500);
        expect(res.json).toHaveBeenCalledWith({ msg: 'Something went wrong.' });
    });
});

describe('getGroupById', () => {
    beforeEach(() => {
        // Reset the mock response object before each test
        mockClear();
    });

    it('should return group details for a student', async () => {
        const req = getMockReq({
            user: {
                role: Roles.STUDENT,
                _id: 'student_id'
            },
            params: {
                id: 'group_id'
            }
        });

        PointBucketSchema.findOne = jest.fn().mockResolvedValueOnce({
            group: {
                _id: 'group_id',
                name: 'Test Group',
                institute: 'Test Institute',
                createdBy: 'teacher_id',
                radius: 10,
                passingPoints: 100,
                attendanceFrequency: 5,
                attendanceReward: 10,
                penalty: 5
            },
            points: 50
        });

        PointBucketSchema.findOne = jest.fn().mockImplementation(() => ({
            populate: jest.fn().mockResolvedValue({
                group: {
                    _id: 'group_id',
                    name: 'Test Group',
                    institute: 'Test Institute',
                    createdBy: 'teacher_id',
                    radius: 10,
                    passingPoints: 100,
                    attendanceFrequency: 5,
                    attendanceReward: 10,
                    penalty: 5
                },
                points: 50
            })
        }));

        await getGroupById(req, res);

        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.json).toHaveBeenCalledWith({
            group: {
                id: 'group_id',
                name: 'Test Group',
                institute: 'Test Institute',
                createdBy: 'teacher_id',
                radius: 10,
                passingPoints: 100,
                attendanceFrequency: 5,
                attendanceReward: 10,
                penalty: 5,
                points: 50
            }
        });
    });

    it('should return group details for a teacher', async () => {
        const req = getMockReq({
            user: {
                role: Roles.TEACHER,
                _id: 'teacher_id'
            },
            params: {
                id: 'group_id'
            }
        });

        GroupSchema.findOne = jest.fn().mockResolvedValueOnce({
            _id: 'group_id',
            name: 'Test Group',
            institute: 'Test Institute',
            createdBy: 'teacher_id',
            radius: 10,
            passingPoints: 100,
            attendanceFrequency: 5,
            attendanceReward: 10,
            penalty: 5
        });

        await getGroupById(req, res);

        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.json).toHaveBeenCalledWith({
            group: {
                id: 'group_id',
                name: 'Test Group',
                institute: 'Test Institute',
                createdBy: 'teacher_id',
                radius: 10,
                passingPoints: 100,
                attendanceFrequency: 5,
                attendanceReward: 10,
                penalty: 5
            }
        });
    });

    it('should return 400 if group id is missing', async () => {
        const req = getMockReq({
            user: {
                role: Roles.STUDENT,
                _id: 'student_id'
            },
            params: {}
        });

        await getGroupById(req, res);

        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.json).toHaveBeenCalledWith({ msg: 'Group id is required.' });
    });

    it('should return 404 if group is not found for a student', async () => {
        const req = getMockReq({
            user: {
                role: Roles.STUDENT,
                _id: 'student_id'
            },
            params: {
                id: 'group_id'
            }
        });

        PointBucketSchema.findOne = jest.fn().mockImplementation(() => ({
            populate: jest.fn().mockResolvedValue(null)
        }));

        await getGroupById(req, res);

        expect(res.status).toHaveBeenCalledWith(404);
        expect(res.json).toHaveBeenCalledWith({ msg: 'Group not found.' });
    });

    it('should return 404 if group is not found for a teacher', async () => {
        const req = getMockReq({
            user: {
                role: Roles.TEACHER,
                _id: 'teacher_id'
            },
            params: {
                id: 'group_id'
            }
        });

        GroupSchema.findOne = jest.fn().mockResolvedValueOnce(null);

        await getGroupById(req, res);

        expect(res.status).toHaveBeenCalledWith(404);
        expect(res.json).toHaveBeenCalledWith({ msg: 'Group not found.' });
    });

    it('should return 500 if an error occurs while getting group details for a student', async () => {
        const req = getMockReq({
            user: {
                role: Roles.STUDENT,
                _id: 'student_id'
            },
            params: {
                id: 'group_id'
            }
        });

        PointBucketSchema.findOne = jest.fn().mockImplementation(() => ({
            populate: jest.fn().mockRejectedValueOnce(new Error('Internal server error'))
        }));

        await getGroupById(req, res);

        expect(res.status).toHaveBeenCalledWith(500);
        expect(res.json).toHaveBeenCalledWith({ msg: 'Something went wrong.' });
    });

    it('should return 500 if an error occurs while getting group details for a teacher', async () => {
        const req = getMockReq({
            user: {
                role: Roles.TEACHER,
                _id: 'teacher_id'
            },
            params: {
                id: 'group_id'
            }
        });

        GroupSchema.findOne = jest.fn().mockRejectedValueOnce(new Error('Internal server error'));

        await getGroupById(req, res);

        expect(res.status).toHaveBeenCalledWith(500);
        expect(res.json).toHaveBeenCalledWith({ msg: 'Something went wrong.' });
    });
});

describe('updateGroupById', () => {
    beforeEach(() => {
        // Reset the mock response object before each test
        mockClear();
    });

    it('should update the group successfully', async () => {
        const user = {
            _id: 'user_id',
            role: Roles.TEACHER,
        };
        const req = getMockReq({
            user,
            params: {
                id: 'group_id',
            },
            body: {
                name: 'New Group Name',
                institute: 'New Institute',
                radius: 50,
                passingPoints: 100,
                attendanceFrequency: 0,
                attendanceReward: 50,
                penalty: 5,
            },
        });

        const group = {
            _id: 'group_id',
            name: 'Old Group Name',
            institute: 'Old Institute',
            radius: 51,
            passingPoints: 50,
            attendanceFrequency: 15,
            attendanceReward: 25,
            penalty: 2,
            createdBy: {
                _id: 'user_id',
            },
        };

        jest.spyOn(GroupSchema, 'findOne').mockResolvedValueOnce({ ...group, save: jest.fn().mockResolvedValueOnce(group) });

        await updateGroupById(req, res);

        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.json).toHaveBeenCalledWith({
            msg: 'Group updated successfully.',
            group: {
                _id: 'group_id',
                name: 'New Group Name',
                institute: 'New Institute',
                radius: 50,
                passingPoints: 100,
                attendanceFrequency: 15,
                attendanceReward: 50,
                penalty: 5,
                createdBy: {
                    _id: 'user_id',
                },
                save: expect.any(Function),
            },
        });
    });

    it('should return 400 if user is not a teacher', async () => {
        const user = {
            _id: 'user_id',
            role: Roles.STUDENT,
        };
        const req = getMockReq({
            user,
            params: {
                id: 'group_id',
            },
            body: {
                name: 'New Group Name',
            },
        });

        await updateGroupById(req, res);

        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.json).toHaveBeenCalledWith({ msg: 'Only teachers can update groups.' });
    });

    it('should return 400 if group id is missing', async () => {
        const user = {
            _id: 'user_id',
            role: Roles.TEACHER,
        };
        const req = getMockReq({
            user,
            params: {},
            body: {
                name: 'New Group Name',
            },
        });

        await updateGroupById(req, res);

        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.json).toHaveBeenCalledWith({ msg: 'Group id is required.' });
    });


    it('should return 404 if group is not found', async () => {
        const user = {
            _id: 'user_id',
            role: Roles.TEACHER,
        };
        const req = getMockReq({
            user,
            params: {
                id: 'nonexistent_group_id',
            },
            body: {
                name: 'New Group Name',
            },
        });

        jest.spyOn(GroupSchema, 'findOne').mockResolvedValueOnce(null);

        await updateGroupById(req, res);

        expect(res.status).toHaveBeenCalledWith(404);
        expect(res.json).toHaveBeenCalledWith({ msg: 'Group not found.' });
    });

    it('should return 400 if user is not the group creator', async () => {
        const user = {
            _id: 'user_id',
            role: Roles.TEACHER,
        };
        const req = getMockReq({
            user,
            params: {
                id: 'group_id',
            },
            body: {
                name: 'New Group Name',
            },
        });

        const group = {
            _id: 'group_id',
            name: 'Old Group Name',
            createdBy: {
                _id: 'other_user_id',
            },
        };

        jest.spyOn(GroupSchema, 'findOne').mockResolvedValueOnce(group);

        await updateGroupById(req, res);

        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.json).toHaveBeenCalledWith({ msg: 'Only group creator can update the group.' });
    });

    it('should handle internal server error', async () => {
        const user = {
            _id: 'user_id',
            role: Roles.TEACHER,
        };
        const req = getMockReq({
            user,
            params: {
                id: 'group_id',
            },
            body: {
                name: 'New Group Name',
            },
        });

        const group = {
            _id: 'group_id',
            name: 'Old Group Name',
            createdBy: {
                _id: 'user_id',
            },
        };

        jest.spyOn(GroupSchema, 'findOne').mockResolvedValueOnce({ ...group, save: jest.fn().mockRejectedValueOnce(new Error('Internal server error')) });

        await updateGroupById(req, res);

        expect(res.status).toHaveBeenCalledWith(500);
        expect(res.json).toHaveBeenCalledWith({ msg: 'Something went wrong.' });
    });
});

describe('deleteGroupById', () => {
    beforeEach(() => {
        // Reset the mock response object before each test
        mockClear();
    });

    it('should delete a group successfully if user is a teacher and group exists', async () => {
        const req = getMockReq({
            user: {
                role: 'Teacher',
                _id: 'teacher_id'
            },
            params: {
                id: 'group_id'
            }
        });

        GroupSchema.findOne = jest.fn().mockResolvedValueOnce({
            _id: 'group_id',
            createdBy: {
                _id: 'teacher_id'
            }
        });

        GroupSchema.deleteOne = jest.fn().mockResolvedValue(null);

        await deleteGroupById(req, res);

        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.json).toHaveBeenCalledWith({ msg: 'Group deleted successfully.' });
    });

    it('should return status 400 if user is not a teacher', async () => {
        const req = getMockReq({
            user: {
                role: 'Student',
                _id: 'student_id'
            },
            params: {
                id: 'group_id'
            }
        });

        await deleteGroupById(req, res);

        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.json).toHaveBeenCalledWith({ msg: 'Only teachers can delete groups.' });
    });

    it('should return status 400 if group id is missing', async () => {
        const req = getMockReq({
            user: {
                role: 'Teacher',
                _id: 'teacher_id'
            },
            params: {}
        });

        await deleteGroupById(req, res);

        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.json).toHaveBeenCalledWith({ msg: 'Group id is required.' });
    });

    it('should return status 404 if group does not exist', async () => {
        const req = getMockReq({
            user: {
                role: 'Teacher',
                _id: 'teacher_id'
            },
            params: {
                id: 'nonexistent_group_id'
            }
        });

        GroupSchema.findOne = jest.fn().mockResolvedValueOnce(null);

        await deleteGroupById(req, res);

        expect(res.status).toHaveBeenCalledWith(404);
        expect(res.json).toHaveBeenCalledWith({ msg: 'Group not found.' });
    });

    it('should return status 400 if user is not the group creator', async () => {
        const req = getMockReq({
            user: {
                role: 'Teacher',
                _id: 'teacher_id'
            },
            params: {
                id: 'group_id'
            }
        });

        GroupSchema.findOne = jest.fn().mockResolvedValueOnce({
            _id: 'group_id',
            createdBy: {
                _id: 'other_teacher_id'
            }
        });

        await deleteGroupById(req, res);

        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.json).toHaveBeenCalledWith({ msg: 'Only group creator can delete the group.' });
    });

    it('should return status 500 if there is an error deleting the group', async () => {
        const req = getMockReq({
            user: {
                role: 'Teacher',
                _id: 'teacher_id'
            },
            params: {
                id: 'group_id'
            }
        });

        GroupSchema.findOne = jest.fn().mockRejectedValueOnce(new Error('Database error'));

        await deleteGroupById(req, res);

        expect(res.status).toHaveBeenCalledWith(500);
        expect(res.json).toHaveBeenCalledWith({ msg: 'Something went wrong.' });
    });
});

describe('joinGroupById', () => {
    beforeEach(() => {
        // Reset the mock response object before each test
        mockClear();
    });

    it('should return 400 if user is not a student', async () => {
        const req = getMockReq({
            user: {
                role: 'Teacher',
            },
            params: {
                id: 'groupId',
            },
        });

        await joinGroupById(req, res);

        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.json).toHaveBeenCalledWith({ msg: 'Only students can join groups.' });
    });

    it('should return 400 if groupId is missing', async () => {
        const req = getMockReq({
            user: {
                role: 'Student',
            },
            params: {},
        });

        await joinGroupById(req, res);

        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.json).toHaveBeenCalledWith({ msg: 'Group id is required.' });
    });

    it('should return 404 if pointBucket is found but group is not', async () => {
        const req = getMockReq({
            user: {
                role: 'Student',
                _id: 'userId',
            },
            params: {
                id: 'groupId',
            },
        });

        jest.spyOn(PointBucketSchema, 'findOne').mockImplementation(() => ({
            populate: jest.fn().mockResolvedValueOnce(null),
        }));

        jest.spyOn(GroupSchema, 'findOne').mockResolvedValueOnce(null);

        await joinGroupById(req, res);

        expect(res.status).toHaveBeenCalledWith(404);
        expect(res.json).toHaveBeenCalledWith({ msg: 'Group not found.' });
    });

    it('should return 400 if pointBucket is found and isActive is true', async () => {
        const req = getMockReq({
            user: {
                role: 'Student',
                _id: 'userId',
            },
            params: {
                id: 'groupId',
            },
        });

        PointBucketSchema.findOne = jest.spyOn(PointBucketSchema, 'findOne').mockImplementation(() => ({
            populate: jest.fn().mockResolvedValueOnce({
                group: {},
                isActive: true,
            }),
        }));


        await joinGroupById(req, res);

        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.json).toHaveBeenCalledWith({ msg: 'User already joined the group.' });
    });

    it('should update pointBucket isActive to true and return 200 if pointBucket is found and isActive is false', async () => {
        const req = getMockReq({
            user: {
                role: 'Student',
                _id: 'userId',
            },
            params: {
                id: 'groupId',
            },
        });

        PointBucketSchema.findOne = jest.spyOn(PointBucketSchema, 'findOne').mockImplementation(() => ({
            populate: jest.fn().mockResolvedValueOnce({
                group: {},
                isActive: false,
                save: jest.fn().mockResolvedValueOnce(),
            }),
        }));

        await joinGroupById(req, res);

        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.json).toHaveBeenCalledWith({ msg: 'User joined successfully.' });
    });

    it('should create a new pointBucket and return 200 if pointBucket is not found', async () => {
        const req = getMockReq({
            user: {
                role: 'Student',
                _id: 'userId',
            },
            params: {
                id: 'groupId',
            },
        });

        PointBucketSchema.findOne = jest.spyOn(PointBucketSchema, 'findOne').mockImplementation(() => ({
            populate: jest.fn().mockResolvedValueOnce(null),
        }));
        PointBucketSchema.prototype.save = jest.fn().mockResolvedValueOnce();
        jest.spyOn(GroupSchema, 'findOne').mockResolvedValueOnce({});

        await joinGroupById(req, res);

        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.json).toHaveBeenCalledWith({ msg: 'User joined successfully.' });
    });

    it('should return 404 if group is not found when creating a new pointBucket', async () => {
        const req = getMockReq({
            user: {
                role: 'Student',
                _id: 'userId',
            },
            params: {
                id: 'groupId',
            },
        });

        PointBucketSchema.findOne = jest.spyOn(PointBucketSchema, 'findOne').mockImplementation(() => ({
            populate: jest.fn().mockResolvedValueOnce(null),
        }));
        PointBucketSchema.prototype.save = jest.fn().mockResolvedValueOnce();

        jest.spyOn(GroupSchema, 'findOne').mockResolvedValueOnce(null);

        await joinGroupById(req, res);

        expect(res.status).toHaveBeenCalledWith(404);
        expect(res.json).toHaveBeenCalledWith({ msg: 'Group not found.' });
    });

    it('should handle errors and return 500', async () => {
        const req = getMockReq({
            user: {
                role: 'Student',
                _id: 'userId',
            },
            params: {
                id: 'groupId',
            },
        });

        PointBucketSchema.findOne = jest.fn().mockImplementation(() => ({
            populate: jest.fn().mockRejectedValueOnce(new Error('Database error')),
        }));

        await joinGroupById(req, res);

        expect(res.status).toHaveBeenCalledWith(500);
        expect(res.json).toHaveBeenCalledWith({ msg: 'Something went wrong.' });
    });
});

describe('leaveGroupById', () => {
    beforeEach(() => {
        // Reset the mock response object before each test
        mockClear();
    });

    it('should return status 400 if group id is missing', async () => {
        const req = getMockReq({
            user: {
                role: Roles.STUDENT,
            },
            params: {},
        });

        await leaveGroupById(req, res);

        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.json).toHaveBeenCalledWith({ msg: 'Group id is required.' });
    });

    it('should return status 400 if user is a teacher', async () => {
        const req = getMockReq({
            user: {
                role: Roles.TEACHER,
            },
            params: {
                id: 'group_id',
            },
        });

        await leaveGroupById(req, res);

        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.json).toHaveBeenCalledWith({ msg: 'Teachers cannot leave groups.' });
    });

    it('should return status 404 if group is not found', async () => {
        const req = getMockReq({
            user: {
                role: Roles.STUDENT,
            },
            params: {
                id: 'group_id',
            },
        });

        PointBucketSchema.findOne = jest.fn().mockResolvedValueOnce(null);

        await leaveGroupById(req, res);

        expect(res.status).toHaveBeenCalledWith(404);
        expect(res.json).toHaveBeenCalledWith({ msg: 'Group not found.' });
    });

    it('should return status 400 if user has already left the group', async () => {
        const req = getMockReq({
            user: {
                role: Roles.STUDENT,
                _id: 'user_id',
            },
            params: {
                id: 'group_id',
            },
        });

        PointBucketSchema.findOne = jest.fn().mockResolvedValueOnce({
            isActive: false,
        });

        await leaveGroupById(req, res);

        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.json).toHaveBeenCalledWith({ msg: 'User already left the group.' });
    });

    it('should return status 200 and update isActive to false', async () => {
        const req = getMockReq({
            user: {
                role: Roles.STUDENT,
                _id: 'user_id',
            },
            params: {
                id: 'group_id',
            },
        });

        const saveMock = jest.fn().mockResolvedValueOnce();

        PointBucketSchema.findOne = jest.fn().mockResolvedValueOnce({
            isActive: true,
            save: saveMock,
        });

        await leaveGroupById(req, res);

        expect(saveMock).toHaveBeenCalled();
        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.json).toHaveBeenCalledWith({ msg: 'User left successfully.' });
    });

    it('should return status 500 if there is an error saving the point bucket', async () => {
        const req = getMockReq({
            user: {
                role: Roles.STUDENT,
                _id: 'user_id',
            },
            params: {
                id: 'group_id',
            },
        });

        PointBucketSchema.findOne = jest.fn().mockResolvedValueOnce({
            isActive: true,
            save: jest.fn().mockRejectedValueOnce(new Error('Save error')),
        });

        console.error = jest.fn();

        await leaveGroupById(req, res);

        expect(console.error).toHaveBeenCalledWith('Error leaving group: ', expect.any(Error));
        expect(res.status).toHaveBeenCalledWith(500);
        expect(res.json).toHaveBeenCalledWith({ msg: 'Something went wrong.' });
    });

    it('should return status 500 if there is an error finding the point bucket', async () => {
        const req = getMockReq({
            user: {
                role: Roles.STUDENT,
                _id: 'user_id',
            },
            params: {
                id: 'group_id',
            },
        });

        PointBucketSchema.findOne = jest.fn().mockRejectedValueOnce(new Error('Find error'));

        console.error = jest.fn();

        await leaveGroupById(req, res);

        expect(console.error).toHaveBeenCalledWith('Error leaving a group: ', expect.any(Error));
        expect(res.status).toHaveBeenCalledWith(500);
        expect(res.json).toHaveBeenCalledWith({ msg: 'Something went wrong.' });
    });
});

describe('kickUserById', () => {
    beforeEach(() => {
        // Reset the mock response object before each test
        mockClear();
    });

    it('should kick a user successfully', async () => {
        const req = getMockReq({
            user: {
                role: Roles.TEACHER
            },
            params: {
                id: 'groupId'
            },
            body: {
                userId: 'userId'
            }
        });

        PointBucketSchema.deleteOne = jest.fn().mockResolvedValueOnce();

        await kickUserById(req, res);

        expect(PointBucketSchema.deleteOne).toHaveBeenCalledWith({ user: 'userId', group: 'groupId' });
        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.json).toHaveBeenCalledWith({ msg: 'User kicked successfully.' });
    });

    it('should return 400 if group id is missing', async () => {
        const req = getMockReq({
            user: {
                role: Roles.TEACHER
            },
            params: {},
            body: {
                userId: 'userId'
            }
        });

        await kickUserById(req, res);

        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.json).toHaveBeenCalledWith({ msg: 'Group id is required.' });
    });

    it('should return 400 if user id is missing', async () => {
        const req = getMockReq({
            user: {
                role: Roles.TEACHER
            },
            params: {
                id: 'groupId'
            },
            body: {}
        });

        await kickUserById(req, res);

        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.json).toHaveBeenCalledWith({ msg: 'User id is required.' });
    });

    it('should return 400 if user is not a teacher', async () => {
        const req = getMockReq({
            user: {
                role: Roles.STUDENT
            },
            params: {
                id: 'groupId'
            },
            body: {
                userId: 'userId'
            }
        });

        await kickUserById(req, res);

        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.json).toHaveBeenCalledWith({ msg: 'Only teachers can kick users.' });
    });

    it('should return 500 if an error occurs while kicking the user', async () => {
        const req = getMockReq({
            user: {
                role: Roles.TEACHER
            },
            params: {
                id: 'groupId'
            },
            body: {
                userId: 'userId'
            }
        });

        PointBucketSchema.deleteOne = jest.fn().mockRejectedValueOnce(new Error('Test error'));

        await kickUserById(req, res);

        expect(PointBucketSchema.deleteOne).toHaveBeenCalledWith({ user: 'userId', group: 'groupId' });
        expect(res.status).toHaveBeenCalledWith(500);
        expect(res.json).toHaveBeenCalledWith({ msg: 'Something went wrong.' });
    });
});

describe('getGroupMembers', () => {
    beforeEach(() => {
        mockClear();
    });

    it('should return group members successfully', async () => {
        const req = getMockReq({
            user: { id: 'user_id' },
            params: { id: 'group_id' },
        });

        const pointBuckets = [
            {
                user: {
                    _id: 'user_id_1',
                    name: 'User 1',
                    email: 'user1@example.com',
                    role: 'Member',
                    institute: 'Test Institute',
                },
                points: 10,
            },
            {
                user: {
                    _id: 'user_id_2',
                    name: 'User 2',
                    email: 'user2@example.com',
                    role: 'Member',
                    institute: 'Test Institute',
                },
                points: 20,
            },
        ];

        PointBucketSchema.find = jest.fn().mockImplementation(() => ({
            populate: jest.fn().mockResolvedValue(pointBuckets),
        }));
        await getGroupMembers(req, res);

        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.json).toHaveBeenCalledWith({
            members: [
                {
                    id: 'user_id_1',
                    name: 'User 1',
                    email: 'user1@example.com',
                    role: 'Member',
                    institute: 'Test Institute',
                    points: 10,
                },
                {
                    id: 'user_id_2',
                    name: 'User 2',
                    email: 'user2@example.com',
                    role: 'Member',
                    institute: 'Test Institute',
                    points: 20,
                },
            ],
        });
    });

    it('should return 400 if group id is missing', async () => {
        const req = getMockReq({
            user: { id: 'user_id' },
            params: {},
        });

        await getGroupMembers(req, res);

        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.json).toHaveBeenCalledWith({ msg: 'Group id is required.' });
    });

    it('should return 500 if an error occurs', async () => {
        const req = getMockReq({
            user: { id: 'user_id' },
            params: { id: 'group_id' },
        });

        PointBucketSchema.find = jest.fn().mockImplementation(() => ({
            populate: jest.fn().mockRejectedValueOnce(new Error('Database error')),
        }));

        await getGroupMembers(req, res);

        expect(res.status).toHaveBeenCalledWith(500);
        expect(res.json).toHaveBeenCalledWith({ msg: 'Something went wrong.' });
    });
});

describe('getMemberDetails', () => {
    beforeEach(() => {
        // Reset the mock response object before each test
        mockClear();
    });

    it('should return member details for a valid activity id', async () => {
        const req = getMockReq({
            body: {
                activityId: 'validActivityId'
            }
        });

        const activity = {
            _id: 'validActivityId',
            triggerBy: 'validUserId',
            group: 'validGroupId'
        };

        const pointBucket = {
            user: {
                _id: 'validUserId',
                name: 'Test User',
                email: 'test@example.com',
                role: 'Student',
                institute: 'Test Institute'
            },
            points: 100
        };

        jest.spyOn(ActivitySchema, 'findOne').mockResolvedValueOnce(activity);
        PointBucketSchema.findOne = jest.fn().mockImplementation(() => ({
            populate: jest.fn().mockResolvedValueOnce(pointBucket)
        }));

        await getMemberDetails(req, res);

        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.json).toHaveBeenCalledWith({
            id: 'validUserId',
            name: 'Test User',
            email: 'test@example.com',
            role: 'Student',
            institute: 'Test Institute',
            points: 100
        });
    });

    it('should return 404 if activity is not found', async () => {
        const req = getMockReq({
            body: {
                activityId: 'invalidActivityId'
            }
        });

        jest.spyOn(ActivitySchema, 'findOne').mockResolvedValueOnce(null);

        await getMemberDetails(req, res);

        expect(res.status).toHaveBeenCalledWith(404);
        expect(res.json).toHaveBeenCalledWith({ msg: 'Activity not found.' });
    });

    it('should return 404 if point bucket is not found', async () => {
        const req = getMockReq({
            body: {
                activityId: 'validActivityId'
            }
        });

        const activity = {
            _id: 'validActivityId',
            triggerBy: 'validUserId',
            group: 'validGroupId'
        };

        jest.spyOn(ActivitySchema, 'findOne').mockResolvedValueOnce(activity);
        PointBucketSchema.findOne = jest.fn().mockImplementation(() => ({
            populate: jest.fn().mockResolvedValueOnce(null)
        }));

        await getMemberDetails(req, res);

        expect(res.status).toHaveBeenCalledWith(404);
        expect(res.json).toHaveBeenCalledWith({ msg: 'Group not found.' });
    });

    it('should return 400 if activity id is missing', async () => {
        const req = getMockReq({
            body: {}
        });

        await getMemberDetails(req, res);

        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.json).toHaveBeenCalledWith({ msg: 'Activity id is required.' });
    });

    it('should handle error while getting activity', async () => {
        const req = getMockReq({
            body: {
                activityId: 'validActivityId'
            }
        });

        jest.spyOn(ActivitySchema, 'findOne').mockRejectedValueOnce(new Error('Test Error'));

        await getMemberDetails(req, res);

        expect(res.status).toHaveBeenCalledWith(500);
        expect(res.json).toHaveBeenCalledWith({ msg: 'Something went wrong.' });
    });

    it('should handle error while getting point bucket', async () => {
        const req = getMockReq({
            body: {
                activityId: 'validActivityId'
            }
        });

        const activity = {
            _id: 'validActivityId',
            triggerBy: 'validUserId',
            group: 'validGroupId'
        };

        jest.spyOn(ActivitySchema, 'findOne').mockResolvedValueOnce(activity);
        PointBucketSchema.findOne = jest.fn().mockImplementation(() => ({
            populate: jest.fn().mockRejectedValueOnce(new Error('Test Error'))
        }));

        await getMemberDetails(req, res);

        expect(res.status).toHaveBeenCalledWith(500);
        expect(res.json).toHaveBeenCalledWith({ msg: 'Something went wrong.' });
    });
});