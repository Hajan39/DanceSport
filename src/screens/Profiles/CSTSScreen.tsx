import * as React from 'react';
import { Component } from 'react';
import { ActionSheet, Icon, View, Text, Button } from 'native-base';

import firebase from 'firebase';
import { NavigationScreenProps } from 'react-navigation';
import { ImagePicker, Permissions } from 'expo';
import { DancerData } from '../../objects/profileData';
import CSTS from '../../server/cstsCommunicator';
import FirebaseWorker from '../../objects/FirebaseWorker';
import Colors from '../../constants/Colors';
import CSTSProfile from '../../components/CSTSProfile';
import LoadingPage from '../../objects/loadingPage';
import { User } from '../../objects/firebaseUser';
import BackgroundImage from '../../components/BackgroundImage';
import QRCode from 'react-native-qrcode';
import { Overlay } from 'react-native-elements';
import Layout from '../../constants/Layout';

export interface CSTSScreenProps extends NavigationScreenProps {

}

export interface CSTSScreenState {
    profile: DancerData | undefined,
    user: User | undefined,
    currentUser: firebase.User,
    isOverlayVisible: boolean
}

class CSTSScreen extends React.Component<CSTSScreenProps, CSTSScreenState> {
    constructor(props: CSTSScreenProps) {
        super(props);
        var user = firebase.auth().currentUser
        if (user == null) {
            this.props.navigation.navigate("tabs")
        } else
            this.state = { profile: undefined, user: undefined, currentUser: user, isOverlayVisible: false }
    }
    static navigationOptions = ({ navigation }: NavigationScreenProps) => {
        const { params } = navigation.state;
        return {
            title: navigation.state.params && navigation.state.params.name || 'Profil',
            headerStyle: {
                backgroundColor: Colors.header,
                borderBottomWidth: 0,
                shadowColor: 'transparent'
            },
            headerRight: (<>
                {params && !params.isMe && <Icon
                    style={{ paddingRight: 20 }}
                    name="heart"
                    fontSize={25}
                    color="red"
                    type="FontAwesome"
                    onPress={() => params.toggleFavorites()} />}
                <Icon
                    style={{ paddingRight: 20 }}
                    name="qrcode"
                    fontSize={25}
                    color="white"
                    type="FontAwesome"
                    onPress={() => params.viewQrCode()} />
            </>
            )
        }
    };
    viewQrCode = () => {
        this.setState({ isOverlayVisible: true });
    }
    toggleFavorites = () => {
        if (this.state.profile)
            FirebaseWorker.toggleCSTSFavorites(this.state.profile.profile.IdtClena)
    }
    componentDidMount() {
        this.props.navigation.setParams({
            viewQrCode: () => this.viewQrCode(),
            toggleFavorites: () => this.toggleFavorites()
        });
        var { params } = this.props.navigation.state;
        if (params && params.idt) {
            CSTS.getDancerAllData(params.idt).then((data) => {
                this.setState({ profile: data });
                this.props.navigation.setParams({
                    name: data.profile.Jmeno + " " + data.profile.Prijmeni,
                    isMe: false
                })
            })
            FirebaseWorker.getCstsDataByIdt(params.idt).then((user) => {
                this.setState({ user: user });
            })

        }
        else {
            FirebaseWorker.getUserData(this.state.currentUser).then((userData: User) => {
                CSTS.getDancerAllData(userData.cstsIdt).then((dancerData: DancerData) => {
                    this.setState({ profile: dancerData, user: userData });
                    this.props.navigation.setParams({
                        name: dancerData.profile.Jmeno + " " + dancerData.profile.Prijmeni,
                        isMe: true

                    })
                })
            })
        }

    }
    partnerClicked = (partnerIdt: number | string) => {
        console.log("partnerClick", partnerIdt)
        this.props.navigation.push("cstsScreen", { idt: partnerIdt })
    };
    selectImage(): void {
        console.log("imageSelected")
        var BUTTONS = ["Vybrat ze souboru", "Vyfotit", "Zrušit"];
        var CANCEL_INDEX = 3;
        ActionSheet.show(
            {
                options: BUTTONS,
                cancelButtonIndex: CANCEL_INDEX,
                title: "Vyberte obrázek"
            },
            async buttonIndex => {
                switch (buttonIndex) {
                    case 0:
                        this._pickImage(true)
                        break;
                    case 1:
                        await Permissions.askAsync(Permissions.CAMERA, Permissions.CAMERA_ROLL);
                        this._pickImage(false)
                    default:
                        break;
                }
            }
        )

    }
    _pickImage = async (image: boolean) => {
        const options = {
            allowsEditing: true,

            aspect: [1, 1] as [number, number],
        };
        let result = image ? await ImagePicker.launchImageLibraryAsync(options) : await ImagePicker.launchCameraAsync(options);

        if (!result.cancelled && this.state.user) {
            var url = await FirebaseWorker.uploadImage(result.uri, this.state.user);
            this.setState({
                user: {
                    ...this.state.user,
                    photoUrl: url
                }
            })
        }
    };

    render() {
        if (this.state.profile) {
            return (
                <BackgroundImage>
                    {this.state.user && <Overlay
                        windowBackgroundColor="rgba(150, 100, 255, .5)"
                        overlayBackgroundColor="red"
                        borderRadius={25}
                        animationType="fade"
                        fullScreen={false}
                        transparent
                        isVisible={this.state.isOverlayVisible}
                        overlayStyle={{ justifyContent: "center", backgroundColor: "blue" }}
                        containerStyle={{ backgroundColor: "red" }}
                        onBackdropPress={() => this.setState({ isOverlayVisible: false })}
                        width={Layout.window.width * 0.9}
                        height={Layout.window.height * 0.9}
                    >
                        <View style={{ width: Layout.window.width * 0.9, height: Layout.window.height * 0.9, justifyContent: "center", alignItems: "center", flexDirection: "column" }}>
                            <QRCode
                                value={this.state.user.firebaseId}
                                //Setting the value of QRCode
                                size={Layout.window.width * 0.8}
                                //Size of QRCode
                                bgColor="#000"
                                //Backgroun Color of QRCode
                                fgColor="#fff"
                            //Front Color of QRCode
                            />
                            <Button style={{ marginTop: 50 }} block info onPress={() => this.setState({ isOverlayVisible: false })}>
                                <Text>Zavřít</Text>
                            </Button>
                        </View>
                    </Overlay>}

                    <CSTSProfile
                        //onHealthCheckPressed={() => this.onHealthCheckPressed()}
                        profile={this.state.profile}
                        //onPayLicencePressed={() => this.onPayLicencePressed()}
                        partnerClicked={(idt: string | number) => this.partnerClicked(idt)}
                        user={this.state.user}
                        selectImage={() => this.selectImage()}></CSTSProfile>

                </BackgroundImage>
            );
        }
        else
            return LoadingPage("Načítání profilu");
    }
}

export default CSTSScreen;