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
     */
    sendResetCode(email) {
        // implementation for forgot password
    }
}

export default instance = new AuthService();
