import * as React from 'react';
import { Overlay } from 'react-native-elements';
import { View, Card, Picker, Button, Left, Body, Right, ActionSheet, Icon } from 'native-base';
import { SeznamDivizi, Seznam, Selection } from '../objects/ranklistData';
import { Text } from 'react-native';
import Colors from '../constants/Colors';

export interface RanklistOverlayProps {
    selection: Selection
    datum: string | null,
    vekKtg: string | null,
    disciplina: string | null,
    divize: number | null,
    overlayVisible: boolean,
    hideOverlay: () => void,
    updateResult: (state: RanklistOverlayState) => void
}

export interface RanklistOverlayState {
    seznamDatumu: string[],
    seznamDiscplin: string[],
    seznamVekovychKategorii: string[],
    seznamDivizi: string[],
    datum: string | null,
    vekKtg: string | null,
    disciplina: string | null,
    divize: number | null,

}

class RanklistOverlay extends React.Component<RanklistOverlayProps, RanklistOverlayState> {
    constructor(props: RanklistOverlayProps) {
        super(props);
        this.state = {
            datum: props.datum,
            vekKtg: props.vekKtg,
            disciplina: props.disciplina,
            divize: props.divize,
            seznamDatumu: this.props.selection.seznamDatumu.map(x => x.Value),
            seznamDiscplin: this.props.selection.seznamDisciplin.map(x => x.Value),
            seznamDivizi: this.props.selection.seznamDivizi.map(x => x.Value),
            seznamVekovychKategorii: this.props.selection.seznamVekovychKategorii.map(x => x.Value),
        }
    }
    render() {
        return (<Overlay
            isVisible={this.props.overlayVisible}
            overlayStyle={{ justifyContent: "center", }}
            onBackdropPress={() => this.props.hideOverlay()}
        >
            <View style={{ justifyContent: "space-between", alignItems: "center", flexDirection: "column", flex: 1 }}>
                <Button block iconRight transparent style={{ flexDirection: "row", justifyContent: "space-between" }} onPress={() => ActionSheet.show(
                    {
                        options: [...this.state.seznamVekovychKategorii, "Zrušit"],
                        cancelButtonIndex: this.state.seznamVekovychKategorii.length,
                        title: "Věková katergorie"
                    },
                    buttonIndex => {
                        if (buttonIndex < this.state.seznamVekovychKategorii.length)
                            this.setState({ vekKtg: this.props.selection.seznamVekovychKategorii.find(x => x.Value == this.state.seznamVekovychKategorii[buttonIndex]).Key });
                    }
                )}
                >
                    <Text>Věková katergorie</Text>
                    <Text>{this.props.selection.seznamVekovychKategorii.find(x => x.Key == this.state.vekKtg).Value || ''}</Text>
                    <Icon type="FontAwesome" name="chevron-down" />
                </Button>
                <Button block iconRight transparent style={{ flexDirection: "row", justifyContent: "space-between" }} onPress={() => ActionSheet.show(
                    {
                        options: [...this.state.seznamDiscplin, "Zrušit"],
                        cancelButtonIndex: this.state.seznamDiscplin.length,
                        title: "Disciplína"
                    },
                    buttonIndex => {
                        if (buttonIndex < this.state.seznamDiscplin.length)
                            this.setState({ disciplina: this.props.selection.seznamDisciplin.find(x => x.Value == this.state.seznamDiscplin[buttonIndex]).Key });
                    }
                )}
                >
                    <Text>Disciplína</Text>
                    <Text>{this.props.selection.seznamDisciplin.find(x => x.Key == this.state.disciplina).Value || ''}</Text>
                    <Icon type="FontAwesome" name="chevron-down" />
                </Button>

                <Button block iconRight transparent style={{ flexDirection: "row", justifyContent: "space-between" }} onPress={() => ActionSheet.show(
                    {
                        options: [...this.state.seznamDatumu, "Zrušit"],
                        cancelButtonIndex: this.state.seznamDatumu.length,
                        title: "Datum"
                    },
                    buttonIndex => {
                        if (buttonIndex < this.state.seznamDatumu.length)
                            this.setState({ datum: this.props.selection.seznamDatumu.find(x => x.Value == this.state.seznamDatumu[buttonIndex]).Key });
                    }
                )}
                >
                    <Text>Datum</Text>
                    <Text>{this.props.selection.seznamDatumu.find(x => x.Key == this.state.datum).Value || ''}</Text>
                    <Icon type="FontAwesome" name="chevron-down" />
                </Button>

                <Button block iconRight transparent style={{ flexDirection: "row", justifyContent: "space-between" }} onPress={() => ActionSheet.show(
                    {
                        options: [...this.state.seznamDivizi, "Zrušit"],
                        cancelButtonIndex: this.state.seznamDivizi.length,
                        title: "Divize"
                    },
                    buttonIndex => {
                        if (buttonIndex < this.state.seznamDivizi.length)
                            this.setState({ divize: this.props.selection.seznamDivizi.find(x => x.Value == this.state.seznamDivizi[buttonIndex]).Key });
                    }
                )}
                >
                    <Text>Divize</Text>
                    <Text>{this.props.selection.seznamDivizi.find(x => x.Key == this.state.divize).Value || ''}</Text>
                    <Icon type="FontAwesome" name="chevron-down" />
                </Button>
                <Button block style={{ backgroundColor: Colors.header }} onPress={() => this.props.updateResult(this.state)}><Text style={{ color: Colors.white }}>Uložit</Text></Button>
            </View>
        </Overlay>);
    }
}

export default RanklistOverlay;