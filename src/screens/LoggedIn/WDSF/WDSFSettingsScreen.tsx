import React, { Component } from 'react';
import { NavigationScreenProps } from 'react-navigation';
import WDSF from '../../../server/wdsfCommunicator';
import _ from 'lodash';
import BackgroundImage from '../../../components/BackgroundImage';
import FirebaseWorker from '../../../objects/FirebaseWorker';
import { Alert } from 'react-native';
import { User } from 'firebase';
import { WdsfProfile } from '../../../objects/wdsfData';
import { Item, Input, Button, Icon } from 'native-base';
import Colors from '../../../constants/Colors';

export interface WDSFSettingsSceenProps extends NavigationScreenProps {

}

export interface WDSFSettingsSceenState {
    id: string,
    user: User,
    profile: WdsfProfile | undefined
}

class WDSFSettingsSceen extends React.Component<WDSFSettingsSceenProps, WDSFSettingsSceenState> {
    constructor(props: WDSFSettingsSceenProps) {
        super(props);
        var { params } = props.navigation.state;
        var id = params && params.user && params.user.wdsfId;
        this.state = {
            id: id ? id.toString() : "",
            user: params.user,
            profile: undefined
        }
        if (id)
            WDSF.getDancerProfile(id).then((profile: WdsfProfile) => {
                this.setState({ profile })
            })

    }
    static navigationOptions = ({ navigation }: NavigationScreenProps) => {
        return {
            title: 'WDSF Nastavení',
            headerRight: (
                <Button
                    transparent
                    onPress={() => navigation.navigate("wdsfScreen")}
                >
                    <Icon type="FontAwesome5" name='user' />
                </Button>
            ),
            headerStyle: {
                backgroundColor: Colors.header,
            },
            headerTintColor: '#fff',
            headerTitleStyle: {
                fontWeight: 'bold',
            },
        }
    };


    checkUserProfile = (profile: WdsfProfile) => {
        var name = profile.name + " " + profile.surname;
        if (!this.state.user.name || name.toLowerCase() == this.state.user.name.toLowerCase()) {
            FirebaseWorker.updateWDSFProfile(profile)
        }
        Alert.alert(
            'Jste si jisti?',
            'Jméno ' + name + ' nesouhlasí se jménem ' + this.state.user.name + ". Jste to opravdu vy?",
            [
                { text: 'NE' },
                { text: 'ANO', onPress: () => FirebaseWorker.updateWDSFProfile(profile) },
            ],
            { cancelable: false },
        );

    }
    findUserById = _.debounce(() => {
        WDSF.getDancerProfile(this.state.id).then((profile: WdsfProfile) => {
            this.setState({ profile })
            this.checkUserProfile(profile)
        })
    }, 2000)

    render() {
        var { params } = this.props.navigation.state;
        return (<BackgroundImage>
            <Item>
                <Icon active type="FontAwesome5" name='id-badge' />
                <Input placeholder='MIN' value={this.state.id} onChangeText={(id: string) => this.setState({ id }, () => { this.findUserById() })} />
            </Item>
            <Item>
                <Icon active type="FontAwesome5" name='user' />
                <Input disabled placeholder='Jméno' value={this.state.profile && this.state.profile.name} />
                <Input disabled placeholder='Příjmení' value={this.state.profile && this.state.profile.surname} />
            </Item>
            <Item>
                <Icon active ios="ios-at" android='md-at' name='at' />
                <Input disabled placeholder='email' value={params && params.user && params.user.email} />
            </Item>
            <Item>
                <Icon active ios="ios-contacts" android='md-contacts' name="contacts" />
                <Input disabled placeholder='Věková kategorie' value={this.state.profile && this.state.profile.ageGroup} />
            </Item>
        </BackgroundImage>);
    }
}

export default WDSFSettingsSceen;