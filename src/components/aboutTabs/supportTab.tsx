import * as React from 'react';
import { Text, StyleSheet, ScrollView } from 'react-native';
import Colors from '../../constants/Colors';
import { Image } from 'react-native-elements';
import { User } from '../../objects/firebaseUser';
import Layout from '../../constants/Layout';

export interface SupportTabProps {
    user?: User
}

const SupportTab: React.SFC<SupportTabProps> = (props) => {
    return (
        <ScrollView style={styles.container}>
            <Text style={styles.header}>Podpořte vývoj aplikace</Text>
            <Text style={styles.text}>Částku si prosím upravte dle svých možností.</Text>
            <Image style={{ width: Layout.window.width * 0.8, height: Layout.window.width * 0.8, alignSelf: "center" }} source={{ uri: "http://api.paylibo.com/paylibo/generator/czech/image?accountNumber=1020648191&bankCode=6100&amount=100.00&currency=CZK&vs=91&message=AppSupportFrom" + props.user.email }} />
        </ScrollView>
    );
}

export default SupportTab;


const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignSelf: "center",
        alignContent: "center"

    },

    header: {
        fontSize: 28,
        color: Colors.header,
        alignSelf: "center"
    },
    text: {
        fontSize: 15
    }
})