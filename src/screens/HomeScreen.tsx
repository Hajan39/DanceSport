import * as React from 'react';
import { Image, View, ScrollView } from 'react-native';
import { Card, CardItem, Button, Icon, Left } from 'native-base';
import BackgroundImage from '../components/BackgroundImage';
import { NavigationScreenProps } from 'react-navigation';
import Layout from '../constants/Layout';
import { ComponentBase } from 'resub';
import { User } from '../objects/firebaseUser';
import UserStore from '../strores/UserStore';
import { AdMobBanner } from 'expo-ads-admob';
import Colors from '../constants/Colors';
import { Text } from 'react-native';
import { deliveryClient, Post } from '../objects/kenticoObjects';

export interface HomeScreenProps extends NavigationScreenProps {

}

export interface HomeScreenState {
    user?: User,
    posts?: Post[]
}

class HomeScreen extends ComponentBase<HomeScreenProps, HomeScreenState> {
    protected _buildState(props: HomeScreenProps, initialBuild: boolean): HomeScreenState {
        var user = UserStore.getUser();

        return {
            user
        }
    }

    componentDidMount() {

        deliveryClient.items<Post>()
            .type('post')
            .toObservable()
            .subscribe(response => {
                this.setState({ posts: response.items });;
            });

    }
    static navigationOptions = ({ navigation }: NavigationScreenProps) => {
        const { params } = navigation.state;
        return {
            headerLeft: <Button transparent onPress={() => navigation.openDrawer()} ><Icon name="menu" style={{ color: Colors.iconColor }}
            /></Button>,
            title: 'Novinky',
            headerStyle: {
                backgroundColor: Colors.header,
            },
            headerTintColor: '#fff',
            headerTitleStyle: {
                fontWeight: 'bold',
            },
        }
    };
    render() {

        return (
            <BackgroundImage>
                <ScrollView  >
                    <View style={{ flex: 1, alignItems: "center", height: Layout.window.height }}>
                        {this.state.posts && this.state.posts.map((x, index) => {
                            return <View key={index}>
                                <Card style={{ width: '90%' }}>
                                    {x.nadpis && <CardItem>
                                        <Left>
                                            <Text style={{ fontSize: 20, fontWeight: "700" }}>{x.nadpis.value}</Text>
                                        </Left>
                                    </CardItem>}
                                    {x.obrazek &&
                                        <CardItem cardBody>
                                            {x.obrazek.value.map((image, ix) => {
                                                return <Image key={ix} source={{ uri: image.url }} style={{ height: Layout.window.width * 0.9 / image.width * image.height, flex: 1 }} />
                                            })}
                                        </CardItem>
                                    }
                                    {x.popis && <CardItem>
                                        <Text>{x.popis.value}</Text>
                                    </CardItem>}
                                </Card>
                                {index > 0 && index % 3 && <AdMobBanner
                                    bannerSize="smartBannerPortrait"
                                    adUnitID="ca-app-pub-1900213351962804/6808224429"
                                    testDeviceID="EMULATOR" />}
                            </View>
                        })}

                        <AdMobBanner

                            bannerSize="smartBannerPortrait"
                            adUnitID="ca-app-pub-1900213351962804/6808224429"
                            testDeviceID="EMULATOR" />
                    </View>
                </ScrollView>
            </BackgroundImage>
        );
    }
}

export default HomeScreen;