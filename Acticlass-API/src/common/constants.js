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

// Socket events
const SOCKET_EVENTS = {

    //Auth
    CONNECTED: 'connected',
    DISCONNECT: 'disconnect',

    // incoming events (client -> server)  
    ON_START_SESSION: 'StartSession',
    ON_JOIN_SESSION: 'JoinSession',
    ON_LEAVE_SESSION: 'LeaveSession',
    ON_END_SESSION: 'EndSession',
    ON_RAISE_REQUEST: 'RaiseRequest',
    ON_ACCEPT_REQUEST: 'AcceptRequest',
    ON_REJECT_REQUEST: 'RejectRequest',
    ON_LOCATION: 'Location',
    ON_ATTENDANCE: 'Attendance',
    ON_GROUP_STATUS: 'GroupStatus',

    // outgoing events (server -> client)
    SESSION_CREATED: 'sessionCreated',
    SESSION_JOINED: 'sessionJoined',
    SESSION_LEFT: 'sessionLeft',
    SESSION_DELETED: 'sessionDeleted',
    REQUEST_ACCEPTED: 'requestAccepted',
    REQUEST_REJECTED: 'requestRejected',
    REQUEST_RAISED: 'requestRaised',
    POINTS_UPDATED: 'pointsUpdated',
    LOCATION_REQUEST: 'locationRequest',
    CHECK_ATTENDANCE: 'checkAttendance',
}

const ACTIVITY_TYPES = {
    SESSION_STARTED: 'SessionStarted',
    SESSION_ENDED: 'SessionEnded',
    STUDENT_JOINED: 'StudentJoined',
    STUDENT_LEFT: 'StudentLeft',
    RAISE_REQUEST: 'RaiseRequest',
    REQUEST_ACCEPTED: 'RequestAccepted',
    REQUEST_REJECTED: 'RequestRejected',
    ATTENDANCE: 'Attendance',
}

module.exports = {
    JWT_EXPIRATION_TIME,
    Roles,
    DEFAULT_RADIUS,
    ATTENDANCE_FREQUENCY,
    SOCKET_EVENTS,
    ACTIVITY_TYPES
}