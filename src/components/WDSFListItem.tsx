import * as React from 'react';
import { Component } from 'react';
import { ListItem } from 'native-base';
import { Text } from 'react-native';
import Colors from '../constants/Colors';

export interface WDSFListItemProps {
    wdsfIdt: number,
    name: string,
    onClick: (id: number) => void,
}

const WDSFListItem: React.SFC<WDSFListItemProps> = (props: WDSFListItemProps) => {
    return (
        <ListItem onPress={() =>
            props.onClick(props.wdsfIdt)
        }>
            <Text>{props.name}</Text>
            <Text style={{color: Colors.grey, fontSize: 10}}>{props.wdsfIdt}</Text>
        </ListItem>
    );
}

export default WDSFListItem;