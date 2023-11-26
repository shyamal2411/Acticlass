const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');
const { getMockReq, getMockRes } = require('@jest-mock/express');
const moment = require('moment');

const ActivitySchema = require('../src/database/schema/activity');
const { getActivities } = require('../src/controllers/activities/activity/controllers');
const { ACTIVITY_TYPES, Roles } = require('../src/common/constants');

const { res, mockClear } = getMockRes();

let mongoServer;

jest.setTimeout(150000);

beforeAll(async () => {
    mongoServer = await MongoMemoryServer.create();
    const mongoUri = mongoServer.getUri();
    await mongoose.connect(mongoUri, { useNewUrlParser: true, useUnifiedTopology: true });
});

afterAll(async () => {
    await mongoose.disconnect();
    await mongoServer.stop();
});

describe('getActivities', () => {
    beforeEach(() => {
        mockClear();
    });

    it('should return activities for teacher role', async () => {
        const req = getMockReq({
            user: {
                role: Roles.TEACHER,
            },
            body: {
                groupId: 'group_id',
                startDate: '2022-01-01',
                endDate: '2022-01-31',
            },
        });

        const activities = [
            {
                _id: 'activity_id_1',
                group: 'group_id',
                timestamp: new Date(),
                type: ACTIVITY_TYPES.REQUEST_ACCEPTED,
                triggerFor: {
                    _id: 'trigger_for_id',
                    triggerBy: {
                        _id: 'trigger_by_id',
                        name: 'Test User',
                        email: 'test@example.com',
                    },
                    type: 'trigger_for_type',
                    timestamp: new Date(),
                    points: 10,
                },
                triggerBy: {
                    _id: 'trigger_by_id',
                    name: 'Test User',
                    email: 'test@example.com',
                },
            },
            // Add more activities as needed
        ];

        jest.spyOn(ActivitySchema, 'find').mockImplementation(() => ({
            populate: jest.fn().mockImplementation(() => ({
                populate: jest.fn().mockResolvedValue(activities),
            })),
        }));

        await getActivities(req, res);

        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.json).toHaveBeenCalledWith({
            activities: activities.map(activity => ({
                timestamp: activity.timestamp,
                points: activity.points,
                type: activity.type,
                triggerFor: {
                    _id: activity.triggerFor._id,
                    triggerBy: {
                        _id: activity.triggerFor.triggerBy._id,
                        name: activity.triggerFor.triggerBy.name,
                        email: activity.triggerFor.triggerBy.email,
                    },
                    type: activity.triggerFor.type,
                    timestamp: activity.triggerFor.timestamp,
                    points: activity.triggerFor.points,
                },
                triggerBy: {
                    _id: activity.triggerBy._id,
                    name: activity.triggerBy.name,
                    email: activity.triggerBy.email,
                },
            })),
        });
    });

    it('should return activities for non-teacher role', async () => {
        const req = getMockReq({
            user: {
                role: Roles.STUDENT,
                _id: 'user_id',
            },
            body: {
                groupId: 'group_id',
                startDate: '2022-01-01',
                endDate: '2022-01-31',
            },
        });

        const activities = [
            {
                _id: 'activity_id_1',
                group: 'group_id',
                timestamp: new Date(),
                type: ACTIVITY_TYPES.REQUEST_ACCEPTED,
                triggerFor: {
                    _id: 'trigger_for_id',
                    triggerBy: {
                        _id: 'trigger_by_id',
                        name: 'Test User',
                        email: 'test@example.com',
                    },
                    type: 'trigger_for_type',
                    timestamp: new Date(),
                    points: 10,
                },
                triggerBy: {
                    _id: 'trigger_by_id',
                    name: 'Test User',
                    email: 'test@example.com',
                },
            },
        ];


        jest.spyOn(ActivitySchema, 'find').mockImplementation(() => ({
            populate: jest.fn().mockImplementation(() => ({
                populate: jest.fn().mockResolvedValue(activities),
            })),
        }));

        await getActivities(req, res);
        expect(res.status).toHaveBeenCalledWith(200);
        // expect(res.json).toHaveBeenCalledWith({
        //     activities
        // });
    });

    it('should return empty activities if no activities found', async () => {
        const req = getMockReq({
            user: {
                role: Roles.TEACHER,
            },
            body: {
                groupId: 'group_id',
                startDate: '2022-01-01',
                endDate: '2022-01-31',
            },
        });
        jest.spyOn(ActivitySchema, 'find').mockImplementation(() => ({
            populate: jest.fn().mockImplementation(() => ({
                populate: jest.fn().mockResolvedValue([]),
            })),
        }));

        await getActivities(req, res);

        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.json).toHaveBeenCalledWith({ activities: [] });
    });

    it('should return error if start date is after end date', async () => {
        const req = getMockReq({
            user: {
                role: Roles.TEACHER,
            },
            body: {
                groupId: 'group_id',
                startDate: '2022-01-31',
                endDate: '2022-01-01',
            },
        });

        await getActivities(req, res);

        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.json).toHaveBeenCalledWith({ message: 'Start date must be before end date' });
    });

});