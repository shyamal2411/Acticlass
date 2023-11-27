const NodeCache = require("node-cache");
const { ActivitySchema, PointBucketSchema, GroupSchema } = require("../database");
const { ACTIVITY_TYPES, Roles, ATTENDANCE_FREQUENCY } = require("../common/constants");
const { sortBy, isEmpty } = require("lodash");
const { scheduleJob } = require("node-schedule");

class ActivityManager {
    tag = "[ActivityManager]";
    SESSION_TIMEOUT = 60 * 60 * 6; // 6 hours

    constructor() {
        this.pendingRequests = new NodeCache();
        this.sessions = new NodeCache({ stdTTL: this.SESSION_TIMEOUT, checkperiod: this.SESSION_TIMEOUT, delayedDelete: true });
        // end session after 6 hours of inactivity.
        this.sessions.on("expired", (key, value) => {
            console.log(this.tag, "Session expired", key, value);
            let owner = this.sessionOwner.get(key);
            this.endSession({ groupId: key, userId: owner, role: Roles.TEACHER });
        });
        this.sessionOwner = new NodeCache();
        this.sessionLocation = new Map();
        this.cronJobs = new Map();

        this.bucketUpdateListener = null;
    }


    /**
     * @private
     * @param {ActivitySchema} activity 
     * @returns {{id:String,type:ACTIVITY_TYPES,timestamp:Date,group:String,triggerBy:String,triggerFor:String,points:Number}}
     */
    parseActivity(activity) {
        let data = {};
        data.id = activity._id.toString();
        data.type = activity.type;
        data.timestamp = activity.timestamp;
        data.group = activity.group.toString();
        data.triggerBy = activity.triggerBy?.toString();
        data.triggerFor = activity.triggerFor?.toString();
        data.points = activity.points;
        return data;
    }

    /**
     * @private
     * @param {String} groupId
     * @param {*} activity 
     */
    addActivity(groupId, activity) {
        const session = this.sessions.get(groupId);
        if (!session) {
            return;
        }
        session.push(this.parseActivity(activity));
        this.sessions.set(groupId, session);
    }

    /**
     * 
     * @param {{String} groupId 
     * @param {Function} cronTask 
     */
    addGroupAttendanceCheck(groupId, cronTask) {
        GroupSchema.findOne({ _id: groupId }).then((group) => {
            if (!group) {
                console.log(this.tag, "Group does not exist");
                return;
            }
            const freq = group.attendanceFrequency;
            if (!freq) {
                console.log(this.tag, "Attendance frequency not set");
                return;
            }
            if (this.cronJobs.has(groupId)) {
                let cronJob = this.cronJobs.get(groupId);
                cronJob.cancel();
                this.cronJobs.delete(groupId);
            }
            if (freq === 0) {
                console.log(this.tag, "Attendance frequency is 0");
                return;
            }
            const job = scheduleJob(`*/${freq} * * * *`, cronTask);
            this.cronJobs.set(groupId, job);
        });
    }

    /**
     * 
     * @param {*} groupId 
     */
    removeGroupAttendanceCheck(groupId) {
        if (this.cronJobs.has(groupId)) {
            let cronJob = this.cronJobs.get(groupId);
            cronJob.cancel();
            this.cronJobs.delete(groupId);
        }
    }


    /**   
     * @param {{groupId:String,location:{lat:Number,long:Number},userId:String,role:String}} data 
     * @param {Function} cb 
     */
    startSession(data, cb) {
        let msg = "";
        if (data.role !== Roles.TEACHER) {
            msg = "Only teacher can start session";
            console.log(this.tag, "Only teacher can start session");
        } else if (this.sessions.has(data.groupId)) {
            msg = "Session already exists";
            console.log(this.tag, data.groupId, "Session already exists");
        } else if (!data.location) {
            msg = "Location is required";
            console.log(this.tag, data.groupId, "Location is required");
        }
        if (msg) {
            if (cb) {
                cb({ message: msg });
            }
            return;
        }
        ActivitySchema.create({
            type: ACTIVITY_TYPES.SESSION_STARTED,
            group: data.groupId,
            triggerBy: data.userId,
        }).then((activity) => {
            this.sessionOwner.set(data.groupId, data.userId);
            this.sessions.set(data.groupId, [this.parseActivity(activity)]);
            this.sessionLocation.set(data.groupId, data.location);
            console.log(this.tag, data.groupId, "Session started");
            if (cb) {
                cb(null, { message: "Session started" });
            }
        }).catch((error) => {
            console.log(this.tag, data.groupId, "Session start failed", error);
            if (cb) {
                cb({ message: "Session start failed" });
            }
        });
    }


    /**
     * 
     * @param {{groupId:String,userId:String,role:String}} data 
     * @param {Function} cb
     */
    endSession(data, cb) {
        if (data.role !== Roles.TEACHER) {
            console.log(this.tag, "Only teacher can end session");
            if (cb) {
                cb({ message: "Only teacher can end session" });
            }
            return;
        }
        const session = this.sessions.get(data.groupId);
        if (!session) {
            console.log(this.tag, data.groupId, "Session does not exist");
            if (cb) {
                cb({ message: "Session does not exist" });
            }
            return;
        }
        ActivitySchema.create({
            type: ACTIVITY_TYPES.SESSION_ENDED,
            group: data.groupId,
            triggerBy: data.userId,
        }).then((activity) => {
            this.sessionOwner.del(data.groupId);
            this.sessions.del(data.groupId);
            this.sessionLocation.delete(data.groupId);
            console.log(this.tag, data.groupId, "Session ended");
            if (cb) {
                cb(null, { message: "Session ended" });
            }
        }).catch((error) => {
            console.log(this.tag, data.groupId, "Session end failed", error);
            if (cb) {
                cb({ message: "Session end failed" });
            }
        });
    }


    /**
     * 
     * @param {{groupId:String,userId:String,role:String}} data 
     * @param {Function} cb 
     */
    joinSession(data, cb) {
        if (data.role !== Roles.STUDENT) {
            console.log(this.tag, "Only student can join session");
            if (cb) {
                cb({ message: "Only student can join session" });
            }
            return;
        }
        const session = this.sessions.get(data.groupId);
        if (!session) {
            console.log(this.tag, "Session does not exist");
            if (cb) {
                cb({ message: "Session does not exist" });
            }
            return;
        }
        let lastJoined = null;
        let lastLeft = null;
        for (let i = session.length - 1; i >= 0; i--) {
            if (!lastJoined && session[i].type === ACTIVITY_TYPES.STUDENT_JOINED && session[i].triggerBy === data.userId) {
                lastJoined = i;
            }
            if (!lastLeft && session[i].type === ACTIVITY_TYPES.STUDENT_LEFT && session[i].triggerBy === data.userId) {
                lastLeft = i;
            }
            if (lastJoined && lastLeft) {
                break;
            }
        }
        if (lastJoined && lastLeft && lastJoined > lastLeft) {
            console.log(this.tag, data.userId, "Student already joined");
            if (cb) {
                cb({ message: "Student already joined" });
            }
            return;
        }
        ActivitySchema.create({
            type: ACTIVITY_TYPES.STUDENT_JOINED,
            group: data.groupId,
            triggerBy: data.userId,
        }).then((activity) => {
            this.addActivity(data.groupId, activity);
            console.log(this.tag, data.userId, "Student joined");
            if (cb) {
                cb(null, { message: "Student joined" });
            }
        }).catch((error) => {
            console.log(this.tag, data.userId, "Student join failed", error);
            if (cb) {
                cb({ message: "Student join failed" });
            }
        });
    }

    /**
     * 
     * @param {{groupId:String,userId:String,role:String}} data 
     * @param {Function} cb 
     */
    leaveSession(data, cb) {
        if (data.role !== Roles.STUDENT) {
            console.log(this.tag, "Only student can leave session");
            if (cb) {
                cb({ message: "Only student can leave session" });
            }
            return;
        }
        const session = this.sessions.get(data.groupId);
        if (!session) {
            console.log(this.tag, "Session does not exist");
            if (cb) {
                cb({ message: "Session does not exist" });
            }
            return;
        }
        let lastJoined = null;
        let lastLeft = null;
        for (let i = session.length - 1; i >= 0; i--) {
            if (!lastJoined && session[i].type === ACTIVITY_TYPES.STUDENT_JOINED && session[i].triggerBy === data.userId) {
                lastJoined = i;
            }
            if (!lastLeft && session[i].type === ACTIVITY_TYPES.STUDENT_LEFT && session[i].triggerBy === data.userId) {
                lastLeft = i;
            }
            if (lastJoined && lastLeft) {
                break;
            }
        }
        if (lastLeft && lastJoined && lastLeft > lastJoined) {
            console.log(this.tag, data.userId, "Student already left");
            if (cb) {
                cb({ message: "Student already left" });
            }
            return;
        }
        ActivitySchema.create({
            type: ACTIVITY_TYPES.STUDENT_LEFT,
            group: data.groupId,
            triggerBy: data.userId,
        }).then((activity) => {
            this.addActivity(data.groupId, activity);
            console.log(this.tag, data.userId, "Student left");
            if (cb) {
                cb(null, { message: "Student left" });
            }
        }).catch((error) => {
            console.log(this.tag, data.userId, "Student leave failed", error);
            if (cb) {
                cb({ message: "Student leave failed" });
            }
        });
    }

    /**
     * 
     * @param {{groupId:String,userId:String,role:String}} data
     * @param {Function} cb     
     */
    raiseRequest(data, cb) {
        if (data.role !== Roles.STUDENT) {
            console.log(this.tag, "Only student can raise request");
            if (cb) {
                cb({ message: "Only student can raise request" });
            }
            return;
        }
        const session = this.sessions.get(data.groupId);
        if (!session) {
            console.log(this.tag, "Session does not exist");
            if (cb) {
                cb({ message: "Session does not exist" });
            }
            return;
        }
        ActivitySchema.create({
            type: ACTIVITY_TYPES.RAISE_REQUEST,
            group: data.groupId,
            triggerBy: data.userId,
        }).then((activity) => {
            this.addActivity(data.groupId, activity);
            this.pendingRequests.set(activity._id.toString(), this.parseActivity(activity));
            console.log(this.tag, data.userId, "has raised Request");
            if (cb) {
                cb(null, { message: "Request raised" });
            }
        }).catch((error) => {
            console.log(this.tag, data.userId, "Request raise failed", error);
            if (cb) {
                cb({ message: "Request raise failed" });
            }
        });
    }


    /**
    * 
    * @param {{groupId:String,userId:String,role:String,points:Number,requestId:String,type:ACTIVITY_TYPES}} data
    * @param {Function} cb     
    */
    handleRequest(data, cb) {
        let msg = ""
        if (data.role !== Roles.TEACHER) {
            msg = "Only teacher can approve/reject request";
            console.log(this.tag, "Only teacher can approve/reject request");
        } else if (!data.type) {
            msg = "Request type is required";
            console.log(this.tag, "Request type is required");
        } else if (data.type !== ACTIVITY_TYPES.REQUEST_ACCEPTED && data.type !== ACTIVITY_TYPES.REQUEST_REJECTED) {
            msg = "Request type is invalid";
            console.log(this.tag, "Request type is invalid");
        } else if (!data.points) {
            msg = "Request points is required";
            console.log(this.tag, "Request points is required");
        } else if (!data.requestId) {
            msg = "Request ID is required";
            console.log(this.tag, "Request ID is required");
            return;
        }
        if (msg) {
            if (cb) {
                cb({ message: msg });
            }
            return;
        }

        const session = this.sessions.get(data.groupId);
        if (!session) {
            console.log(this.tag, "Session does not exist");
            if (cb) {
                cb({ message: "Session does not exist" });
            }
            return;
        }
        let request = this.pendingRequests.get(data.requestId);
        if (request && request.triggerBy) {
            ActivitySchema.create({
                type: data.type,
                group: data.groupId,
                triggerBy: data.userId,
                triggerFor: data.requestId,
                points: data.points,
            }).then((activity) => {
                this.addActivity(data.groupId, activity);
                this.updateUserPointBucket({ groupId: data.groupId, userId: request.triggerBy, points: data.points, type: data.type });
                this.pendingRequests.del(data.requestId);
                console.log(this.tag, data.userId, "has approved/rejected Request");
                if (cb) {
                    cb(null, { studentId: request.triggerBy, message: "Request approved/rejected" });
                }
            }).catch((error) => {
                console.log(this.tag, data.userId, "Request approve/reject failed", error);
                if (cb) {
                    cb({ message: "Request approve/reject failed" });
                }
            });
        } else {
            console.log(this.tag, "Request does not exist/already handled");
            if (cb) {
                cb({ message: "Request does not exist/already handled" });
            }
        }
    }

    addListenerForPointBucketUpdate(cb) {
        this.bucketUpdateListener = cb;
    }

    /**
     * @private
     * @param {{ groupId:String,points:Number,userId:String,type:String}} data     
     */
    updateUserPointBucket(data) {
        PointBucketSchema.findOne({ user: data.userId, group: data.groupId }).then((bucket) => {
            if (!bucket) {
                console.log(this.tag, data.userId, "Point bucket does not exist");
                return;
            }

            if (!bucket.isActive) {
                console.log(this.tag, data.userId, "Point bucket is not active");
                return;
            }
            if (data.type === ACTIVITY_TYPES.REQUEST_ACCEPTED || data.type === ACTIVITY_TYPES.ATTENDANCE) {
                bucket.points += data.points;
            } else {
                bucket.points -= data.points;
            }
            if (bucket.points < 0) {
                bucket.points = 0;
            }
            bucket.save().then(() => {
                console.log(this.tag, data.userId, "Point bucket updated");
                if (this.bucketUpdateListener) {
                    this.bucketUpdateListener({ userId: data.userId, groupId: data.groupId, points: bucket.points });
                }
            }).catch((error) => {
                console.log(this.tag, data.userId, "Point bucket update failed", error);
            });
        });
    }

    /**
     * 
     * @param {{groupId:String,role:Roles,userId:String}} data      
     * @returns {Array}
     */
    getCurrentSessionActivities(data) {
        const session = this.sessions.get(data.groupId);
        if (!session) {
            console.log(this.tag, "Session does not exist");
            return [];
        }
        if (data.role === Roles.TEACHER) {
            let activities = [];
            let isAttendanceChecked = false;
            session.forEach((activity) => {
                if (activity.type === ACTIVITY_TYPES.ATTENDANCE) {
                    if (!isAttendanceChecked) {
                        isAttendanceChecked = true;
                        activities.push(activity);
                    }
                } else {
                    isAttendanceChecked = false;
                    activities.push(activity);
                }
            });
            return activities;
        }
        if (data.role === Roles.STUDENT) {
            // filter all the activities related to student
            const activities = session.filter(activity => activity.triggerBy.toString() === data.userId);
            // filter all the RequestAccepted and RequestRejected activities for which student has raised request
            const requests = session.filter(activity => (activity.type === ACTIVITY_TYPES.REQUEST_ACCEPTED || activity.type === ACTIVITY_TYPES.REQUEST_REJECTED));
            // filter all the requests for which teacher has accepted/rejected
            const filteredRequests = requests.filter(request => activities.find(activity => request.triggerFor && request.triggerFor.toString() === activity.id.toString()) !== undefined);
            let result = activities.concat(filteredRequests);
            // sort by timestamp
            result = sortBy(result, ['timestamp']);
            return result;
        }
    }

    /**
     * 
     * @param {{groupId:String,role:Roles,userId:String,points:Number}} data 
     * @param {Function} cb 
     * @returns 
     */
    markAttendance(data, cb) {
        if (data.role !== Roles.STUDENT) {
            console.log(this.tag, "Only student can mark attendance");
            if (cb) {
                cb({ message: "Only student can mark attendance" });
            }
            return;
        }
        const session = this.sessions.get(data.groupId);
        if (!session) {
            console.log(this.tag, "Session does not exist");
            if (cb) {
                cb({ message: "Session does not exist" });
            }
            return;
        }
        ActivitySchema.create({
            type: ACTIVITY_TYPES.ATTENDANCE,
            group: data.groupId,
            triggerBy: data.userId,
            points: data.points,
        }).then((activity) => {
            this.addActivity(data.groupId, activity);
            this.updateUserPointBucket({ groupId: data.groupId, userId: data.userId, points: data.points, type: ACTIVITY_TYPES.ATTENDANCE })
            console.log(this.tag, data.userId, "Attendance marked");
            if (cb) {
                cb(null, { message: "Attendance marked" });
            }
        }).catch((error) => {
            console.log(this.tag, data.userId, "Attendance mark failed", error);
            if (cb) {
                cb({ message: "Attendance mark failed" });
            }
        });
    }


    /**
     * 
     * @param {String} groupId 
     */
    getSessionOwner(groupId) {
        if (!groupId) {
            return null;
        }
        return this.sessionOwner.get(groupId);
    }

    /**
     * 
     * @param {{userId:String}} data 
     * @returns {sessions:Array}
     */
    getStartedSessions({ userId }) {
        let sessions = [];
        this.sessions.keys().forEach((groupId) => {
            const session = this.sessions.get(groupId);
            if (!session) {
                return;
            }
            const owner = this.getSessionOwner(groupId);
            if (!owner) {
                return;
            }
            if (owner === userId) {
                sessions.push(groupId);
            }
        });
        return sessions;
    }

    /**
     * 
     * @param {{groupId:String,role:Roles,userId:String}} data 
     * @returns {{isActive:Boolean}}
     */
    getGroupStatus({ groupId, role, userId }) {
        if (!groupId || isEmpty(groupId)) {
            return { isActive: false, message: "Invalid groupId" };
        }
        const session = this.sessions.get(groupId);
        if (!session) {
            return { isActive: false };
        }
        const activities = this.getCurrentSessionActivities({ groupId, role, userId });
        const location = this.sessionLocation.get(groupId);
        return { isActive: true, location, activities };
    }
}


module.exports = new ActivityManager();