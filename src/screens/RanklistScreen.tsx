import * as React from 'react';
import {
    ListView, ListViewDataSource, ScrollView, StyleSheet, Text, TouchableOpacity,
    View,
    RefreshControl
} from 'react-native';
import { Icon } from 'native-base'
import { Pary, Rank, Ranklist, Selection } from '../objects/ranklistData';
import { NavigationScreenProps } from 'react-navigation';
import RanklistOverlay, { RanklistOverlayState } from '../components/RanklistOverlay';
import CSTS from '../server/cstsCommunicator';
import BackgroundImage from '../components/BackgroundImage';

export interface RanklistScreenProps extends NavigationScreenProps {

}

export interface RanklistScreenState {
    selection: Selection | null
    rank: Rank | undefined,
    datum: string | null,
    vekKtg: string | null,
    disciplina: string | null,
    divize: number | null,
    pary: ListViewDataSource,
    overlayVisible: boolean,
    refreshing: boolean
}
class RanklistScreen extends React.Component<RanklistScreenProps, RanklistScreenState> {
    constructor(props: RanklistScreenProps) {
        super(props);
        this.state = {
            selection: null,
            rank: undefined,
            datum: null,
            vekKtg: null,
            disciplina: null,
            divize: null,
            pary: new ListView.DataSource({ rowHasChanged: (r1, r2) => r1 !== r2 }),
            overlayVisible: false,
            refreshing: false
        }
    }
    static navigationOptions = ({ navigation }: NavigationScreenProps) => {
        const { params } = navigation.state;
        return {
            title: 'Ranklist',
            headerRight: (
                <Icon
                    style={{ paddingRight: 20 }}
                    name="sliders"
                    fontSize={25}
                    color="white"
                    type="FontAwesome"
                    onPress={() => params.viewNewUser()} />
            )
        }
    };

    updateData(state: RanklistOverlayState): void {
        CSTS.getRanklist(state.vekKtg, state.disciplina, state.datum, state.divize).then((ranklist: Ranklist) => {
            this.setRanklist(ranklist)
        });
    }

    private setRanklist(ranklist: Ranklist) {

        const ds = new ListView.DataSource({ rowHasChanged: (r1, r2) => r1 !== r2 });
        this.setState({
            selection: ranklist.selection,
            rank: ranklist.rank,
            vekKtg: ranklist.selection.vekKtg,
            disciplina: ranklist.selection.disciplina,
            divize: ranklist.selection.divize,
            datum: ranklist.selection.datum,
            pary: ds.cloneWithRows(ranklist.rank.pary)
        });
    }

    componentDidMount() {
        this.props.navigation.setParams({
            viewNewUser: () => this.viewNewUser()
        });
        CSTS.getRanklist().then((ranklist: Ranklist) => {
            this.setRanklist(ranklist)
        });
    }

    viewNewUser = () => {
        this.setState({ overlayVisible: true });
    }
    _onRefresh = () => {
        this.setState({ refreshing: true });
        CSTS.getRanklist(this.state.vekKtg, this.state.disciplina, this.state.datum, this.state.divize).then((res: Ranklist) => this.setRanklist(res)).then(() =>
            this.setState({ refreshing: false }));
    }

    getRow(item: Pary) {
        return (
            <View key={item.id} style={{ flex: 1, alignSelf: 'stretch', flexDirection: 'row' }}>
                <View style={{ flex: 1, alignSelf: 'stretch', width: '80%' }}>
                    <Text>{item.partner_jmn}{"\n"}{item.partnerka_jmn}</Text>
                </View>
                <View style={{ flex: 1, alignSelf: 'stretch', justifyContent: 'center', alignItems: "center" }}>
                    <Text>{item.body_celkem}</Text>
                </View>
            </View>
        );
    }

    render() {
        return (
            <BackgroundImage>
                <RanklistOverlay {...this.state} hideOverlay={() => this.setState({ overlayVisible: false })} updateResult={(state: RanklistOverlayState) => this.updateData(state)} ></RanklistOverlay>
                <View style={{ flex: 1, paddingBottom: 50 }}>

                    <ScrollView refreshControl={<RefreshControl refreshing={this.state.refreshing} onRefresh={() => this._onRefresh()} />}>
                        <Text style={{}}>{this.state.rank && this.state.rank.nazev}</Text>
                        {this.state.rank &&
                            <ListView enableEmptySections={true}
                                style={styles.eventList}
                                dataSource={this.state.pary}
                                renderRow={(couple) => {
                                    return (
                                        <TouchableOpacity >
                                            <View style={styles.eventBox}>
                                                <View style={styles.eventDate}>
                                                    <Text style={styles.eventDay}>{couple.poradi_od}</Text>
                                                </View>
                                                <View style={styles.eventContent}>
                                                    <Text style={styles.eventTime}>{couple.partner_jmn}</Text>
                                                    <Text style={styles.userName}>{couple.partnerka_jmn}</Text>
                                                    <Text style={styles.description}>{couple.body_celkem} bodů (TL: {couple.body_tliga}, MCR: {couple.body_mcr}, WDSF: {couple.body_wdsf})</Text>
                                                </View>
                                            </View>
                                        </TouchableOpacity>
                                    )
                                }} />
                        }
                    </ScrollView>
                </View >
            </BackgroundImage>
        );
    }

}
export default RanklistScreen;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#DCDCDC",
    },
    row: {
        flex: 1,
        padding: 12,
        flexDirection: 'row',
        alignItems: 'center',
    },

    eventList: {
        marginTop: 20,
    },
    eventBox: {
        padding: 10,
        marginTop: 5,
        marginBottom: 5,
        flexDirection: 'row',
    },
    eventDate: {
        flexDirection: 'column',
    },
    eventDay: {
        fontSize: 50,
        color: "#0099FF",
        fontWeight: "600",
    },
    eventMonth: {
        fontSize: 16,
        color: "#0099FF",
        fontWeight: "600",
    },
    eventContent: {
        flex: 1,
        flexDirection: 'column',
        alignItems: 'flex-start',
        marginLeft: 10,
        backgroundColor: '#FFFFFF',
        padding: 10,
        borderRadius: 10
    },
    description: {
        fontSize: 15,
        color: "#646464",
    },
    eventTime: {
        fontSize: 18,
        color: "#151515",
    },
    userName: {
        fontSize: 16,
        color: "#151515",
    },

});

