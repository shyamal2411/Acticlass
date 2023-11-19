import { endpoints } from "../common/endpoints";
import api from "./APIRequest";
import moment from "moment";
import authService from "./authService";
import { ACTIVITY_TYPES, Roles } from "../../../Acticlass-API/src/common/constants";
import { get } from "lodash";

class ActivityService {

    tag = '[ActivityService]';
    
    /**
     * 
     * @param {{groupId:string,startDate:Date,endDate:Date}} daata
     * @param {Function} cb 
     */
    getWeeklyActivities({groupId,startDate,endDate},cb) {
        
        startDate = moment(startDate).startOf("day");
        endDate = moment(endDate).endOf("day");

        api({url:endpoints.getActivities,method:"POST",data:{groupId,startDate,endDate}}).then(res => {
            console.log(this.tag,"Activities fetched! 📝");
            let result = {};
            for(let activity of res.activities) {
                let date = moment(activity.timestamp).format("YYYY-MM-DD");
                if(result[date] == null) {
                    result[date] = [];
                }
                result[date].push(activity);                
            }    
            if(cb != null) {
                cb(null,result);
            }
        }).catch(err => {
            console.error(this.tag,err);
            if(cb != null) {
                cb(err,null);
            }
        })
    }

    /**
     * @private
     * @param {*} activity 
     * @returns {String} name
     */
    getNameForActivity(activity) {
        if(activity.type == ACTIVITY_TYPES.REQUEST_ACCEPTED || activity.type == ACTIVITY_TYPES.REQUEST_REJECTED) {
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
        if(activity.type == ACTIVITY_TYPES.REQUEST_ACCEPTED || activity.type == ACTIVITY_TYPES.REQUEST_REJECTED) {
            return activity.triggerFor.triggerBy.email;
        }
        return activity.triggerBy.email;
    }

    /**
     * 
     * @param {{groupId:string,startDate:Date,endDate:Date}} daata
     * @param {Function} cb 
     */
    getActivitiesForCSV({groupId,startDate,endDate},cb) {
        startDate = moment(startDate).startOf("day");
        endDate = moment(endDate).endOf("day");

        api({url:endpoints.getActivities,method:"POST",data:{groupId,startDate,endDate}}).then(res => {
            console.log(this.tag,"Activities fetched! 📝");  
            let data = [];
            let columns = [];                                  
            if(authService.getRole()== Roles.TEACHER)  {                
                 data = [];
                 columns = [{id:"Date"},{ id:"Student Email"}, {id:"Student Name"}, {id:"Type"}, {id:"Points"}];
                for(let activity of res.activities) {
                    let date = moment(activity.timestamp);
                    let obj = {
                        Date:date,
                        Type:activity.type,
                        "Student Name":this.getNameForActivity(activity),
                        "Student Email":this.getEmailForActivity(activity),
                        Points:activity.points
                    }
                    data.push(obj);                
                }  
            }else{
                for(let activity of res.activities) {
                    data = [];
                    columns = [{id:"Date"},{ id:"Type"}, {id:"Points"}];
                    let date = moment(activity.timestamp);
                    let obj = {
                        Date:date,
                        Type:activity.type,
                        Points:activity.points
                    }
                    data.push(obj);                
                }
            }              
            if(cb != null) {
                cb(null,{data,columns});
            }
        }).catch(err => {
            console.error(this.tag,err);
            if(cb != null) {
                cb(err,null);
            }
        })
    }
}

/**
 * @type {ActivityService}
 */
export default instance = new ActivityService();