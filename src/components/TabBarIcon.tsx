import { Icon } from 'native-base';
import React from 'react';
import Colors from '../constants/Colors';
export interface TabBarIconProps {
    name: string,
    focused: boolean,
}

class TabBarIcon extends React.Component<TabBarIconProps, {}> {
    constructor(props: TabBarIconProps) {
        super(props);
    }
    render() {
        return (
            <Icon
                name={this.props.name}
                type="FontAwesome"
                active={this.props.focused}
                style={{ color: this.props.focused ? Colors.header : Colors.grey, marginBottom: -3 }}
            />
        );
    }
}

export default TabBarIcon;