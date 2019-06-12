import React, { Component } from 'react';
import { CompResults } from '../../objects/profileData';
import { List, ListItem, Left, Text, Body, Right } from 'native-base';
import BackgroundImage from '../BackgroundImage';
import { ScrollView } from 'react-native';

export interface CompResultsTabProps {
    compResults: CompResults
}

export interface CompResultsTabState {

}

class CompResultsTab extends React.Component<CompResultsTabProps, CompResultsTabState> {

    parseDate(dateString: string): string {
        var date: Date = new Date(dateString);
        return date.getDate() + ". " + (date.getMonth() + 1) + ". " + date.getFullYear();
    }

    render() {
        return (<ScrollView>
            <BackgroundImage><List>
                {this.props.compResults.Items.map((comp) => {
                    return (
                        <ListItem key={comp.Id}>
                            <Left style={{ flex: 1 }}>
                                <Text>{this.parseDate(comp.Datum)}</Text>
                            </Left>
                            <Body style={{ flex: 3 }}>
                                <Text>{comp.Nazev}</Text>
                                <Text note>{comp.Kategorie}</Text>
                            </Body>
                            <Right style={{ flex: 1 }}>
                                <Text note>{comp.PoradiOd == comp.PoradiDo ? comp.PoradiOd : `${comp.PoradiOd}. - ${comp.PoradiDo}`}.</Text>
                            </Right>
                        </ListItem>)
                })}

            </List>
            </BackgroundImage>
        </ScrollView>);
    }
}

export default CompResultsTab;