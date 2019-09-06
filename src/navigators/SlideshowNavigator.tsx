import * as React from 'react';
import { createStackNavigator } from 'react-navigation-stack';
import { View, Text, Button, Item, Input } from 'native-base';
import { TextInput, Image, ImageSourcePropType } from 'react-native';
import { NavigationScreenProps } from 'react-navigation';
import FirebaseWorker from '../objects/FirebaseWorker';
import WDSF from '../server/wdsfCommunicator';
import { WdsfProfile } from '../objects/wdsfData';
import CSTS from '../server/cstsCommunicator';
import { Profile } from '../objects/profileData';
import Layout from '../constants/Layout';

export interface IdPageProps {
    imagePath: ImageSourcePropType,
    name: string, 
    onNext: () => void, 
    saveId: (id: string)=> void
}

class IdPage extends React.Component<IdPageProps, {id: string}> {
    constructor(props: IdPageProps){
        super(props);
        this.state = {id: ""}
    }
    render(){
    return (
        <View style={{flex: 1, padding: 10}}>
            <Image style={{flex: 1, alignSelf: "center", resizeMode: "contain", width: Layout.window.width }} source={this.props.imagePath} />
            <View style={{paddingTop: 50, flex: 2}}><Text style={{fontSize: 20, alignSelf: "center"}}>Enter your {this.props.name}</Text>
            <Item rounded>
            <Input keyboardType="number-pad" value={this.state.id}
            style={{padding: 10, paddingVertical: 10, alignContent: "center", alignSelf: "center"}} onChangeText={(text) => this.setState({ id:text  })} placeholder={this.props.name}/>
          </Item>
          <View style={{justifyContent: "space-around", flexDirection: "row", padding: 10}} >
          <Button style={{flex: 1}} transparent block onPress={() => this.props.onNext()}><Text>Skip</Text></Button>
<Button style={{flex: 1}} success block onPress={() => this.props.saveId(this.state.id)}><Text>OK</Text></Button>
            </View>
            </View>
        </View>
    )
    }
}

const saveWdsfUser= (id: string) => {
    WDSF.getDancerProfile(id).then((profile: WdsfProfile)=> {
        FirebaseWorker.updateWDSFProfile(profile);
    })
}

const saveCstsUser= (id: string) => {
    CSTS.getDancerProfile(id).then((profile: Profile)=> {
        FirebaseWorker.updateCSTSProfile(profile);
    })
}

const WdsfPage = (navigation: NavigationScreenProps) => {
    return <IdPage name="WDSF Id" imagePath={require("../../assets/wdsf.png")} {...navigation} onNext={() => navigation.navigation.navigate("cstsInit") } saveId={(id: string)=> {saveWdsfUser(id); navigation.navigation.navigate("cstsInit")}} />
}
const CstsPage = (navigation: NavigationScreenProps) => {
    return <IdPage name="CSTS IDT" imagePath={require("../../assets/csts.jpeg")} {...navigation} onNext={() => {FirebaseWorker.setInitCompleted(); navigation.navigation.navigate("home")} } saveId={(id: string)=> {saveCstsUser(id); FirebaseWorker.setInitCompleted()}} />
}


const SlideShowNavigator = createStackNavigator({
        wdsfInit: WdsfPage,
        cstsInit: CstsPage
        }, {
             initialRouteName: "wdsfInit",
            headerMode: "none"
        })

export default SlideShowNavigator;