
import Geolocation from 'react-native-geolocation-service';
import { RESULTS } from 'react-native-permissions';
import PermissionManager from './PermissionManager';
var geodist = require('geodist');

class locationService {
    tag = '[locationService]';

    constructor() {
        if (locationService.instance) {
            return locationService.instance;
        }
        locationService.instance = this;
    }

    /**
     * @private
     * @param {Function} cb 
     */
    withPermission(cb) {
        PermissionManager.requestLocationPermission().then(res => {
            if (res === RESULTS.GRANTED) {
                if (cb) cb();
            }
        });
    }


    /**
     * 
     * @param {Function} cb
     * 
     */
    getCurrentLocation(cb) {
        this.withPermission(() => {
            Geolocation.getCurrentPosition(
                position => {
                    const { latitude, longitude } = position.coords;
                    console.log(this.tag, `Current location: ${latitude}, ${longitude}`);
                    if (cb != null) {
                        cb(null, { lat: latitude, long: longitude });
                    }
                },
                error => {
                    console.error(this.tag, `Error getting current location: ${error.message}`);
                    if (cb != null) {
                        cb(error, null);
                    }
                },
                { enableHighAccuracy: true }
            );
        })
    }

    /**
     * @param {location1:{lat:Number,long:Number},location2:{lat:Number,long:Number}} 
     * @returns {Number} distance in meters
     */
    distance(location1, location2) {
        return geodist(location1, location2, { exact: true, unit: 'meters' });
    }

    /**
     * @param {Function} cb
     * @param {location:{lat:Number,long:Number}} 
     * */
    getDistanceFrom(location, cb) {
        this.getCurrentLocation((err, res) => {
            if (err) {
                console.log(err);
                cb(err, null);
            } else {
                if (cb) cb(null, dis(res, location));
            }
        })
    }

}
export default instance = new locationService();


