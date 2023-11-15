
import PermissionManager from './PermissionManager';
import { RESULTS } from 'react-native-permissions';
var Geolocation = require('geolocation')
var geodist = require('geodist');

class locationService {
    tag = '[locationService]';

    constructor() {
        if (locationService.instance) {
            return locationService.instance;
        }
        locationService.instance = this;
    }

    init() {
        console.log(this.tag, 'Initializing location service...');
        Geolocation.setRNConfiguration({
            skipPermissionRequests: false,
            authorizationLevel: 'whenInUse',
        });
        console.log(this.tag, 'Location service initialized. ✅');

    }

    /**
     * @private
     * @param {Function} cb 
     */
    withPermission(cb) {
        PermissionManager.requestLocationPermission().then(res => {
            if (res === RESULTS.GRANTED) {
                if(cb) cb();
            }
        });
    }


    /**
     * 
     * @param {Function} cb
     * 
     */
    getCurrentLocation(cb) {
        this.withPermission(()=>{
            Geolocation.getCurrentPosition(
                position => {
                    const { latitude, longitude } = position.coords;
                    console.log(this.tag,`Current location: ${latitude}, ${longitude}`);
                    if (cb != null) {
                        cb(null, { lat:latitude, long:longitude });
                    }
                },
                error => {
                    console.error(thsi.tag,`Error getting current location: ${error.message}`);
                    if (cb != null) {
                        cb(error, null);
                    }
                }
            );
        })
    }

    /**
     * @param {location1:{lat:Number,long:Number},location2:{lat:Number,long:Number}} 
     */
    distance(location1,location2){
        return geodist(location1,location2,{exact:true,unit:'meters'});
    }

    /**
     * @param {Function} cb
     * @param {location:{lat:Number,long:Number}} 
     * */
    getDistanceFrom(location,cb){
        this.getCurrentLocation((err,res)=>{
            if(err){
                console.log(err);
                cb(err,null);
            }else{
                if(cb) cb(null,dis(res,location));                
            }
        })
    }
    
}
export default instance = new locationService();


