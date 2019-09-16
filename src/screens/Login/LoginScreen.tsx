import { Button, List, ListItem, Icon } from 'native-base';
import * as React from 'react';
import { Image, KeyboardAvoidingView, Text, TextInput, TouchableOpacity, View, Alert } from 'react-native';
import { Divider } from 'react-native-elements';
import FirebaseWorker from '../../objects/FirebaseWorker';
import Colors from '../../constants/Colors';
import LoadingPage from '../../objects/loadingPage';
import { NavigationScreenProps } from 'react-navigation';
import Login from '../../functions/loginFunctions';

export interface LoginScreenState {
    email: string,
    password: string,
    error?: string,
    loading: boolean
}

class LoginScreen extends React.Component<NavigationScreenProps, LoginScreenState> {
    constructor(props: NavigationScreenProps) {
        super(props);
        this.state = {
            email: "",
            password: "",
            loading: true
        }
    }
    componentDidMount() {
        this.setState({ loading: false });
    }

    onLoginOrRegister = () => {
        this.setState({ loading: true });
        Login.loginGoogleUser(FirebaseWorker.updateLogin).then(result => {
            this.setState({ loading: result.success, error: "Přerušili jste zadávání. Opakujte prosím." });
        }).catch(error => {
            this.setState({ loading: false, error: error.message });

        })

    }

    onVerifyUser = async () => {
        this.setState({ loading: true });
        const { email, password } = this.state;
        if (email.length > 0 && password.length > 0) {
            Login.loginUserWithEmailAndPassword(email, password).then(user => {
                if (user)
                    return FirebaseWorker.updateLogin(user)
                else
                    throw "User not found";
            }).catch(error => {
                this.setState({ error: error, loading: false })
            });
        } else {
            this.setState({ error: "Musíte vyplnit email a heslo", loading: false })
        }
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
                    <ListItem>
                        <Text style={{ flex: 1 }}>Heslo</Text>
                        <TextInput secureTextEntry style={{ flex: 3 }} placeholder="************" value={this.state.password} onChangeText={(password) => this.setState({ password })}></TextInput>
                    </ListItem>
                    {this.state.error && <ListItem noBorder>
                        <Text style={{ color: Colors.red }}>{this.state.error}</Text>
                    </ListItem>}
                </List>
                <View style={{ width: '100%', alignContent: "center", alignItems: "center", paddingTop: 5 }}>
                    <Button block info style={{ width: '80%', alignSelf: "center", borderRadius: 5 }} onPress={() => {
                        this.onVerifyUser()
                    }}>
                        <Text>Přihlásit se</Text>
                    </Button>
                    <Button block icon iconLeft info style={{ width: '80%', alignSelf: "center", borderRadius: 5, marginTop: 20 }} onPress={() => this.onLoginOrRegister()}>
                        <Icon type="FontAwesome" name='google' />
                        <Text>Přihlásit se přes google</Text>
                    </Button>
                </View>

                <View style={{ flexDirection: "column", alignContent: "center", justifyContent: "space-evenly", paddingTop: 25 }}>
                    <Button transparent block style={{ width: '80%', alignSelf: "center", borderRadius: 5, marginTop: 10 }} onPress={() => this.onSendPass()} >
                        <Text style={{ color: "blue" }}>Zapomenuté heslo</Text>
                    </Button>
                    <Button transparent block style={{ width: '80%', alignSelf: "center", borderRadius: 5, marginTop: 5 }} onPress={() => this.props.navigation.navigate("register")}>
                        <Text style={{ color: "blue" }}>Zaregistrovat se.</Text>
                    </Button>

                </View>
            </View>
        </KeyboardAvoidingView>);
    }
    onSendPass(): void {
        if (this.state.email.length > 0) {
            Login.resetPass(this.state.email);
            Alert.alert("Obnovení hesla Vám bylo odesláno na vyplněný email");
        } else {
            this.setState({ error: "Prosím, vyplňte svůj email" });
        }
    }
}

export default LoginScreen;