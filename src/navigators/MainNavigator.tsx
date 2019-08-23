import * as React from 'react';
import {
    createAppContainer, createStackNavigator,
    createBottomTabNavigator,
    createSwitchNavigator,
    NavigationRouteConfigMap,
    NavigationNavigator,
    BottomTabNavigatorConfig,
    createDrawerNavigator,
    DrawerNavigatorConfig
} from 'react-navigation';
import { MultiBar, MultiBarToggle } from 'react-native-multibar';

import CompetitionScreen from '../screens/CompetitionScreen';
import HomeScreen from '../screens/HomeScreen';
import RanklistScreen from '../screens/RanklistScreen';
import TabBarIcon from '../components/TabBarIcon';
import LoginScreen from '../screens/Login/LoginScreen';
import RegisterScreen from '../screens/Login/RegisterScreen';
import LoadingScreen from '../screens/Login/LoadingScreen';
import { Component } from 'react';
import FirebaseWorker from '../objects/FirebaseWorker';
import firebase from 'firebase';
import SettingsScreen from '../screens/SettingsScreen';
import Icon from 'react-native-vector-icons/FontAwesome';
import WDSFScreen from '../screens/Profiles/WDSFScreen';
import CSTSScreen from '../screens/Profiles/CSTSScreen';
import { Text, Image } from 'react-native';
import CSTSSettingsSceen from '../screens/Settings/CSTSSettingsScreen';
import WDSFSettingsSceen from '../screens/Settings/WDSFSettingsScreen';
import ForgotPasswordScreen from '../screens/Login/ForgotPasswordScreen';
import CustomIcon from '../CustomIcon';
import Colors from '../constants/Colors';


const homeScreenStack = createStackNavigator(
    {
        Home: HomeScreen
    },
    {
        navigationOptions: ({ navigation }) => ({
            showLabel: false,
            initialRouteName: 'Home',
            headerMode: 'none',
            drawerLabel: "Novinky",
            drawerIcon: ({ focused }) => (
                <TabBarIcon
                    focused={focused}
                    name="newspaper-o"
                />
            ),
        }),
    }
);

const ranklistScreenStack = createStackNavigator(
    {
        Ranklist: RanklistScreen
    },
    {
        navigationOptions: ({ navigation }) => ({
            initialRouteName: 'Ranklist',
            showLabel: false,
            tabBarLabel: "Ranklist",
            headerMode: "none",
            tabBarIcon: ({ focused }) => (
                <TabBarIcon
                    focused={focused}
                    name="list-ol"
                />
            ),
        }),
    }
);
const wdsfCompetitionScreenStack = createStackNavigator(
    {
        Competition: CompetitionScreen
    }, {
        navigationOptions: ({ navigation }) => ({
            initialRouteName: 'Competition',
            headerMode: "none",
            showLabel: false,
            tabBarLabel: "Soutěže",
            tabBarIcon: ({ focused }) => (
                <TabBarIcon
                    focused={focused}
                    name="trophy"
                />
            ),
        })

    });



const wdsfScreenStack = createStackNavigator(
    {
        Wdsf: WDSFScreen
    }, {
        navigationOptions: ({ navigation }) => ({
            initialRouteName: 'Wdsf',
            headerMode: "none",
            showLabel: false,
            tabBarLabel: "WDSF",
            tabBarIcon: ({ focused }) => (
                <CustomIcon name="wdsf" size={20} />
            ),
        })

    });

const drawerBarSettings: DrawerNavigatorConfig = {
    initialRouteName: "home",
}
const bottomBarSettings: BottomTabNavigatorConfig = {
    initialRouteName: "home",
    tabBarOptions: {
        showLabel: false,
        activeTintColor: '#F8F8F8',
        inactiveTintColor: '#586589',
        style: {
            backgroundColor: '#171F33'
        },
        tabStyle: {}
    }
};

const cstsScreenStack = createStackNavigator(
    {
        Csts: CSTSScreen
    }, {
        navigationOptions: ({ navigation }) => ({
            initialRouteName: 'Csts',
            headerMode: "none",
            showLabel: false,
            tabBarLabel: "Profil",
            tabBarIcon: ({ focused }) => (
                <TabBarIcon focused={focused} name="user" />
            ),
        })

    });
const settingsScreenStack = createStackNavigator(
    {
        Settings: SettingsScreen,
        cstsSettings: CSTSSettingsSceen,
        wdsfSettings: WDSFSettingsSceen
    }, {
        navigationOptions: ({ navigation }) => ({
            initialRouteName: 'Settings',
            headerMode: "none",
            showLabel: false,
            drawerLabel: "Nastavení",
            drawerIcon: ({ focused }) => (
                <TabBarIcon
                    focused={focused}
                    name="cog"
                />
            ),
        })

    });


export interface NavigationState {
    Navigation: NavigationNavigator<any, any, any>
}

class CustomTabsNavigator extends Component<{}, NavigationState> {
    constructor(props: Readonly<{}>) {
        super(props);
        this.state = {
            Navigation: createSwitchNavigator({
                loading: LoadingScreen,
                login: LoginScreen,
                register: RegisterScreen,
                //forgotPassordScreen: ForgotPasswordScreen,
            })
        }
    }

    componentDidMount() {
        firebase.auth().onAuthStateChanged(async (user) => {
            if (user && user) {
                var data = await FirebaseWorker.getUserData(user);

                const screens: NavigationRouteConfigMap = {
                    home: {
                        name: 'HomeScreenStack',
                        screen: homeScreenStack
                    }

                };

                const cstsScreens: NavigationRouteConfigMap = {
                    ranklist: {
                        name: "RanklistScreenStack",
                        screen: ranklistScreenStack
                    },

                }
                const wdsfScreens: NavigationRouteConfigMap = {
                    competiton: {
                        name: "CompetitionScreenStack",
                        screen: wdsfCompetitionScreenStack
                    },

                }
                if (data.cstsIdt) {

                    cstsScreens.profile = {
                        name: "CSTSSCreenStack",
                        screen: cstsScreenStack
                    }


                }
                if (data.wdsfId) {
                    wdsfScreens.profile = {
                        name: "WDSFScreenStack",
                        screen: wdsfScreenStack
                    }
                }

                screens.CSTS = {
                    name: "CSTSBottomTab",
                    screen: createBottomTabNavigator(cstsScreens,
                        {
                            navigationOptions: ({ navigation }) => ({
                                initialRouteName: 'Csts',
                                headerMode: "none",
                                showLabel: false,
                                drawerLabel: "ČSTS",
                                drawerIcon: ({ focused }) => (
                                    <CustomIcon name="csts" size={20} />
                                ),
                            })
                        })
                }
                screens.WDSF = {
                    name: "WDSFBottomTab",
                    screen: createBottomTabNavigator(wdsfScreens,
                        {
                            navigationOptions: ({ navigation }) => ({
                                initialRouteName: 'Wdsf',
                                headerMode: "none",
                                showLabel: false,
                                drawerLabel: "WDSF",
                                drawerIcon: ({ focused }) => (
                                    <CustomIcon name="wdsf" size={20} />
                                ),
                            })
                        })
                }

                screens.settings = {
                    name: "settingsScreenStack",
                    screen: settingsScreenStack
                }
                this.setState({ Navigation: createDrawerNavigator(screens, drawerBarSettings) })
            }
            else {
                this.setState({
                    Navigation: createSwitchNavigator({
                        loading: LoadingScreen,
                        login: LoginScreen,
                        register: RegisterScreen,
                        // forgotPassordScreen: ForgotPasswordScreen,
                    })
                });
            }
        })
    };

    render() {
        const { props } = this;
        const NavigatorTabs = createAppContainer(this.state.Navigation);
        return <NavigatorTabs screenProps={{ ...props }} />;
    }
}




//const AppContainer = createAppContainer(AppNavigator);

export default class NavigationScreens extends React.Component {
    render() {
        return <CustomTabsNavigator />;
    }
}