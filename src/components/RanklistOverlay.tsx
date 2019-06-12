import * as React from 'react';
import { Overlay } from 'react-native-elements';
import { View, ListItem, Text, Picker, Button } from 'native-base';
import { SeznamDivizi, Seznam, Selection } from '../objects/ranklistData';

export interface RanklistOverlayProps {
    selection: Selection | null
    datum: string | null,
    vekKtg: string | null,
    disciplina: string | null,
    divize: number | null,
    overlayVisible: boolean,
    hideOverlay: () => void,
    updateResult: (state: RanklistOverlayState) => void
}

export interface RanklistOverlayState {
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
            divize: props.divize
        }
    }
    render() {
        return (<Overlay
            isVisible={this.props.overlayVisible}
            overlayStyle={{ justifyContent: "center", }}
            onBackdropPress={() => this.props.hideOverlay()}
        >
            <View style={{ justifyContent: "center", alignItems: "center", flexDirection: "column" }}>
                {this.props.selection &&
                    <View style={{ width: '100%' }}>
                        <ListItem style={{ justifyContent: "space-evenly" }}>
                            <Text style={{ width: '50%' }}>Věková katergorie</Text>
                            <Picker
                                selectedValue={this.state.vekKtg || ''}
                                style={{ width: '50%' }}
                                onValueChange={(itemValue, itemIndex) => {
                                    this.setState({
                                        vekKtg: itemValue
                                    });
                                }
                                }>
                                {this.props.selection.seznamVekovychKategorii.map((category: Seznam) => {
                                    return <Picker.Item key={category.Key} label={category.Value} value={category.Key} />
                                })}
                            </Picker>

                        </ListItem>
                        <ListItem style={{ justifyContent: "space-evenly" }}>
                            <Text style={{ width: '50%' }}>Disciplína</Text>
                            < Picker
                                selectedValue={this.state.disciplina || ''}
                                style={{ height: 50, width: '50%' }}
                                onValueChange={(itemValue, itemIndex) =>
                                    this.setState({ disciplina: itemValue })
                                }>
                                {this.props.selection.seznamDisciplin.map((category: Seznam) => {
                                    return <Picker.Item key={category.Key} label={category.Value} value={category.Key} />
                                })}
                            </Picker>
                        </ListItem>
                        <ListItem style={{ justifyContent: "space-evenly" }}>
                            <Text style={{ width: '50%' }}>Datum</Text>
                            < Picker
                                selectedValue={this.state.datum || ''}
                                style={{ width: '50%' }}
                                onValueChange={(itemValue, itemIndex) =>
                                    this.setState({ datum: itemValue })
                                }>
                                {this.props.selection.seznamDatumu.map((category: Seznam) => {
                                    return <Picker.Item key={category.Key} label={category.Value} value={category.Key} />
                                })}
                            </Picker>
                        </ListItem>
                        <ListItem style={{ justifyContent: "space-evenly" }}>
                            <Text style={{ width: '50%' }}>Divize</Text>
                            < Picker
                                selectedValue={this.state.divize || ''}
                                style={{ width: '50%' }}
                                onValueChange={(itemValue, itemIndex) =>
                                    this.setState({ divize: itemValue })
                                }>
                                {this.props.selection.seznamDivizi.map((category: SeznamDivizi) => {
                                    return <Picker.Item key={category.Key} label={category.Value} value={category.Key} />
                                })}
                            </Picker>
                        </ListItem>
                        <Button block onPress={() => this.props.updateResult(this.state)}><Text>Uložit</Text></Button>
                    </View>
                }
            </View>
        </Overlay>);
    }
}

export default RanklistOverlay;