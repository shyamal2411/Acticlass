const { hash, compare } = require("../src/services/bcrypt");


test('Hash test', async () => {
    let hashPW = await hash('test');
    compare('test', hashPW).then((match) => {
        expect(match).toBe(true);
    });
});

