import * as React from 'react';
import {
    createAppContainer,
    NavigationRouteConfigMap,
    NavigationNavigator,
} from 'react-navigation';
import { createStackNavigator, } from 'react-navigation-stack';
import { createDrawerNavigator } from 'react-navigation-drawer';
import HomeScreen from '../screens/HomeScreen';
import TabBarIcon from '../components/TabBarIcon';
import SettingsScreen from '../screens/SettingsScreen';
import CSTSSettingsSceen from '../screens/LoggedIn/CSTS/CSTSSettingsScreen';
import WDSFSettingsSceen from '../screens/LoggedIn/WDSF/WDSFSettingsScreen';
import Colors from '../constants/Colors';
import SideMenu from './SideMenu';
import { User } from '../objects/firebaseUser';
import LoginNavigator from './LoginNavigator';
import { getCstsScreens, getWdsfScreens } from './CompetitionNavigator';
import SlideShowNavigator from './SlideshowNavigator';
import { ComponentBase } from 'resub';
import UserStore from '../strores/UserStore';
import AboutScreen from '../screens/AboutScreen';

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
const aboutScreenStack = createStackNavigator(
    {
        About: AboutScreen
    },
    {
        navigationOptions: ({ navigation }) => ({
            showLabel: false,
            initialRouteName: 'About',
            headerMode: 'none',
            drawerLabel: "O aplikaci",
            drawerIcon: ({ focused }) => (
                <TabBarIcon
                    focused={focused}
                    name="info"
                />
            ),
        }),
    }
);

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
        })

    });


export interface NavigationState {
    Navigation: NavigationNavigator<any, any, any>,
}

class CustomTabsNavigator extends ComponentBase<{}, NavigationState> {
    protected _buildState(props: {}, initialBuild: boolean): NavigationState {
        var settings = UserStore.getRouterSettings();
       
            return {
                Navigation: settings ? this.getNavigation(settings) : LoginNavigator,
            }
        
       
    }

    getNavigation(data: {firstLoad: boolean, csts: boolean, wdsf: boolean}) {
        const screens: NavigationRouteConfigMap = {};

        if (data.firstLoad)
            screens.init = {
                name: "init",
                screen: SlideShowNavigator,

            }

        screens.home = {
            name: 'HomeScreenStack',
            screen: homeScreenStack
        }
        screens.CSTS = {
            name: "CSTSBottomTab",
            screen: getCstsScreens(data.csts)
        }
        screens.WDSF = {
            name: "WDSFBottomTab",
            screen: getWdsfScreens(data.wdsf)
        }
        screens.About = {
            name: 'aboutScreenStack',
            screen: aboutScreenStack
        }
        screens.settings = {
            name: "settingsScreenStack",
            screen: settingsScreenStack
        }

        return createDrawerNavigator(screens, {
            contentComponent: (navigator) =>
                <SideMenu activeLabelStyle={{ backgroundColor: Colors.header }} {...navigator} updateImage={(url: string) => this.updateImage(url)} />,
            drawerWidth: 300
        });
    }

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