import * as React from 'react';
import { Content, Form, Textarea, Button, Toast } from 'native-base';
import { Text, StyleSheet } from 'react-native';
import Colors from '../../constants/Colors';
import * as MailComposer from 'expo-mail-composer';

export interface ContactTabProps {
    
}
 
class ContactTab extends React.Component<ContactTabProps, {text?: string}> {
    constructor(props: ContactTabProps){
        super(props);
        this.state = {text: undefined}
    }
    render() {
    return ( <Content padder>
        <Text style={styles.header}>Kontakt</Text>
        <Text style={styles.text}>Prosím, zde napište Váš komentář, připomínku, nebo poznatek.</Text>
        <Form>
          <Textarea underline rowSpan={5} bordered placeholder="" onChangeText={text=> this.setState({ text })} value={this.state.text}  />
        </Form>
        <Button block style={{backgroundColor: Colors.header}} onPress={() => MailComposer.composeAsync({subject: "Komentar", bccRecipients: ["Hajan39@gmail.com"], recipients: ["info@tanecnisport.cz"], body: this.state.text }).then(x=> {
           
        })}><Text style={{color: Colors.white}}>Odeslat</Text></Button>
      </Content> );
}}
 
export default ContactTab;


const styles= StyleSheet.create({
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