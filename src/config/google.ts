import {
    G_ANDROID_DEV_CLIENT_ID,
    G_ANDROID_STANDALONE_CLIENT_ID,
    G_IOS_DEV_CLIENT_ID,
    G_IOS_STANDALONE_CLIENT_ID
} from 'react-native-dotenv';
import * as AppAuth from 'expo-app-auth';
import { Platform } from 'react-native';

const googleLoginConfig = Object.freeze({
    clientId: (Platform.OS == "android" ? G_ANDROID_DEV_CLIENT_ID : G_IOS_DEV_CLIENT_ID) as string || '',
    androidClientId: G_ANDROID_DEV_CLIENT_ID as string || '',
    iosClientId: G_IOS_DEV_CLIENT_ID as string || '',
    iosStandaloneAppClientId: G_IOS_STANDALONE_CLIENT_ID as string || '',
    androidStandaloneAppClientId: G_ANDROID_STANDALONE_CLIENT_ID as string || '',
    scopes: ['profile', 'email'],
    redirectUrl: `${AppAuth.OAuthRedirect}:/oauth2redirect/google`,
})

export default googleLoginConfig;