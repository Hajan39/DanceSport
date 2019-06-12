import * as React from 'react';
import { Image, StyleSheet, View, ScrollView } from 'react-native';
import { Card, CardItem, Left, Thumbnail, Body, Right, Button, Icon, Text, Title } from 'native-base';
import BackgroundImage from '../components/BackgroundImage';
import { Constants } from 'expo';

export interface HomeScreenProps {

}

export interface HomeScreenState {
    state: object | null
}

class HomeScreen extends React.Component<HomeScreenProps, HomeScreenState> {
    constructor(props: HomeScreenProps) {
        super(props);
        this.state = { state: null };
    }
    static navigationOptions = {
        header: null,
    };
    render() {
        return (
            <BackgroundImage>
                <ScrollView  >
                    <View style={{ flex: 1, alignItems: "center", paddingBottom: 50, paddingTop: Constants.statusBarHeight }}>
                        <Card style={{ width: '90%' }}>
                            <CardItem>
                                <Left>
                                    <Thumbnail source={{ uri: 'https://scontent.fprg1-1.fna.fbcdn.net/v/t1.0-9/317460_516571561711890_535922201_n.jpg?_nc_cat=102&_nc_ht=scontent.fprg1-1.fna&oh=f78356ad224009792731e18a6b55cd64&oe=5D91B46E' }} />
                                    <Body>
                                        <Text>Český taneční sport</Text>
                                        <Text note>@tanecnisport</Text>
                                    </Body>
                                </Left>
                            </CardItem>
                            <CardItem cardBody>
                                <Image source={{ uri: 'https://scontent.fprg1-1.fna.fbcdn.net/v/t1.0-9/62003018_2200005980035098_1317292763472986112_n.jpg?_nc_cat=102&_nc_ht=scontent.fprg1-1.fna&oh=4e5d38be05f9b8e3bceb18eebb9f0fd5&oe=5D9583C7' }} style={{ height: 200, flex: 1 }} />
                            </CardItem>
                            <CardItem>
                                <Text>Taneční pár David Odstrčil - Tara Bohak se vydal na prestižní soutěž světového tanečního žebříčku WDSF GrandSlam Standard do dalekého Taipei a v konkurenci 61 párů obsadil 17. místo. Gratulujeme! #českýtanečnísport 🇨🇿 Ilustrační foto: Jakub Širc</Text>
                            </CardItem>
                            <CardItem>
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
                            </CardItem>
                        </Card>
                        <Card style={{ width: '90%' }}>
                            <CardItem>
                                <Left>
                                    <Thumbnail source={{ uri: 'https://scontent.fprg1-1.fna.fbcdn.net/v/t1.0-9/317460_516571561711890_535922201_n.jpg?_nc_cat=102&_nc_ht=scontent.fprg1-1.fna&oh=f78356ad224009792731e18a6b55cd64&oe=5D91B46E' }} />
                                    <Body>
                                        <Text>Český taneční sport</Text>
                                        <Text note>@tanecnisport</Text>
                                    </Body>
                                </Left>
                            </CardItem>
                            <CardItem cardBody>
                                <Image source={{ uri: 'https://scontent.fprg1-1.fna.fbcdn.net/v/t1.0-9/61740613_2199940363374993_8032640225744257024_n.jpg?_nc_cat=101&_nc_ht=scontent.fprg1-1.fna&oh=7ca6bc4f93277746db5dc000d794c111&oe=5D9BC165' }} style={{ height: 200, flex: 1 }} />
                            </CardItem>
                            <CardItem>
                                <Text>O body do světového tanečního žebříčku se tančilo o víkendu i na pobřeží Černého moře a byl u toho jeden český pár.
        Taneční pár Luboš Kozel - Adéla Siročáková obsadil v soutěži WDSF International Open Latin v bulharském Burgasu 19. místo (19/53).
        Gratulujeme!
        #českýtanečnísport 🇨🇿
Ilustrační foto: Jiří Jalovecký</Text>
                            </CardItem>
                            <CardItem>
                                <Left>
                                    <Button transparent>
                                        <Icon active name="thumbs-up" />
                                        <Text>18 Likes</Text>
                                    </Button>
                                </Left>
                                <Body>
                                    <Button transparent>
                                        <Icon active name="chatbubbles" />
                                        <Text>11 Comments</Text>
                                    </Button>
                                </Body>
                                <Right>
                                    <Text>22h ago</Text>
                                </Right>
                            </CardItem>
                        </Card>
                    </View>
                </ScrollView>
            </BackgroundImage>
        );
    }
}

export default HomeScreen;