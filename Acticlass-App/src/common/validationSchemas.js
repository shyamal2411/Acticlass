import * as Yup from 'yup';

// SignIn validation schema
export const signInValidation = Yup.object().shape({
    email: Yup.string().email('Invalid email').required('Required'),
    password: Yup.string().required('Required'),
});

// Signup validation schema
export const signUpValidation1 = Yup.object().shape({
    email: Yup.string().email('Invalid email').required('Required'),
    name: Yup.string().max(15, 'Too Long!').matches(/^[A-Za-z]+$/, 'Whitespace and Number are not allowed!').required('Required')
});

export const signUpValidation2 = Yup.object().shape({
    institute: Yup.string().required('Required'),
    role: Yup.string().required('Required')
});

export const signUpValidation3 = Yup.object().shape({
    password: Yup.string().matches(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
        'Password must be at least 8 characters long and include at least one uppercase letter, one lowercase letter, one number, and one special character'
    ).required('Required'),
    confirmPassword: Yup.string()
        .oneOf([Yup.ref('password'), null], 'Passwords must match')
        .required('Required')
});

// Forgot password validation schema
export const forgotPasswordSchema = Yup.object().shape({
    email: Yup.string().email('Invalid email').required('Required'),
});
