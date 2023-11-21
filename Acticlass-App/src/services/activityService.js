import moment from "moment";
import { ACTIVITY_TYPES, ROLES } from "../common/constants";
import { endpoints } from "../common/endpoints";
import api from "./APIRequest";
import authService from "./authService";

class ActivityService {

    tag = '[ActivityService]';

    /**
     * 
     * @param {{groupId:string,startDate:Date,endDate:Date}} data
     * @param {Function} cb 
     */
    getWeeklyActivities({ groupId, startDate, endDate }, cb) {

        startDate = moment(startDate);
        endDate = moment(endDate);

        console.log(this.tag, "Fetching activities for", startDate, "to", endDate);
        api({ url: endpoints.getActivities, method: "POST", data: { groupId, startDate, endDate } }).then(res => {
            console.log(this.tag, "Activities fetched! 📝");
            let result = {};
            for (let activity of res.activities) {
                let day = moment(activity.timestamp).format("ddd");
                if (result[day] == null) {
                    result[day] = [];
                }
                result[day].push(activity);
            }
            if (cb != null) {
                cb(null, result);
            }
        }).catch(err => {
            console.error(this.tag, err);
            if (cb != null) {
                cb(err, null);
            }
        })
    }

    /**
     * @private
     * @param {*} activity 
     * @returns {String} name
     */
    getNameForActivity(activity) {
        if (activity.type == ACTIVITY_TYPES.REQUEST_ACCEPTED || activity.type == ACTIVITY_TYPES.REQUEST_REJECTED) {
            return activity.triggerFor.triggerBy.name;
        }
        return activity.triggerBy.name;
    }

    /**
     * 
     * @private
     * @param {*} activity 
     * @returns {String} email
     */
    getEmailForActivity(activity) {
        if (activity.type == ACTIVITY_TYPES.REQUEST_ACCEPTED || activity.type == ACTIVITY_TYPES.REQUEST_REJECTED) {
            return activity.triggerFor.triggerBy.email;
        }
        return activity.triggerBy.email;
    }

    /**
     * 
     * @param {{groupId:string,startDate:Date,endDate:Date}} data
     * @param {Function} cb 
     */
    getActivitiesForCSV({ groupId, startDate, endDate }, cb) {
        startDate = moment(startDate).startOf("day");
        endDate = moment(endDate).endOf("day");

        api({ url: endpoints.getActivities, method: "POST", data: { groupId, startDate, endDate } }).then(res => {
            console.log(this.tag, "Activities fetched! 📝");
            let data = [];
            let columns = [];
            if (authService.getRole() == ROLES.TEACHER) {
                data = [];
                columns = ["Date", "Student Email", "Student Name", "Type", "Points"];
                for (let activity of res.activities) {
                    let date = moment(activity.timestamp);
                    data.push([date, this.getEmailForActivity(activity), this.getNameForActivity(activity), activity.type, activity.points]);
                }
            } else {
                for (let activity of res.activities) {
                    data = [];
                    columns = ["Date", "Type", "Points"];
                    let date = moment(activity.timestamp);
                    data.push([date, activity.type, activity.points]);
                }
            }
            if (cb != null) {
                cb(null, { data, columns });
            }
        }).catch(err => {
            console.error(this.tag, err);
            if (cb != null) {
                cb(err, null);
            }
        })
    }

}

/**
 * @type {ActivityService}
 */
export default instance = new ActivityService();