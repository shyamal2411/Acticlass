const mongoose = require("mongoose");
const { MongoMemoryServer } = require("mongodb-memory-server");
const Group = require("../src/database/schema/group");
const PointBucket = require("../src/database/schema/pointBucket");

let mongoServer;
function generateObjectId() {
  return new mongoose.Types.ObjectId();
}

describe("Group Schema", () => {
  beforeAll(async () => {
    jest.setTimeout(120000);
    groupSchema = require("../src/database/schema/group").schema;
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

  it("should throw an error if name field is not provided", async () => {
    const groupWithoutName = {
      institute: "Some Institute",
      createdBy: generateObjectId(),
    };

    const createGroupWithoutName = async () => {
      await Group.create(groupWithoutName);
    };

    expect(createGroupWithoutName).rejects.toThrow(); // Expecting rejection when name is not provided
  });

  it("should throw an error if institute field is not provided", async () => {
    const groupWithoutInstitute = {
      name: "Some Group",
      createdBy: generateObjectId(),
    };

    const createGroupWithoutInstitute = async () => {
      await Group.create(groupWithoutInstitute);
    };

    expect(createGroupWithoutInstitute).rejects.toThrow(); // Expecting rejection when institute is not provided
  });

  it("should throw an error if createdBy field is not provided", async () => {
    const groupWithoutCreatedBy = {
      name: "Some Group",
      institute: "Some Institute",
    };

    const createGroupWithoutCreatedBy = async () => {
      await Group.create(groupWithoutCreatedBy);
    };

    expect(createGroupWithoutCreatedBy).rejects.toThrow(); // Expecting rejection when createdBy is not provided
  });

  it("should default passingPoints to zero if not provided", async () => {
    const groupWithoutPassingPoints = {
      name: "Some Group",
      institute: "Some Institute",
      createdBy: generateObjectId(),
    };

    const createdGroup = await Group.create(groupWithoutPassingPoints);

    expect(createdGroup).toBeDefined(); // Expecting the group to be created
    expect(createdGroup.passingPoints).toBe(0); // Expecting passingPoints to be defaulted to zero
  });

  it("should accept valid attendanceFrequency values", async () => {
    const groupWithValidAttendanceFrequency = {
      name: "Some Group",
      institute: "Some Institute",
      createdBy: generateObjectId(),
      attendanceFrequency: 60,
    };

    const createdGroup = await Group.create(groupWithValidAttendanceFrequency);

    expect(createdGroup).toBeDefined();
  });

  it("should reject invalid attendanceFrequency value", async () => {
    const groupWithInvalidAttendanceFrequency = {
      name: "Some Group",
      institute: "Some Institute",
      createdBy: generateObjectId(),
      attendanceFrequency: 90, // Invalid value: Not present in ATTENDANCE_FREQUENCY
    };

    const createGroupWithInvalidAttendanceFrequency = async () => {
      await Group.create(groupWithInvalidAttendanceFrequency);
    };

    expect(createGroupWithInvalidAttendanceFrequency).rejects.toThrow(); // Expecting rejection for invalid attendanceFrequency
  });

  it("should not accept negative values for attendanceReward field", async () => {
    const groupWithNegativeAttendanceReward = {
      name: "Some Group",
      institute: "Some Institute",
      createdBy: generateObjectId(),
      attendanceReward: -10,
    };

    const createGroupWithNegativeAttendanceReward = async () => {
      await Group.create(groupWithNegativeAttendanceReward);
    };

    expect(createGroupWithNegativeAttendanceReward).rejects.toThrow(); // Expecting rejection for negative attendanceReward
  });

  it("should not accept negative values for penalty field", async () => {
    const groupWithNegativePenalty = {
      name: "Some Group",
      institute: "Some Institute",
      createdBy: generateObjectId(),
      penalty: -5,
    };

    const createGroupWithNegativePenalty = async () => {
      await Group.create(groupWithNegativePenalty);
    };

    expect(createGroupWithNegativePenalty).rejects.toThrow(); // Expecting rejection for negative penalty
  });

  it("should not accept negative values for radius field", async () => {
    const groupWithNegativeRadius = {
      name: "Some Group",
      institute: "Some Institute",
      createdBy: generateObjectId(),
      radius: -50, // Negative value for radius
    };

    const createGroupWithNegativeRadius = async () => {
      await Group.create(groupWithNegativeRadius);
    };

    expect(createGroupWithNegativeRadius).rejects.toThrow(); // Expecting rejection for negative radius
  });

  it("should reject non-standard attendanceFrequency values", async () => {
    const groupWithNonStandardFrequency = {
      name: "Some Group",
      institute: "Some Institute",
      createdBy: generateObjectId(),
      attendanceFrequency: 45, // Non-standard frequency value
    };

    const createGroupWithNonStandardFrequency = async () => {
      await Group.create(groupWithNonStandardFrequency);
    };

    expect(createGroupWithNonStandardFrequency).rejects.toThrow(); // Expecting rejection for non-standard attendanceFrequency
  });

  it("should accept zero as a valid value for passingPoints field", async () => {
    const groupWithZeroPassingPoints = {
      name: "Some Group",
      institute: "Some Institute",
      createdBy: generateObjectId(),
      passingPoints: 0, // Zero as passingPoints value
    };

    const createdGroup = await Group.create(groupWithZeroPassingPoints);

    expect(createdGroup).toBeDefined(); // Expecting the group to be created
    expect(createdGroup.passingPoints).toBe(0); // Expecting passingPoints to be set to zero
  });

  it("should accept zero as a valid value for attendanceReward field", async () => {
    const groupWithZeroAttendanceReward = {
      name: "Some Group",
      institute: "Some Institute",
      createdBy: generateObjectId(),
      attendanceReward: 0, // Zero as attendanceReward value
    };

    const createdGroup = await Group.create(groupWithZeroAttendanceReward);

    expect(createdGroup).toBeDefined(); // Expecting the group to be created
    expect(createdGroup.attendanceReward).toBe(0); // Expecting attendanceReward to be set to zero
  });

  it("should accept zero as a valid value for penalty field", async () => {
    const groupWithZeroPenalty = {
      name: "Some Group",
      institute: "Some Institute",
      createdBy: generateObjectId(),
      penalty: 0, // Zero as penalty value
    };

    const createdGroup = await Group.create(groupWithZeroPenalty);

    expect(createdGroup).toBeDefined(); // Expecting the group to be created
    expect(createdGroup.penalty).toBe(0); // Expecting penalty to be set to zero
  });

  it("should accept maximum allowed length for name field", async () => {
    const maxLengthName = "a".repeat(255);

    const groupWithMaxLengthName = {
      name: maxLengthName,
      institute: "Some Institute",
      createdBy: generateObjectId(),
    };

    const createdGroup = await Group.create(groupWithMaxLengthName);

    expect(createdGroup).toBeDefined(); // Expecting the group to be created with maximum length name
  });

  it("should accept standard attendanceFrequency values", async () => {
    const standardFrequencies = [0, 15, 30, 60];

    const promises = standardFrequencies.map(async (frequency) => {
      const groupWithStandardFrequency = {
        name: "Some Group",
        institute: "Some Institute",
        createdBy: generateObjectId(),
        attendanceFrequency: frequency,
      };

      const createdGroup = await Group.create(groupWithStandardFrequency);
      expect(createdGroup).toBeDefined();
    });

    await Promise.all(promises);
  });

  it("should reject non-numeric values for attendanceFrequency", async () => {
    const groupWithNonNumericFrequency = {
      name: "Some Group",
      institute: "Some Institute",
      createdBy: generateObjectId(),
      attendanceFrequency: "invalid",
    };

    const createGroupWithNonNumericFrequency = async () => {
      await Group.create(groupWithNonNumericFrequency);
    };

    expect(createGroupWithNonNumericFrequency).rejects.toThrow(); // Expecting rejection for non-numeric attendanceFrequency
  });

  it("should not accept an empty string for name field", async () => {
    const groupWithEmptyName = {
      name: "",
      institute: "Some Institute",
      createdBy: generateObjectId(),
    };

    const createGroupWithEmptyName = async () => {
      await Group.create(groupWithEmptyName);
    };

    expect(createGroupWithEmptyName).rejects.toThrow(); // Expecting rejection for an empty name field
  });

  it("should accept a floating-point number for attendanceReward field", async () => {
    const groupWithFloatingPointReward = {
      name: "Some Group",
      institute: "Some Institute",
      createdBy: generateObjectId(),
      attendanceReward: 15.5,
    };

    const createdGroup = await Group.create(groupWithFloatingPointReward);

    expect(createdGroup).toBeDefined();
    expect(createdGroup.attendanceReward).toBeCloseTo(15.5);
  });
});

describe("Group Schema - pre deleteOne hook", () => {
  let groupId;
  let otherGroupId;

  beforeAll(async () => {
    jest.setTimeout(120000);
    mongoServer = await MongoMemoryServer.create();
    const mongoUri = mongoServer.getUri();
    await mongoose.connect(mongoUri, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    const group = await Group.create({
      name: "Test Group",
      institute: "Test Institute",
      createdBy: generateObjectId(),
      radius: 10,
      passingPoints: 5,
      attendanceFrequency: 60,
      attendanceReward: 10,
      penalty: 5,
    });

    groupId = group._id;
    const otherGroup = await Group.create({
      name: "Other Group",
      institute: "Another Institute",
      createdBy: generateObjectId(),
      radius: 10,
      passingPoints: 5,
      attendanceFrequency: 60,
      attendanceReward: 10,
      penalty: 5,
    });

    otherGroupId = otherGroup._id;

    const createOtherGroupPointBuckets = async () => {
      await mongoose.model("pointBuckets").create([
        {
          user: generateObjectId(),
          group: otherGroupId,
          isActive: true,
          points: 20,
        },
        {
          user: generateObjectId(),
          group: otherGroupId,
          isActive: true,
          points: 30,
        },
      ]);
    };

    await createOtherGroupPointBuckets();
  });

  afterAll(async () => {
    await mongoose.disconnect();
    await mongoServer.stop();
  });

  it("should delete associated point buckets when a group is deleted", async () => {
    await Group.deleteOne({ _id: groupId });

    const associatedPointBuckets = await mongoose
      .model("pointBuckets")
      .find({ group: groupId });

    expect(associatedPointBuckets).toHaveLength(0);
  });
  it("should not delete other group's point buckets when a group is deleted", async () => {
    await Group.deleteOne({ _id: groupId });

    const otherGroupPointBuckets = await mongoose
      .model("pointBuckets")
      .find({ group: otherGroupId });

    expect(otherGroupPointBuckets).not.toHaveLength(0);
  });

  it("should not delete other group's point buckets when a group is deleted", async () => {
    await Group.deleteOne({ _id: groupId });
    const otherGroupPointBuckets = await mongoose
      .model("pointBuckets")
      .find({ group: otherGroupId });

    expect(otherGroupPointBuckets).not.toHaveLength(0);
  });

  it("should not call next() if pre deleteOne hook encounters an error", async () => {
    const originalDeleteOne = mongoose.Model.deleteOne;
    mongoose.Model.deleteOne = jest
      .fn()
      .mockRejectedValue(new Error("Simulated error"));

    await expect(Group.deleteOne({ _id: groupId })).rejects.toThrow(
      "Simulated error"
    );

    mongoose.Model.deleteOne = originalDeleteOne;
  });
});
