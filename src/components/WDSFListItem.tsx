import * as React from 'react';
import { Component } from 'react';
import { ListItem, Text } from 'native-base';

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
            <Text note>{props.wdsfIdt}</Text>
        </ListItem>
    );
}

export default WDSFListItem;