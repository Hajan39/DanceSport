import * as React from 'react';
import { SafeAreaView, NavigationScreenProps, ScrollView } from 'react-navigation';

import BackgroundImage from '../../../components/BackgroundImage';
import { Icon, Button, Card, CardItem, Body, Label } from 'native-base';
import Colors from '../../../constants/Colors';
import WDSF from '../../../server/wdsfCommunicator';
import { WdsfCompetitionGlobal } from '../../../objects/wdsfData';
import { Text, View } from 'react-native';
import LoadingPage from '../../../objects/loadingPage';
import Layout from '../../../constants/Layout';
import { AdMobBanner } from 'expo-ads-admob';

export interface CompetitionScreenProps extends NavigationScreenProps {

}

export interface CompetitionScreenState {
    competitions: WdsfCompetitionGlobal[],
    from?: string,
    to?: string,
    groupId?: number
}

class CompetitionScreen extends React.Component<CompetitionScreenProps, CompetitionScreenState> {
    constructor(props: CompetitionScreenProps) {
        super(props);
        var date = new Date();
        var from = date.getFullYear() + "-" + (date.getMonth() + 1) + "-" + date.getDate();
        var to = date.getFullYear() + "-" + (date.getMonth() + 2) + "-" + date.getDate();

        this.state = props.navigation.getParam("compSearch", { competitions: [], from, to })
    }
    static navigationOptions = ({ navigation }: NavigationScreenProps) => {
        return {
            headerLeft: <Button transparent onPress={() => navigation.openDrawer()} ><Icon name="menu" style={{ color: Colors.iconColor }}
            /></Button>,
            title: 'Soutěže',
            headerStyle: {
                backgroundColor: Colors.header,
            },
            headerTintColor: '#fff',
            headerTitleStyle: {
                fontWeight: 'bold',
            },
        }
    };
    componentDidMount() {
        WDSF.getCompetitionList(this.state.from, this.state.to, this.state.groupId).then(x => {
            this.setState({ competitions: x });
        }).catch(x => {
            console.log("err", x);

        });

    }

    render() {
        return (
            <BackgroundImage>
                <SafeAreaView style={{ flex: 1, alignItems: "center", justifyContent: "center", backgroundColor: "transparent" }}>
                    <ScrollView>
                        {this.state.competitions.length > 0 ? this.state.competitions.map((x, index) => {
                            var spl = x.name.split("-");
                            var date = new Date(spl[3].trim());
                            return (<View key={x.id}><Card style={{ width: Layout.window.width * 0.9 }}>
                                <CardItem header bordered>
                                    <Text onPress={() => this.showCompetitionDetail(x.id)}>{spl[0].trim()}</Text>
                                </CardItem>
                                <CardItem bordered>
                                    <Body>
                                        <Text onPress={() => this.showCompetitionDetail(x.id)}>{spl[1].trim()} - {spl[2].trim()}</Text>

                                    </Body>
                                </CardItem>
                                <CardItem footer bordered>
                                    <Text onPress={() => this.showCompetitionDetail(x.id)}>{date.getDate()}. {date.getMonth() + 1}. {date.getFullYear()}</Text>

                                </CardItem>
                            </Card>
                             {index > 0 && index % 4 == 0 && <AdMobBanner

                                bannerSize="smartBannerPortrait"
                                adUnitID="ca-app-pub-1900213351962804/6193625682"
                                testDeviceID="EMULATOR" />}
                                </View>)
                        }) : LoadingPage("Načítání seznamu soutěží")}
                    </ScrollView>
                </SafeAreaView>
            </BackgroundImage>);
    }
    showCompetitionDetail(id: number): void {

        this.props.navigation.push("WdsfCompDetail", { compId: id })
    }
}

export default CompetitionScreen;