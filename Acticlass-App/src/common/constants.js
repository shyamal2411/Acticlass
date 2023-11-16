const ROLES = {
  STUDENT: 'Student',
  TEACHER: 'Teacher',
};

// MMKV
const MMKV_STORE_NAME = 'Acticlass_MMKV_Store';
const MMKV_ENC_KEY = 'Acticlass_MMKV_ENC_KEY';

// Auth Token
export const AUTH_TOKEN = 'Acticlass_AUTH_TOKEN';
export const IS_FROM_RESET = 'Acticlass_AUTH_IS_FROM_RESET';
export const USER = 'Acticlass_USER';

// Landing Page
const IS_FIRST_TIME = 'Acticlass_IS_FIRST_TIME';

const ATTENDANCE_FREQUENCY = ['0', '15', '30', '60'];

const PubSubEvents = {
  // App State
  ONAppGoToBackground: 'ONAppGoToBackground',
  ONAppComesToForeground: 'ONAppComesToForeground',

  // Group
  OnGroupCreated: 'OnGroupCreated',
  OnGroupUpdated: 'OnGroupUpdated',
  OnGroupDeleted: 'OnGroupDeleted',
  OnGroupJoined: 'OnGroupJoined',
  OnGroupLeft: 'OnGroupLeft',
  OnGroupMemberAdded: 'OnGroupMemberAdded',
  OnGroupMemberRemoved: 'OnGroupMemberRemoved',
  OnGroupMemberUpdated: 'OnGroupMemberUpdated',
  OnGroupMemberKicked: 'OnGroupMemberKicked',

  // Session
  OnSessionCreated: 'OnSessionCreated',
  OnSessionDeleted: 'OnSessionDeleted',
  OnSessionJoined: 'OnSessionJoined',
  OnSessionLeft: 'OnSessionLeft',
  OnRequestRaised: 'OnRequestRaised',
  OnRequestAccepted: 'OnRequestAccepted',
  OnRequestRejected: 'OnRequestRejected',
  OnPointsUpdated: 'OnPointsUpdated',
  OnAttendanceRequested: 'OnAttendanceRequested',
};

const ACTIVITY_TYPES = {
  SESSION_STARTED: 'SessionStarted',
  SESSION_ENDED: 'SessionEnded',
  STUDENT_JOINED: 'StudentJoined',
  STUDENT_LEFT: 'StudentLeft',
  RAISE_REQUEST: 'RaiseRequest',
  REQUEST_ACCEPTED: 'RequestAccepted',
  REQUEST_REJECTED: 'RequestRejected',
  ATTENDANCE: 'Attendance',
};

// Socket events
const SOCKET_EVENTS = {
  //Auth
  CONNECTED: 'connect',
  DISCONNECT: 'disconnect',
  ERROR: 'error',
  CONNECTION_ERROR: 'connect_error',

  // outgoing events (client -> server)
  START_SESSION: 'StartSession',
  JOIN_SESSION: 'JoinSession',
  LEAVE_SESSION: 'LeaveSession',
  END_SESSION: 'EndSession',
  RAISE_REQUEST: 'RaiseRequest',
  ACCEPT_REQUEST: 'AcceptRequest',
  REJECT_REQUEST: 'RejectRequest',
  LOCATION: 'Location',
  ATTENDANCE: 'Attendance',
  GROUP_STATUS: 'GroupStatus',

  // incoming events (server -> client)
  ON_SESSION_CREATED: 'sessionCreated',
  ON_SESSION_JOINED: 'sessionJoined',
  ON_SESSION_LEFT: 'sessionLeft',
  ON_SESSION_DELETED: 'sessionDeleted',
  ON_REQUEST_ACCEPTED: 'requestAccepted',
  ON_REQUEST_REJECTED: 'requestRejected',
  ON_REQUEST_RAISED: 'requestRaised',
  ON_POINTS_UPDATED: 'pointsUpdated',
  ON_LOCATION_REQUEST: 'locationRequest',
  ON_CHECK_ATTENDANCE: 'checkAttendance',
};

const IntroSliderCarousel = [
  {
    key: 'one',
    title: 'Connect, Collaborate, Conquer',
    text: 'Groups for every subject. Foster engagement and support. Learning, shared.',
    image: require('../assets/HomeScreen.png'),
  },
  {
    key: 'two',
    title: 'Smart Activities Tracking',
    text: 'Effortless attendance. Precision in your hands. Track activities based on location and class schedule.',
    image: require('../assets/activitiesScreen.png'),
  },
  {
    key: 'three',
    title: 'Leaderboard for groups',
    text: 'Compete, earn, and climb. Turn learning into a friendly competition with Reward points. Who will be on the top?',
    image: require('../assets/leaderboard.png'),
  },
];

module.exports = {
  ROLES,
  MMKV_STORE_NAME,
  MMKV_ENC_KEY,
  AUTH_TOKEN,
  IS_FROM_RESET,
  USER,
  ATTENDANCE_FREQUENCY,
  PubSubEvents,
  SOCKET_EVENTS,
  ACTIVITY_TYPES,
  IS_FIRST_TIME,
  IntroSliderCarousel,
};
