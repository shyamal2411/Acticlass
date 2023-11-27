const mongoose = require("mongoose");
const { MongoMemoryServer } = require("mongodb-memory-server");
const Activity = require("../src/database/schema/activity");

const { ACTIVITY_TYPES } = require("../src/common/constants");

let mongoServer;

function generateObjectId() {
  return new mongoose.Types.ObjectId();
}

describe("Activity Schema", () => {
  beforeAll(async () => {
    jest.setTimeout(120000);
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

  it("should create a new activity with all the required fields.", async () => {
    const mockActivity = {
      type: ACTIVITY_TYPES.ATTENDANCE,
      timestamp: new Date(),
      group: generateObjectId(),
      triggerBy: generateObjectId(),
    };

    const createdActivity = await Activity.create(mockActivity);

    expect(createdActivity).toBeDefined();
    expect(createdActivity.type).toBe(mockActivity.type);
    expect(createdActivity.timestamp).toEqual(mockActivity.timestamp);
  });
  it("should fail if required field type is missing", async () => {
    const incompleteActivity = {
      timestamp: new Date(),
      group: generateObjectId(),
      triggerBy: generateObjectId(),
    };

    const createIncompleteActivity = async () => {
      await Activity.create(incompleteActivity);
    };

    expect(createIncompleteActivity).rejects.toThrow(); // Expecting rejection for a missing required field type
  });

  it("should fail if type field is not from allowed values", async () => {
    const invalidActivity = {
      type: "InvalidType",
      timestamp: new Date(),
      group: generateObjectId(),
      triggerBy: generateObjectId(),
    };

    const createInvalidActivity = async () => {
      await Activity.create(invalidActivity);
    };

    expect(createInvalidActivity).rejects.toThrow(); // Expecting rejection for an invalid type field value
  });

  it("should have default timestamp when not provided", async () => {
    const activityWithoutTimestamp = {
      type: ACTIVITY_TYPES.ATTENDANCE,
      group: generateObjectId(),
      triggerBy: generateObjectId(),
    };

    const createdActivity = await Activity.create(activityWithoutTimestamp);

    expect(createdActivity.timestamp).toBeDefined();
  });

  it("should allow null for triggerFor field", async () => {
    const activityWithNullTriggerFor = {
      type: ACTIVITY_TYPES.ATTENDANCE,
      timestamp: new Date(),
      group: generateObjectId(),
      triggerBy: generateObjectId(),
      triggerFor: null,
    };

    const createdActivity = await Activity.create(activityWithNullTriggerFor);

    expect(createdActivity).toBeDefined();
    expect(createdActivity.triggerFor).toBeNull();
  });

  it("should accept a valid number for points field", async () => {
    const activityWithPoints = {
      type: ACTIVITY_TYPES.ATTENDANCE,
      timestamp: new Date(),
      group: generateObjectId(),
      triggerBy: generateObjectId(),
      points: 50,
    };

    const createdActivity = await Activity.create(activityWithPoints);

    expect(createdActivity).toBeDefined();
    expect(createdActivity.points).toBe(50);
  });

  it("should throw an error if group field is not provided", async () => {
    const activityWithoutGroup = {
      type: ACTIVITY_TYPES.ATTENDANCE,
      timestamp: new Date(),
      triggerBy: generateObjectId(),
    };

    await expect(Activity.create(activityWithoutGroup)).rejects.toThrow();
  });

  it("should throw an error if triggerBy field is not provided", async () => {
    const activityWithoutTriggerBy = {
      type: ACTIVITY_TYPES.ATTENDANCE,
      timestamp: new Date(),
      group: generateObjectId(),
    };

    await expect(Activity.create(activityWithoutTriggerBy)).rejects.toThrow();
  });

  it("should throw an error if group field is not a valid ObjectId", async () => {
    const activityWithInvalidGroup = {
      type: ACTIVITY_TYPES.ATTENDANCE,
      timestamp: new Date(),
      group: "invalidObjectId",
      triggerBy: generateObjectId(),
    };

    await expect(Activity.create(activityWithInvalidGroup)).rejects.toThrow();
  });

  it("should throw an error if triggerBy field is not a valid ObjectId", async () => {
    const activityWithInvalidTriggerBy = {
      type: ACTIVITY_TYPES.ATTENDANCE,
      timestamp: new Date(),
      group: generateObjectId(),
      triggerBy: "invalidObjectId",
    };

    await expect(
      Activity.create(activityWithInvalidTriggerBy)
    ).rejects.toThrow();
  });

  it("should throw an error if triggerFor field is not a valid ObjectId or null", async () => {
    const activityWithInvalidTriggerFor = {
      type: ACTIVITY_TYPES.ATTENDANCE,
      timestamp: new Date(),
      group: generateObjectId(),
      triggerBy: generateObjectId(),
      triggerFor: "invalidObjectId",
    };

    await expect(
      Activity.create(activityWithInvalidTriggerFor)
    ).rejects.toThrow();
  });

  it("should throw an error if points field is not a number", async () => {
    const activityWithInvalidPoints = {
      type: ACTIVITY_TYPES.ATTENDANCE,
      timestamp: new Date(),
      group: generateObjectId(),
      triggerBy: generateObjectId(),
      points: "invalidNumber",
    };

    await expect(Activity.create(activityWithInvalidPoints)).rejects.toThrow();
  });

  it("should save the activity to the database", async () => {
    const validActivity = {
      type: ACTIVITY_TYPES.ATTENDANCE,
      timestamp: new Date(),
      group: generateObjectId(),
      triggerBy: generateObjectId(),
    };

    const createdActivity = await Activity.create(validActivity);

    const retrievedActivity = await Activity.findById(createdActivity._id);

    expect(retrievedActivity).toBeDefined();
  });

  it("should accept a floating-point number for points field", async () => {
    const activityWithFloatingPointPoints = {
      type: ACTIVITY_TYPES.ATTENDANCE,
      timestamp: new Date(),
      group: generateObjectId(),
      triggerBy: generateObjectId(),
      points: 25.5,
    };

    const createdActivity = await Activity.create(
      activityWithFloatingPointPoints
    );

    expect(createdActivity).toBeDefined();
    expect(createdActivity.points).toBeCloseTo(25.5);
  });
});
