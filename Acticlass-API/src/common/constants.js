//JWT Token
const JWT_EXPIRATION_TIME = '7d'; // 7 days

// Types of users
const Roles = {
    TEACHER: 'Teacher',
    STUDENT: 'Student',
}

// Groups
const DEFAULT_RADIUS = 50; // in meters
const ATTENDANCE_FREQUENCY = [0, 15, 30, 60]; // in minutes

module.exports = {
    JWT_EXPIRATION_TIME,
    Roles,
    DEFAULT_RADIUS,
    ATTENDANCE_FREQUENCY
}