import * as React from 'react';
import { ScrollView, Text, Linking, StyleSheet } from 'react-native';
import { Card, ListItem, List } from 'native-base';
import { Image } from 'react-native-elements';
import * as MailComposer from 'expo-mail-composer';
import Colors from '../../constants/Colors';

export interface AboutTabProps {
    
}
 
const AboutTab: React.SFC<AboutTabProps> = () => {
    return (  <ScrollView>
        <Card transparent style={styles.topContainer}>
        <Text style={styles.header}>O aplikaci Taneční sport</Text>
        <Text style={styles.text}>Tato aplikace byla vyvinuta na základě jednoho nápadu, který se zrodil, aby každý taneční, a i každý příznivce tance, mohl mít informace, které potřebuje stále u sebe, v telfonu.
        Po zpřístupnění od WDSF se nám podařilo implementovat první zdroj a následně i ČSTS. </Text>
        <Text style={styles.text}>Jelikož aplikaci vyvíjí poze parta nadšenců, umístili jsme do aplkace několik reklam, které nám pomohou alespoň část investovaného času dostat zpět. Také bychom byli rádi za příspěvek od Vás, který by pomohl k dalšímu rozšíření a rozvoji aplikace.</Text>
        <Text style={styles.text}>Příspěvek nemusá to být jen finanční. Můžete se také zapojit do vývoje aplikace tím, že navrhnete, co by ještě aplikace mohla zobrazovat. Také pokud máte nějaký spolek, který chcete zobrazit zde v aplikaci, prosím ozvěte se nám.</Text>

        <Text style={styles.subheader}>Přispěvatelé</Text>
        <List>
            <ListItem onPress={() => Linking.openURL("http://dancesportfamily.cz/")}>
                 <Image resizeMode="stretch" source={require("../../../assets/logo.png")} style={{height: 26, width: 26}} />
                <Text style={styles.text}>Podpora, informace - DancesportFamily</Text></ListItem>
                </List>
        </Card>
        <Card style={styles.bottomContainer}>
            <Text onPress={() => MailComposer.composeAsync({recipients: ["info@tanecnisport.cz"],bccRecipients: ["Hajan39@gmail.com"], subject: "Email z aplikace Tanecnisport"})}>Created by Jan Hanč</Text> 
        </Card>
        </ScrollView>);
}
 
export default AboutTab;


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