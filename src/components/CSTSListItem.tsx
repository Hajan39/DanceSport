import * as React from 'react';
import { Component } from 'react';
import { Partner } from '../objects/profileData';
import { ListItem } from 'native-base';
import { NavigationScreenProps } from 'react-navigation';
import { Text } from 'react-native';
import Colors from '../constants/Colors';

export interface CSTSListItemProps {
    cstsIdt: number,
    name: string,
    onClick: (idt: number) => void,
}

const CSTSListItem: React.SFC<CSTSListItemProps> = (props: CSTSListItemProps) => {
    return (
        <ListItem onPress={() =>
            props.onClick(props.cstsIdt)
        }>
            <Text>{props.name}</Text>
            <Text style={{color: Colors.grey, fontSize: 10}}>{props.cstsIdt}</Text>
        </ListItem>
    );
}

export default CSTSListItem;