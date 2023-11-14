const ROLES = {
  STUDENT: 'Student',
  TEACHER: 'Teacher',
};

// MMKV
const MMKV_STORE_NAME = 'Acticlass_MMKV_Store';
const MMKV_ENC_KEY = 'Acticlass_MMKV_ENC_KEY';

// Auth Token

const AUTH_TOKEN = "Acticlass_AUTH_TOKEN";
const IS_FROM_RESET = "Acticlass_AUTH_IS_FROM_RESET";
const USER = "Acticlass_USER";

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
}

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
}

module.exports = {
  ROLES,
  MMKV_STORE_NAME,
  MMKV_ENC_KEY,
  AUTH_TOKEN,
  IS_FROM_RESET,
  USER,
  ATTENDANCE_FREQUENCY,
  PubSubEvents,
  SOCKET_EVENTS
}
