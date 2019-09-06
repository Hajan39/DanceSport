import * as React from 'react';
import { Image, StyleSheet, View, ScrollView } from 'react-native';
import { Card, CardItem, Left, Thumbnail, Body, Right, Button, Icon, Text, Title } from 'native-base';
import BackgroundImage from '../components/BackgroundImage';
import { Constants } from 'expo';
import { NavigationScreenProps } from 'react-navigation';
import { FbResponseObject } from '../objects/FacebookResponse';
import Layout from '../constants/Layout';
import { getAccessToken, getFeeds } from '../server/facebookCommunicator';
import { ComponentBase } from 'resub';
import { User } from '../objects/firebaseUser';
import UserStore from '../strores/UserStore';

export interface HomeScreenProps extends NavigationScreenProps{

}

export interface HomeScreenState {
    state: object | null,
    data: FbResponseObject|undefined,
    user: User|undefined
}

class HomeScreen extends ComponentBase<HomeScreenProps, HomeScreenState> {
     protected _buildState(props: HomeScreenProps, initialBuild: boolean): HomeScreenState {
         var user = UserStore.getUser();
         
        return {
            state: null, data: undefined,user
        }
    }
    
    componentDidMount() {
        var acctoken = getAccessToken().then(x=> {
            getFeeds(x).then(feeds => {
                this.setState({ data:feeds  });
            })
        });
  

    }
    static navigationOptions = ({ navigation }: NavigationScreenProps) => {
        const { params } = navigation.state;
        return {
        headerLeft: <Button transparent><Icon name="menu" style={{color: "black"}}
        onPress={ () => navigation.openDrawer() } /></Button>,
        title: 'Novinky',
    }};
    render() {
        
        return (
            <BackgroundImage>
                <ScrollView  >
                    <View style={{ flex: 1, alignItems: "center", paddingBottom: 50, height: Layout.window.height }}>
                    
                    <Card style={{ width: '90%' }}>
                            <CardItem cardBody>
                                <Image source={require("../../assets/logo.png")} />
                            </CardItem> 
                            <CardItem>
                                <Text>{"Vítejte v nové aplikaci pro lidi co milují tanec. Aplikace je určena pro všchnz, kteří mlují tanec a případně jsou i registrovaními členy jednoho z podporovaných spolků. Není-li Váš taneční spolek ještě mezi nimi? Ozvěte se nám a my se pokusíme je přidat."}</Text>
                            </CardItem>
                           
                        </Card>
                        {this.state.data&&
                         this.state.data.data.map(x=> {
                            return <Card style={{ width: '90%' }}>
                            {/* <CardItem>
                                <Left>
                                    <Thumbnail source={{ uri: 'https://scontent.fprg1-1.fna.fbcdn.net/v/t1.0-9/317460_516571561711890_535922201_n.jpg?_nc_cat=102&_nc_ht=scontent.fprg1-1.fna&oh=f78356ad224009792731e18a6b55cd64&oe=5D91B46E' }} />
                                    <Body>
                                        <Text>Český taneční sport</Text>
                                        <Text note>@tanecnisport</Text>
                                    </Body>
                                </Left>
                            </CardItem> */}
                            <CardItem cardBody>
                                {x.attachments.data && x.attachments.data.map(image=> {
                                    return <Image source={{ uri: image.media.image.src }} style={{ height: Layout.window.width*0.9/image.media.image.width*image.media.image.height, flex: 1 }} />
                                })}
                                
                            </CardItem> 
                            <CardItem>
                                <Text>{x.message}</Text>
                            </CardItem>
                            {/* <CardItem>
                                <Left>
                                    <Button transparent>
                                        <Icon active name="thumbs-up" />
                                        <Text>12 Likes</Text>
                                    </Button>
                                </Left>
                                <Body>
                                    <Button transparent>
                                        <Icon active name="chatbubbles" />
                                        <Text>4 Comments</Text>
                                    </Button>
                                </Body>
                                <Right>
                                    <Text>11h ago</Text>
                                </Right>
                            </CardItem> */}
                        </Card>
                        })}
                    </View>
                </ScrollView>
            </BackgroundImage>
        );
    }
}

export default HomeScreen;