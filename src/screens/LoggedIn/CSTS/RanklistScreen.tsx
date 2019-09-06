import * as React from 'react';
import {
    ScrollView, StyleSheet, Text,
    View,
    RefreshControl
} from 'react-native';
import { Icon, Button, Card, CardItem } from 'native-base'
import { Pary, Rank, Ranklist, Selection } from '../../../objects/ranklistData';
import { NavigationScreenProps } from 'react-navigation';
import CSTS from '../../../server/cstsCommunicator';
import BackgroundImage from '../../../components/BackgroundImage';
import RanklistOverlay, { RanklistOverlayState } from '../../../components/RanklistOverlay';
import Colors from '../../../constants/Colors';
import { showProfile } from '../../../functions/cstsFunction';
import LoadingPage from '../../../objects/loadingPage';

export interface RanklistScreenProps extends NavigationScreenProps {

}

export interface RanklistScreenState {
    selection: Selection | null
    rank: Rank | undefined,
    datum: string | null,
    vekKtg: string | null,
    disciplina: string | null,
    divize: number | null,
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
            overlayVisible: false,
            refreshing: false
        }
    }
    static navigationOptions = ({ navigation }: NavigationScreenProps) => {
        const { params } = navigation.state;
        return {
            headerLeft: <Button transparent><Icon name="menu" style={{ color: "black" }} fontSize={25}

                onPress={() => navigation.openDrawer()} /></Button>,
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
        this.setState({ overlayVisible: false })
        CSTS.getRanklist(state.vekKtg, state.disciplina, state.datum, state.divize).then((ranklist: Ranklist) => {
            this.setRanklist(ranklist)
        });
    }

    setRanklist = (ranklist: Ranklist) => {

        this.setState({
            selection: ranklist.selection,
            rank: ranklist.rank,
            vekKtg: ranklist.selection.vekKtg,
            disciplina: ranklist.selection.disciplina,
            divize: ranklist.selection.divize,
            datum: ranklist.selection.datum,
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

    render() {
        if (this.state.rank) {


            return (
                <BackgroundImage>
                    <RanklistOverlay {...this.state} hideOverlay={() => this.setState({ overlayVisible: false })} updateResult={(state: RanklistOverlayState) => this.updateData(state)} />
                    <View style={{ flex: 1 }}>

                        <ScrollView refreshControl={<RefreshControl refreshing={this.state.refreshing} onRefresh={() => this._onRefresh()} />}>
                            <Text style={{}}>{this.state.rank && this.state.rank.nazev}</Text>
                            {this.state.rank.pary.map((couple: Pary) => {
                                return <Card transparent noShadow key={couple.id}>
                                    <View style={styles.eventBox}>
                                        <View style={styles.eventDate}>
                                            <Text style={styles.eventDay}>{couple.poradi_od}</Text>
                                        </View>
                                        <View style={styles.eventContent}>
                                            <Text style={styles.eventTime} onPress={() => showProfile(couple.partner_idt, this.props.navigation)}>{couple.partner_jmn}</Text>
                                            <Text style={styles.userName} onPress={() => showProfile(couple.partnerka_idt, this.props.navigation)}>{couple.partnerka_jmn}</Text>
                                            <Text style={styles.description}>{couple.body_celkem} bodů (TL: {couple.body_tliga}, MCR: {couple.body_mcr}, WDSF: {couple.body_wdsf})</Text>
                                        </View>
                                    </View>
                                </Card>
                            })}
                        </ScrollView>
                    </View >
                </BackgroundImage>
            );
        } else {
            return LoadingPage("Načítání ranklistu, chviličku strpení.")
        }
    }
}
export default RanklistScreen;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#DCDCDC",
    },
    eventBox: {
        padding: 10,
        color: Colors.header,
        marginTop: 5,
        marginBottom: 5,
        flexDirection: 'row',
    },
    eventDate: {
        flexDirection: 'column',
        justifyContent: "center",
        alignContent: "center"
    },
    eventDay: {
        fontSize: 50,
        color: Colors.header,
        fontWeight: "600",
    },

    eventContent: {
        flex: 1,
        flexDirection: 'column',
        alignItems: 'flex-start',
        marginLeft: 10,
        backgroundColor: Colors.transparent,
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

