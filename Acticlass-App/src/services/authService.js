import { AUTH_TOKEN, USER } from "../common/constants";
import { endpoints } from "../common/endpoints";
import { mmkv } from "../utils/MMKV";
import api from "./APIRequest";

class AuthService {
    role = null;
    tag = '[AuthService]';
    signUpData = {};
    constructor() {
        if (AuthService.instance) {
            return AuthService.instance;
        }
        AuthService.instance = this;
    }


    /**
     * 
     * @param {String} email 
     * @param {String} password 
     * @param {Function} cb
     */
    signIn({ email, password }, cb) {
        api({ url: endpoints.signIn, method: "POST", data: { email, password } }).then(res => {
            console.log(this.tag, "[signIn]", "Sign In successful! ✅");
            if (cb != null) {
                cb(null, res);
            }
        }).catch(err => {
            console.error(this.tag, "[signIn]", err);
            if (cb != null) {
                cb(err, null);
            }
        })
    }


    /**
     * rest cache Data
     */
    resetSignUpData() {
        this.signUpData = {};
    }

    /**
     * 
     * @param {{email,password,name,institute,role}} data 
     */
    updateSignUpData(data) {
        this.signUpData = { ...this.signUpData, ...data };
    }

    /**
     * sign up using data
     * @param {Function} cb
     */
    signUp(cb) {
        api({ url: endpoints.signUp, method: "POST", data: this.signUpData }).then(res => {
            console.log(this.tag, "[signUp]", "Sign Up successful! ✅");
            if (cb != null) {
                cb(null, res);
            }
        }).catch(err => {
            console.error(this.tag, "[signUp]", err);
            if (cb != null) {
                cb(err, null);
            }
        })
    }

    /**
     * 
     * @param {String} email 
     * @param {Function} cb
     */
    sendResetCode(email, cb) {
        api({ url: endpoints.forgotPassword, method: "POST", data: { email } }).then(res => {
            console.log(this.tag, "[sendResetCode]", "Reset code sent! 📧");
            if (cb != null) {
                cb(null, res);
            }
        }).catch(err => {
            console.error(this.tag, "[sendResetCode]", err);
            if (cb != null) {
                cb(err, null);
            }
        })
    }

    /**
     * 
     * @param {{email:String,code:Integer}} data      
     * @param {Function} cb 
     */
    verifyResetCode({ email, code }, cb) {
        api({ url: endpoints.verifyCode, method: "POST", data: { email, code } }).then(res => {
            console.log(this.tag, "[verifyResetCode]", "Reset code verified! ✅");
            if (cb != null) {
                cb(null, res);
            }
        }).catch(err => {
            console.error(this.tag, "[verifyResetCode]", err);
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
    resetPassword({ email, password }, cb) {
        api({ url: endpoints.resetPassword, method: "POST", data: { email, password } }).then(res => {
            console.log(this.tag, "[resetPassword]", "Password reset successful!");
            if (cb != null) {
                cb(null, res);
            }
        }).catch(err => {
            console.error(this.tag, "[resetPassword]", err);
            if (cb != null) {
                cb(err, null);
            }
        })
    }

    /**
     * 
     * @param {Function} cb 
     */
    deleteAccount(cb) {
        api({ url: endpoints.deleteProfile, method: "DELETE" }).then(res => {
            console.log(this.tag, "[deleteAccount]", "Account deleted! ✅");
            if (cb != null) {
                cb(null, res);
            }
        }).catch(err => {
            console.error(this.tag, "[deleteAccount]", err);
            if (cb != null) {
                cb(err, null);
            }
        })
    }

    /**
     * 
     * @param {'Teacher'|'Student'} role 
     */
    setRole(role) {
        this.role = role;
        console.log(this.tag, "[setRole]", "Role set to", role);
    }

    /**
     * 
     * @returns {'Teacher'|'Student'}
     */
    getRole() {
        if (this.role == null) {
            this.role = mmkv.getObject(USER)?.role;
        }
        return this.role;
    }

    /**
     * 
     * @param {{token:String,user:Object,role:ROLES}} res 
     */
    saveAuth(res) {
        mmkv.set(AUTH_TOKEN, res.token);
        mmkv.set(USER, res.user);
        this.setRole(res.user.role);
    }

    /**
     * 
     * @param {Function} cb 
     */
    logout(cb) {
        mmkv.remove(AUTH_TOKEN);
        mmkv.remove(USER);
        this.setRole(null);
        if (cb != null) {
            cb();
        }
    }


    getUserId() {
        const user = mmkv.getObject(USER);
        if (user)
            return user.id;
        console.warn(this.tag, "[getUserId]", "Trying to get user Id without login/signup");
        return null;
    }
}


/**
 * @type {AuthService}
 */
export default instance = new AuthService();
