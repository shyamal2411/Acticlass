import {
    signInValidation,
    signUpValidation1,
    signUpValidation2,
    signUpValidation3,
    forgotPassword,
    resetCode,
    groupCreation,
} from '../src/common/validationSchemas';

describe('Validation Schemas', () => {
    describe('SignIn Validation', () => {
        it('should pass with valid email and password', async () => {
            const values = { email: 'test@example.com', password: 'password123' };
            await expect(signInValidation.validate(values)).resolves.toBe(values);
        });

        it('should fail with invalid email', async () => {
            const values = { email: 'invalid', password: 'password123' };
            await expect(signInValidation.validate(values)).rejects.toThrow('Invalid email');
        });

        it('should fail with missing email', async () => {
            const values = { password: 'password123' };
            await expect(signInValidation.validate(values)).rejects.toThrow('Required');
        });

        it('should fail with missing password', async () => {
            const values = { email: 'test@example.com' };
            await expect(signInValidation.validate(values)).rejects.toThrow('Required');
        });
    });

    describe('SignUp Validation 1', () => {
        it('should pass with valid email and name', async () => {
            const values = { email: 'test@example.com', name: 'John' };
            await expect(signUpValidation1.validate(values)).resolves.toBe(values);
        });

        it('should fail with invalid email', async () => {
            const values = { email: 'invalid', name: 'John' };
            await expect(signUpValidation1.validate(values)).rejects.toThrow('Invalid email');
        });

        it('should fail with missing email', async () => {
            const values = { name: 'John' };
            await expect(signUpValidation1.validate(values)).rejects.toThrow('Required');
        });

        it('should fail with missing name', async () => {
            const values = { email: 'test@example.com' };
            await expect(signUpValidation1.validate(values)).rejects.toThrow('Required');
        });

        it('should fail with name too long', async () => {
            const values = { email: 'test@example.com', name: 'ThisNameIsTooLong' };
            await expect(signUpValidation1.validate(values)).rejects.toThrow('Too Long!');
        });

        it('should fail with name containing whitespace', async () => {
            const values = { email: 'test@example.com', name: 'John Smith' };
            await expect(signUpValidation1.validate(values)).rejects.toThrow('Whitespace and Number are not allowed!');
        });

        it('should fail with name containing number', async () => {
            const values = { email: 'test@example.com', name: 'John123' };
            await expect(signUpValidation1.validate(values)).rejects.toThrow('Whitespace and Number are not allowed!');
        });
    });

    describe('SignUp Validation 2', () => {
        it('should pass with valid institute and role', async () => {
            const values = { institute: 'Example University', role: 'Student' };
            await expect(signUpValidation2.validate(values)).resolves.toBe(values);
        });

        it('should fail with missing institute', async () => {
            const values = { role: 'Student' };
            await expect(signUpValidation2.validate(values)).rejects.toThrow('Required');
        });

        it('should fail with missing role', async () => {
            const values = { institute: 'Example University' };
            await expect(signUpValidation2.validate(values)).rejects.toThrow('Required');
        });
    });

    describe('SignUp Validation 3', () => {
        it('should pass with valid password and confirm password', async () => {
            const values = { password: 'Password123!', confirmPassword: 'Password123!' };
            await expect(signUpValidation3.validate(values)).resolves.toBe(values);
        });

        it('should fail with missing confirm password', async () => {
            const values = { password: 'Password123!' };
            await expect(signUpValidation3.validate(values)).rejects.toThrow('Required');
        });

        it('should fail with password too short', async () => {
            const values = { password: 'pass', confirmPassword: 'pass' };
            await expect(signUpValidation3.validate(values)).rejects.toThrow('Password must be at least 8 characters long and include at least one uppercase letter, one lowercase letter, one number, and one special character');
        });

        it('should fail with password missing uppercase letter', async () => {
            const values = { password: 'password123!', confirmPassword: 'password123!' };
            await expect(signUpValidation3.validate(values)).rejects.toThrow('Password must be at least 8 characters long and include at least one uppercase letter, one lowercase letter, one number, and one special character');
        });

        it('should fail with password missing lowercase letter', async () => {
            const values = { password: 'PASSWORD123!', confirmPassword: 'PASSWORD123!' };
            await expect(signUpValidation3.validate(values)).rejects.toThrow('Password must be at least 8 characters long and include at least one uppercase letter, one lowercase letter, one number, and one special character');
        });

        it('should fail with password missing number', async () => {
            const values = { password: 'Password!', confirmPassword: 'Password!' };
            await expect(signUpValidation3.validate(values)).rejects.toThrow('Password must be at least 8 characters long and include at least one uppercase letter, one lowercase letter, one number, and one special character');
        });

        it('should fail with password missing special character', async () => {
            const values = { password: 'Password123', confirmPassword: 'Password123' };
            await expect(signUpValidation3.validate(values)).rejects.toThrow('Password must be at least 8 characters long and include at least one uppercase letter, one lowercase letter, one number, and one special character');
        });

        it('should fail with passwords not matching', async () => {
            const values = { password: 'Password123!', confirmPassword: 'Password456!' };
            await expect(signUpValidation3.validate(values)).rejects.toThrow('Passwords must match');
        });
    });

    describe('Forgot Password Validation', () => {
        it('should pass with valid email', async () => {
            const values = { email: 'test@example.com' };
            await expect(forgotPassword.validate(values)).resolves.toBe(values);
        });

        it('should fail with invalid email', async () => {
            const values = { email: 'invalid' };
            await expect(forgotPassword.validate(values)).rejects.toThrow('Invalid email');
        });

        it('should fail with missing email', async () => {
            const values = {};
            await expect(forgotPassword.validate(values)).rejects.toThrow('Required');
        });
    });

    describe('Reset Code Validation', () => {
        it('should pass with valid code', async () => {
            const values = { code: '123456' };
            await expect(resetCode.validate(values)).resolves.toBe(values);
        });

        it('should fail with invalid code', async () => {
            const values = { code: 'invalid' };
            await expect(resetCode.validate(values)).rejects.toThrow('Must be 6 digit code');
        });

        it('should fail with missing code', async () => {
            const values = {};
            await expect(resetCode.validate(values)).rejects.toThrow('Required');
        });
    });

    describe('Group Creation Validation', () => {
        it('should pass with valid values', async () => {
            const values = {
                name: 'Example Group',
                radius: 100,
                passingPoints: 10,
                attendanceFrequency: 1,
                attendanceReward: 5,
                falseRequestPenalty: 10,
            };
            await expect(groupCreation.validate(values)).resolves.toBe(values);
        });

        it('should fail with missing name', async () => {
            const values = {
                radius: 100,
                passingPoints: 10,
                attendanceFrequency: 1,
                attendanceReward: 5,
                falseRequestPenalty: 10,
            };
            await expect(groupCreation.validate(values)).rejects.toThrow('Required');
        });

        it('should fail with missing radius', async () => {
            const values = {
                name: 'Example Group',
                passingPoints: 10,
                attendanceFrequency: 1,
                attendanceReward: 5,
                falseRequestPenalty: 10,
            };
            await expect(groupCreation.validate(values)).rejects.toThrow('Required');
        });

        it('should fail with radius too small', async () => {
            const values = {
                name: 'Example Group',
                radius: 10,
                passingPoints: 10,
                attendanceFrequency: 1,
                attendanceReward: 5,
                falseRequestPenalty: 10,
            };
            await expect(groupCreation.validate(values)).rejects.toThrow('must be greater than or equal to 50');
        });

        it('should fail with radius too large', async () => {
            const values = {
                name: 'Example Group',
                radius: 200,
                passingPoints: 10,
                attendanceFrequency: 1,
                attendanceReward: 5,
                falseRequestPenalty: 10,
            };
            await expect(groupCreation.validate(values)).rejects.toThrow('must be less than or equal to 150');
        });

        it('should fail with missing passing points', async () => {
            const values = {
                name: 'Example Group',
                radius: 100,
                attendanceFrequency: 1,
                attendanceReward: 5,
                falseRequestPenalty: 10,
            };
            await expect(groupCreation.validate(values)).rejects.toThrow('Required');
        });

        it('should fail with passing points too small', async () => {
            const values = {
                name: 'Example Group',
                radius: 100,
                passingPoints: -1,
                attendanceFrequency: 1,
                attendanceReward: 5,
                falseRequestPenalty: 10,
            };
            await expect(groupCreation.validate(values)).rejects.toThrow('must be greater than or equal to 0');
        });

        it('should fail with missing attendance frequency', async () => {
            const values = {
                name: 'Example Group',
                radius: 100,
                passingPoints: 10,
                attendanceReward: 5,
                falseRequestPenalty: 10,
            };
            await expect(groupCreation.validate(values)).rejects.toThrow('Required');
        });

        it('should fail with missing attendance reward', async () => {
            const values = {
                name: 'Example Group',
                radius: 100,
                passingPoints: 10,
                attendanceFrequency: 1,
                falseRequestPenalty: 10,
            };
            await expect(groupCreation.validate(values)).rejects.toThrow('Required');
        });

        it('should fail with missing false request penalty', async () => {
            const values = {
                name: 'Example Group',
                radius: 100,
                passingPoints: 10,
                attendanceFrequency: 1,
                attendanceReward: 5,
            };
            await expect(groupCreation.validate(values)).rejects.toThrow('Required');
        });

        it('should fail with false request penalty too large', async () => {
            const values = {
                name: 'Example Group',
                radius: 100,
                passingPoints: 10,
                attendanceFrequency: 1,
                attendanceReward: 5,
                falseRequestPenalty: 31,
            };
            await expect(groupCreation.validate(values)).rejects.toThrow('must be less than or equal to 30');
        });
    });
});