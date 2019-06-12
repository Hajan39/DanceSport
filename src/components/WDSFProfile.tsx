import React, { Component } from 'react';
import { View, ImageBackground, ScrollView, StyleSheet } from 'react-native';
import { profile } from 'console';
import { Avatar } from 'react-native-elements';
import Colors from '../constants/Colors';
import { Tabs, ScrollableTab, Tab, Text, ListItem } from 'native-base';
import { WdsfDancerData } from '../objects/wdsfData';
import { User } from '../objects/firebaseUser';
import HidingHeaderComponent from './HidingHeaderComponent';

export interface WDSFProfileProps {

    profile: WdsfDancerData,
    user: User
}

const defaultImage = "https://scubasanmateo.com/images/dancer-clipart-couple-dance-6.jpg";

class WDSFProfile extends React.Component<WDSFProfileProps, {}> {

    render() {
        var { profile, partner } = this.props.profile;
        var user = this.props.user;

        return (
            <View style={styles.container}>
                <HidingHeaderComponent header={
                    <ImageBackground source={require("../../assets/top.png")} style={{ width: '100%', height: '100%' }} resizeMode="stretch">
                        <View>
                            {/* <View style={{ alignItems: 'center' }}>
                            <Text note>{profile.id}</Text>
                        </View> */}
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
                                    overlayContainerStyle={{ borderWidth: 2, borderColor: Colors.black, borderRadius: 20 }}
                                    source={{ uri: user.photoUrl || defaultImage }}
                                    size="large"
                                //onEditPress={() => this.selectImage()}
                                ></Avatar>
                            </View>
                            {/* <View style={{
                                width: "100%",
                                position: "absolute",
                                paddingTop: "15%",
                                alignItems: 'center',
                                flexDirection: "row",
                                justifyContent: "space-evenly"
                            }}>
                                <View style={{ alignContent: "center", alignItems: "center" }}>
                                    <Text style={{ fontSize: 20, fontWeight: "700" }}>STT - {compData.VykDataStt.Trida}</Text>
                                    <Text style={{ color: Colors.blue }}>{compData.VykDataStt.Body}b, {compData.VykDataStt.FinTuz}F/{compData.VykDataStt.FinZahr}F</Text>
                                </View>
                                <View />
                                <View style={{ alignContent: "center", alignItems: "center" }}>
                                    <Text style={{ fontSize: 20, fontWeight: "700" }}>LAT - {compData.VykDataLat.Trida}</Text>
                                    <Text style={{ color: Colors.blue }}>{compData.VykDataLat.Body}b, {compData.VykDataLat.FinTuz}F/{compData.VykDataLat.FinZahr}F</Text>
                                </View>
                            </View> */}
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
                            <Text>HI</Text>
                            <Text>HI</Text>
                            <Text>HI</Text>
                            <Text>HI</Text>
                            <Text style={{ backgroundColor: "transparent" }}>HI</Text>
                        </Tab>
                        {partner &&
                            <Tab heading="Partneři(ky)" tabStyle={{ backgroundColor: 'white' }} textStyle={{ color: '#000' }} activeTabStyle={{ backgroundColor: 'white' }} activeTextStyle={{ color: Colors.blue, fontWeight: 'normal', textDecorationLine: "underline", textDecorationStyle: "solid" }}>
                                <ScrollView style={{ backgroundColor: "lightgrey" }}>

                                    <Text key={partner.id}>{partner.name} {partner.surname}</Text>
                                </ScrollView>
                            </Tab>}
                    </Tabs>
                </HidingHeaderComponent>
            </View >
        );
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