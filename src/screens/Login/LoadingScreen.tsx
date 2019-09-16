import * as React from 'react';
import { NavigationScreenProps } from 'react-navigation';
import { Component } from 'react';
import firebase from 'firebase';
import LoadingPage from '../../objects/loadingPage';
import FirebaseWorker from '../../objects/FirebaseWorker';

export interface LoadingScreenState {
    unmount: firebase.Unsubscribe;
}

class LoadingScreen extends React.Component<NavigationScreenProps, LoadingScreenState> {
    componentWillUnmount() {
        this.state.unmount();
    }

    componentDidMount() {
        var unmount = firebase.auth().onAuthStateChanged((user) => {
            console.log("uaee");

            if (user) {
                console.log('nonull');

                var data = FirebaseWorker.getUserData(user).then(data => {
                    if (data.firstLoad) {
                        console.log("slideshow");

                        this.props.navigation.navigate("slideshow");
                    } else {
                        console.log('home');

                        this.props.navigation.navigate("home");
                    }
                })
            } else {
                console.log('login');

                this.props.navigation.navigate("login")
            }
        })
        this.setState({ unmount });
    }
    render() {
        return LoadingPage("Čekejte prosím, nastavujeme aplikaci");
    }
}

export default LoadingScreen;