import * as React from 'react';
import { List, ListItem, Left, Button, Body, Right, Icon, Container, CheckBox } from 'native-base';
import { Text } from 'react-native';
import { ScrollView } from 'react-native';
import { User } from '../objects/firebaseUser';
import { NavigationScreenProps } from 'react-navigation';
import CustomIcon from '../CustomIcon';
import { ComponentBase } from 'resub';
import UserStore from '../strores/UserStore';
import Colors from '../constants/Colors';
import FirebaseWorker from '../objects/FirebaseWorker';

export interface SettingsScreenState {
    user?: User,
    visible?: {csts: boolean, wdsf: boolean}
}

class SettingsScreen extends ComponentBase<NavigationScreenProps, SettingsScreenState> {
    protected _buildState(props: NavigationScreenProps, initialBuild: boolean): SettingsScreenState {
        return {
            user: UserStore.getUser(),
            visible: UserStore.getVisibleSettings()
        }
    }
    static navigationOptions = ({ navigation }: NavigationScreenProps) => {
        return {
            headerLeft: <Button transparent onPress={() => navigation.openDrawer()} ><Icon name="menu" style={{ color: Colors.iconColor }}
            /></Button>,
            title: 'Nastavení',

            headerStyle: {
                backgroundColor: Colors.header,
            },
            headerTintColor: '#fff',
            headerTitleStyle: {
                fontWeight: 'bold',
            },
        }
    };

    render() {
        console.log('SettingsScreen', this.state.visible);
        
        return (<Container>
            <ScrollView>
                <List><ListItem itemDivider>
                        <Text>Zájmové skupiny</Text>
                    </ListItem>
                    <ListItem onPress={() => this.checkCSTS()}>
                        <Left>            
                            <CheckBox onPress={() => this.checkCSTS()} checked={this.state.visible?this.state.visible.csts:true} />
                        </Left>
                        <Body><Text>ČSTS</Text></Body>
                    </ListItem>
                    <ListItem onPress={() => this.checkWDSF()}>
                        <Left>            
                            <CheckBox onPress={() => this.checkWDSF()} checked={this.state.visible? this.state.visible.wdsf:true} />
                        </Left>
                        <Body><Text>WDSF</Text></Body>
                    </ListItem>
                    <ListItem itemDivider>
                        <Text>Uživatelské účty</Text>
                    </ListItem>
                    {this.state.visible && this.state.visible.csts &&
                    <ListItem onPress={() => this.props.navigation.navigate("cstsSettings", { user: this.state.user })}>
                        <Left><CustomIcon name="csts" size={26} />
                            <Body><Text>ČSTS</Text></Body>
                        </Left>
                        <Right>
                            <Icon type="FontAwesome" name="chevron-right" />
                        </Right>
                    </ListItem>}
                    {this.state.visible && this.state.visible.wdsf &&
                    <ListItem onPress={() => this.props.navigation.navigate("wdsfSettings", { user: this.state.user })}>
                        <Left><CustomIcon name="wdsf" size={30} />
                            <Body><Text>WDSF</Text></Body>
                        </Left>
                        <Right>
                            <Icon type="FontAwesome" name="chevron-right" />
                        </Right>
                    </ListItem>}
                </List>
            </ScrollView>
        </Container>);
    }
    checkCSTS(): void {
        if(this.state.visible){
            UserStore.setVisibleState(!this.state.visible.csts, this.state.visible.wdsf)
            FirebaseWorker.updateVisibility({csts: !this.state.visible.csts, wdsf: this.state.visible.wdsf})
        }
}
    checkWDSF(): void {
        if(this.state.visible){
            UserStore.setVisibleState(this.state.visible.csts, !this.state.visible.wdsf)
            FirebaseWorker.updateVisibility({csts: this.state.visible.csts, wdsf: !this.state.visible.wdsf})
    }
}
}

export default SettingsScreen;