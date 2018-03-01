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
            tripRates: []
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
        this.updateTripRate()
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
        let trip = this.props.navigation.state.params.trip;
        return this.state.tripRates.map((rate, index) => {
            return (
                <View style={styles.currencyView} key={index}>
                    <Text style={styles.currencyField}>{rate.name}</Text>
                    <Text style={styles.currencyField2}>(-> {trip.baseCurrency})</Text>
                    <TextInput
                        style={styles.currencyInput}
                        value={rate.value.toString()}
                        underlineColorAndroid="transparent"
                        placeholderTextColor="#818181"
                        keyboardType='numeric'
                        onChangeText={(text) => console.log(text) & this.updateRate(rate, text)}
                    />
                </View>
            )
        });
    }

    updateRate(rate, text) {
        let tripCurrencyRates = this.state.tripRates.slice();
        for (r of tripCurrencyRates) {
            if (r.name == rate.name) {
                rate.value = this.checkAmount(text);             
            }
        }
        this.setState({tripCurrencyRates})
        console.log(tripCurrencyRates);
        this.renderChangeRates();
    }

    updateTripRate() {
        //================================================================
        //====================RATES MEEGEVEN MET TRIP=====================
        //================================================================
    }

    checkAmount(text) {
        var newText = '';
        let numbers = '0123456789';
        var containsComma = false;

        for (var i = 0; i < text.length; i++) {
            if (numbers.indexOf(text[i]) > -1) {
                newText = newText + text[i];
            }
            if (text[i] === ',' && containsComma === false) {
                newText = newText + '.';
                containsComma = true;
            }
            if (text[i] === '.' && containsComma === false) {
                newText = newText + '.';
                containsComma = true;
            }
        }
        containsComma = false;

        return newText
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
                    <Text>{I18n.t('changecurrency')}</Text>
                    {this.renderChangeRates()}

                </View>

                <View>
                    <Text style={styles.textfieldaboveMultiSelect}>{I18n.t('addguides')}</Text>
                    <MultiSelect
                        hideTags
                        items={["test", "test"]}
                        uniqueKey="email"
                        ref={(component) => { this.multiSelect = component }}
                        selectedItems={selectedItems}
                        onSelectedItemsChange={this.onSelectedItemsChange}
                        selectText="Kies guides"
                        searchInputPlaceholderText={I18n.t('chooseguide')}
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
        // flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        flexDirection: 'row'
    },
    currencyField: {
        flex: .2,
        textAlign: 'left',
        paddingLeft: 10
    },
    currencyField2: {
        flex: .2,
        textAlign: 'left',
        paddingLeft: 10
    },
    currencyInput: {
        flex: .6,
        textAlign: 'center'
    }
});
