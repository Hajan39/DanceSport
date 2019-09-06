import * as React from 'react';
import { Component } from 'react';
import { Text, View, List, ListItem, Left, Button, Body, Right, Switch, Input, Icon, Title, Container, Header } from 'native-base';
import firebase from 'firebase';
import FirebaseWorker from '../objects/FirebaseWorker';

import { ScrollView, Platform } from 'react-native';
import { User } from '../objects/firebaseUser';
import { NavigationScreenProps } from 'react-navigation';
import CustomIcon from '../CustomIcon';
import { ComponentBase } from 'resub';
import UserStore from '../strores/UserStore';

export interface SettingsScreenProps extends NavigationScreenProps {

}

export interface SettingsScreenState {
    user: User|undefined
}

class SettingsScreen extends ComponentBase<SettingsScreenProps, SettingsScreenState> {
     protected _buildState(props: SettingsScreenProps, initialBuild: boolean): SettingsScreenState {
        return {
            user: UserStore.getUser()
        }
    }
    static navigationOptions = ({ navigation }: NavigationScreenProps) => {
        return {
            headerLeft: <Button transparent><Icon name="menu" style={{color: "black"}}
        onPress={ () => navigation.openDrawer() } /></Button>,
            title: 'Nastavení',
        }
    };

    render() {
        return (<Container>
            <ScrollView>
                <List>
                    <ListItem itemDivider>
                        <Text>Uživatelské účty</Text>
                    </ListItem>
                    <ListItem onPress={() => this.props.navigation.navigate("cstsSettings", { user: this.state.user })}>
                        <Left><CustomIcon name="csts" size={26} />
                            <Body><Text>ČSTS</Text></Body>
                        </Left>
                        <Right>
                            <Icon type="FontAwesome" name="chevron-right" />
                        </Right>
                    </ListItem>
                    <ListItem onPress={() => this.props.navigation.navigate("wdsfSettings", { user: this.state.user })}>
                        <Left><CustomIcon name="wdsf" size={30} />
                            <Body><Text>WDSF</Text></Body>
                        </Left>
                        <Right>
                            <Icon type="FontAwesome" name="chevron-right" />
                        </Right>
                    </ListItem>
                    <ListItem style={{ alignSelf: "flex-end" }} onPress={() => firebase.auth().signOut()}>
                        <Left><Icon type="FontAwesome" name="sign-out" />
                            <Body><Text>Odhlásit se</Text></Body>
                        </Left>
                    </ListItem>
                </List>
            </ScrollView>
        </Container>);
    }
}

export default SettingsScreen;