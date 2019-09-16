import * as React from 'react';
import { ScrollView, Text, Linking, StyleSheet } from 'react-native';
import { Card, ListItem, List } from 'native-base';
import { Image } from 'react-native-elements';
import * as MailComposer from 'expo-mail-composer';
import Colors from '../../constants/Colors';
import { deliveryClient, Prispevatel, About } from '../../objects/kenticoObjects';

export interface AboutTabProps {

}
export interface AboutTabState {
    prispevatel: Prispevatel[],
    about: About[]

}
class AboutTab extends React.Component<AboutTabProps, AboutTabState> {
    constructor(props: AboutTabProps){
        super(props);
        this.state={prispevatel:[], about:[]}
    }
componentDidMount() {
    deliveryClient.items<Prispevatel>()
    .type('prispevatele')
    .toObservable()
    .subscribe(response => {
        this.setState({ prispevatel: response.items });;
    });
    deliveryClient.items<About>()
    .type('about')
    .toObservable()
    .subscribe(response => {        
        this.setState({ about: response.items });;
    });
}

   render() {
    return (<ScrollView>
        <Card transparent style={styles.topContainer}>
            {this.state.about.length>0 && this.state.about[0].header&&<Text style={styles.header}>{this.state.about[0].header.value}</Text>}
            {this.state.about.length>0 && this.state.about[0].description&&<Text style={styles.text}>{this.state.about[0].description.value}</Text>}
            
            <Text style={styles.subheader}>Přispěvatelé</Text>
            <List>
                {this.state.prispevatel.map((item, index) => {
                    var url = item.web.value.toString();
                    
                    return <ListItem key={index} onPress={() => Linking.openURL(url)}>
                    <Image resizeMode="stretch" source={{uri: item.image && item.image.value[0].url}} style={{ height: 26, width: 26 }} />
                    {item.name && <Text style={styles.text}>{item.name.value}</Text>}
                    </ListItem>
                })}
                
            </List>
        </Card>
        <Card style={styles.bottomContainer}>
            <Text onPress={() => MailComposer.composeAsync({ recipients: ["info@tanecnisport.cz"], bccRecipients: ["Hajan39@gmail.com"], subject: "Email z aplikace Tanecnisport" })}>Created by Jan Hanč</Text>
        </Card>
    </ScrollView>);
   }
}

export default AboutTab;


const styles = StyleSheet.create({
    container: {
        flex: 1,
        flexDirection: "column",
        justifyContent: "space-between",
        padding: 10,
    },
    topContainer: {
        flexDirection: "column",
        padding: 20
    },
    bottomContainer: {
        alignItems: "center"
    },
    header: {
        fontSize: 28,
        color: Colors.header,
        alignSelf: "center"
    },
    subheader: {
        fontSize: 28,
        color: Colors.header,
        alignSelf: "center",
        paddingTop: 20
    },
    text: {
        fontSize: 15
    }
})