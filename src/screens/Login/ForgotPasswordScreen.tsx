import * as React from 'react';
import { Component } from 'react';
import LoadingPage from '../../objects/loadingPage';
import { KeyboardAvoidingView, TouchableOpacity, Alert } from 'react-native';
import { View, List, ListItem, Text, Button } from 'native-base';
import { Image, Divider } from 'react-native-elements';
import { TextInput } from 'react-native-gesture-handler';
import Colors from '../../constants/Colors';
import { NavigationScreenProps } from 'react-navigation';
import FirebaseWorker from '../../objects/FirebaseWorker';

export interface ForgotPasswordScreenProps extends NavigationScreenProps {

}

export interface ForgotPasswordScreenState {
    loading: boolean,
    email: string,
    error: string | null
}

class ForgotPasswordScreen extends React.Component<ForgotPasswordScreenProps, ForgotPasswordScreenState> {
    constructor(props: ForgotPasswordScreenProps) {
        super(props);
        this.state = { loading: true, email: "", error: null };
    }

    componentDidMount() {
        this.setState({ loading: true })
    }
    render() {
        if (this.state.loading)
            return LoadingPage("Přihlašování")
        return (<KeyboardAvoidingView style={{ flex: 1, flexDirection: "column" }} behavior="padding" enabled>
            <Image source={require("../../../assets/logo.png")} resizeMode="contain" style={{ alignContent: "center", alignItems: "center", alignSelf: "center", width: '90%', flex: 1 }} />
            <Divider />
            <View style={{ flex: 1 }}>
                <List>
                    <ListItem >
                        <Text style={{ flex: 1 }}>Email</Text>
                        <TextInput keyboardType="email-address" style={{ flex: 3 }} placeholder="john@email.cz" value={this.state.email} onChangeText={(email) => this.setState({ email })}></TextInput>
                    </ListItem>

                    {this.state.error && <ListItem noBorder>
                        <Text style={{ color: Colors.red }}>{this.state.error}</Text>
                    </ListItem>}
                </List>
                <View style={{ width: '100%', alignContent: "center", alignItems: "center" }}>
                    <Button block info style={{ width: '80%', alignSelf: "center", borderRadius: 5 }} onPress={() => this.onSendPass()}>
                        <Text>Přihlásit se</Text>
                    </Button>
                </View>
                <View style={{ flexDirection: "row", alignContent: "center", justifyContent: "space-evenly" }}><Text>Nemáte účet?</Text>
                    <TouchableOpacity onPress={() => this.props.navigation.navigate("register")}>
                        <Text style={{ color: Colors.blue }}>Zaregistrujte se.</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </KeyboardAvoidingView>);
    }
    onSendPass(): void {
        FirebaseWorker.resetPass(this.state.email);
        Alert.alert("Obnoveni bylo odeslano na Vas email");
        this.props.navigation.navigate("login");
    }
}

export default ForgotPasswordScreen;