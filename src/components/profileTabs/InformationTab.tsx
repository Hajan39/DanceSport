import React, { Component } from 'react';
import { Card, CardItem, Left,  Body, Separator } from 'native-base';
import { Profile, CstsDancerData } from '../../objects/profileData';
import { ScrollView } from 'react-native';
import BackgroundImage from '../BackgroundImage';
import { Text } from 'react-native';
import Colors from '../../constants/Colors';

export interface InfrormationTabProps {
    profile: CstsDancerData
}

export interface InfrormationTabState {

}

class InfrormationTab extends React.Component<InfrormationTabProps, InfrormationTabState> {
    constructor(props: InfrormationTabProps) {
        super(props);
    }

    parseDate(dateString: string): string {
        var date: Date = new Date(dateString);
        return date.getDate() + ". " + (date.getMonth() + 1) + ". " + date.getFullYear();
    }

    render() {
        var { profile, compData } = this.props.profile
        return (<ScrollView style={{ backgroundColor: "transparent" }}>
            <BackgroundImage>
                <Card transparent style={{ backgroundColor: "transparent" }}>
                    <CardItem style={{ backgroundColor: 'rgba(255, 255, 255, 0.2)' }}>
                        <Left>
                            <Text>IDT</Text>
                        </Left>
                        <Body>
                            <Text>{profile.IdtClena}</Text>
                        </Body>
                    </CardItem>
                    <CardItem style={{ backgroundColor: 'rgba(255, 255, 255, 0.2)' }}>
                        <Left>
                            <Text>Věková kategorie</Text>
                        </Left>
                        <Body>
                            <Text>{this.transferCategory(profile.VekKtg)}</Text>
                        </Body>
                    </CardItem>
                    <CardItem style={{ backgroundColor: "transparent" }} >
                        <Left>
                            <Text>Divize</Text>
                        </Left>
                        <Body>
                            <Text>{profile.Divize.Nazev}</Text>
                        </Body>
                    </CardItem>
                    <CardItem style={{ backgroundColor: "transparent" }} >
                        <Left>
                            <Text>Klub</Text>
                        </Left>
                        <Body>
                            <Text>{profile.Klub.Nazev}</Text>
                            <Text style={{color: Colors.grey, fontSize: 10}}>{this.parseDate(profile.Klub.DatVstupu)}</Text>
                        </Body>
                    </CardItem>
                    <CardItem style={{ backgroundColor: "transparent" }} >
                        <Left>
                            <Text>Zákaz startu</Text>
                        </Left>
                        <Body>
                            <Text>{compData.ZakazStartu ? "ANO" : "NE"}</Text>
                        </Body>
                    </CardItem>
                    <CardItem style={{ backgroundColor: "transparent" }} >
                        <Left>
                            <Text>Zdravotní způsobilost</Text>
                        </Left>
                        <Body>
                            {compData.PlatneZdravProhlidky.length > 0 ?
                                <>
                                    <Text>{compData.PlatneZdravProhlidky[0].Nazev}</Text>
                                    <Text style={{color: Colors.grey, fontSize: 10}}>do {this.parseDate(compData.PlatneZdravProhlidky[0].DoData)}</Text>
                                </> : <Text>NE</Text>
                            }
                        </Body>
                    </CardItem>
                    <CardItem bordered style={{justifyContent: "center", backgroundColor: Colors.transparent}}>
                        <Text>OSOBNÍ ZAŘAZENÍ</Text>
                    </CardItem>
                    <CardItem style={{ backgroundColor: "transparent" }} >
                        <Left>
                            <Text>Standard</Text>
                        </Left>
                        <Body>
                            <Text>třída {compData.VykDataStt.Trida}</Text>
                            <Text>body {compData.VykDataStt.Body}</Text>
                            <Text>F tuz./zahr.: {compData.VykDataStt.FinTuz}/{compData.VykDataStt.FinZahr}</Text>
                        </Body>
                    </CardItem>
                    <CardItem style={{ backgroundColor: "transparent" }} >
                        <Left>
                            <Text>Latina</Text>
                        </Left>
                        <Body>
                            <Text>třída {compData.VykDataLat.Trida}</Text>
                            <Text>body {compData.VykDataLat.Body}</Text>
                            <Text>F tuz./zahr.: {compData.VykDataLat.FinTuz}/{compData.VykDataLat.FinZahr}</Text>
                        </Body>
                    </CardItem>
                    <CardItem style={{ backgroundColor: "transparent" }} >
                        <Left>
                            <Text>Nejvyšší dosažené třídy</Text>
                        </Left>
                        <Body>
                            <Text>STT: {compData.NejTridaStt}</Text>
                            <Text>LAT: {compData.NejTridaLat}</Text>
                        </Body>
                    </CardItem>
                </Card>
            </BackgroundImage>
        </ScrollView>);
    }
    transferCategory(VekKtg: string): string {
        switch (VekKtg) {
            case "D1":
                return "Děti I";
            case "D2":
                return "Děti II";
            case "J1":
                return "Junioři I";
            case "J2":
                return "Junioři II";
            case "JU":
                return "Junioři";
            case "ML":
                return "Mládež";
            case "DS":
                return "Dospělí";
            case "SE":
                return "Senioři";
            case "S1":
                return "Senioři I";
            case "S2":
                return "Senioři II";
            case "S3":
                return "Senioři III";
            case "S4":
                return "Senioři IV";
            case "21":
                return "Do 21";
            case "U8":
                return "Do 8"
            default:
                return "";
        }
    }
}

export default InfrormationTab;