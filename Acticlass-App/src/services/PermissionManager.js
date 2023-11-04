import { Platform } from 'react-native';
import { PERMISSIONS, PermissionStatus, RESULTS, request } from 'react-native-permissions';


class PermissionManager {
    /**
     * @private
     */
    static tag = '[PermissionManager]';

    /**
     * @private
     */
    static permissionResult = (result) => {
        switch (result) {
            case RESULTS.BLOCKED:
                console.log(this.tag, 'Permission is blocked.❌ ');
                break;
            case RESULTS.GRANTED:
                console.log(this.tag, 'Permission is granted. ✅');
                break;
            case RESULTS.UNAVAILABLE:
                console.log(this.tag, 'Permission is unavailable. ❌');
                break;
            case RESULTS.DENIED:
                console.log(this.tag, 'Permission is denied. ⚠️');
                break;
            case RESULTS.LIMITED:
                console.log(this.tag, 'Permission is limited. ⚠️');
                break;
            default:
                console.log(this.tag, 'Permission is unknown. ⚠️');
                break;
        }
    }

    /**
     * 
     * @returns {Promise<PermissionStatus>}
     */
    static async requestCameraPermission() {
        try {
            console.log(this.tag, 'Requesting camera permission...');
            let result = RESULTS.UNAVAILABLE;
            if (Platform.OS === 'android') {
                result = await request(PERMISSIONS.ANDROID.CAMERA);
            } else {
                result = await request(PERMISSIONS.IOS.CAMERA);
            }
            this.permissionResult(result);
            return result;
        } catch (error) {
            console.error('Error requesting camera permission:', error);
            return RESULTS.UNAVAILABLE;
        }
    }


}

export default PermissionManager;