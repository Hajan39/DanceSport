import * as React from 'react';
import { createStackNavigator } from "react-navigation-stack";

import WDSFScreen from '../screens/LoggedIn/WDSF/WDSFScreen';
import CSTSScreen from '../screens/LoggedIn/CSTS/CSTSScreen';
import CompetitionScreen from '../screens/LoggedIn/WDSF/CompetitionScreen';
import RanklistScreen from '../screens/LoggedIn/CSTS/RanklistScreen'
import TabBarIcon from "../components/TabBarIcon";
import CustomIcon from "../CustomIcon";
import { NavigationRouteConfigMap } from "react-navigation";
import { createBottomTabNavigator } from 'react-navigation-tabs';
import FavoritesWdsfScreen from '../screens/LoggedIn/WDSF/FavoritesWdsfScreen';
import FavoritesCstsScreen from '../screens/LoggedIn/CSTS/FavoritesCstsScreen';
import CompetitionDetailScreen from '../screens/LoggedIn/WDSF/CompetitionDetailScreen';
import Colors from '../constants/Colors';


export function getCstsScreens(cstsId: boolean) {
    const cstsScreens: NavigationRouteConfigMap = {};

    if (cstsId) {
        cstsScreens.profile = {
            name: "CSTSSCreenStack",
            screen: cstsScreenStack
        }
    }
    cstsScreens.favorites = {
        name: "CSTSFavoritesScreenStack",
        screen: CSTSFavoritesScreenStack
    }
    cstsScreens.ranklist = {
        name: "RanklistScreenStack",
        screen: CstsRanklistScreenStack
    };


    return createBottomTabNavigator(cstsScreens,
        {
            navigationOptions: ({ navigation }) => ({
                initialRouteName: 'Csts',
                headerMode: "none",
                showLabel: false,
            }),
            tabBarOptions: {
                activeTintColor: Colors.header,
                inactiveTintColor: 'gray',
            },
        })
}

export function getWdsfScreens(wdsfId: boolean) {

    const wdsfScreens: NavigationRouteConfigMap = {}

    if (wdsfId) {
        wdsfScreens.profile = {
            name: "WDSFScreenStack",
            screen: wdsfScreenStack
        }
    }

    wdsfScreens.favorites = {
        name: "WDSFFavoritesScreenStack",
        screen: WDSFFavoritesScreenStack
    }

    wdsfScreens.competiton = {
        name: "CompetitionScreenStack",
        screen: wdsfCompetitionScreenStack
    }
    return createBottomTabNavigator(wdsfScreens,
        {
            navigationOptions: ({ navigation }) => ({
                initialRouteName: 'Wdsf',
                headerMode: "none",
                showLabel: false,

            }),
            tabBarOptions: {
                activeTintColor: Colors.header,
                inactiveTintColor: 'gray',
            },
        });
}


export const cstsScreenStack = createStackNavigator(
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
const CSTSFavoritesScreenStack = createStackNavigator(
    {
        Favorites: FavoritesCstsScreen,
        Csts: CSTSScreen
    }, {
    navigationOptions: ({ navigation }) => ({
        initialRouteName: 'Oblíbené',
        headerMode: "none",
        showLabel: false,
        tabBarLabel: "Oblíbené",
        tabBarIcon: ({ focused }) => (
            <TabBarIcon
                focused={focused}
                name="heart"
            />
        ),
    })

});
const CstsRanklistScreenStack = createStackNavigator(
    {
        Ranklist: RanklistScreen,
        Csts: CSTSScreen
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


const WDSFFavoritesScreenStack = createStackNavigator(
    {
        Favorites: FavoritesWdsfScreen
    }, {
    navigationOptions: ({ navigation }) => ({
        initialRouteName: 'Oblíbené',
        headerMode: "none",
        showLabel: false,
        tabBarLabel: "Oblíbené",
        tabBarIcon: ({ focused }) => (
            <TabBarIcon
                focused={focused}
                name="heart"
            />
        ),
    })

});

const wdsfCompetitionScreenStack = createStackNavigator(
    {
        Competition: CompetitionScreen,
        WdsfCompDetail: CompetitionDetailScreen
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
        tabBarLabel: "Profil",
        tabBarIcon: ({ focused }) => (
            <TabBarIcon focused={focused} name="user" />
        ),
    })

});