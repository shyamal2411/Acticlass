const mongoose = require("mongoose");
const { MongoMemoryServer } = require("mongodb-memory-server");
const User = require("../src/database/schema/user");
let mongoServer;

describe("User Schema", () => {
  beforeAll(async () => {
    jest.setTimeout(120000);
    userSchema = require("../src/database/schema/user").schema;
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
    const userWithoutName = {
      email: "test@example.com",
      institute: "Some Institute",
      role: "Student",
      password: "testpassword",
    };

    const createUserWithoutName = async () => {
      await User.create(userWithoutName);
    };

    expect(createUserWithoutName).rejects.toThrow();
  });

  it("should throw an error if email field is not provided or is not unique", async () => {
    const userWithoutEmail = {
      name: "Test User",
      institute: "Some Institute",
      role: "Student",
      password: "testpassword",
    };

    const createUserWithoutEmail = async () => {
      await User.create(userWithoutEmail);
    };

    const userWithExistingEmail = {
      name: "Another Test User",
      email: "test@example.com",
      institute: "Another Institute",
      role: "admin",
      password: "password123",
    };

    const createUserWithExistingEmail = async () => {
      await User.create(userWithExistingEmail);
    };

    expect(createUserWithoutEmail).rejects.toThrow(); // Expecting error when email is not provided

    expect(createUserWithExistingEmail).rejects.toThrow(); // Expecting error when email already exists
  });

  it("should throw an error if institute field is not provided", async () => {
    const userWithoutInstitute = {
      name: "Test User",
      email: "test@example.com",
      role: "Student",
      password: "testpassword",
    };

    const createUserWithoutInstitute = async () => {
      await User.create(userWithoutInstitute);
    };

    expect(createUserWithoutInstitute).rejects.toThrow(); // Expecting rejection when institute is not provided
    expect(createUserWithoutInstitute).rejects.toThrow(); // Expecting error when institute is not provided
  });

  it("should throw an error if role field does not match Roles enum", async () => {
    const userWithInvalidRole = {
      name: "Test User",
      email: "test@example.com",
      institute: "Some Institute",
      role: "invalidRole",
      password: "testpassword",
    };

    const createUserWithInvalidRole = async () => {
      await User.create(userWithInvalidRole);
    };

    expect(createUserWithInvalidRole).rejects.toThrow(); // Expecting rejection when role is invalid
    expect(createUserWithInvalidRole).rejects.toThrow(); // Expecting error when role is invalid
  });

  it("should throw an error if password field is not provided", async () => {
    const userWithoutPassword = {
      name: "Test User",
      email: "test@example.com",
      institute: "Some Institute",
      role: "Student",
    };

    const createUserWithoutPassword = async () => {
      await User.create(userWithoutPassword);
    };

    expect(createUserWithoutPassword).rejects.toThrow(); // Expecting rejection when password is not provided
    expect(createUserWithoutPassword).rejects.toThrow(); // Expecting error when password is not provided
  });

  it("should throw an error if role field is an empty string", async () => {
    const userWithEmptyRole = {
      name: "Test User",
      email: "test@example.com",
      institute: "Some Institute",
      role: "",
      password: "testpassword",
    };

    const createUserWithEmptyRole = async () => {
      await User.create(userWithEmptyRole);
    };

    expect(createUserWithEmptyRole).rejects.toThrow(); // Expecting rejection when role is an empty string
    expect(createUserWithEmptyRole).rejects.toThrow(); // Expecting error when role is an empty string
  });

  it("should accept special characters in the password field", async () => {
    const userWithSpecialCharactersInPassword = {
      name: "Test User",
      email: "test123@example.com",
      institute: "Motabhai University",
      password: "SamplePassword!@#$",
      role: "Student",
    };

    const createdUser = await User.create(userWithSpecialCharactersInPassword);
    expect(createdUser).toBeDefined(); // Expecting the user to be created successfully with special characters in the password
  });
});
