export const baseUrl = 'http://172.17.2.145:8073';

export const endpoints = {
    // Auth
    signIn: baseUrl + '/users/login',
    signUp: baseUrl + '/users/signup',
    forgotPassword: baseUrl + '/users/forgot-password',
    verifyCode: baseUrl + '/users/verify-code',
    resetPassword: baseUrl + '/users/reset-password',
    deleteProfile: baseUrl + '/users/profile',
};


