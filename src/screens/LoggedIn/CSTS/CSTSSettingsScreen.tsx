import React, { Component } from 'react';
import { Item, Input, Icon, Button } from 'native-base';
import { NavigationScreenProps } from 'react-navigation';
import _ from 'lodash';
import CSTS from '../../../server/cstsCommunicator';
import BackgroundImage from '../../../components/BackgroundImage';
import FirebaseWorker from '../../../objects/FirebaseWorker';
import { User } from '../../../objects/firebaseUser';
import { Alert } from 'react-native';
import { Profile } from '../../../objects/profileData';

export interface CSTSSettingsSceenProps extends NavigationScreenProps {

}

export interface CSTSSettingsSceenState {
    idt: string,
    user: User,
    profile: Profile | undefined
}

class CSTSSettingsSceen extends React.Component<CSTSSettingsSceenProps, CSTSSettingsSceenState> {
    constructor(props: CSTSSettingsSceenProps) {
        super(props);
        var { params } = props.navigation.state;
        var idt = params && params.user && params.user.cstsIdt;
        if (idt)
            CSTS.getDancerProfile(idt).then((profile: Profile) => {
                this.setState({ profile })
            })
        this.state = {
            idt: idt ? idt.toString() : "",
            user: params.user,
            profile: undefined
        }
    }
    static navigationOptions = ({ navigation }: NavigationScreenProps) => {
        return {
            title: 'ČSTS Nastavení',
            headerRight: (
                <Button
                    transparent
                    onPress={() => navigation.navigate("cstsScreen")}
                >
                    <Icon type="FontAwesome5" name='user' />
                </Button>
            ),
        }
    };

    checkUserProfile = (profile: Profile) => {
        var name = profile.Jmeno + " " + profile.Prijmeni;
        if (!this.state.user.name || name.toLowerCase() == this.state.user.name.toLowerCase()) {
            FirebaseWorker.updateCSTSProfile(profile)
        }
        Alert.alert(
            'Jste si jisti?',
            'Jméno ' + name + ' nesouhlasí se jménem ' + this.state.user.name + ". Jste to opravdu vy?",
            [
                { text: 'NE'},
                { text: 'ANO', onPress: () => FirebaseWorker.updateCSTSProfile(profile) },
            ],
            { cancelable: false },
        );

    }

    findUserByIdt = _.debounce(() => {
        CSTS.getDancerProfile(this.state.idt).then((profile: Profile) => {
            this.setState({ profile })
            this.checkUserProfile(profile)
        })
    }, 2000)

    render() {
        var { params } = this.props.navigation.state;

        return (
            <BackgroundImage>
                <Item>
                    <Icon active type="FontAwesome5" name='id-badge' />
                    <Input placeholder='IDT' value={this.state.idt} onChangeText={(idt: string) => this.setState({ idt }, () => { this.findUserByIdt() })} />
                </Item>
                <Item>
                    <Icon active type="FontAwesome5" name='user' />
                    <Input disabled placeholder='Jméno' value={this.state.profile && this.state.profile.Jmeno} />
                    <Input disabled placeholder='Příjmení' value={this.state.profile && this.state.profile.Prijmeni} />
                </Item>
                <Item>
                    <Icon active ios="ios-at" android='md-at' name='at' />
                    <Input disabled placeholder='email' value={params && params.user && params.user.email} />
                </Item>
                <Item>
                    <Icon active ios="ios-contacts" android='md-contacts' name="contacts" />
                    <Input disabled placeholder='Věková kategorie' value={this.state.profile && this.state.profile.VekKtg} />
                </Item>
            </BackgroundImage>
        );
    }
}

export default CSTSSettingsSceen;