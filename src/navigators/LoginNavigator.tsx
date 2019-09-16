import React from 'react';
import { createSwitchNavigator } from 'react-navigation';
import LoginScreen from '../screens/Login/LoginScreen';
import RegisterScreen from '../screens/Login/RegisterScreen';
import LoadingScreen from '../screens/Login/LoadingScreen';

const LoginNavigator = createSwitchNavigator({
    loading: LoadingScreen,
    login: LoginScreen,
    register: RegisterScreen,
});

export default LoginNavigator;