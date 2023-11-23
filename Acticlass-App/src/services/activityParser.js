import { isEqual } from "lodash";
import { ACTIVITY_TYPES } from "../common/constants";
import authService from "./authService";

export default class ActivityParser {

    /**
     * @private
     */
    static baseParsed = (item) => {
        return {
            ...item,
            isMine: isEqual(authService.getUserId(), item.triggerBy),
        }
    }

    /**
     * 
     * @param {[{id:String,type:String,timestamp:Number,group:String,triggerBy:String,triggerFor:String,points:Number}]} activities 
     * @returns 
     */
    static parse(activities) {
        if (!activities || activities.length === 0) return [];
        let parsedActivities = [];
        activities.forEach(activity => {
            switch (activity.type) {
                case ACTIVITY_TYPES.RAISE_REQUEST:
                    parsedActivities.push(this.baseParsed(activity));
                    break;
                case ACTIVITY_TYPES.REQUEST_ACCEPTED:
                    parsedActivities.push(this.baseParsed(activity));
                    break;
                case ACTIVITY_TYPES.REQUEST_REJECTED:
                    parsedActivities.push(this.baseParsed(activity));
                    break;
                case ACTIVITY_TYPES.ATTENDANCE:
                    parsedActivities.push(this.baseParsed(activity));
                    break;
                default:
                    break;
            }
        });
        return parsedActivities;
    }
}