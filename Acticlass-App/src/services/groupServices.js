import { endpoints } from '../common/endpoints';
import api from './APIRequest';

class groupService {
  tag = '[groupService]';
  constructor() {
    if (groupService.instance) {
      return groupService.instance;
    }
    groupService.instance = this;
  }

  /**
   *
   * @param {String} name
   * @param {Integer} radius
   * @param {Integer} passingPoints
   * @param {Integer} attendanceFrequency
   * @param {Integer} attendanceReward
   * @param {Integer} penalty
   * @param {Function} cb
   */
  createGroup(
    {
      name,
      radius,
      passingPoints,
      attendanceFrequency,
      attendanceReward,
      penalty,
    },
    cb,
  ) {
    api({
      url: endpoints.createGroup,
      method: 'POST',
      data: {
        name,
        radius,
        passingPoints,
        attendanceFrequency,
        attendanceReward,
        penalty,
      },
    })
      .then(res => {
        console.log(this.tag, '[createGroup]', 'Group Creation successful! ✅');
        if (cb != null) {
          cb(null, res);
        }
      })
      .catch(err => {
        console.error(this.tag, '[createGroup]', err);
        if (cb != null) {
          cb(err, null);
        }
      });
  }

  /**
   * Gell All the group members by group ID
   * @param {Function} cb
   */
  getAll(cb) {
    api({ url: endpoints.getGroups, method: 'GET' })
      .then(res => {
        console.log(this.tag, '[getAll]', 'Groups retrieved successfully! ✅');
        if (cb != null) {
          cb(null, res);
        }
      })
      .catch(err => {
        console.error(this.tag, '[getAll]', err);
        if (cb != null) {
          cb(err, null);
        }
      });
  }

  /**
   *
   * Join Group by group ID
   * @param {String} groupId
   * @param {Function} cb
   */
  joinGroup(groupId, cb) {
    api({ url: `${endpoints.joinGroup}/${groupId}`, method: 'POST' })
      .then(res => {
        console.log(this.tag, '[joinGroup]', 'Group joined successfully! ✅');
        if (cb != null) {
          cb(null, res);
        }
      })
      .catch(err => {
        console.error(this.tag, '[joinGroup]', err);
        if (cb != null) {
          cb(err, null);
        }
      });
  }

  /**
   *
   * Get ID of the group
   * @param {String} groupId
   * @param {Function} cb
   */
  getGroupById(groupId, cb) {
    api({ url: `${endpoints.getGroupById}/${groupId}`, method: 'GET' })
      .then(res => {
        console.log(this.tag, '[getId]', 'Group ID retrieved successfully! ✅');
        if (cb != null) {
          cb(null, res);
        }
      })
      .catch(err => {
        console.error(this.tag, '[getId]', err);
        if (cb != null) {
          cb(err, null);
        }
      });
  }

  /**
   * Get members by group ID
   * @param {String} groupId
   * @param {Function} cb
   */
  getMembers(groupId, cb) {
    api({
      url: `${endpoints.getGroupMembers}/${groupId}`,
      method: 'GET',
    })
      .then(res => {
        console.log(
          this.tag,
          '[getMembers]',
          'Members retrieved successfully! ✅',
        );
        if (cb != null) {
          cb(null, res);
        }
      })
      .catch(err => {
        console.error(this.tag, '[getMembers]', err);
        if (cb != null) {
          cb(err, null);
        }
      });
  }

  /**
   *
   * @param {string} groupId
   * @param {String} name
   * @param {Integer} radius
   * @param {Integer} passingPoints
   * @param {Integer} attendanceFrequency
   * @param {Integer} attendanceReward
   * @param {Integer} penalty
   * @param {Function} cb
   */
  updateGroup(
    {
      groupId,
      name,
      radius,
      passingPoints,
      attendanceFrequency,
      attendanceReward,
      penalty,
    },
    cb,
  ) {
    api({
      url: `${endpoints.updateGroup}/${groupId}`,
      method: 'POST',
      data: {
        name,
        radius,
        passingPoints,
        attendanceFrequency,
        attendanceReward,
        penalty,
      },
    })
      .then(res => {
        console.log(
          this.tag,
          '[updateGroup]',
          'Group info updated successfully! ✅',
        );
        if (cb != null) {
          cb(null, res);
        }
      })
      .catch(err => {
        console.error(this.tag, '[updateGroup]', err);
        if (cb != null) {
          cb(err, null);
        }
      });
  }

  /**
   *
   * @param {String} groupId
   */
  leaveGroup(groupId, cb) {
    api({ url: `${endpoints.leaveGroup}/${groupId}`, method: 'POST' })
      .then(res => {
        console.log(this.tag, '[leaveGroup]', 'Group left successfully! ✅');
        if (cb != null) {
          cb(null, res);
        }
      })
      .catch(err => {
        console.error(this.tag, '[leaveGroup]', err);
        if (cb != null) {
          cb(err, null);
        }
      });
  }

  /**
   *
   * @param {{groupId:String,userId:String}} data
   * @param {Function} cb
   */
  kickUser({ userId, groupId }, cb) {
    api({
      url: `${endpoints.kickUser}/${groupId}`,
      method: 'POST',
      data: { userId },
    })
      .then(res => {
        console.log(this.tag, '[kickUser]', 'user kicked successful!');
        if (cb != null) {
          cb(null, res);
        }
      })
      .catch(err => {
        console.error(this.tag, '[kickUser]', err);
        if (cb != null) {
          cb(err, null);
        }
      });
  }

  /**
   * @param {String} groupId
   * @param {Function} cb
   */
  deleteGroup({ groupId }, cb) {
    api({ url: `${endpoints.deleteGroup}/${groupId}`, method: 'DELETE' })
      .then(res => {
        console.log(
          this.tag,
          '[deleteGroup]',
          'Group deleted successfully! ✅',
        );
        if (cb != null) {
          cb(null, res);
        }
      })
      .catch(err => {
        console.error(this.tag, '[deleteGroup]', err);
        if (cb != null) {
          cb(err, null);
        }
      });
  }


  /**
   * 
   * @param {{activityId}} data 
   * @param {Function} cb 
   */
  getMemberDetails({ activityId }, cb) {
    api({ url: `${endpoints.getMemberDetails}`, method: 'POST', data: { activityId } })
      .then(res => {
        console.log(
          this.tag,
          '[getMemberDetails]',
          'Member details retrieved successfully! ✅',
        );
        if (cb != null) {
          cb(null, res);
        }
      })
      .catch(err => {
        console.error(this.tag, '[getMemberDetails]', err);
        if (cb != null) {
          cb(err, null);
        }
      });
  }

}


export default instance = new groupService();
