export const ROLES = {
  STUDENT: 'Student',
  TEACHER: 'Teacher',
};

// MMKV
export const MMKV_STORE_NAME = 'Acticlass_MMKV_Store';
export const MMKV_ENC_KEY = 'Acticlass_MMKV_ENC_KEY';

// Auth Token
export const AUTH_TOKEN = "Acticlass_AUTH_TOKEN";
export const IS_FROM_RESET = "Acticlass_AUTH_IS_FROM_RESET";

export const ATTENDANCE_FREQUENCY = ['0', '15', '30', '60'];

export const PubSubEvents = {
  OnGroupCreated: 'OnGroupCreated',
  OnGroupUpdated: 'OnGroupUpdated',
  OnGroupDeleted: 'OnGroupDeleted',
  OnGroupJoined: 'OnGroupJoined',
  OnGroupLeft: 'OnGroupLeft',
  OnGroupMemberAdded: 'OnGroupMemberAdded',
  OnGroupMemberRemoved: 'OnGroupMemberRemoved',
  OnGroupMemberUpdated: 'OnGroupMemberUpdated'
}