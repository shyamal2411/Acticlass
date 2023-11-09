import { USER } from '../common/constants';
import { mmkv } from '../utils/MMKV';

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

    /**
     * @private
     */
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
}

export default socketService = new SocketService();
