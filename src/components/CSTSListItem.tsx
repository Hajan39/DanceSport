import * as React from 'react';
import { Component } from 'react';
import { Partner } from '../objects/profileData';
import { ListItem, Text } from 'native-base';
import { NavigationScreenProps } from 'react-navigation';

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
            <Text note>{props.cstsIdt}</Text>
        </ListItem>
    );
}

export default CSTSListItem;