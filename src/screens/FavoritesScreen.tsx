import * as React from 'react';
import { User } from '../objects/firebaseUser';
import BackgroundImage from '../components/BackgroundImage';
import { List, ListItem, Icon, Button } from 'native-base';
import { NavigationScreenProps } from 'react-navigation';
import { Text, ActivityIndicator } from 'react-native';
import CSTSListItem from '../components/CSTSListItem';
import WDSFListItem from '../components/WDSFListItem';

export interface FavoritesScreenProps extends NavigationScreenProps {

}

export interface FavoritesScreenState {
    user: User | null,
    overlayVisible: boolean,
    cstsFavorites: User[],
    wdsfFavorites: User[],
}

class FavoritesScreen extends React.Component<FavoritesScreenProps, FavoritesScreenState> {
    constructor(props: FavoritesScreenProps) {
        super(props);
        this.state = { user: null, overlayVisible: false, cstsFavorites: [], wdsfFavorites: [] };
    }

    static navigationOptions = ({ navigation }: NavigationScreenProps) => {
        const { params } = navigation.state;
        return {
            title: 'Ranklist',
            headerLeft: <Button transparent><Icon name="menu" style={{color: "black"}}
        onPress={ () => navigation.openDrawer() } /></Button>,
            headerRight: (
                <Icon
                    style={{ paddingRight: 20 }}
                    name="add"
                    fontSize={25}
                    color="white"
                    type="FontAwesome"
                    onPress={() => params.addUser()} />
            )
        }
    };

    addUser = () => {
        this.setState({ overlayVisible: true });
    }

    componentDidMount() {
        this.props.navigation.setParams({
            addUser: () => this.addUser()
        });
    }

    render() {
        if (this.state.user) {
            return (
                <BackgroundImage>

                    <List>
                        {this.state.cstsFavorites.length > 0 &&
                            <ListItem itemDivider>
                                <Text>CSTS</Text>
                            </ListItem>}
                        {this.state.cstsFavorites.map(x => {
                            return <CSTSListItem cstsIdt={x.cstsIdt} name={x.name} onClick={(idt: number | string) => this.userCSTSClick(idt)} key={x.cstsIdt} />
                        })}
                        {this.state.wdsfFavorites.length > 0 &&
                            <ListItem itemDivider>
                                <Text>WDSF</Text>
                            </ListItem>}
                        {this.state.wdsfFavorites.map(x => {
                            return <WDSFListItem wdsfId={x.wdsfId} name={x.name} onClick={(id: number | string) => this.userWDSFClick(id)} key={x.wdsfId} />
                        })}
                    </List>
                </BackgroundImage>
            );
        } else {
            return (
                <BackgroundImage>
                    <ActivityIndicator size="large"></ActivityIndicator>
                    <Text>Načítání</Text>
                </BackgroundImage>
            );
        }
    }
    userCSTSClick(idt: string | number): void {
        this.props.navigation.navigate("cstsProfile", { idt: idt })
    }
    userWDSFClick(id: React.ReactText): void {
        this.props.navigation.navigate("wdsfProfile", { id: id })
    }
}

export default FavoritesScreen;