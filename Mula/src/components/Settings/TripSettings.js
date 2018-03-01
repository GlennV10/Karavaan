import React, { Component } from 'react';
import { AsyncStorage, StyleSheet, View, Image, Text, TextInput, Button, TouchableOpacity, BackHandler, Picker, Alert } from 'react-native';
import { StackNavigator } from 'react-navigation';
import I18n from 'react-native-i18n';
import MultiSelect from 'react-native-multiple-select';

export default class TripSettings extends Component {

    constructor(props) {
        super(props);
        this.state = {
            name: "",
            username: "",
            password: "",
            language: "",
            currency: "",
            selectedItems: [],
            tripRates: ""
        }
    }

    async componentDidMount() {

        AsyncStorage.getItem('currency').then((currency) => {
            this.setState({ currency });
        });

        await this.getTrip();
        this.props.navigation.addListener("didFocus", () => BackHandler.addEventListener('hardwareBackPress', this._handleBackButton));
        this.props.navigation.addListener("willBlur", () => BackHandler.removeEventListener('hardwareBackPress', this._handleBackButton))
    }

    _handleBackButton = () => {
        this.props.navigation.navigate('DashboardTrips');
        return true;
    }

    updateCurrency(newCurrency) {
        this.setState({ currency: newCurrency });
        AsyncStorage.setItem('currency', newCurrency).then(console.log("Currency updated to " + newCurrency));
    }

    askToDeleteTrip() {
        Alert.alert(
            I18n.t('delete'),
            I18n.t('deletetrip'), [{
                text: 'Cancel',
                onPress: () => console.log('Cancel Pressed'),
                style: 'cancel'
            }, {
                text: 'OK',
                onPress: () => this.deleteTrip()
            },], {
                cancelable: false
            }
        )
        return true;
    }

    deleteTrip() {
        let trip = this.props.navigation.params.state.trip;
        //deletetrip
    }

    onSelectedItemsChange = selectedItems => {
        this.setState({ selectedItems });
        console.log(selectedItems);

    };

    renderChangeRates() {
        var result = [];
        if (this.state.tripRates.length > 0) {
            for (let rate = 0; rate < this.state.tripRates.length; rate++) {
                result.push(
                    <View style={styles.currencyView} key={rate}>
                        <View style={styles.currencyField}>
                            <Text >{this.state.tripRates[rate].name}</Text>
                        </View>
                        <View style={styles.currencyInput}>
                            <TextInput
                                placeholder={this.state.tripRates[rate].value + ""}
                                
                                underlineColorAndroid="transparent"
                                placeholderTextColor="#818181"
                                keyboardType='numeric'
                                onChangeText={(text) => console.log(text) & this.updateRate(rate, text)}
                            />
                        </View>
                    </View>)
            }
        } else {
            alert("niks gedaan")
        }
        return result;
    }

    updateRate(r, t) {
        alert("test")
    }

    getTrip() {
        let trip = this.props.navigation.state.params.trip;
        return fetch('http://193.191.177.73:8080/karafinREST/getTrip/' + trip.id, {
            method: 'GET',
            header: {
                'Content-Type': 'application/json'
            }
        })
            .then((res) => res.json())
            .then((trip) => {
                this.renderValutaToArray(trip.rates)
            });
    }

    renderValutaToArray(rate) {
        var array = [];
        Object.keys(rate).map((val) => {
            array.push({
                name: val,
                value: rate[val]
            })
        });
        this.setState({ tripRates: array })
    }

    render() {
        const { selectedItems } = this.state;
        return (
            <View style={styles.container}>
                <View style={styles.separator}>
                    <Text>{I18n.t('currency')}</Text>
                    <Picker selectedValue={this.state.currency} onValueChange={(itemValue, itemIndex) => this.updateCurrency(itemValue)}>
                        <Picker.Item label="Euro" value="Euro" />
                        <Picker.Item label="American Dollar" value="USD" />
                    </Picker>
                </View>

                <View style={styles.separator}>
                    <Text>Verander de currency rate</Text>
                    {this.renderChangeRates()}

                </View>

                <View>
                    <Text style={styles.textfieldaboveMultiSelect}>Voeg reisbegeleiders toe</Text>
                    <MultiSelect
                        hideTags
                        items={["test", "test"]}
                        uniqueKey="email"
                        ref={(component) => { this.multiSelect = component }}
                        selectedItems={selectedItems}
                        onSelectedItemsChange={this.onSelectedItemsChange}
                        selectText="Kies guides"
                        searchInputPlaceholderText="Kies guides"
                        onChangeInput={(item) => console.log(item)}
                        displayKey="userName"
                        style={backgroundColor = "#d4e8e5"}
                        selectedItemTextColor="#edc14f"
                        selectedItemIconColor="#edc14f"
                        itemTextColor="#303030"
                        searchInputStyle={{ color: '#303030' }}
                        submitButtonColor="#edc14f"
                        submitButtonText={I18n.t('submit')}
                        color="#303030" />
                </View>


                <View>
                    <TouchableOpacity style={styles.button} onPress={() => this.askToDeleteTrip()}>
                        <Text style={styles.buttonText}>{I18n.t('delete')}</Text>
                    </TouchableOpacity>
                </View>


            </View>

        )
    }

}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#FFFFFF',
        alignSelf: 'stretch',
        padding: 20
    },
    profileImage: {
        width: 80,
        height: 80,
        borderRadius: 40
    },
    profileButton: {
        alignSelf: 'center'
    },
    logoutButton: {
        height: 40,
        alignItems: 'center',
        backgroundColor: '#ffd185',
        borderRadius: 5
    },
    logoutText: {
        fontSize: 12,
        lineHeight: 28,
        color: '#303030',
        textAlign: 'center'
    },
    button: {
        height: 40,
        alignItems: 'center',
        backgroundColor: '#ffd185',
        borderRadius: 5,
        marginTop: 10
    },
    buttonText: {
        fontSize: 15,
        lineHeight: 28,
        color: '#303030',
        textAlign: 'center'
    },
    separator: {
        borderBottomColor: '#bbb',
        borderBottomWidth: StyleSheet.hairlineWidth,
        marginBottom: 5,
        marginTop: 5
    },
    textfieldaboveMultiSelect: {
        marginBottom: 10
    },
    currencyView: {
        flex: 1,
        flexDirection: 'row'
    },
    currencyField: {
        flex: 0.2
    },
    currencyInput: {
        flex: 0.8
    }
});