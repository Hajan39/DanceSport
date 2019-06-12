import * as React from 'react';
import {
    createAppContainer, createStackNavigator,
    createBottomTabNavigator,
    createSwitchNavigator,
    NavigationRouteConfigMap,
    NavigationNavigator,
    BottomTabNavigatorConfig
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


const homeScreenStack = createStackNavigator(
    {
        Home: HomeScreen,
        wdsfScreen: WDSFScreen,
        cstsScreen: CSTSScreen
    },
    {
        navigationOptions: ({ navigation }) => ({
            showLabel: false,
            initialRouteName: 'Home',
            headerMode: 'none',
            tabBarIcon: ({ focused }) => (
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
        Ranklist: RanklistScreen,
        wdsfScreen: WDSFScreen,
        cstsScreen: CSTSScreen

    },
    {
        navigationOptions: ({ navigation }) => ({
            initialRouteName: 'Ranklist',
            showLabel: false,
            headerMode: "none",
            //tabBarLabel: "Ranklist",
            tabBarIcon: ({ focused }) => (
                <TabBarIcon
                    focused={focused}
                    name="list-ol"
                />
            ),
        }),
    }
);
const competitionScreenStack = createStackNavigator(
    {
        Competition: CompetitionScreen,
        wdsfScreen: WDSFScreen,
        cstsScreen: CSTSScreen
    }, {
        navigationOptions: ({ navigation }) => ({
            initialRouteName: 'Competition',
            headerMode: "none",
            showLabel: false,
            //tabBarLabel: "Soutěže",
            tabBarIcon: ({ focused }) => (
                <TabBarIcon
                    focused={focused}
                    name="trophy"
                />
            ),
        })

    });


const settingsScreenStack = createStackNavigator(
    {
        Settings: SettingsScreen,
        wdsfScreen: WDSFScreen,
        cstsScreen: CSTSScreen,
        cstsSettings: CSTSSettingsSceen,
        wdsfSettings: WDSFSettingsSceen
    }, {
        navigationOptions: ({ navigation }) => ({
            initialRouteName: 'Settings',
            headerMode: "none",
            showLabel: false,
            // tabBarLabel: "Nastavení",
            tabBarIcon: ({ focused }) => (
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

                const screens: NavigationRouteConfigMap = {};
                const settings: BottomTabNavigatorConfig = {
                    tabBarComponent: MultiBar,
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
                screens.home = {
                    name: 'HomeScreenStack',
                    screen: homeScreenStack
                }
                screens.ranklist = {
                    name: 'RanklistScreenStack',
                    screen: ranklistScreenStack
                }
                if (data.cstsIdt || data.wdsfId) {
                    screens.profile = {
                        screen: () => null,
                        navigationOptions: ({ navigation }) => ({
                            tabBarIcon: () => (<MultiBarToggle navigation={navigation} actionSize={50} animateIcon={false} routes={[
                                data.wdsfId && {
                                    routeName: "wdsfScreen",
                                    color: '#FF8360',
                                    icon: (<><CustomIcon name="wdsf" size={20} /><Text>WDSF</Text></>)
                                },
                                data.cstsIdt && {
                                    routeName: "cstsScreen",
                                    color: '#E8E288',
                                    icon: (<><CustomIcon name="csts" size={20} /><Text>ČSTS</Text></>)
                                }
                            ]} icon={(<Icon name="user" color="#FFFFFF" size={24} />)} />)
                        }),
                        params: {
                            navigationDisabled: true
                        }
                    }
                }

                screens.competitions = {
                    name: 'CompetitionScreenStack',
                    screen: competitionScreenStack
                }
                screens.settings = {
                    name: "settingsScreenStack",
                    screen: settingsScreenStack
                }
                this.setState({ Navigation: createBottomTabNavigator(screens, settings) })
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