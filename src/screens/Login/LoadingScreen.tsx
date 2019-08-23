import * as React from 'react';
import { NavigationScreenProps } from 'react-navigation';
import { Props, Component } from 'react';
import firebase from 'firebase';
import LoadingPage from '../../objects/loadingPage';
import FirebaseWorker from '../../objects/FirebaseWorker';

export interface LoadingScreenProps extends NavigationScreenProps {

}

export interface LoadingScreenState {
}

class LoadingScreen extends Component<LoadingScreenProps, LoadingScreenState> {
    componentDidMount() {
        firebase.auth().onAuthStateChanged(async (user) => {
            if (user) {
                this.props.navigation.navigate("home");
            } else {
                this.props.navigation.navigate("login")
            }
        })
    }
    render() {
        return LoadingPage("Čekejte prosím, nastavujeme aplikaci");
    }
}

export default LoadingScreen;