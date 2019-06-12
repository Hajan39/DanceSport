import * as React from 'react';
import { DancerData } from '../objects/profileData';
import { NavigationScreenProps } from 'react-navigation';
import CSTS from '../server/cstsCommunicator';
import { ImagePicker, Permissions } from 'expo';
import FirebaseWorker from '../objects/FirebaseWorker';
import { ActionSheet, Tabs, Tab, Left, Body, Right, Container, Header, Title, TabHeading, Text, ScrollableTab } from 'native-base';
import { User } from '../objects/firebaseUser';
import LoadingPage from '../objects/loadingPage';
import firebase from 'firebase';
import Colors from '../constants/Colors';
import CSTSProfile from '../components/CSTSProfile';
import WDSFProfile from '../components/WDSFProfile';
import WDSF from '../server/wdsfCommunicator';
import { WdsfDancerData } from '../objects/wdsfData';
export interface ProfileScreenProps extends NavigationScreenProps {

}

export interface ProfileScreenState {
    profile: DancerData | undefined,
    user: User | undefined,
    currentUser: firebase.User
    wdsfprofile: WdsfDancerData | undefined
}

class ProfileScreen extends React.Component<ProfileScreenProps, ProfileScreenState> {
    constructor(props: ProfileScreenProps) {
        super(props);
        var user = firebase.auth().currentUser
        if (user == null) {
            this.props.navigation.navigate("home")
        } else
            this.state = { profile: undefined, user: undefined, currentUser: user, wdsfprofile: undefined }
    }

    static navigationOptions = ({ navigation }: NavigationScreenProps) => {
        return {
            header: null
        }
    };


    onPayLicencePressed = () => {
        console.log("PayLicence Pressed");
    };

    partnerClicked = (partnerIdt: any) => {
        this.props.navigation.navigate("profile", { idt: partnerIdt })
    };

    onHealthCheckPressed = () => {
        console.log("HealthCheck pressed");
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

    componentDidMount() {
        var { params } = this.props.navigation.state;
        if (params && params.idt) {
            CSTS.getDancerAllData(params.idt).then((data) => {
                this.setState({ profile: data });
                this.props.navigation.setParams({
                    name: data.profile.Jmeno + " " + data.profile.Prijmeni
                })
            })
            WDSF.getDancerAllData(params.min).then((data) => {
                this.setState({ wdsfprofile: data });
                this.props.navigation.setParams({
                    name: data.profile.name + " " + data.profile.surname
                })
            })
        }
        else {
            FirebaseWorker.getUserData(this.state.currentUser).then((userData: User) => {
                CSTS.getDancerAllData(userData.cstsIdt).then((dancerData: DancerData) => {
                    this.setState({ profile: dancerData, user: userData });
                    this.props.navigation.setParams({
                        name: dancerData.profile.Jmeno + " " + dancerData.profile.Prijmeni
                    })
                })
                WDSF.getDancerAllData(userData.wdsfId).then((dancerData: WdsfDancerData) => {
                    this.setState({ wdsfprofile: dancerData, user: userData });

                })
            }
            )
        }

    }

    render() {
        if (this.state.profile && this.state.user && this.state.wdsfprofile) {
            var { profile } = this.state.profile;
            return (
                <Container>
                    <Header hasTabs style={{ backgroundColor: Colors.blue }}>
                        <Left />
                        <Body style={{ alignContent: "center" }}>
                            <Title>{profile.Jmeno + " " + profile.Prijmeni}</Title>
                        </Body>
                        <Right />
                    </Header>
                    <Tabs locked tabBarUnderlineStyle={{ height: 1 }} renderTabBar={() => <ScrollableTab style={{ borderWidth: 0, backgroundColor: Colors.blue }} />} >
                        <Tab activeTabStyle={{ borderWidth: 0 }} heading={<TabHeading style={{ backgroundColor: Colors.blue }}>
                            <Title style={{ color: '#ffffff' }} >ČSTS</Title>
                            <Text note style={{ color: '#ffffff' }}>{this.state.user.cstsIdt}</Text>
                        </TabHeading>} >
                            <CSTSProfile
                                onHealthCheckPressed={() => this.onHealthCheckPressed()}
                                profile={this.state.profile}
                                onPayLicencePressed={() => this.onPayLicencePressed()}
                                partnerClicked={(idt: string | number) => this.partnerClicked(idt)}
                                user={this.state.user}
                                selectImage={() => this.selectImage()}></CSTSProfile>
                        </Tab>
                        <Tab heading={<TabHeading style={{ backgroundColor: Colors.blue }} >
                            <Title style={{ color: '#ffffff' }} >WDSF</Title>
                            <Text note style={{ color: '#ffffff' }}>{this.state.user.wdsfId}</Text>
                        </TabHeading>} >
                            <WDSFProfile profile={this.state.wdsfprofile} user={this.state.user} ></WDSFProfile>
                        </Tab>

                    </Tabs>
                </Container>
            );
        }
        else
            return LoadingPage("Načítání profilu");

    }
    parseDate(dateString: string): string {
        var date: Date = new Date(dateString);
        return date.getDate() + ". " + (date.getMonth() + 1) + ". " + date.getFullYear();
    }
}

export default ProfileScreen;

