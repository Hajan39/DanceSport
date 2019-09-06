import * as React from 'react';
import { NavigationScreenProps, ScrollView } from 'react-navigation';
import {  Button, Icon, Tabs, Tab, ScrollableTab, Text, Card, CardItem } from 'native-base';
import { WdsfDancerData } from '../../../objects/wdsfData';
import FirebaseWorker from '../../../objects/FirebaseWorker';
import Colors from '../../../constants/Colors';
import LoadingPage from '../../../objects/loadingPage';
import BackgroundImage from '../../../components/BackgroundImage';
import Barcode from 'react-native-barcode-builder';
import { ComponentBase } from 'resub';
import UserStore from '../../../strores/UserStore';
import { GroupType } from '../../../objects/GroupTypes';
import ProfileHeader from '../../../components/ProfileHeader';
import WDSFListItem from '../../../components/WDSFListItem';
import WDSF from '../../../server/wdsfCommunicator';
import { User } from '../../../objects/firebaseUser';

export interface WDSFScreenProps extends NavigationScreenProps {

}

export interface WDSFScreenState {
    profile: WdsfDancerData,
    isme: boolean
    loggedUser?: User

}

class WDSFScreen extends ComponentBase<WDSFScreenProps, WDSFScreenState> {
    protected _buildState(props: WDSFScreenProps, initialBuild: boolean): WDSFScreenState {
        var user: WdsfDancerData = this.props.navigation.getParam("dancerData", UserStore.getWdsfProfile())
        var loggedUser = UserStore.getUser()

        return {
            profile: user,
            isme: loggedUser && user ? loggedUser.wdsfId == user.profile.id : false,
            loggedUser: loggedUser
        }
    }
    static navigationOptions = ({ navigation }: NavigationScreenProps) => {
        const { params } = navigation.state;
        return {
            headerLeft: <Button transparent><Icon name="menu" style={{color: "black"}}color="black"
            onPress={ () => navigation.openDrawer() } /></Button>,
          title: navigation.state.params && navigation.state.params.name || 'Profil',
            headerStyle: {
                backgroundColor: Colors.header,
                borderBottomWidth: 0,
                shadowColor: 'transparent'
            },
            headerRight: (
                params && !params.isMe && <Icon
                    style={{ paddingRight: 20 }}
                    name="heart"
                    fontSize={25}
                    color="red"
                    type="FontAwesome"
                    onPress={() => params.toggleFavorites()} />
            )
        }
    };

    wdsfProfileClick(id: number): void {
        WDSF.getDancerAllData(id).then(x=> {
            this.props.navigation.push("Wdsf", { dancerData: x })
        })
    }

  
    toggleFavorites = () => {
        if (this.state.profile && this.state.loggedUser) {
            var idt = this.state.profile.profile.id;
            var index = this.state.loggedUser.followingWdsfIds.find(x => x == idt);
            if (index)
                FirebaseWorker.updateWDSFFavorites(this.state.loggedUser.followingWdsfIds.filter(x => x !== idt))
            else
                FirebaseWorker.updateWDSFFavorites([...this.state.loggedUser.followingWdsfIds, idt])

        }
    }
    componentDidMount() {
        this.props.navigation.setParams({
            toggleFavorites: () => this.toggleFavorites(),
            name: this.state.profile.profile.name + " " + this.state.profile.profile.surname,
            isMe: this.state.isme
        })

    }
    render() {
        const {partner, profile} = this.state.profile;
        if (this.state.profile) {
            return (
                <BackgroundImage>
                    <ProfileHeader id={profile.id} groupType={GroupType.WDSF} profile={profile}/>
                    <Tabs renderTabBar={() => <ScrollableTab style={{ backgroundColor: "transparent" }} backgroundColor="transparent" tabsContainerStyle={{ backgroundColor: "transparent" }} />} style={{ height: "10%", backgroundColor: "transparent" }} >
                        <Tab heading="Informace" tabStyle={{ backgroundColor: 'transparent' }} textStyle={{ color: '#000' }} activeTabStyle={{ backgroundColor: 'transparent' }} activeTextStyle={{ color: Colors.blue, fontWeight: '700', textDecorationLine: "underline", textDecorationStyle: "solid" }}>
                            <BackgroundImage>

                                <Text style={{ paddingLeft: 20 }}>Licence</Text>
                                {profile.licenses.map((x, i) => {
                                    return (
                                        <Card key={i}>
                                            <CardItem style={{ flexDirection: "column" }}>
                                                <Text>Typ: {x.type}</Text>
                                                <Text>Divize: {x.division}</Text>
                                                <Text>Status: {x.status}</Text>
                                                <Text>Expirace: {x.expiresOn}</Text>
                                            </CardItem>
                                        </Card>
                                    )
                                })}
                                <Barcode value={profile.id.toString()} format="CODE128" />
                            </BackgroundImage>
                        </Tab>
                        {partner &&
                            <Tab heading="Partneři(ky)" tabStyle={{ backgroundColor: 'white' }} textStyle={{ color: '#000' }} activeTabStyle={{ backgroundColor: 'white' }} activeTextStyle={{ color: Colors.blue, fontWeight: 'normal', textDecorationLine: "underline", textDecorationStyle: "solid" }}>
                                <BackgroundImage>
                                    <ScrollView style={{ backgroundColor: "transparent" }}>
                                        <WDSFListItem name={partner.name + " " + partner.surname} onClick={(id: number) => this.wdsfProfileClick(id)} wdsfIdt={partner.id} />
                                    </ScrollView>
                                </BackgroundImage>
                            </Tab>}
                    </Tabs>
                </BackgroundImage>
            );
        }
        else
            return LoadingPage("Načítání profilu");
    }
}

export default WDSFScreen;