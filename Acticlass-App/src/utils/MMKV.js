import { MMKV } from 'react-native-mmkv';
import { MMKV_ENC_KEY, MMKV_STORE_NAME } from '../common/constants';

class MMKVManager {
    constructor(name) {
        this.name = name || MMKV_STORE_NAME;
        this.storage = new MMKV({
            id: this.name,
            encryptionKey: MMKV_ENC_KEY,
        });
    }

    /**
     * Get instance of MMKVManager
     * @return {MMKV}
     */
    getInstance() {
        return this.storage;
    }

    /**
     * @param {String} key 
     * @param {*} value 
     */
    set(key, value) {
        switch (typeof value) {
            case 'object':
                this.storage.set(key, JSON.stringify(value))
                break;
            default:
                this.storage.set(key, value);
                break;
        }
    }

    /**
     * 
     * @param {String} key      
     * @returns {String}
     */
    getString(key) {
        return this.storage.getString(key);
    }

    /**
     * 
     * @param {String} key      
     * @returns {Object}
     */
    getObject(key) {
        return JSON.parse(this.storage.getString(key) || null);
    }

    /**
     * 
     * @param {String} key      
     * @returns {Array}
     */
    getArray(key) {
        return this.getObject(key);
    }

    /**
     * 
     * @param {String} key      
     * @returns {number}
     */
    getNumber(key) {
        return this.storage.getNumber(key);
    }

    /**
     * 
     * @param {String} key      
     * @returns {Boolean}
     */
    getBoolean(key) {
        return this.storage.getBoolean(key);
    }

    /**
     * 
     * @returns {void}
     */
    cleanStorage() {
        this.storage.clearAll();
        console.info("[MMKV][" + this.name + "]", "storage is now reset!");
    }
    /**
     * 
     * @param {String} key 
     * @returns {void}
     */
    removeKey(key) {
        return this.storage.delete(key);
    }

    /**
     * 
     * @param {String} key 
     * @returns {Boolean}
     */
    has(key) {
        return this.storage.contains(key);
    }

    /**
     * @return {String}
     */
    getAllKeys() {
        return this.storage.getAllKeys();
    }

    /**
     * Add Listener to this storage
     * Use .remove() to remove the listener
     */
    addListener(callback) {
        if (!callback) throw new Error("[MMKVManager]: Callback is required");
        return this.storage.addOnValueChangedListener(callback);
    }
}

export const KVDB = MMKVManager;


export const mmkv = new MMKVManager();