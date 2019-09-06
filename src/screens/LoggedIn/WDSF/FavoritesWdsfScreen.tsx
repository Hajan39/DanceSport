import * as React from 'react';
import { Component } from 'react';
import { ScrollView } from 'react-native-gesture-handler';
import { ComponentBase } from 'resub';
import { View, Card, Text, Body, CardItem, Right, Icon, Left, Button, Item, Input, Fab } from 'native-base';
import { SearchBar } from 'react-native-elements';
import UserStore from '../../../strores/UserStore';
import { User } from '../../../objects/firebaseUser';
import WDSF from '../../../server/wdsfCommunicator';
import { WdsfProfile } from '../../../objects/wdsfData';
import { NavigationScreenProps } from 'react-navigation';
import { debounce } from 'lodash';
import FirebaseWorker from '../../../objects/FirebaseWorker';
import Colors from '../../../constants/Colors';

export interface FavoritesWdsfScreenProps extends NavigationScreenProps, React.Props<any> {

}

export interface FavoritesWdsfScreenState {
    search?: string,
    user?: User ,
    followingWdsf?: WdsfProfile[]
    filteredWdsf?: WdsfProfile[]
    showAdd: boolean,
    addIdt?: number,
    searchedUser?: WdsfProfile

}

class FavoritesWdsfScreen extends ComponentBase<FavoritesWdsfScreenProps, FavoritesWdsfScreenState> {
    protected _buildState(props: FavoritesWdsfScreenProps, initialBuild: boolean): FavoritesWdsfScreenState {
        var user = UserStore.getUser();
        if (user)
            this.mapFollowing(user.followingWdsfIds);
        return {
            search: undefined,
            user: user,
            showAdd: false,
            addIdt: undefined,
            searchedUser: undefined
        }
    }

    mapFollowing = (followingWdsfIds: number[]) => {
        this.setState({ followingWdsf: [], filteredWdsf: [] }, () =>
            followingWdsfIds.forEach(wdsfId => {
                WDSF.getDancerProfile(wdsfId).then(profile => {
                    ;
                    this.setState({ followingWdsf: [...this.state.followingWdsf, profile], filteredWdsf: [...this.state.filteredWdsf, profile] });
                })
            })
        )
    }

    static navigationOptions = ({ navigation }: NavigationScreenProps) => {
        const { params } = navigation.state;
        return {
        headerLeft: <Button transparent><Icon name="menu" style={{color: "black"}}
        onPress={ () => navigation.openDrawer() } /></Button>,
        title: 'WDSF - Oblibene',
    }};

    updateSearch = (search: string) => {
        var toSearch = search.toLowerCase()
        var data = this.state.followingWdsf ? this.state.followingWdsf.filter(x => x.name.toLowerCase().includes(toSearch) || x.surname.toLowerCase().includes(toSearch) || x.id.toString().includes(toSearch)) : [];

        this.setState({ search, filteredWdsf: data });
    };
    removeWdsfId = (wdsfId: number) => {
        if (this.state.user) {
            const filtered = this.state.user.followingWdsfIds.filter(x => x !== wdsfId);
            FirebaseWorker.updateWDSFFavorites(filtered)
        }
    }


    updateText = (text: string | undefined) => {
        this.setState({ addIdt: text ? parseInt(text) : undefined, searchedUser: undefined });
        if (text)
            this.searchWdsfByIdt(text)
    }

    searchWdsfByIdt = debounce((wdsfId: string) => {
        WDSF.getDancerProfile(wdsfId).then(profile => {

            this.setState({
                searchedUser: profile
            });
        });
    }, 2000)

    render() {
        return (
            <View style={{ flex: 1 }}>
                <SearchBar
                    lightTheme round
                    placeholder="Vyhledvání podle Jména nebo MIN ..."
                    onChangeText={this.updateSearch}
                    value={this.state.search}
                />
                <ScrollView>
                {this.state.showAdd &&
                        <Card>
                            <Item success={!!this.state.searchedUser}>
                                {this.state.searchedUser && <Text>{this.state.searchedUser.name} {this.state.searchedUser.surname}</Text>}
                                <Input placeholder='MIN' onChangeText={this.updateText} value={this.state.addIdt && this.state.addIdt.toString()} keyboardType="number-pad" />
                                {this.state.searchedUser && <Icon name='checkmark-circle' onPress={() => this.saveNewPerson()} ><Text> Pridat</Text></Icon>}
                            </Item>
                        </Card>}
                    {this.state.user && this.state.filteredWdsf && this.state.filteredWdsf.map(profile => {
                        return <Card key={profile.id}>
                            <CardItem >
                                <Body >

                                    <Text onPress={() => this.showWdsfProfile(profile.id)}>
                                        {profile.name} {profile.surname}
                                    </Text>
                                    <Text note>{profile.id}</Text>
                                </Body>
                                <Right>
                                    <Icon onPress={() => this.removeWdsfId(profile.id)} type="FontAwesome" name="trash" color="red" />
                                </Right>
                            </CardItem>
                        </Card>
                    })}
                </ScrollView>
                <Fab
                    containerStyle={{}}
                    style={{ backgroundColor: Colors.header }}
                    position="bottomRight"
                    onPress={() => this.setState({ showAdd: true, searchedUser: undefined })}>
                    <Icon name="add" />

                </Fab>
            </View>);
    }
    saveNewPerson(): void {
        if (this.state.searchedUser) {
            if (this.state.user)
                FirebaseWorker.updateWDSFFavorites([...this.state.user.followingWdsfIds, this.state.searchedUser.id])
        }
    }
    showWdsfProfile(id: number): void {
        WDSF.getDancerAllData(id).then(x => {
            this.props.navigation.push("Wdsf", { dancerData: x })
        })
    }
}

export default FavoritesWdsfScreen;