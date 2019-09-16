import React, { Component } from 'react';
import { CompResults } from '../../objects/profileData';
import { List, ListItem, Left, Body, Right } from 'native-base';
import BackgroundImage from '../BackgroundImage';
import { ScrollView, View } from 'react-native';
import { Text } from 'react-native';
import Colors from '../../constants/Colors';
import { AdMobBanner } from 'expo-ads-admob';

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
                {this.props.compResults.Items.map((comp, index) => {
                    return (<View key={comp.Id}>
                        <ListItem >
                            <Left style={{ flex: 1 }}>
                                <Text>{this.parseDate(comp.Datum)}</Text>
                            </Left>
                            <Body style={{ flex: 3 }}>
                                <Text>{comp.Nazev}</Text>
                                <Text style={{color: Colors.grey, fontSize: 10}}>{comp.Kategorie}</Text>
                            </Body>
                            <Right style={{ flex: 1 }}>
                                <Text style={{color: Colors.grey, fontSize: 10}}>{comp.PoradiOd == comp.PoradiDo ? comp.PoradiOd : `${comp.PoradiOd}. - ${comp.PoradiDo}`}.</Text>
                            </Right>
                        </ListItem>
                         {index > 0 && index % 5 == 0 && <AdMobBanner

                            bannerSize="smartBannerPortrait"
                            adUnitID="ca-app-pub-1900213351962804/6193625682"
                            testDeviceID="EMULATOR" />}
                            </View>)
                })}

            </List>
            </BackgroundImage>
        </ScrollView>);
    }
}

export default CompResultsTab;