import React, { Component } from 'react';
import { LinearGradient } from 'expo';
import { Text, Icon, Tabs, Tab, ScrollableTab } from 'native-base';
import { ImageBackground, TouchableOpacity, StyleSheet, View } from 'react-native';
import { Avatar } from 'react-native-elements';
import Colors from '../constants/Colors';
import InfrormationTab from './profileTabs/InformationTab';
import PartnerTab from './profileTabs/PartnerTab';
import CompResultsTab from './profileTabs/CompResultsTab';
import { DancerData } from '../objects/profileData';
import { User } from '../objects/firebaseUser';
import HidingHeaderComponent from './HidingHeaderComponent';

export interface CSTSProfileProps {
    profile: DancerData,
    user: User | undefined,
    selectImage: () => void,

    partnerClicked: (idt: string | number) => void
}

const defaultImage = require("../../assets/profile.png");

class CSTSProfile extends React.Component<CSTSProfileProps, {}> {
    render() {
        var { profile, compData, partner, compResults } = this.props.profile;
        var { user } = this.props;
        return (
            <View style={styles.container}>
                <HidingHeaderComponent header={
                    <ImageBackground source={require("../../assets/top.png")} style={{ width: '100%', height: '100%' }} resizeMode="stretch">
                        <View>
                            <View style={{
                                width: "100%",
                                position: "absolute",
                                paddingTop: '8%',
                                alignItems: 'center',
                            }}>
                                <Avatar
                                    showEditButton
                                    editButton={{ name: "camera" }}
                                    rounded
                                    imageProps={{
                                        resizeMode: 'contain'
                                    }}
                                    overlayContainerStyle={{ borderWidth: 2, borderColor: Colors.white, borderRadius: 20 }}
                                    source={user && user.photoUrl ? { uri: user.photoUrl } : defaultImage}
                                    size="large"
                                    onEditPress={() => this.props.selectImage()}
                                    onPress={() => this.props.selectImage()}
                                ></Avatar>
                            </View>
                            <View style={{
                                width: "100%",
                                paddingTop: "15%",
                                alignItems: 'center',
                                flexDirection: "row",
                                justifyContent: "space-evenly"
                            }}>
                                <View style={{ alignContent: "center", alignItems: "center" }}>
                                    <Text style={{ fontSize: 20, fontWeight: "700", color: Colors.white }}>STT - {compData.VykDataStt.Trida}</Text>
                                    <Text style={{ color: Colors.white }}>{compData.VykDataStt.Body}b, {compData.VykDataStt.FinTuz}F/{compData.VykDataStt.FinZahr}F</Text>
                                </View>
                                <View />
                                <View style={{ alignContent: "center", alignItems: "center" }}>
                                    <Text style={{ fontSize: 20, fontWeight: "700", color: Colors.white }}>LAT - {compData.VykDataLat.Trida}</Text>
                                    <Text style={{ color: Colors.white }}>{compData.VykDataLat.Body}b, {compData.VykDataLat.FinTuz}F/{compData.VykDataLat.FinZahr}F</Text>
                                </View>
                            </View>
                            <View style={{
                                width: "100%",
                                paddingTop: 10,
                                alignItems: 'center',
                                flexDirection: "row",
                                justifyContent: "space-evenly"
                            }}>
                                <LinearGradient style={styles.buttonContainer} start={[0, 1]} end={[1, 0]}
                                    colors={[compData.PlatneZdravProhlidky.length > 0 ? Colors.white : '#ff0000', 'transparent']}>
                                    <TouchableOpacity style={{
                                        width: '100%', height: '100%', flexDirection: 'row',
                                        justifyContent: 'center',
                                        alignItems: 'center',
                                    }}
                                    //onPress={() => this.props.onHealthCheckPressed()}
                                    >

                                        <Icon type="FontAwesome" name="heart" style={{ fontSize: 12, color: "black" }} />
                                        <Text style={{ fontSize: 13 }}> {compData.PlatneZdravProhlidky.length > 0 ? "✔" : "X"}</Text>
                                    </TouchableOpacity>
                                </LinearGradient>
                                <LinearGradient style={styles.buttonContainer} start={[0, 1]} end={[1, 0]}
                                    colors={['transparent', compData.Souticence ? Colors.white : '#ff0000']}>
                                    <TouchableOpacity style={{
                                        width: '100%', height: '100%', flexDirection: 'row',
                                        justifyContent: 'center',
                                        alignItems: 'center',
                                    }}
                                    //onPress={() => this.props.onPayLicencePressed()}
                                    >
                                        <Icon type="FontAwesome" name="id-badge" style={{ fontSize: 15, color: 'black' }} />
                                        <Text style={{ fontSize: 13 }}> {compData.Souticence ? "✔" : "X"}</Text>
                                    </TouchableOpacity>
                                </LinearGradient>
                            </View>
                        </View>
                    </ImageBackground>} title={this.props.profile.profile.IdtClena.toString()}>
                    <Tabs renderTabBar={() => <ScrollableTab style={{ backgroundColor: "transparent" }} backgroundColor="transparent" tabsContainerStyle={{ backgroundColor: "transparent" }} />} style={{ height: "10%", backgroundColor: "transparent", paddingBottom: 50 }} >
                        <Tab heading="Informace" tabStyle={{ backgroundColor: 'transparent' }} textStyle={{ color: '#000' }} activeTabStyle={{ backgroundColor: 'transparent' }} activeTextStyle={{ color: Colors.blue, fontWeight: '700', textDecorationLine: "underline", textDecorationStyle: "solid" }}>
                            <InfrormationTab profile={this.props.profile}></InfrormationTab>
                        </Tab>
                        <Tab heading="Partneři(ky)" tabStyle={{ backgroundColor: 'transparent' }} textStyle={{ color: '#000' }} activeTabStyle={{ backgroundColor: 'transparent' }} activeTextStyle={{ color: Colors.blue, fontWeight: '700', textDecorationLine: "underline", textDecorationStyle: "solid" }}>
                            <PartnerTab partner={partner} profile={profile} partnerClicked={(idt: number) => this.props.partnerClicked(idt)} />
                        </Tab>
                        {compResults.Items.length > 0 &&
                            <Tab heading="Výsledky soutěží" tabStyle={{ backgroundColor: 'transparent' }} textStyle={{ color: '#000' }} activeTabStyle={{ backgroundColor: 'transparent' }} activeTextStyle={{ color: Colors.blue, fontWeight: '700', textDecorationLine: "underline", textDecorationStyle: "solid" }}>
                                <CompResultsTab compResults={compResults} />

                            </Tab>}
                    </Tabs>
                </HidingHeaderComponent>
            </View >
        );
    }
}

export default CSTSProfile;

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    buttonContainer: {
        marginTop: 10,
        height: 30,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 20,
        width: '30%',
        borderRadius: 30,

    },
    valid: {
        backgroundColor: "green",
    },
    invalid: {
        backgroundColor: 'red'
    },
    row: {
        flex: 1,
        flexDirection: "row"
    },
});