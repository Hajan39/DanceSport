import * as React from 'react';
import { NavigationScreenProps } from 'react-navigation';
import { CstsDancerData } from '../../../objects/profileData';
import { Icon, Button, Tabs, Tab, View, ScrollableTab } from 'native-base';
import Colors from '../../../constants/Colors';
import FirebaseWorker from '../../../objects/FirebaseWorker';
import BackgroundImage from '../../../components/BackgroundImage';
import LoadingPage from '../../../objects/loadingPage';
import { StyleSheet, Group } from 'react-native';
import InfrormationTab from '../../../components/profileTabs/InformationTab';
import PartnerTab from '../../../components/profileTabs/PartnerTab';
import CompResultsTab from '../../../components/profileTabs/CompResultsTab';
import ProfileHeader from "../../../components/ProfileHeader"
import { ComponentBase } from 'resub';
import UserStore from '../../../strores/UserStore';
import { GroupType } from '../../../objects/GroupTypes';
import { User } from '../../../objects/firebaseUser';
import { showProfile } from '../../../functions/cstsFunction';

export interface CSTSScreenProps extends NavigationScreenProps {

}

export interface CSTSScreenState {
    profile: CstsDancerData,
    likeIt?: boolean,
    loggedUser?: User
}

class CSTSScreen extends ComponentBase<CSTSScreenProps, CSTSScreenState> {
    protected _buildState(props: CSTSScreenProps, initialBuild: boolean): CSTSScreenState {

        var user: CstsDancerData = this.props.navigation.getParam("dancerData", UserStore.getCstsProfile())
        var loggedUser = UserStore.getUser()
        return {
            profile: user,
            likeIt: user && loggedUser &&  loggedUser.cstsIdt == user.profile.IdtClena? undefined: loggedUser && loggedUser.followingCstsIdts.findIndex(x=> x == user.profile.IdtClena)>0,
            loggedUser: loggedUser
        }
    }

    static navigationOptions = ({ navigation }: NavigationScreenProps) => {
        const { params } = navigation.state;
        
        return {
            headerLeft: <Button transparent><Icon name="menu" style={{ color: "black" }}
                onPress={() => navigation.openDrawer()} /></Button>,

            title: navigation.state.params && navigation.state.params.name || 'Profil',
            headerStyle: {
                backgroundColor: Colors.header,
                borderBottomWidth: 0,
                shadowColor: 'transparent'
            },
            headerRight: (<>
                {params && params.likeIt!=undefined && <Icon
                    style={{ paddingRight: 20 }}
                    name={params.likeIt ? "heart" : "heart-o"}
                    fontSize={25}
                    color="red"
                    type="FontAwesome"
                    onPress={() => params.toggleFavorites()} />}

            </>
            ),
              headerTintColor: '#fff',
              headerTitleStyle: {
                fontWeight: 'bold',
              },
        }
    };

    toggleFavorites = () => {
        this.setState({ likeIt: !this.state.likeIt  });
        this.props.navigation.setParams({
            likeIt: !this.state.likeIt
        })
        if (this.state.profile && this.state.loggedUser) {
            var idt = this.state.profile.profile.IdtClena;
            var index = this.state.loggedUser.followingCstsIdts.find(x => x == idt);
            if (index)
                FirebaseWorker.updateCSTSFavorites(this.state.loggedUser.followingCstsIdts.filter(x => x !== idt))
            else
                FirebaseWorker.updateCSTSFavorites([...this.state.loggedUser.followingCstsIdts, idt])

        }
    }
    componentDidMount() {
        this.props.navigation.setParams({
            toggleFavorites: () => this.toggleFavorites(),
            name: this.state.profile.profile.Jmeno + " " + this.state.profile.profile.Prijmeni,
            likeIt: this.state.likeIt
        })
    }

    render() {
        if (this.state.profile) {
            var { profile, partner, compResults } = this.state.profile;

            return (
                <View style={styles.container}>
                    <BackgroundImage>
                        <ProfileHeader compData={this.state.profile.compData} id={this.state.profile.profile.IdtClena} groupType={GroupType.CSTS} />
                        <Tabs renderTabBar={() => <ScrollableTab style={{ backgroundColor: "transparent" }} backgroundColor="transparent" tabsContainerStyle={{ backgroundColor: "transparent" }} />} style={{ height: "10%", backgroundColor: "transparent" }} >
                            <Tab heading="Informace" tabStyle={{ backgroundColor: 'transparent' }} textStyle={{ color: '#000' }} activeTabStyle={{ backgroundColor: 'transparent' }} activeTextStyle={{ color: Colors.blue, fontWeight: '700', textDecorationLine: "underline", textDecorationStyle: "solid" }}>
                                <InfrormationTab profile={this.state.profile}></InfrormationTab>
                            </Tab>
                            <Tab heading="Partneři(ky)" tabStyle={{ backgroundColor: 'transparent' }} textStyle={{ color: '#000' }} activeTabStyle={{ backgroundColor: 'transparent' }} activeTextStyle={{ color: Colors.blue, fontWeight: '700', textDecorationLine: "underline", textDecorationStyle: "solid" }}>
                                <PartnerTab partner={partner} profile={profile} partnerClicked={(idt: number) => showProfile(idt, this.props.navigation)} />
                            </Tab>
                            {compResults.Items.length > 0 &&
                                <Tab heading="Výsledky soutěží" tabStyle={{ backgroundColor: 'transparent' }} textStyle={{ color: '#000' }} activeTabStyle={{ backgroundColor: 'transparent' }} activeTextStyle={{ color: Colors.blue, fontWeight: '700', textDecorationLine: "underline", textDecorationStyle: "solid" }}>
                                    <CompResultsTab compResults={compResults} />

                                </Tab>}
                        </Tabs>
                    </BackgroundImage>
                </View>
            );
        }
        else
            return LoadingPage("Načítání profilu");
    }
}

export default CSTSScreen;

const styles = StyleSheet.create({
    container: {
        flex: 1,
    }
});