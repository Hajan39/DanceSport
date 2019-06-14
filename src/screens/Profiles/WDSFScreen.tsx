import * as React from 'react';
import firebase from 'firebase';
import { NavigationScreenProps } from 'react-navigation';
import { ActionSheet, Left, Title, Body, Right, Header, Button, Icon } from 'native-base';
import { Permissions, ImagePicker } from 'expo';
import { WdsfDancerData } from '../../objects/wdsfData';
import FirebaseWorker from '../../objects/FirebaseWorker';
import WDSF from '../../server/wdsfCommunicator';
import Colors from '../../constants/Colors';
import WDSFProfile from '../../components/WDSFProfile';
import LoadingPage from '../../objects/loadingPage';
import { User } from '../../objects/firebaseUser';
import BackgroundImage from '../../components/BackgroundImage';
import { Overlay } from 'react-native-elements';
import { View, Text } from 'react-native';
import Layout from '../../constants/Layout';
import QRCode from 'react-native-qrcode';

export interface WDSFScreenProps extends NavigationScreenProps {

}

export interface WDSFScreenState {
    user: User | undefined,
    currentUser: firebase.User
    wdsfprofile: WdsfDancerData | undefined,
    isOverlayVisible: boolean
}

class WDSFScreen extends React.Component<WDSFScreenProps, WDSFScreenState> {
    constructor(props: WDSFScreenProps) {
        super(props);
        var user = firebase.auth().currentUser
        if (user == null) {
            this.props.navigation.navigate("tabs")
        } else
            this.state = { user: undefined, currentUser: user, wdsfprofile: undefined, isOverlayVisible: false }
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

    selectImage = (): void => {
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

    wdsfProfileClick(id: number): void {
        console.log("partnerClick", id)
        this.props.navigation.push("wdsfScreen", { id: id })
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
    toggleFavorites = () => {
        if (this.state.wdsfprofile)
            FirebaseWorker.toggleWDSFFavorites(this.state.wdsfprofile.profile.id)
    }
    componentDidMount() {
        this.props.navigation.setParams({
            toggleFavorites: () => this.toggleFavorites()
        });
        var { params } = this.props.navigation.state;
        if (params && params.id) {

            WDSF.getDancerAllData(params.id).then((data) => {
                this.setState({ wdsfprofile: data });
                this.props.navigation.setParams({
                    name: data.profile.name + " " + data.profile.surname,
                    isMe: false
                })
            })
        }
        else {
            FirebaseWorker.getUserData(this.state.currentUser).then((userData: User) => {

                WDSF.getDancerAllData(userData.wdsfId).then((dancerData: WdsfDancerData) => {
                    this.setState({ wdsfprofile: dancerData, user: userData });
                    this.props.navigation.setParams({
                        name: dancerData.profile.name + " " + dancerData.profile.surname,
                        isMe: true
                    })
                })
            }
            )
        }

    }
    render() {
        if (this.state.wdsfprofile) {
            return (
                <BackgroundImage>

                    <WDSFProfile profile={this.state.wdsfprofile} user={this.state.user} onProfileClicked={(id: number) => this.wdsfProfileClick(id)} ></WDSFProfile>

                </BackgroundImage>
            );
        }
        else
            return LoadingPage("Načítání profilu");
    }
}

export default WDSFScreen;