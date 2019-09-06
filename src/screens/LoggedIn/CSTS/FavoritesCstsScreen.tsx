import * as React from 'react';
import { ScrollView } from 'react-native-gesture-handler';
import { ComponentBase } from 'resub';
import { View, Card, Text, Body, CardItem, Right, Icon, Button, Fab, Input, Item } from 'native-base';
import { SearchBar } from 'react-native-elements';
import UserStore from '../../../strores/UserStore';
import { User } from '../../../objects/firebaseUser';
import { NavigationScreenProps } from 'react-navigation';
import { debounce } from 'lodash';
import { Profile } from '../../../objects/profileData';
import CSTS from '../../../server/cstsCommunicator';
import Colors from '../../../constants/Colors';
import FirebaseWorker from '../../../objects/FirebaseWorker';

export interface FavoritesCstsScreenProps extends NavigationScreenProps, React.Props<any> {

}

export interface FavoritesCstsScreenState {
    search?: string,
    user?: User,
    followingCsts?: Profile[]
    filteredCsts?: Profile[],
    showAdd: boolean,
    addIdt?: number,
    searchedUser?: Profile

}

class FavoritesCstsScreen extends ComponentBase<FavoritesCstsScreenProps, FavoritesCstsScreenState> {
    protected _buildState(props: FavoritesCstsScreenProps, initialBuild: boolean): FavoritesCstsScreenState {
        var user = UserStore.getUser();
        if (user)
            this.mapFollowing(user.followingCstsIdts);
        return {
            search: undefined,
            user: user,
            showAdd: false,
            addIdt: undefined,
            searchedUser: undefined
        }
    }
    mapFollowing = (followingCstsIdts: number[]) => {
        this.setState({ followingCsts: [], filteredCsts: [] }, () =>
            followingCstsIdts.forEach(cstsIdt => {
                CSTS.getDancerProfile(cstsIdt).then(profile => {
                    ;
                    this.setState({ followingCsts: [...this.state.followingCsts, profile], filteredCsts: [...this.state.filteredCsts, profile] });
                })
            })
        )
    }



    static navigationOptions = ({ navigation }: NavigationScreenProps) => {
        const { params } = navigation.state;
        return {
            headerLeft: <Button transparent><Icon name="menu" style={{ color: "black" }}
                onPress={() => navigation.openDrawer()} /></Button>,
            title: 'CSTS - Oblibene',
        }
    };

    removeCstsIdt = (cstsIdt: number) => {
        if (this.state.user) {
            const filtered = this.state.user.followingCstsIdts.filter(x => x !== cstsIdt);
            FirebaseWorker.updateCSTSFavorites(filtered)
        }
    }

    updateSearch = (search: string) => {
        var toSearch = search.toLowerCase()
        var data = this.state.followingCsts ? this.state.followingCsts.filter(x => x.Jmeno.toLowerCase().includes(toSearch) || x.Prijmeni.toLowerCase().includes(toSearch) || x.IdtClena.toString().includes(toSearch)) : [];

        this.setState({ search, filteredCsts: data });
    };

    updateText = (text: string | undefined) => {
        this.setState({ addIdt: text ? parseInt(text) : undefined, searchedUser: undefined });
        if (text)
            this.searchCstsByIdt(text)
    }

    searchCstsByIdt = debounce((cstsIdt: string) => {
        CSTS.getDancerProfile(cstsIdt).then(profile => {

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
                    placeholder="Vyhledávání podle Jména nebo IDT ..."
                    onChangeText={this.updateSearch}
                    value={this.state.search}
                />
                <ScrollView>
                    {this.state.showAdd &&
                        <Card>
                            <Item success={!!this.state.searchedUser}>
                                {this.state.searchedUser && <Text>{this.state.searchedUser.Jmeno} {this.state.searchedUser.Prijmeni}</Text>}
                                <Input placeholder='IDT Clena' onChangeText={this.updateText} value={this.state.addIdt && this.state.addIdt.toString()} keyboardType="number-pad" />
                                {this.state.searchedUser && <Icon name='checkmark-circle' onPress={() => this.saveNewPerson()} ><Text> Pridat</Text></Icon>}
                            </Item>
                        </Card>}
                    {this.state.user && this.state.filteredCsts && this.state.filteredCsts.map(profile => {
                        return <Card key={profile.IdtClena}>
                            <CardItem >
                                <Body >

                                    <Text onPress={() => this.showCstsProfile(profile.IdtClena)}>
                                        {profile.Jmeno} {profile.Prijmeni}
                                    </Text>
                                    <Text note>{profile.IdtClena}</Text>
                                </Body>
                                <Right>
                                    <Icon onPress={() => this.removeCstsIdt(profile.IdtClena)} type="FontAwesome" name="trash" color="red" />
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
                FirebaseWorker.updateCSTSFavorites([...this.state.user.followingCstsIdts, this.state.searchedUser.IdtClena])
        }
    }
    showCstsProfile(id: number): void {
        CSTS.getDancerAllData(id).then(x => {
            this.props.navigation.push("Csts", { dancerData: x })
        })
    }
}

export default FavoritesCstsScreen;