import React, { useState } from "react";
import { View, StyleSheet, Button, Alert } from "react-native";

export const createTwoButtonAlert = ({ title, desc, positiveText, negativeText, onPositive, onNegative }) =>
    Alert.alert(
        title,
        desc,
        [
            {
                text: positiveText,
                onPress: onPositive,
                style: "cancel"
            },
            { text: negativeText, onPress: onNegative }
        ],
        { cancelable: false }
    );
