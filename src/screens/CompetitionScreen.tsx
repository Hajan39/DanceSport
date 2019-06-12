import * as React from 'react';
import { Image, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-navigation';

import { GetCompetitions } from '../server/competitionCommunicator';
import BackgroundImage from '../components/BackgroundImage';

export interface CompetitionScreenProps {

}

export interface CompetitionScreenState {
}

class CompetitionScreen extends React.Component<CompetitionScreenProps, CompetitionScreenState> {
    constructor(props: CompetitionScreenProps) {
        super(props);
    }

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