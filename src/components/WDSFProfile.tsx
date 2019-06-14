import React, { Component } from 'react';
import { View, ImageBackground, ScrollView, StyleSheet } from 'react-native';
import { profile } from 'console';
import { Avatar } from 'react-native-elements';
import Colors from '../constants/Colors';
import { Tabs, ScrollableTab, Tab, Text, ListItem, Card, CardItem } from 'native-base';
import { WdsfDancerData } from '../objects/wdsfData';
import { User } from '../objects/firebaseUser';
import HidingHeaderComponent from './HidingHeaderComponent';
import Barcode from 'react-native-barcode-builder';
import BackgroundImage from './BackgroundImage';
import WDSFListItem from './WDSFListItem';

export interface WDSFProfileProps {
    onProfileClicked: (id: number) => void,
    profile: WdsfDancerData,
    user: User
}

const defaultImage = require("../../assets/profile.png");

class WDSFProfile extends React.Component<WDSFProfileProps, {}> {

    render() {
        var { profile, partner } = this.props.profile;
        var { user } = this.props;

        return (
            <View style={styles.container}>
                <HidingHeaderComponent header={
                    <ImageBackground source={require("../../assets/top.png")} style={{ width: '100%', height: '100%' }} resizeMode="stretch">
                        <View>
                            <View style={{
                                width: "100%",
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
                                //onEditPress={() => this.selectImage()}
                                ></Avatar>
                            </View>
                            <View style={{
                                width: "100%",
                                paddingTop: 10,
                                alignItems: 'center',
                                flexDirection: "row",
                                justifyContent: "space-evenly"
                            }}>
                                {/* <View style={{ alignContent: "center", alignItems: "center" }}>
                                    <Text style={{ fontSize: 20, fontWeight: "700" }}>STT - {compData.VykDataStt.Trida}</Text>
                                    <Text style={{ color: Colors.blue }}>{compData.VykDataStt.Body}b, {compData.VykDataStt.FinTuz}F/{compData.VykDataStt.FinZahr}F</Text>
                                </View> */}
                                {/* <View /> */}
                                <View style={{ alignContent: "center", alignItems: "center" }}>
                                    <Text style={{ color: Colors.white }}>Národnost: {this.props.profile.profile.nationality}</Text>
                                    <Text style={{ color: Colors.white }}>Země: {this.props.profile.profile.country}</Text>
                                    <Text style={{ color: Colors.white }}>Věková skupina: {this.props.profile.profile.ageGroup}</Text>
                                </View>
                            </View>
                            {/* <View style={{
                                width: "100%",
                                position: "absolute",
                                paddingTop: "30%",
                                alignItems: 'center',
                                flexDirection: "row",
                                justifyContent: "space-evenly"
                            }}>
                                <LinearGradient style={styles.buttonContainer} start={[0, 1]} end={[1, 0]}
                                    colors={[compData.PlatneZdravProhlidky.length > 0 ? '#00ff00' : '#ff0000', 'transparent']}>
                                    <TouchableOpacity style={{
                                        width: '100%', height: '100%', flexDirection: 'row',
                                        justifyContent: 'center',
                                        alignItems: 'center',
                                    }}
                                        onPress={() => this.onHealthCheckPressed}>

                                        <Icon type="FontAwesome" name="heart" style={{ fontSize: 12, color: "black" }} />
                                        <Text style={{ fontSize: 13 }}> {compData.PlatneZdravProhlidky.length > 0 ? "✔" : "X"}</Text>
                                    </TouchableOpacity>
                                </LinearGradient>
                                <LinearGradient style={styles.buttonContainer} start={[0, 1]} end={[1, 0]}
                                    colors={['transparent', compData.Souticence ? '#00ff00' : '#ff0000']}>
                                    <TouchableOpacity style={{
                                        width: '100%', height: '100%', flexDirection: 'row',
                                        justifyContent: 'center',
                                        alignItems: 'center',
                                    }}
                                        onPress={() => this.onPayLicencePressed}>
                                        <Icon type="FontAwesome" name="id-badge" style={{ fontSize: 15, color: 'black' }} />
                                        <Text style={{ fontSize: 13 }}> {compData.Souticence ? "✔" : "X"}</Text>
                                    </TouchableOpacity>
                                </LinearGradient>
                            </View> */}
                        </View>
                    </ImageBackground>} title={this.props.profile.profile.id.toString()}>
                    <Tabs renderTabBar={() => <ScrollableTab style={{ backgroundColor: "transparent" }} backgroundColor="transparent" tabsContainerStyle={{ backgroundColor: "transparent" }} />} style={{ height: "10%", backgroundColor: "transparent" }} >
                        <Tab heading="Informace" tabStyle={{ backgroundColor: 'transparent' }} textStyle={{ color: '#000' }} activeTabStyle={{ backgroundColor: 'transparent' }} activeTextStyle={{ color: Colors.blue, fontWeight: '700', textDecorationLine: "underline", textDecorationStyle: "solid" }}>
                            <BackgroundImage>

                                <Text style={{ paddingLeft: 20 }}>Licence</Text>
                                {this.props.profile.profile.licenses.map((x, i) => {
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
                                <Barcode value={this.props.profile.profile.id.toString()} format="CODE128" />
                            </BackgroundImage>
                        </Tab>
                        {partner &&
                            <Tab heading="Partneři(ky)" tabStyle={{ backgroundColor: 'white' }} textStyle={{ color: '#000' }} activeTabStyle={{ backgroundColor: 'white' }} activeTextStyle={{ color: Colors.blue, fontWeight: 'normal', textDecorationLine: "underline", textDecorationStyle: "solid" }}>
                                <BackgroundImage>
                                    <ScrollView style={{ backgroundColor: "transparent" }}>
                                        <WDSFListItem name={partner.name + " " + partner.surname} onClick={(id: number) => this.props.onProfileClicked(id)} wdsfIdt={partner.id} />
                                    </ScrollView>
                                </BackgroundImage>
                            </Tab>}
                    </Tabs>
                </HidingHeaderComponent>
            </View >
        );
    }
    onPartnerClick(id: number): void {
        throw new Error("Method not implemented.");
    }
}

export default WDSFProfile;

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

    row: {
        flex: 1,
        flexDirection: "row"
    },
});