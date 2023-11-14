import { PubSubEvents, ROLES, SOCKET_EVENTS, USER } from '../common/constants';
import { baseUrl } from '../common/endpoints';
import { mmkv } from '../utils/MMKV';
import authService from './authService';
const io = require('socket.io-client');

class SocketService {

    tag = '[SocketService]';

    /**
     * @private
     * type {SocketIOClient.Socket}
     */
    socket = null;

    /**
     * @private
     */
    constructor() {
        this.socket;
    }

    /**
     *  Initialize socket connection
     */
    init() {
        this.getSocket();

        // Auth
        this.socket.on(SOCKET_EVENTS.CONNECTED, () => {
            console.log(this.tag, 'connected');
        });
        this.socket.on(SOCKET_EVENTS.DISCONNECT, () => {
            console.log(this.tag, 'disconnected');
        });
        this.socket.on(SOCKET_EVENTS.ERROR, (err) => {
            console.log(this.tag, err);
        });
        this.socket.on(SOCKET_EVENTS.CONNECTION_ERROR, (err) => {
            console.log(this.tag, 'connect_error', err.message);
        });

        // incoming events (server -> client)
        this.socket.on(SOCKET_EVENTS.ON_SESSION_CREATED, (data) => {
            console.log(this.tag, 'ON_SESSION_CREATED', data);
            PubSub.publish(PubSubEvents.OnSessionCreated, data);
        });

        this.socket.on(SOCKET_EVENTS.ON_SESSION_DELETED, (data) => {
            console.log(this.tag, 'ON_SESSION_DELETED', data);
            PubSub.publish(PubSubEvents.OnSessionDeleted, data);
        });

        this.socket.on(SOCKET_EVENTS.ON_SESSION_JOINED, (data) => {
            console.log(this.tag, 'ON_SESSION_JOINED', data);
            PubSub.publish(PubSubEvents.OnSessionJoined, data);
        });
        this.socket.on(SOCKET_EVENTS.ON_SESSION_LEFT, (data) => {
            console.log(this.tag, 'ON_SESSION_LEFT', data);
            PubSub.publish(PubSubEvents.OnSessionLeft, data);
        });
        this.socket.on(SOCKET_EVENTS.ON_POINTS_UPDATED, (data) => {
            console.log(this.tag, 'ON_POINTS_UPDATED', data);
            PubSub.publish(PubSubEvents.OnPointsUpdated, data);
        });
        this.socket.on(SOCKET_EVENTS.ON_REQUEST_ACCEPTED, (data) => {
            console.log(this.tag, 'ON_REQUEST_ACCEPTED', data);
            PubSub.publish(PubSubEvents.OnRequestAccepted, data);
        });
        this.socket.on(SOCKET_EVENTS.ON_REQUEST_REJECTED, (data) => {
            console.log(this.tag, 'ON_REQUEST_REJECTED', data);
            PubSub.publish(PubSubEvents.OnRequestRejected, data);
        });
        this.socket.on(SOCKET_EVENTS.ON_REQUEST_RAISED, (data) => {
            console.log(this.tag, 'ON_REQUEST_RAISED', data);
            PubSub.publish(PubSubEvents.OnRequestRaised, data);
        });
        this.socket.on(SOCKET_EVENTS.ON_LOCATION_REQUEST, (data) => {
            console.log(this.tag, 'ON_LOCATION_REQUEST', data);
            //TODO: get location from user(Teacher) and send to server on LOCATION event

        });
        this.socket.on(SOCKET_EVENTS.ON_CHECK_ATTENDANCE, (data) => {
            console.log(this.tag, 'ON_CHECK_ATTENDANCE', data);
            //TODO: get location and check if in the radius and send to server on ATTENDANCE event
        });
    }

    /**
     * @private
     * create new socket if not exist or return existing socket 
     * @returns {SocketIOClient.Socket}
     */
    getSocket() {
        if (this.socket) {
            if (this.socket.connected) {
                return this.socket;
            }
        } else {
            const user = mmkv.getObject(USER);
            this.socket = io(baseUrl,
                {
                    forceNew: true,
                    autoConnect: false,
                    transports: ['websocket'],
                    extraHeaders: { userid: user.id, role: user.role },
                });
        }
        this.socket.connect();
        return this.socket;
    }

    /**
     * @private
     * @param {Function} cb 
     */
    withSocket(cb) {
        try {
            const socket = this.getSocket();
            if (socket && socket.connected) {
                cb(socket);
            } else {
                console.log(this.tag, "Socket not initialized ❌");
            }
        } catch (error) {
            console.log(this.tag, error);
        }
    }



    /**
     * Disconnect socket connection
     */
    disconnect() {
        if (this.socket && this.socket.connected) {
            this.socket.disconnect();
        }
    }

    /**
     * 
     * @param {{groupId:String}} data 
     * @param {Function} cb 
     */
    getGroupStatus({ groupId }, cb) {
        this.withSocket((socket) => {
            socket.emit(SOCKET_EVENTS.GROUP_STATUS, { groupId }, (res) => {
                if (res) {
                    console.log(this.tag, "Group Status:", authService.getRole(), groupId, res);
                    if (cb) cb(res);
                }
            });
        });
    }

    /**     
     * @param {{groupId:String}} data 
     * @param {Function} cb
     */
    startSession({ groupId }, cb) {
        if (authService.getRole() === ROLES.TEACHER) {
            this.withSocket((socket) => {
                socket.emit(SOCKET_EVENTS.START_SESSION, { groupId }, (res) => {
                    if (res) {
                        console.log(this.tag, "Start Session", res);
                        if (cb) cb(res);
                    }
                });
            });
        } else {
            console.log(this.tag, "You Cannot Start Session ❌");
        }
    }

    /**
     * 
     * @param {{groupId:String}} data 
     * @param {Function} cb
     */
    endSession({ groupId }, cb) {
        if (authService.getRole() === ROLES.TEACHER) {
            this.withSocket((socket) => {
                socket.emit(SOCKET_EVENTS.END_SESSION, { groupId }, (res) => {
                    if (res) {
                        console.log(this.tag, "end Session", res);
                        if (cb) cb(res);
                    }
                });
            });
        } else {
            console.log(this.tag, "You Cannot End Session ❌");
        }
    }

    /**
     * 
     * @param {{groupId:String}} data 
     * @param {Function} cb
     */
    joinSession({ groupId }, cb) {
        if (authService.getRole() === ROLES.STUDENT) {
            this.withSocket((socket) => {
                socket.emit(SOCKET_EVENTS.JOIN_SESSION, { groupId }, (res) => {
                    if (res) {
                        console.log(this.tag, "Join Session", res);
                        if (cb) cb(res);
                    }
                });
            });
        } else {
            console.log(this.tag, "You Cannot Join Session ❌");
        }
    }

    /**
     * 
     * @param {{groupId:String}} data 
     * @param {Function} cb
     */
    leaveSession({ groupId }, cb) {
        if (authService.getRole() === ROLES.STUDENT) {
            this.withSocket((socket) => {
                socket.emit(SOCKET_EVENTS.LEAVE_SESSION, { groupId }, (res) => {
                    if (res) {
                        console.log(this.tag, "Leave Session", res);
                        if (cb) cb(res);
                    }
                });
            });
        } else {
            console.log(this.tag, "You Cannot Leave Session ❌");
        }
    }

    /**
     * 
     * @param {{groupId:String}} data 
     * @param {Function} cb
     */
    raiseRequest({ groupId }, cb) {
        if (authService.getRole() === ROLES.STUDENT) {
            this.withSocket((socket) => {
                socket.emit(SOCKET_EVENTS.RAISE_REQUEST, { groupId }, (res) => {
                    if (res) {
                        console.log(this.tag, "Raise Request", res);
                        if (cb) cb(res);
                    }
                });
            });
        } else {
            console.log(this.tag, "You Cannot Raise Request ❌");
        }
    }


    /**
     * 
     * @param {{groupId:String,requestId:String,points:Number}} data 
     * @param {Function} cb
     */
    acceptRequest({ groupId, requestId, points }, cb) {
        if (authService.getRole() === ROLES.TEACHER) {
            this.withSocket((socket) => {
                socket.emit(SOCKET_EVENTS.ACCEPT_REQUEST, { groupId, requestId, points }, (res) => {
                    if (res) {
                        console.log(this.tag, "Accept Request", res);
                        if (cb) cb(res);
                    }
                });
            });
        } else {
            console.log(this.tag, "You Cannot Accept Request ❌");
        }
    }

    /**
     * 
     * @param {{groupId:String,requestId:String,points:Number}} data 
     * @param {Function} cb     
     */
    rejectRequest({ groupId, requestId, points }, cb) {
        if (authService.getRole() === ROLES.TEACHER) {
            this.withSocket((socket) => {
                socket.emit(SOCKET_EVENTS.REJECT_REQUEST, { groupId, requestId, points }, (res) => {
                    if (res) {
                        console.log(this.tag, "Reject Request", res);
                        if (cb) cb(res);
                    }
                });
            });
        } else {
            console.log(this.tag, "You Cannot Reject Request ❌");
        }
    }


    /**
     * 
     * @param {{groupId:String,location:{lat:Number,long:Number}}} data      
     * @param {Function} cb     
     */
    sendLocation({ groupId, location }, cb) {
        if (authService.getRole() === ROLES.TEACHER) {
            this.withSocket((socket) => {
                socket.emit(SOCKET_EVENTS.LOCATION, { groupId, location }, (res) => {
                    if (res) {
                        console.log(this.tag, "send Location", res);
                        if (cb) cb(res);
                    }
                });
            });
        } else {
            console.log(this.tag, "You Cannot Send Location ❌");
        }
    }

    /**
     * 
     * @param {{groupId:String, points:Number}} data 
     * @param {Function} cb
     */
    markAttendance({ groupId, points }, cb) {
        if (authService.getRole() === ROLES.STUDENT) {
            this.withSocket((socket) => {
                socket.emit(SOCKET_EVENTS.ATTENDANCE, { groupId, points }, (res) => {
                    if (res) {
                        console.log(this.tag, "Attendance mark", res);
                        if (cb) cb(res);
                    }
                });
            });
        } else {
            console.log(this.tag, "You Cannot mark Attendance ❌");
        }
    }
}

/**
 * @type {SocketService}
 */
export default socketService = new SocketService();
