import { Button, List, ListItem, Icon } from 'native-base';
import * as React from 'react';
import { Image, KeyboardAvoidingView, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { Divider } from 'react-native-elements';
import FirebaseWorker from '../../objects/FirebaseWorker';
import Colors from '../../constants/Colors';
import LoadingPage from '../../objects/loadingPage';
import { NavigationScreenProps } from 'react-navigation';

export interface LoginScreenProps extends NavigationScreenProps {

}

export interface LoginScreenState {
    email: string,
    password: string,
    error: string | undefined,
    loading: boolean
}

class LoginScreen extends React.Component<LoginScreenProps, LoginScreenState> {
    constructor(props: LoginScreenProps) {
        super(props);
        this.state = {
            email: "",
            password: "",
            error: undefined,
            loading: true
        }
    }
    componentDidMount() {
        this.setState({ loading: false });
    }

    onLoginOrRegister = () => {
        FirebaseWorker.loginGoogleUser();
    }
    
    onVerifyUser = async () => {
        const { email, password } = this.state;
        if (email.length > 0 && password.length > 0) {
            var result = await FirebaseWorker.loginUser(email, password);
            if (!result)
                this.setState({ error: result, loading: false })
        } else {
            this.setState({ error: "Musíte vyplnit email a heslo" })
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
                <View style={{ width: '100%', alignContent: "center", alignItems: "center" }}>
                    <Button block info style={{ width: '80%', alignSelf: "center", borderRadius: 5 }} onPress={() => {
                        this.setState({ loading: true });
                        this.onVerifyUser()
                    }}>
                        <Text>Přihlásit se</Text>
                    </Button>
                    <Button block icon iconLeft info style={{ width: '80%', alignSelf: "center", borderRadius: 5, marginTop: 10 }} onPress={() => this.onLoginOrRegister()}>
                                <Icon type="FontAwesome" name='google' />
                                <Text>Přihlásit se přes google</Text>
                            </Button>
                    <Button transparent block onPress={() => this.props.navigation.navigate("forgotPassword")} >
                        <Text>Zapomenuté heslo</Text>
                    </Button>
                </View>
                <View style={{ flexDirection: "row", alignContent: "center", justifyContent: "space-evenly", paddingTop: 25 }}><Text>Nemáte účet?</Text>
                    <TouchableOpacity onPress={() => this.props.navigation.navigate("register")}>
                        <Text style={{ color: Colors.blue }}>Zaregistrujte se.</Text>
                    </TouchableOpacity>

                </View>
            </View>
        </KeyboardAvoidingView>);
    }
}

export default LoginScreen;