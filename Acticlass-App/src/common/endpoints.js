export const baseUrl = 'http://172.17.2.145:8073';

export const endpoints = {
  // Auth
  signIn: baseUrl + '/users/login',
  signUp: baseUrl + '/users/signup',
  forgotPassword: baseUrl + '/users/forgot-password',
  verifyCode: baseUrl + '/users/verify-code',
  resetPassword: baseUrl + '/users/reset-password',
  deleteProfile: baseUrl + '/users/profile',
  //Group
  createGroup: baseUrl + '/groups/create',
  getGroups: baseUrl + '/groups/get-all',
  getGroupById: baseUrl + '/groups/get',
  getGroupMembers: baseUrl + '/groups/get-members',
  updateGroup: baseUrl + '/groups/update',
  deleteGroup: baseUrl + '/groups/delete',
  joinGroup: baseUrl + '/groups/join',
  leaveGroup: baseUrl + '/groups/leave',
  kickUser: baseUrl + '/groups/kick',
  getMemberDetails: baseUrl + '/groups/get-member-details',

  //Activity
  getActivities: baseUrl + '/activities/get-activities',
};
