import React from "react";
import { List, Item, ListItem, Text } from "native-base";
import { profile } from "console";
import { Partner, Profile, PartnerItem } from "../../objects/profileData";
import { ScrollView } from "react-native";
import BackgroundImage from "../BackgroundImage";

export interface PartnerTabProps {
    partnerClicked: (idt: number) => void,
    partner: Partner,
    profile: Profile
}

export interface PartnerTabState {

}

class PartnerTab extends React.Component<PartnerTabProps, PartnerTabState> {
    render() {
        return (
            <ScrollView>
                <BackgroundImage>
                    <List>
                        {this.props.partner.Items.map((partner: PartnerItem) => {
                            var selected = partner.Partner.Idt == this.props.profile.IdtClena ? partner.Partnerka : partner.Partner;
                            return (
                                <ListItem key={selected.Id} onPress={() =>
                                    this.props.partnerClicked(selected.Idt)
                                }>
                                    <Text>{selected.Jmeno} {selected.Prijmeni}</Text>
                                </ListItem>
                            )
                        })}
                    </List>
                </BackgroundImage>
            </ScrollView>
        );
    }
}

export default PartnerTab;