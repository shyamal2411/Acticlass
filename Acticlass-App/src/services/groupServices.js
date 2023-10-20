import { endpoints } from "../common/endpoints";
import api from "./APIRequest";

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
     * @param {String} institute 
     * @param {Integer} radius
     * @param {Integer} passingPoints
     * @param {Integer} attendanceFrequency
     * @param {Integer} attendanceReward
     * @param {Integer} penalty
     * @param {Function} cb
     */
    createGroup({ name,institute,radius,passingPoints, attendanceFrequency,attendanceReward, penalty }, cb) {
        api({ url: endpoints.signIn, method: "POST", data: { name,institute,radius,passingPoints, attendanceFrequency,attendanceReward, penalty } }).then(res => {
            console.log(this.tag, "[createGroup]", "Group Creation successful! ✅");
            if (cb != null) {
                cb(null, res);
            }
        }).catch(err => {
            console.error(this.tag, "[createGroup]", err);
            if (cb != null) {
                cb(err, null);
            }
        })
    }



    /**
     * 
     * Join Group by group ID
     * @param {string} groupId 
     * @param {Function} cb
     */
    joinGroup(groupId, cb) {
        api({ url: `${endpoints.joinGroup}/${groupId}`, method: "POST" }).then(res => {
            console.log(this.tag, "[joinGroup]", "Group joined successfully! ✅");
            if (cb != null) {
                cb(null, res);
            }
        }).catch(err => {
            console.error(this.tag, "[joinGroup]", err);
            if (cb != null) {
                cb(err, null);
            }
        })
    }



    /**
     * 
     * @param {String} name
     * @param {String} institute 
     * @param {Integer} radius
     * @param {Integer} passingPoints
     * @param {Integer} attendanceFrequency
     * @param {Integer} attendanceReward
     * @param {Integer} penalty
     * @param {Function} cb
     */
    updateGroup({ name, institute, radius, passingPoints, attendanceFrequency, attendanceReward, penalty }, cb) {
        api({
            url: endpoints.updateGroup,
            method: "POST",
            data: {
                name,
                institute,
                radius,
                passingPoints,
                attendanceFrequency,
                attendanceReward,
                penalty
            }
        }).then(res => {
            console.log(this.tag, "[updateGroup]", "Group info updated successfully! ✅");
            if (cb != null) {
                cb(null, res);
            }
        }).catch(err => {
            console.error(this.tag, "[updateGroup]", err);
            if (cb != null) {
                cb(err, null);
            }
        })
    }

    
    
    /**
     * 
     * @param {String} groupId 
    */
   leaveGroup(groupId, cb) {
        api({ url: `${endpoints.leaveGroup}/${groupId}`, method: "POST" }).then(res => {
            console.log(this.tag, "[leaveGroup]", "Group left successfully! ✅");
            if (cb != null) {
                cb(null, res);
            }
        }).catch(err => {
            console.error(this.tag, "[leaveGroup]", err);
            if (cb != null) {
                cb(err, null);
            }
        })       
    }
    /**
     * 
     * @param {{email:String,password:String}} data 
     * @param {Function} cb 
    */
   kickUser({ userId }, cb) {
        api({ url: endpoints.kickUser, method: "POST", data: { userId } }).then(res => {
            console.log(this.tag, "[kickUser]", "user kicked successful!");
            if (cb != null) {
                cb(null, res);
            }
        }).catch(err => {
            console.error(this.tag, "[kickUser]", err);
            if (cb != null) {
                cb(err, null);
            }
        })
    }
    

}
export default instance = new groupService();
