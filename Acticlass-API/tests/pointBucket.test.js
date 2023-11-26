const mongoose = require("mongoose");
const { MongoMemoryServer } = require("mongodb-memory-server");
const PointBucket = require("../src/database/schema/pointBucket");

let mongoServer;
function generateObjectId() {
  return new mongoose.Types.ObjectId();
}

describe("PointBucket Schema", () => {
  beforeAll(async () => {
    jest.setTimeout(120000);
    pointBucketSchema = require("../src/database/schema/pointBucket").schema;
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

  it("should throw an error if user field is not provided", async () => {
    const pointBucketWithoutUser = {
      group: generateObjectId(),
    };

    const createPointBucketWithoutUser = async () => {
      await PointBucket.create(pointBucketWithoutUser);
    };

    expect(createPointBucketWithoutUser).rejects.toThrow(); // Expecting rejection for missing user field
  });

  it("should throw an error if group field is not provided", async () => {
    const pointBucketWithoutGroup = {
      user: generateObjectId(),
    };

    const createPointBucketWithoutGroup = async () => {
      await PointBucket.create(pointBucketWithoutGroup);
    };

    expect(createPointBucketWithoutGroup).rejects.toThrow(); // Expecting rejection for missing group field
  });

  it("should default isActive field to true if not provided", async () => {
    const pointBucketWithoutIsActive = {
      user: generateObjectId(),
      group: generateObjectId(),
    };

    const createdPointBucket = await PointBucket.create(
      pointBucketWithoutIsActive
    );

    expect(createdPointBucket).toBeDefined();
    expect(createdPointBucket.isActive).toBe(true);
  });

  it("should default points field to zero if not provided", async () => {
    const pointBucketWithoutPoints = {
      user: generateObjectId(),
      group: generateObjectId(),
    };

    const createdPointBucket = await PointBucket.create(
      pointBucketWithoutPoints
    );

    expect(createdPointBucket).toBeDefined();
    expect(createdPointBucket.points).toBe(0);
  });

  it("should accept false as a valid value for isActive field", async () => {
    const pointBucketWithFalseIsActive = {
      user: generateObjectId(),
      group: generateObjectId(),
      isActive: false,
    };

    const createdPointBucket = await PointBucket.create(
      pointBucketWithFalseIsActive
    );

    expect(createdPointBucket).toBeDefined();
    expect(createdPointBucket.isActive).toBe(false);
  });

  it("should accept positive values for points field", async () => {
    const pointBucketWithPositivePoints = {
      user: generateObjectId(),
      group: generateObjectId(),
      points: 50,
    };

    const createdPointBucket = await PointBucket.create(
      pointBucketWithPositivePoints
    );

    expect(createdPointBucket).toBeDefined();
    expect(createdPointBucket.points).toBeGreaterThan(0);
  });

  it("should accept a valid ObjectId for user field", async () => {
    const pointBucketWithValidUser = {
      user: generateObjectId(),
      group: generateObjectId(),
      points: 30,
    };

    const createdPointBucket = await PointBucket.create(
      pointBucketWithValidUser
    );

    expect(createdPointBucket).toBeDefined();
  });

  it("should accept a valid ObjectId for group field", async () => {
    const pointBucketWithValidGroup = {
      user: generateObjectId(),
      group: generateObjectId(),
      points: 20,
    };

    const createdPointBucket = await PointBucket.create(
      pointBucketWithValidGroup
    );

    expect(createdPointBucket).toBeDefined();
  });

  it("should accept null as a valid value for isActive field", async () => {
    const pointBucketWithNullIsActive = {
      user: generateObjectId(),
      group: generateObjectId(),
      isActive: null,
    };

    const createdPointBucket = await PointBucket.create(
      pointBucketWithNullIsActive
    );

    expect(createdPointBucket).toBeDefined();
    expect(createdPointBucket.isActive).toBeNull();
  });

  it("should accept zero as a valid value for points field", async () => {
    const pointBucketWithZeroPoints = {
      user: generateObjectId(),
      group: generateObjectId(),
      points: 0,
    };

    const createdPointBucket = await PointBucket.create(
      pointBucketWithZeroPoints
    );

    expect(createdPointBucket).toBeDefined();
    expect(createdPointBucket.points).toBe(0);
  });

  it("should not accept an empty string for user field", async () => {
    const pointBucketWithEmptyUser = {
      user: "",
      group: generateObjectId(),
      points: 10,
    };

    const createPointBucketWithEmptyUser = async () => {
      await PointBucket.create(pointBucketWithEmptyUser);
    };

    expect(createPointBucketWithEmptyUser).rejects.toThrow(); // Expecting rejection for an empty string user field
  });

  it("should not accept a string value for group field", async () => {
    const pointBucketWithStringGroup = {
      user: generateObjectId(),
      group: "invalidGroupID",
      points: 15,
    };

    const createPointBucketWithStringGroup = async () => {
      await PointBucket.create(pointBucketWithStringGroup);
    };

    expect(createPointBucketWithStringGroup).rejects.toThrow(); // Expecting rejection for a string value in the group field
  });

  it("should default isActive field to true if not provided", async () => {
    const pointBucketWithoutIsActive = {
      user: generateObjectId(),
      group: generateObjectId(),
    };

    const createdPointBucket = await PointBucket.create(
      pointBucketWithoutIsActive
    );

    expect(createdPointBucket).toBeDefined();
    expect(createdPointBucket.isActive).toBe(true);
  });

  it("should accept maximum allowed value for points field", async () => {
    const MAX_POINTS = Number.MAX_SAFE_INTEGER;

    const pointBucketWithMaxPoints = {
      user: generateObjectId(),
      group: generateObjectId(),
      points: MAX_POINTS,
    };

    const createdPointBucket = await PointBucket.create(
      pointBucketWithMaxPoints
    );

    expect(createdPointBucket).toBeDefined();
    expect(createdPointBucket.points).toBe(MAX_POINTS);
  });

  it("should not accept a negative number for user field", async () => {
    const pointBucketWithNegativeUser = {
      user: -5,
      group: generateObjectId(),
      points: 25,
    };

    const createPointBucketWithNegativeUser = async () => {
      await PointBucket.create(pointBucketWithNegativeUser);
    };

    expect(createPointBucketWithNegativeUser).rejects.toThrow(); // Expecting rejection for a negative number in the user field
  });

  it("should not accept null for group field", async () => {
    const pointBucketWithNullGroup = {
      user: generateObjectId(),
      group: null,
      points: 20,
    };

    const createPointBucketWithNullGroup = async () => {
      await PointBucket.create(pointBucketWithNullGroup);
    };

    expect(createPointBucketWithNullGroup).rejects.toThrow(); // Expecting rejection for null in the group field
  });

  it("should default isActive field to true if not provided", async () => {
    const pointBucketWithoutIsActive = {
      user: generateObjectId(),
      group: generateObjectId(),
    };

    const createdPointBucket = await PointBucket.create(
      pointBucketWithoutIsActive
    );

    expect(createdPointBucket).toBeDefined();
    expect(createdPointBucket.isActive).toBe(true);
  });

  it("should not accept a string value for points field", async () => {
    const pointBucketWithStringPoints = {
      user: generateObjectId(),
      group: generateObjectId(),
      points: "invalid",
    };

    const createPointBucketWithStringPoints = async () => {
      await PointBucket.create(pointBucketWithStringPoints);
    };

    expect(createPointBucketWithStringPoints).rejects.toThrow(); // Expecting rejection for a string value in the points field
  });
});
