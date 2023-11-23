
import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { RESULTS } from 'react-native-permissions';
import Snackbar from 'react-native-snackbar';
import { Camera, useCameraDevice, useCodeScanner } from 'react-native-vision-camera';
import { colors } from '../common/colors';
import { PubSubEvents } from '../common/constants';
import Navbar from '../components/navBar';
import PermissionManager from '../services/PermissionManager';
import groupServices from '../services/groupServices';

const QrCodeScanScreen = ({ navigation }) => {
    const [isBlocked, setIsBlocked] = useState(false);
    const device = useCameraDevice('back');
    const [hasPermission, setHasPermission] = useState(false);
    let isScanning = true;

    const handleScanned = (code) => {
        console.log('Scanned code:', code);
        groupServices.joinGroup(code.value, (err, res) => {
            if (err) {
                console.log(err);
                Snackbar.show({
                    text: err.msg,
                    duration: Snackbar.LENGTH_SHORT,
                    backgroundColor: colors.danger,
                });
                isScanning = true;
            } else {
                Snackbar.show({
                    text: res.msg,
                    duration: Snackbar.LENGTH_SHORT,
                    backgroundColor: colors.success,
                });
                PubSub.publish(PubSubEvents.OnGroupJoined);
                navigation.goBack();
            }
        });
    };

    const codeScanner = useCodeScanner({
        codeTypes: ['qr'],
        onCodeScanned: (codes) => {
            if (codes.length === 0) return;
            let code = codes[0];
            if (isScanning) {
                isScanning = false;
                handleScanned(code);
            }
        }
    });

    const requestCameraPermission = async () => {
        const permission = await PermissionManager.requestCameraPermission();
        if (permission === RESULTS.BLOCKED) {
            setIsBlocked(true);
        } else if (permission === RESULTS.GRANTED) {
            setIsBlocked(false);
            setHasPermission(true);
        }
        // const permission = await requestPermission();
        console.log('Permission:', permission);
    };


    useEffect(() => {
        requestCameraPermission();
    }, []);

    return (
        <View style={styles.container}>
            <Navbar prefixIcon={true} title={'QR Scan'} />
            {(!hasPermission) ? <View style={styles.textContainer}>
                <Text style={styles.text}>No access to camera.</Text>
                {(!isBlocked) ? <TouchableOpacity onPress={() => {
                    requestCameraPermission();
                }}>
                    <Text style={[styles.subText, { color: colors.primary, marginTop: 16 }]}>Try again!</Text>
                </TouchableOpacity> : <Text style={styles.subText}>Please allow access to camera to scan QR code.</Text>}
            </View> :
                <Camera
                    style={styles.camera}
                    device={device}
                    codeScanner={codeScanner}
                    isActive={true}
                />
            }
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
    },
    camera: {
        flex: 1,
        height: '100%',
        width: '100%',
    },
    textContainer: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },
    text: {
        color: colors.placeholder,
        fontSize: 24,
        fontWeight: '600',
    },
    subText: {
        color: colors.placeholder,
        fontSize: 18,
        fontWeight: '400',
    },
});

export default QrCodeScanScreen;
