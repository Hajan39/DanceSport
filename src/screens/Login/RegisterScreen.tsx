import { Button, List, ListItem } from 'native-base';
import * as React from 'react';
import { Image, KeyboardAvoidingView, Text, TextInput, View } from 'react-native';
import { Divider } from 'react-native-elements';
import Colors from '../../constants/Colors';
import FirebaseWorker from '../../objects/FirebaseWorker';
import { NavigationScreenProps, ScrollView } from 'react-navigation';
import LoadingPage from '../../objects/loadingPage';
import Reinput from 'reinput'

export interface RegisterScreenState {
    name: string,
    surname: string,
    email: string,
    password: string,
    wdsfMin: string,
    cstsIdt: string,
    error: string | undefined,
    loading: boolean
}

class RegisterScreen extends React.Component<NavigationScreenProps, RegisterScreenState> {
    constructor(props: NavigationScreenProps) {
        super(props);
        this.state = {
            name: "",
            surname: "",
            email: "",
            password: "",
            wdsfMin: "",
            cstsIdt: "",
            error: undefined,
            loading: true
        }
    }
    componentDidMount() {
        this.setState({ loading: false });
    }
    onSignUpUser() {
        this.setState({ loading: true });
        var wdsfMin = this.state.wdsfMin.length > 0 ? parseInt(this.state.wdsfMin) : null;
        var cstsIdt = this.state.cstsIdt.length > 0 ? parseInt(this.state.cstsIdt) : null;
        try {
            FirebaseWorker.registerUser(this.state.name, this.state.surname, this.state.email, this.state.password, cstsIdt, wdsfMin);
        } catch (error) {
            this.setState({ error: error.message });
        }
        this.props.navigation.goBack();
        this.setState({ loading: false });
    }
    render() {
        return (this.state.loading ? LoadingPage("Registrace") : <KeyboardAvoidingView style={{ flex: 1, flexDirection: "column" }} behavior="padding" enabled>
            <Image source={require("../../../assets/logo.png")} resizeMode="contain" style={{ alignContent: "center", alignItems: "center", alignSelf: "center", width: '90%', height: '90%', flex: 1 }} />
            <Divider />
            <ScrollView style={{ flex: 2 }}>
                <Reinput label="JMÉNO" keyboardType="default" style={{ width: '80%', alignSelf: "center" }} placeholder="Martin" value={this.state.name} onChangeText={(name: any) => this.setState({ name })} error={this.isFilled(this.state.name)} />
                <Reinput label="PŘÍJMENÍ" keyboardType="default" style={{ width: '80%', alignSelf: "center" }} placeholder="Novák" value={this.state.surname} onChangeText={(surname: any) => this.setState({ surname })} error={this.isFilled(this.state.surname)} />
                <Reinput label="EMAIL" keyboardType="email-address" style={{ width: '80%', alignSelf: "center" }} placeholder="john@email.com" value={this.state.email} onChangeText={(email: any) => this.setState({ email })} error={this.isFilled(this.state.email)} />
                <Reinput label="HESLO" secureTextEntry placeholder="************" value={this.state.password} style={{ width: '80%', alignSelf: "center" }} onChangeText={(password: any) => this.setState({ password })} error={this.isFilled(this.state.password)} />
                <Reinput keyboardType="number-pad" style={{ width: '80%', alignSelf: "center" }} label='WDSF MIN' value={this.state.wdsfMin} onChangeText={(wdsfMin: any) => this.setState({ wdsfMin })} />
                <Reinput keyboardType="number-pad" style={{ width: '80%', alignSelf: "center" }} label='CSTS IDT' value={this.state.cstsIdt} onChangeText={(cstsIdt: any) => this.setState({ cstsIdt })} />

                {this.state.error &&
                    <Text style={{ color: Colors.red }}>{this.state.error}</Text>
                }
                <View style={{ width: '100%', alignContent: "center", alignItems: "center", flexDirection: "row", justifyContent: "space-evenly", paddingBottom: 20 }}>
                    <Button block light style={{ width: '40%', alignSelf: "center", borderRadius: 5 }} onPress={() => this.props.navigation.navigate("login")}>
                        <Text>Zrušit</Text>
                    </Button>
                    <Button block info style={{ width: '40%', alignSelf: "center", borderRadius: 5 }} onPress={() => this.onSignUpUser()}>
                        <Text>Registrace</Text>
                    </Button>
                </View>
            </ScrollView>

        </KeyboardAvoidingView >
        );
    }
    isFilled(name: string) {
        return name.length > 0 ? "" : "Toto pole je povinné";
    }
}

export default RegisterScreen;