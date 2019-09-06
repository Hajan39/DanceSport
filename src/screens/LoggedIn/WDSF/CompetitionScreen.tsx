import * as React from 'react';
import { SafeAreaView, NavigationScreenProps } from 'react-navigation';

import { GetCompetitions } from '../../../server/competitionCommunicator';
import BackgroundImage from '../../../components/BackgroundImage';
import { Icon, Button } from 'native-base';

export interface CompetitionScreenProps  extends NavigationScreenProps{

}

export interface CompetitionScreenState {
}

class CompetitionScreen extends React.Component<CompetitionScreenProps, CompetitionScreenState> {
    constructor(props: CompetitionScreenProps) {
        super(props);
    }
    static navigationOptions = ({ navigation }: NavigationScreenProps) => {
        return {
            headerLeft: <Button transparent><Icon name="menu" style={{color: "black"}}            
        onPress={ () => navigation.openDrawer() } /></Button>,
            title: 'Souteze',
        }
    };
    componentDidMount() {
        GetCompetitions();

    }

    render() {
        return (
            <BackgroundImage>
                <SafeAreaView style={{ flex: 1, alignItems: "center", justifyContent: "center", backgroundColor: "transparent" }}>

                </SafeAreaView>
            </BackgroundImage>);
    }
}

export default CompetitionScreen;