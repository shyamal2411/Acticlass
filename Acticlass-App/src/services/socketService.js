import { SOCKET_EVENTS } from '../common/constants';
import { USER } from '../common/constants';
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
    constructor() {
        this.socket;
    }

    init() {
        this.getSocket();
        this.socket.on('connect', () => {
            console.log(this.tag, 'connected');
        });
        this.socket.on('disconnect', () => {
            console.log(this.tag, 'disconnected');
        });
        this.socket.on('error', (err) => {
            console.log(this.tag, err);
        });
        this.socket.on('connect_error', (err) => {
            console.log(this.tag, 'connect_error', err.message);
        });
    }


    getSocket() {
        if (this.socket) {
            if (this.socket.connected) {
                return this.socket;
            }
        } else {
            const user = mmkv.getObject(USER);
            this.socket = io("http://localhost:3000",
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

    disconnect() {
        this.socket.disconnect();
    }

    on(eventName, callback) {
        this.socket.on(eventName, callback);
    }

    emit(eventName, data) {
        this.socket.emit(eventName, data);
    }
    
    startSession(data) {

    
        if (authService.getRole() === 'Teacher') {
            const socket = this.getSocket();
            if (socket) {
                socket.emit(SOCKET_EVENTS.START_SESSION, data, (response) => {
                    // Handle the callback response here
                    console.log(this.tag,'registerForSocket response:', response);
                });
                console.log(this.tag,"Session Started ✅");
            } else {
                console.log(this.tag,"Socket not initialized ❌");
            }
        } else {
            console.log(this.tag,"You Cannot Start Session ❌");
        }
    }

    endSession(data) {
        if(authService.getRole() === 'Teacher') {   
            const socket = this.getSocket();
            if (socket) {
                socket.emit(SOCKET_EVENTS.END_SESSION, data, (response) => {
                    // Handle the callback response here
                    console.log(this.tag,'registerForSocket response:', response);
                });
                console.log(this.tag,"Session Ended ✅");
            } else {
                console.log(this.tag,"Socket not initialized ❌");
            }
        } else {
            console.log(this.tag,"You Cannot End Session ❌");
        }
    }

    joinSession(data) {
        if(authService.getRole() === 'Student') {
            const socket = this.getSocket();
            if (socket) {
                socket.emit(SOCKET_EVENTS.JOIN_SESSION, data, (response) => {
                    // Handle the callback response here
                    console.log(this.tag,'registerForSocket response:', response);
                });
                console.log(this.tag,"Session Joined ✅");
            } else {
                console.log(this.tag,"Socket not initialized ❌");
            }
        } else {
            console.log(this.tag,"You Cannot Join Session ❌");
        }
    }
    leaveSession(data) {
        if(authService.getRole() === 'Student') {
            const socket = this.getSocket();
            if (socket) {
                socket.emit(SOCKET_EVENTS.LEAVE_SESSION, data, (response) => {
                    // Handle the callback response here
                    console.log(this.tag,'registerForSocket response:', response);
                });
                console.log(this.tag,"Session Left ✅");
            } else {
                console.log(this.tag,"Socket not initialized ❌");
            }
        } else {
            console.log(this.tag,"You Cannot Leave Session ❌");
        }
    }
    raiseRequest(data) {
        if(authService.getRole() === 'Student') {
            const socket = this.getSocket();
            if (socket) {
                socket.emit(SOCKET_EVENTS.RAISE_REQUEST, data, (response) => {
                    // Handle the callback response here
                    console.log(this.tag,'registerForSocket response:', response);
                });
                console.log(this.tag,"Request Raised ✅");
            } else {
                console.log(this.tag,"Socket not initialized ❌");
            }
        } else {
            console.log(this.tag,"You Cannot Raise Request ❌");
        }
    }
    acceptRequest(data) {
        if(authService.getRole() === 'Teacher') {
            const socket = this.getSocket();
            if (socket) {
                socket.emit(SOCKET_EVENTS.ACCEPT_REQUEST, data, (response) => {
                    // Handle the callback response here
                    console.log(this.tag,'registerForSocket response:', response);
                });
                console.log(this.tag,"Request Accepted ✅");
            } else {
                console.log(this.tag,"Socket not initialized ❌");
            }
        } else {
            console.log(this.tag,"You Cannot Accept Request ❌");
        }
    }
    rejectRequest(data) {
        if(authService.getRole() === 'Teacher') {
            const socket = this.getSocket();
            if (socket) {
                socket.emit(SOCKET_EVENTS.REJECT_REQUEST, data, (response) => {
                    // Handle the callback response here
                    console.log(this.tag,'registerForSocket response:', response);
                });
                console.log(this.tag,"Request Rejected ✅");
            } else {
                console.log(this.tag,"Socket not initialized ❌");
            }
        } else {
            console.log(this.tag,"You Cannot Reject Request ❌");
        }
    }
    acceptRequest(data) {
        if(authService.getRole() === 'Teacher') {
            const socket = this.getSocket();
            if (socket) {
                socket.emit(SOCKET_EVENTS.ACCEPT_REQUEST, data, (response) => {
                    // Handle the callback response here
                    console.log(this.tag,'registerForSocket response:', response);
                });
                console.log(this.tag,"Request Accepted ✅");
            } else {
                console.log(this.tag,"Socket not initialized ❌");
            }
        } else {
            console.log(this.tag,"You Cannot Accept Request ❌");
        }
    }
    location(data) {
        if(authService.getRole() === 'Teacher') {
            const socket = this.getSocket();
            if (socket) {
                socket.emit(SOCKET_EVENTS.LOCATION, data, (response) => {
                    // Handle the callback response here
                    console.log(this.tag,'registerForSocket response:', response);
                });
                console.log(this.tag,"Location Sent ✅");
            } else {
                console.log(this.tag,"Socket not initialized ❌");
            }
        } else {
            console.log(this.tag,"You Cannot Send Location ❌");
        }
    }
    attendance(data) {
        if(authService.getRole() === 'Teacher') {
            const socket = this.getSocket();
            if (socket) {
                socket.emit(SOCKET_EVENTS.ATTENDANCE, data, (response) => {
                    // Handle the callback response here
                    console.log(this.tag,'registerForSocket response:', response);
                });
                console.log(this.tag,"Attendance Sent ✅");
            } else {
                console.log(this.tag,"Socket not initialized ❌");
            }
        } else {
            console.log(this.tag,"You Cannot Send Attendance ❌");
        }
    }


}

export default socketService = new SocketService();
