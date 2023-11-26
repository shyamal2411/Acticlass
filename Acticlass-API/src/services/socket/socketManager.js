const socketIO = require('socket.io');
const { SOCKET_EVENTS, Roles, ACTIVITY_TYPES } = require('../../common/constants');
const ActivityManager = require('../ActivityManager');
class SocketManager {

    tag = "[SocketManager]";

    /**
     * @private
     * @type {socketIO.Server}
     */
    io = null;

    init(server) {
        this.io = socketIO(server, { origins: '*:*' });

        ActivityManager.addListenerForPointBucketUpdate((data) => {
            console.log(this.tag, "Point bucket updated 📦", data);
            this.io.in(data.groupId).emit(SOCKET_EVENTS.POINTS_UPDATED, data);
        });

        this.io.use((socket, next) => {
            const userId = socket.handshake?.headers?.auth?.userId || socket.handshake?.headers?.userid;
            const role = socket.handshake?.headers?.auth?.role || socket.handshake?.headers?.role;
            if (!userId) {
                return next(new Error("Invalid userId"));
            }
            if (!role) {
                return next(new Error("Invalid role"));
            }
            socket.userId = userId;
            socket.role = role;
            next();
        })

        this.io.on('connection', (socket) => {
            console.log(this.tag, socket.userId, ' user connected 👍');
            socket.on(SOCKET_EVENTS.DISCONNECT, () => {
                if (socket.role === Roles.TEACHER) {
                    ActivityManager.getStartedSessions({ userId: socket.userId, role: socket.role }).forEach((groupId) => {
                        ActivityManager.endSession({ userId: socket.userId, role: socket.role, groupId }, (err, result) => {
                            if (err) {
                                return console.log(this.tag, err.message);
                            }
                            ActivityManager.removeGroupAttendanceCheck(groupId);
                            socket.leave(groupId);
                            this.io.to(groupId).emit(SOCKET_EVENTS.SESSION_DELETED, { groupId });
                        });
                    });
                }
                console.log(this.tag, socket.userId, 'user disconnected ❌');
            });
            this.registerSocketEvents(socket);
        });
    }

    /**
     * @private
     * @param {Socket} socket 
     */
    registerSocketEvents(socket) {
        //self Join
        socket.join(socket.userId);

        this.io.emit(SOCKET_EVENTS.CONNECTED, { message: 'Connected to server' });

        //incoming events (client -> server)        
        // for Teacher
        if (socket.role === Roles.TEACHER) {
            // Start session
            socket.on(SOCKET_EVENTS.ON_START_SESSION, (data, cb) => {
                ActivityManager.startSession({ ...data, userId: socket.userId, role: socket.role }, (err, result) => {
                    if (err) {
                        return cb({ err: err.message });
                    }
                    ActivityManager.addGroupAttendanceCheck(data.groupId, () => {
                        // Send location request to group owner
                        console.log(this.tag, "Cron job to request location of owner ⏲️ ", data.groupId);
                        this.io.to(socket.userId).emit(SOCKET_EVENTS.LOCATION_REQUEST, { groupId: data.groupId });
                    });
                    socket.join(data.groupId);
                    this.io.to(data.groupId).emit(SOCKET_EVENTS.SESSION_CREATED, { groupId: data.groupId });
                    cb(result);
                });
            });

            // End session
            socket.on(SOCKET_EVENTS.ON_END_SESSION, (data, cb) => {
                ActivityManager.endSession({ ...data, userId: socket.userId, role: socket.role }, (err, result) => {
                    if (err) {
                        return cb({ err: err.message });
                    }
                    ActivityManager.removeGroupAttendanceCheck(data.groupId);
                    socket.leave(data.groupId);
                    this.io.to(data.groupId).emit(SOCKET_EVENTS.SESSION_DELETED, { groupId: data.groupId });
                    cb(result);
                });
            });

            // Accept request
            socket.on(SOCKET_EVENTS.ON_ACCEPT_REQUEST, (data, cb) => {
                ActivityManager.handleRequest({ ...data, type: ACTIVITY_TYPES.REQUEST_ACCEPTED, userId: socket.userId, role: socket.role }, (err, result) => {
                    if (err) {
                        return cb({ err: err.message });
                    }
                    this.io.to(result.studentId).emit(SOCKET_EVENTS.REQUEST_ACCEPTED, { groupId: data.groupId });
                    cb(result);
                });
            });

            // Reject request
            socket.on(SOCKET_EVENTS.ON_REJECT_REQUEST, (data, cb) => {
                ActivityManager.handleRequest({ ...data, type: ACTIVITY_TYPES.REQUEST_REJECTED, userId: socket.userId, role: socket.role }, (err, result) => {
                    if (err) {
                        return cb({ err: err.message });
                    }
                    this.io.to(result.studentId).emit(SOCKET_EVENTS.REQUEST_REJECTED, { groupId: data.groupId });
                    cb(result);
                });
            });

            // Location
            socket.on(SOCKET_EVENTS.ON_LOCATION, (data, cb) => {
                if (!data?.groupId) {
                    return cb({ err: "Invalid groupId" });
                }
                if (!data?.location) {
                    return cb({ err: "Invalid location" });
                }
                // Send location to all students to check attendance if they are in range of teacher location
                socket.to(data.groupId).emit(SOCKET_EVENTS.CHECK_ATTENDANCE, { groupId: data.groupId, location: data.location });
            });
        }

        // for Student
        if (socket.role === Roles.STUDENT) {
            // Join session
            socket.on(SOCKET_EVENTS.ON_JOIN_SESSION, (data, cb) => {
                ActivityManager.joinSession({ ...data, userId: socket.userId, role: socket.role }, (err, result) => {
                    if (err) {
                        return cb({ err: err.message });
                    }
                    socket.join(data.groupId);
                    this.io.to(data.groupId).emit(SOCKET_EVENTS.SESSION_JOINED, { groupId: data.groupId });
                    cb(result);
                });
            });

            // Leave session
            socket.on(SOCKET_EVENTS.ON_LEAVE_SESSION, (data, cb) => {
                ActivityManager.leaveSession({ ...data, userId: socket.userId, role: socket.role }, (err, result) => {
                    if (err) {
                        return cb({ err: err.message });
                    }
                    socket.leave(data.groupId);
                    this.io.to(data.groupId).emit(SOCKET_EVENTS.SESSION_LEFT, { groupId: data.groupId });
                    cb(result);
                });
            });

            // Raise request
            socket.on(SOCKET_EVENTS.ON_RAISE_REQUEST, (data, cb) => {
                ActivityManager.raiseRequest({ ...data, userId: socket.userId, role: socket.role }, (err, result) => {
                    if (err) {
                        return cb({ err: err.message });
                    }
                    const owner = ActivityManager.getSessionOwner(data.groupId);
                    if (!owner) {
                        return cb({ err: "Session not found" });
                    }
                    this.io.to(owner).emit(SOCKET_EVENTS.REQUEST_RAISED, { groupId: data.groupId });
                    cb(result);
                });
            });

            // Attendance
            socket.on(SOCKET_EVENTS.ON_ATTENDANCE, (data, cb) => {
                ActivityManager.markAttendance({ ...data, userId: socket.userId, role: socket.role }, (err, result) => {
                    if (err) {
                        return cb({ err: err.message });
                    }
                    cb(result);
                });
            });
        }

        // Group status
        socket.on(SOCKET_EVENTS.ON_GROUP_STATUS, (data, cb) => {
            if (!data?.groupId) {
                return cb({ err: "Invalid groupId" });
            }
            const group = ActivityManager.getGroupStatus({ groupId: data.groupId, userId: socket.userId, role: socket.role });
            if (group) {
                return cb(group);
            }
        });
    }
}

module.exports = new SocketManager();