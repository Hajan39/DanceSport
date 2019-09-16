import React, { Component } from 'react';
import { NavigationActions, } from 'react-navigation';
import { ScrollView, StyleSheet, Text, View, SafeAreaView, StatusBar } from 'react-native';
import { User } from '../objects/firebaseUser';
import { Avatar, Overlay, Divider } from 'react-native-elements';
import Colors from '../constants/Colors';
import { ActionSheet, Button, Icon } from 'native-base';
import * as Permissions from 'expo-permissions';
import * as ImagePicker from 'expo-image-picker'
import FirebaseWorker from '../objects/FirebaseWorker';
import Layout from '../constants/Layout';
import QRCode from 'react-native-qrcode';
import CustomIcon from '../CustomIcon';
import { ComponentBase } from 'resub';
import UserStore from '../strores/UserStore';
import Login from '../functions/loginFunctions';
import { deliveryClient, Shop } from '../objects/kenticoObjects';
import { log } from 'util';

export interface SideMenuProps {
    updateImage: (url: string) => void
}
export interface SideMenuState {
    data?: User,
    isOverlayVisible: boolean,
    visibility?: {csts: boolean, wdsf: boolean},
    shops?: Shop[]
}
class SideMenu extends ComponentBase<SideMenuProps, SideMenuState> {
    protected _buildState(props: SideMenuProps, initialBuild: boolean): SideMenuState {
        return {
            data: UserStore.getUser(),
            isOverlayVisible: false,
            visibility: UserStore.getVisibleSettings(),
        }
    }

    componentDidMount() {
        deliveryClient.items<Shop>()
        .type('shop')
        .toObservable()
        .subscribe(response => {            
            this.setState({ shops: response.items });;
        });        
    }

    navigateToScreen = (route: string, props?: any) => () => {
        const navigateAction = NavigationActions.navigate({
            routeName: route,
            params: props
        });
        
        this.props.navigation.dispatch(navigateAction);
    }
    viewQrCode = () => {
        this.setState({ isOverlayVisible: true });
    }
    selectImage(): void {
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
                            const permission = await Permissions.getAsync(Permissions.CAMERA_ROLL);
                            if (permission.status !== 'granted') {
                                const newPermission = await Permissions.askAsync(Permissions.CAMERA_ROLL);
                                if (newPermission.status === 'granted') {
                                    this._pickImage(false)
                                }
                            } 
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

        if (!result.cancelled && this.state.data) {
            var url = await FirebaseWorker.uploadImage(result.uri, this.state.data);
            this.props.updateImage(url)
        }
    };
    render() {
        const defaultImage = require("../../assets/profile.png");

        return (
            <SafeAreaView style={styles.container}>
                {this.state.data && <Overlay
                    borderRadius={25}
                    animationType="fade"
                    fullScreen={false}
                    transparent
                    isVisible={this.state.isOverlayVisible}
                    overlayStyle={{ justifyContent: "center" }}
                    onBackdropPress={() => this.setState({ isOverlayVisible: false })}
                    width={Layout.window.width * 0.9}
                    height={Layout.window.height * 0.9}
                >
                    <View style={{ justifyContent: "center", alignItems: "center", flexDirection: "column" }}>
                        <Text>Tento kód ukažte při vstupu na soutěž, nebo jinou podporovanou akci tanečního sportu</Text>
                        <QRCode
                            value={this.state.data.firebaseId}
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
                <ScrollView>
                    {this.state.data && <View style={styles.headerContainer}>
                        <View style={{ flex: 1, width: 280, flexDirection: 'row' }} >
                            <Avatar
                                showEditButton
                                editButton={{ name: "camera" }}
                                rounded
                                imageProps={{
                                    resizeMode: 'contain'
                                }}
                                overlayContainerStyle={{ borderWidth: 2, borderColor: Colors.white, borderRadius: 20 }}
                                source={this.state.data.photoUrl ? { uri: this.state.data.photoUrl } : defaultImage}
                                size="large"
                                onEditPress={() => this.selectImage()}
                                onPress={() => this.selectImage()}
                            ></Avatar>
                            <View style={{ paddingLeft: 10 }}>
                                <Text style={styles.name}>{this.state.data.name}</Text>
                                <Text style={styles.headerText}>{this.state.data.email}</Text>
                            </View>
                            {/* <Icon
                                style={{ paddingRight: 20, color: Colors.white }}
                                name="qrcode"
                                fontSize={25}
                                color={Colors.white}

                                type="FontAwesome"
                                onPress={() => this.viewQrCode()} /> */}
                        </View>

                    </View>}
                    <Divider />

                    <View>
                        <Button icon full transparent style={{ justifyContent: "flex-start" }} block onPress={this.navigateToScreen('Home')} >
                            <Icon style={{ color: Colors.darkGrey }} type="FontAwesome" name="newspaper-o" />
                            <Text style={{ color: Colors.darkGrey }}>Novinky</Text>
                        </Button>
                        <Text style={styles.sectionHeadingStyle}>Svazy a federace</Text>
                        {this.state.visibility&&this.state.visibility.csts && <Button icon full transparent style={{ justifyContent: "flex-start" }} block onPress={this.navigateToScreen('CSTS')} >
                            <CustomIcon size={26} style={{ paddingHorizontal: 15, color: Colors.darkGrey }} name="csts" />
                            <Text style={{ color: Colors.darkGrey }}>ČSTS</Text>
                        </Button>}
                        {this.state.visibility&&this.state.visibility.wdsf && <Button icon full transparent style={{ justifyContent: "flex-start" }} block onPress={this.navigateToScreen('WDSF')} >
                            <CustomIcon size={26} style={{ paddingHorizontal: 15, color: Colors.darkGrey }} name="wdsf" />
                            <Text style={{ color: Colors.darkGrey }}>WDSF</Text>
                        </Button>}
                        <Divider />
                        <Button icon full transparent style={{ justifyContent: "flex-start" }} block onPress={this.navigateToScreen('About')} >
                            <Icon style={{ color: Colors.darkGrey }} type="FontAwesome" name="info" />
                            <Text style={{ color: Colors.darkGrey }}>O aplikaci</Text>
                        </Button>
                    </View>
                </ScrollView>
                <Button icon full transparent style={{ justifyContent: "flex-start" }} block onPress={this.navigateToScreen('Settings')} >
                    <Icon style={{ color: Colors.darkGrey }} type="MaterialIcons" name="settings" />
                    <Text style={{ color: Colors.darkGrey }}>Nastavení</Text>
                </Button>
                <Button iconRight style={styles.footerContainer} onPress={() => Login.signOut().then(() => FirebaseWorker.logout())}>
                    <Text style={{ color: Colors.darkGrey }}>Odhlásit se</Text>
                    <Icon style={{ color: Colors.darkGrey }} type="FontAwesome" name="sign-out" />
                </Button>
            </SafeAreaView>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        paddingTop: StatusBar.currentHeight,
        backgroundColor: Colors.white,
        flex: 1
    },
    headerContainer: {
        paddingTop: 5,
        backgroundColor: Colors.white,
        height: 100,
        flexDirection: "row"
    },
    name: {
        color: Colors.darkGrey,
        fontSize: 25
    },
    headerText: {
        color: Colors.darkGrey,
    },
    navItemStyle: {
        padding: 10
    },
    navSectionStyle: {
        backgroundColor: Colors.grey,
        color: Colors.black
    },
    sectionHeadingStyle: {
        backgroundColor: Colors.grey,
        color: Colors.white,
        fontWeight: "bold",
        paddingVertical: 15,
        paddingHorizontal: 5
    },
    footerContainer: {
        padding: 20,
        color: Colors.white,
        backgroundColor: Colors.white,
        justifyContent: "space-between",
        flexDirection: "row"
    }
});

export default SideMenu;