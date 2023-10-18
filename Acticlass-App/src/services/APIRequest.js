import axios from "axios";
import { mmkv } from "../utils/MMKV";
import { AUTH_TOKEN } from "../common/constants";
import { navRef } from "../navigation/navRef";
import { StackActions } from "@react-navigation/native";

const api = axios.create({
    baseURL: ""
});

api.interceptors.request.use(
    config => {
        const token = mmkv.getString(AUTH_TOKEN);
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    error => {
        return error;
    }
);

api.interceptors.response.use(
    response => {
        return response.data;
    },
    error => {
        if (error.response.status === 401) {
            mmkv.delete(AUTH_TOKEN);
            navRef.current.dispatch(StackActions.replace('AuthStack'));
        } else {
            return Promise.reject(error.response.data);
        }
    }
);



export default api;
