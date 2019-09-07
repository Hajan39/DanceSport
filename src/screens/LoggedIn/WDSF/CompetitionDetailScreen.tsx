import * as React from 'react';
import { Component } from 'react';
import { WdsfCompetitionDetail } from '../../../objects/wdsfData';
import { SafeAreaView, Text } from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';
import { Card } from 'react-native-elements';
import { CardItem } from 'native-base';
import Colors from '../../../constants/Colors';
import { NavigationScreenProps } from 'react-navigation';
import WDSF from '../../../server/wdsfCommunicator';
import LoadingPage from '../../../objects/loadingPage';

export interface CompetitionDetailScreenProps extends NavigationScreenProps {
}

export interface CompetitionDetailScreenState {
    compDetail: WdsfCompetitionDetail|undefined,
    id: number

}

class CompetitionDetailScreen extends React.Component<CompetitionDetailScreenProps, CompetitionDetailScreenState> {
        constructor(props: CompetitionDetailScreenProps) {
        super(props);
        this.state = { compDetail: undefined, id: this.props.navigation.getParam("compId")  };
        
    }

    componentDidMount() {
        WDSF.getCompetitionDetail(this.state.id).then(x=> {
            this.setState({ compDetail:x  });
            this.props.navigation.setParams({
                detail: x
            })
        })
    }

    static navigationOptions = ({ navigation }: NavigationScreenProps) => {
        const { params } = navigation.state;
        return {
            title: params && params.detail? (params.detail.age+ " "+params.detail.discipline): "Detail",
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
    const detail = this.state.compDetail
    if(detail){
    return ( <SafeAreaView>
             <ScrollView>
             <Text style={{fontSize: 25, alignSelf: "center", color: Colors.header}}>{detail.type}</Text>

                 <Card>
                     <CardItem style={{flexDirection: "column"}}>
                         <Text>Město: {detail.location}</Text>
                         <Text>Stát: {detail.country}</Text>
                         <Text>Typ: {detail.type}</Text>
                         <Text>Datum: {detail.date}</Text>
                         <Text>Věková kategoie: {detail.age}</Text>
                         <Text>Divize: {detail.division}</Text>
                         <Text>Status: {detail.status}</Text>
                         <Text>Koeficient: {detail.coefficient}</Text>
                     </CardItem>
                     <CardItem footer bordered>
                        <Text  onPress={()=> this.showGroupCompetitions(detail.groupId)}>Zobrazit všechny soutěže v této skupině</Text>
                     </CardItem>
                 </Card>
             </ScrollView>
         </SafeAreaView> );
    }
    else {
        return LoadingPage("Detail soutěže se načítá")
    }
    }
    showGroupCompetitions(groupId: number): void {
        this.props.navigation.push("Competition", {compSearch: {competitions: [], groupId: groupId}})
    }
 }

   export default CompetitionDetailScreen;