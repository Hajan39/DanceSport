import { LinearGradient } from 'expo';
import * as React from 'react';
import { Platform, View } from 'react-native';
import { Header } from 'react-navigation';

const CustomHeader = (props: JSX.IntrinsicAttributes & JSX.IntrinsicClassAttributes<Header> & Readonly<import("react-navigation").HeaderProps> & Readonly<{ children?: React.ReactNode; }>) => {
    return (
        <View
            style={{
                height: 56,
                marginTop: Platform.OS == "ios" ? 20 : 0
            }}
        >
            <LinearGradient
                colors={["#6200EE", "#3700B3"]}
            >
                <Header {...props} />
            </LinearGradient>
        </View>
    );
};

export default CustomHeader;