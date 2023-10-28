const mongoose = require("mongoose");
const { MongoMemoryServer } = require("mongodb-memory-server");
const Group = require("../../src/database/schema/group");

describe("Group Schema", () => {
    let mongoServer;
    beforeAll(async () => {
        mongoServer = await MongoMemoryServer.create();
        const mongoUri = mongoServer.getUri();
        await mongoose.connect(mongoUri, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
    });

    afterAll(async () => {
        await mongoose.disconnect();
        await mongoServer.stop();
    });

    afterEach(async () => {
        await Group.deleteMany();
    });

    it("should save a group with valid properties", async () => {
        const group = new Group({
            name: "Math Club",
            institute: "Example University",
            members: [],
            createdBy: new mongoose.Types.ObjectId(),
            radius: 10,
            passingPoints: 0,
            attendanceFrequency: 60,
            attendanceReward: 0,
            penalty: 0,
        });
        const savedGroup = await group.save();
        expect(savedGroup._id).toBeDefined();
        expect(savedGroup.name).toBe(group.name);
        expect(savedGroup.institute).toBe(group.institute);
        expect(savedGroup.members).toEqual(group.members);
        expect(savedGroup.createdBy).toEqual(group.createdBy);
        expect(savedGroup.radius).toBe(group.radius);
        expect(savedGroup.passingPoints).toBe(group.passingPoints);
        expect(savedGroup.attendanceFrequency).toBe(group.attendanceFrequency);
        expect(savedGroup.attendanceReward).toBe(group.attendanceReward);
        expect(savedGroup.penalty).toBe(group.penalty);
    });

    it("should not save a group without a name", async () => {
        const group = new Group({
            institute: "Example University",
            members: [],
            createdBy: new mongoose.Types.ObjectId(),
            radius: 10,
            passingPoints: 0,
            attendanceFrequency: 60,
            attendanceReward: 0,
            penalty: 0,
        });
        await expect(group.save()).rejects.toThrow();
    });

    it("should not save a group without an institute", async () => {
        const group = new Group({
            name: "Math Club",
            members: [],
            createdBy: new mongoose.Types.ObjectId(),
            radius: 10,
            passingPoints: 0,
            attendanceFrequency: 60,
            attendanceReward: 0,
            penalty: 0,
        });
        await expect(group.save()).rejects.toThrow();
    });

    it("should not save a group without a createdBy field", async () => {
        const group = new Group({
            name: "Math Club",
            institute: "Example University",
            members: [],
            radius: 10,
            passingPoints: 0,
            attendanceFrequency: 60,
            attendanceReward: 0,
            penalty: 0,
        });
        await expect(group.save()).rejects.toThrow();
    });

    it("should not save a group with an invalid attendanceFrequency field", async () => {
        const group = new Group({
            name: "Math Club",
            institute: "Example University",
            members: [],
            createdBy: new mongoose.Types.ObjectId(),
            radius: 10,
            passingPoints: 0,
            attendanceFrequency: 45,
            attendanceReward: 0,
            penalty: 0,
        });
        await expect(group.save()).rejects.toThrow();
    });

    it("should not save a group with a negative radius field", async () => {
        const group = new Group({
            name: "Math Club",
            institute: "Example University",
            members: [],
            createdBy: new mongoose.Types.ObjectId(),
            radius: -10,
            passingPoints: 0,
            attendanceFrequency: 60,
            attendanceReward: 0,
            penalty: 0,
        });
        await expect(group.save()).rejects.toThrow();
    });

    it("should not save a group with a negative attendanceReward field", async () => {
        const group = new Group({
            name: "Math Club",
            institute: "Example University",
            members: [],
            createdBy: new mongoose.Types.ObjectId(),
            radius: 10,
            passingPoints: 0,
            attendanceFrequency: 60,
            attendanceReward: -10,
            penalty: 0,
        });
        await expect(group.save()).rejects.toThrow();
    });

    it("should not save a group with a negative penalty field", async () => {
        const group = new Group({
            name: "Math Club",
            institute: "Example University",
            members: [],
            createdBy: new mongoose.Types.ObjectId(),
            radius: 10,
            passingPoints: 0,
            attendanceFrequency: 60,
            attendanceReward: 0,
            penalty: -10,
        });
        await expect(group.save()).rejects.toThrow();
    });
});