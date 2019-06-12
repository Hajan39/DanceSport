import { Button, List, ListItem } from 'native-base';
import * as React from 'react';
import { Image, KeyboardAvoidingView, Text, TextInput, View } from 'react-native';
import { Divider } from 'react-native-elements';
import Colors from '../../constants/Colors';
import FirebaseWorker from '../../objects/FirebaseWorker';
import { NavigationScreenProps } from 'react-navigation';
import LoadingPage from '../../objects/loadingPage';

export interface RegisterScreenProps extends NavigationScreenProps {

}

export interface RegisterScreenState {
    name: string,
    surname: string,
    email: string,
    password: string,
    error: string | undefined,
    loading: boolean
}

class RegisterScreen extends React.Component<RegisterScreenProps, RegisterScreenState> {
    constructor(props: RegisterScreenProps) {
        super(props);
        this.state = {
            name: "",
            surname: "",
            email: "",
            password: "",
            error: undefined,
            loading: true
        }
    }
    componentDidMount() {
        this.setState({ loading: false });
    }
    onSignUpUser() {
        this.setState({ loading: true });

        try {

            FirebaseWorker.registerUser(this.state.name, this.state.surname, this.state.email, this.state.password);
        } catch (error) {
            this.setState({ error: error.message });
        }
        this.props.navigation.goBack();
        this.setState({ loading: false });


    }
    render() {
        if (this.state.loading) {
            return LoadingPage("Registrace")
        }
        return (<KeyboardAvoidingView style={{ flex: 1, flexDirection: "column" }} behavior="padding" enabled>
            <Image source={require("../../../assets/logo.png")} resizeMode="contain" style={{ alignContent: "center", alignItems: "center", alignSelf: "center", width: '90%', height: '90%', flex: 1 }} />
            <Divider />
            <View style={{ flex: 1 }}>
                <List>
                    <ListItem >
                        <Text style={{ flex: 1 }}>Jméno</Text>
                        <TextInput keyboardType="default" style={{ flex: 3 }} placeholder="Martin" value={this.state.name} onChangeText={(name) => this.setState({ name })}></TextInput>
                    </ListItem>
                    <ListItem >
                        <Text style={{ flex: 1 }}>Příjmení</Text>
                        <TextInput keyboardType="default" style={{ flex: 3 }} placeholder="Novák" value={this.state.surname} onChangeText={(surname) => this.setState({ surname })}></TextInput>
                    </ListItem>
                    <ListItem >
                        <Text style={{ flex: 1 }}>Email</Text>
                        <TextInput keyboardType="email-address" style={{ flex: 3 }} placeholder="john@email.com" value={this.state.email} onChangeText={(email) => this.setState({ email })}></TextInput>
                    </ListItem>
                    <ListItem>
                        <Text style={{ flex: 1 }}>Heslo</Text>
                        <TextInput secureTextEntry style={{ flex: 3 }} placeholder="************" value={this.state.password} onChangeText={(password) => this.setState({ password })}></TextInput>
                    </ListItem>
                    {this.state.error && <ListItem noBorder>
                        <Text style={{ color: Colors.red }}>{this.state.error}</Text>
                    </ListItem>}
                </List>
                <View style={{ width: '100%', alignContent: "center", alignItems: "center", flexDirection: "row", justifyContent: "space-evenly" }}>
                    <Button block info style={{ width: '40%', alignSelf: "center", borderRadius: 5 }} onPress={() => this.onSignUpUser()}>
                        <Text>Registrace</Text>
                    </Button>
                    <Button block light style={{ width: '40%', alignSelf: "center", borderRadius: 5 }} onPress={() => this.props.navigation.navigate("login")}>
                        <Text>Zrušit</Text>
                    </Button>
                </View>
            </View>
        </KeyboardAvoidingView>
        );
    }
}

export default RegisterScreen;