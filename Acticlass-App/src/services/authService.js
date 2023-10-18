import { endpoints } from "../common/endpoints";
import api from "./APIRequest";

class AuthService {
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

}

export default instance = new AuthService();
