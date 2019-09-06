import NavigationScreens from './src/navigators/MainNavigator';
import * as Font from 'expo-font';
import { Ionicons } from '@expo/vector-icons';
import { Root } from "native-base";
import LoadingPage from './src/objects/loadingPage';
import React, { Component } from 'react';
import { YellowBox, ImageBackground } from 'react-native';
import _ from 'lodash';
import Layout from './src/constants/Layout';

YellowBox.ignoreWarnings(['Setting a timer']);
const _console = _.clone(console);
console.warn = (message: { indexOf: (arg0: string) => number; }) => {
  if (message.indexOf('Setting a timer') <= -1) {
    _console.warn(message);
  }
};
export default class App extends Component<{}, { fontLoaded: boolean }> {
  constructor(props: any) {
    super(props);
    this.state = {
      fontLoaded: false
    }
  }

  async componentDidMount() {

    await Font.loadAsync({
     
      fontello: require('./assets/fonts/fontello.ttf'),
      ...Ionicons.font,
    });
    this.setState({ fontLoaded: true })

  }
  render() {
    return (
      <Root>
        {this.state.fontLoaded ?
          <ImageBackground source={require("./assets/background.png")} style={{ width: Layout.window.width, height: Layout.window.height }}>
            <NavigationScreens />
          </ImageBackground> :
          LoadingPage("Načítání")
        }
      </Root>
    );
  }
}
