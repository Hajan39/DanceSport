import * as React from 'react';
import { ImageBackground, Text, View, TouchableOpacity, ImageURISource } from "react-native";
import { Avatar } from 'react-native-elements';
import { CompData } from '../objects/profileData';
import { StyleSheet } from 'react-native';
import { Icon } from 'native-base';
import Colors from '../constants/Colors';
import { LinearGradient } from 'expo-linear-gradient';
import FirebaseWorker from '../objects/FirebaseWorker';
import { GroupType } from "../objects/GroupTypes"
import { WdsfProfile } from '../objects/wdsfData';

export interface ProfileHeaderProps { compData?: CompData, id: number, groupType: GroupType, profile?: WdsfProfile }

export default class ProfileHeader extends React.Component<ProfileHeaderProps, { image: ImageURISource }> {
    constructor(props: ProfileHeaderProps) {
        super(props);
        this.state = { image: require("../../assets/profile.png") };
    }

    componentDidMount() {
        switch (this.props.groupType) {
            case GroupType.CSTS:
                FirebaseWorker.getCstsDataByIdt(this.props.id).then(x => {     
                    if (x && x.photoUrl)
                        this.setState({ image: { uri: x.photoUrl } });
                })
                break;
                case GroupType.WDSF:
                    FirebaseWorker.getWdsfDataByIdt(this.props.id).then(x => {
                        if (x && x.photoUrl)
                            this.setState({ image: { uri: x.photoUrl } });
                    })
                    break;
            
            default:
                break;
        }
        
    }


    render() {

        const { compData, profile } = this.props;
        return (
            <ImageBackground source={require("../../assets/top.png")} style={{ width: '100%', height: 200 }} resizeMode="stretch">
                <View>
                    <View style={{
                        width: "100%",
                        position: "absolute",
                        paddingTop: '8%',
                        alignItems: 'center',
                    }}>
                        <Avatar
                            rounded
                            imageProps={{
                                resizeMode: 'contain'
                            }}
                            overlayContainerStyle={{ borderWidth: 2, borderColor: Colors.white, borderRadius: 20 }}
                            source={this.state.image}
                            size="large"
                        ></Avatar>
                    </View>
                    {compData && <View style={{
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
                    </View>}
                    {this.props.groupType == GroupType.WDSF &&
                        <View style={{
                            width: "100%",
                            paddingTop: 120,
                            alignItems: 'center',
                            flexDirection: "row",
                            justifyContent: "space-evenly"
                        }}>
                            <View style={{ alignContent: "center", alignItems: "center" }}>
                                <Text style={{ color: Colors.white }}>Národnost: {profile.nationality}</Text>
                                <Text style={{ color: Colors.white }}>Země: {profile.country}</Text>
                                <Text style={{ color: Colors.white }}>Věková skupina: {profile.ageGroup}</Text>
                            </View>
                    </View> }
                    {compData && <View style={{
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
                        </View>}
                </View>
            </ImageBackground>)
    }
};

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