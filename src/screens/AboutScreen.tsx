import * as React from 'react';
import { Component } from 'react';
import { StyleSheet, Text, SafeAreaView } from 'react-native';
import { Icon, Container, Header, Tabs, Tab, Button, Left, Right, Body, ScrollableTab } from 'native-base';
import AboutTab from '../components/aboutTabs/aboutTab';
import ContactTab from '../components/aboutTabs/contactTab';
import SupportTab from '../components/aboutTabs/supportTab';
import UserStore from '../strores/UserStore';
import { ComponentBase } from 'resub';
import { User } from '../objects/firebaseUser';
import { NavigationScreenProps } from 'react-navigation';
import Colors from '../constants/Colors';

export interface AboutScreenProps extends NavigationScreenProps {

}

export interface AboutScreenState {
    user?: User
}

class AboutScreen extends ComponentBase<AboutScreenProps, AboutScreenState> {
    protected _buildState(props: AboutScreenProps, initialBuild: boolean): AboutScreenState {
        return {
            user: UserStore.getUser()
        }
    }

    static navigationOptions = ({ navigation }: AboutScreenProps) => {
        const { params } = navigation.state;
        return {
            headerLeft: <Button transparent><Icon name="menu" style={{ color: "black" }}
                onPress={() => navigation.openDrawer()} /></Button>,
            title: 'O aplikaci',
        }
    };


render(){
    return (
        <SafeAreaView style={styles.container}>
            <Tabs renderTabBar={()=> <ScrollableTab style={{ backgroundColor: "transparent" }} backgroundColor="transparent" tabsContainerStyle={{ backgroundColor: "transparent" }} />} style={{ backgroundColor: "transparent" }} >
                <Tab heading="O aplkaci" tabStyle={{ backgroundColor: 'transparent' }} textStyle={{ color: '#000' }} activeTabStyle={{ backgroundColor: 'transparent' }} activeTextStyle={{ color: Colors.blue, fontWeight: '700', textDecorationLine: "underline", textDecorationStyle: "solid" }}>
                    <AboutTab />
                </Tab>
                <Tab heading="Kontakt"  tabStyle={{ backgroundColor: 'transparent' }} textStyle={{ color: '#000' }} activeTabStyle={{ backgroundColor: 'transparent' }} activeTextStyle={{ color: Colors.blue, fontWeight: '700', textDecorationLine: "underline", textDecorationStyle: "solid" }}>
                    <ContactTab />
                </Tab>
                <Tab heading="Podpora" tabStyle={{ backgroundColor: 'transparent' }} textStyle={{ color: '#000' }} activeTabStyle={{ backgroundColor: 'transparent' }} activeTextStyle={{ color: Colors.blue, fontWeight: '700', textDecorationLine: "underline", textDecorationStyle: "solid" }}>
                    <SupportTab user={this.state.user} />
                </Tab>
            </Tabs>
        </SafeAreaView>
    );
}
}

export default AboutScreen;

const styles = StyleSheet.create({
    container: {
        flex: 1
    },
    subheader: {
        fontSize: 20,
    },
})