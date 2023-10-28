const mongoose = require("mongoose");
const { MongoMemoryServer } = require("mongodb-memory-server");
const User = require("../../src/database/schema/user");

describe("User Schema", () => {
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
    await User.deleteMany();
  });

  it("should save a user with valid properties", async () => {
    const user = new User({
      name: "John Doe",
      email: "johndoe@example.com",
      institute: "Example University",
      role: "Teacher",
      password: "password",
    });
    const savedUser = await user.save();
    expect(savedUser._id).toBeDefined();
    expect(savedUser.name).toBe(user.name);
    expect(savedUser.email).toBe(user.email);
    expect(savedUser.institute).toBe(user.institute);
    expect(savedUser.role).toBe(user.role);
    expect(savedUser.password).toBe(user.password);
  });

  it("should not save a user without a name", async () => {
    const user = new User({
      email: "johndoe@example.com",
      institute: "Example University",
      role: "Teacher",
      password: "password",
    });
    await expect(user.save()).rejects.toThrow();
  });

  it("should not save a user without an email", async () => {
    const user = new User({
      name: "John Doe",
      institute: "Example University",
      role: "Teacher",
      password: "password",
    });
    await expect(user.save()).rejects.toThrow();
  });

  it("should not save a user without an institute", async () => {
    const user = new User({
      name: "John Doe",
      email: "johndoe@example.com",
      role: "Teacher",
      password: "password",
    });
    await expect(user.save()).rejects.toThrow();
  });

  it("should not save a user without a role", async () => {
    const user = new User({
      name: "John Doe",
      email: "johndoe@example.com",
      institute: "Example University",
      password: "password",
    });
    await expect(user.save()).rejects.toThrow();
  });

  it("should not save a user without a password", async () => {
    const user = new User({
      name: "John Doe",
      email: "johndoe@example.com",
      institute: "Example University",
      role: "Teacher",
    });
    await expect(user.save()).rejects.toThrow();
  });

  it("should not save a user with a duplicate email", async () => {
    const user1 = new User({
      name: "John Doe",
      email: "johndoe@example.com",
      institute: "Example University",
      role: "Teacher",
      password: "password",
    });
    await user1.save();

    const user2 = new User({
      name: "Jane Doe",
      email: "johndoe@example.com",
      institute: "Example University",
      role: "Student",
      password: "password",
    });
    await expect(user2.save()).rejects.toThrow();
  });
});   