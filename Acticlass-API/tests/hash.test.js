const { hash, compare } = require("../src/services/bcrypt");

describe("bcrypt", () => {
    it("should hash a password and return a string", async () => {
        const hashedPassword = await hash("password");
        expect(typeof hashedPassword).toBe("string");
    });

    it("should compare a password and its hash and return true", async () => {
        const password = "password";
        const hashedPassword = await hash(password);
        const isMatch = await compare(password, hashedPassword);
        expect(isMatch).toBe(true);
    });

    it("should compare a password and its hash and return false", async () => {
        const password = "password";
        const wrongPassword = "wrongpassword";
        const hashedPassword = await hash(password);
        const isMatch = await compare(wrongPassword, hashedPassword);
        expect(isMatch).toBe(false);
    });
});

