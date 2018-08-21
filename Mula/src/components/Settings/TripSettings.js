import React, { Component } from 'react';
import { AsyncStorage, ScrollView, StyleSheet, View, Image, Text, TextInput, Button, TouchableOpacity, BackHandler, Picker, Alert, KeyboardAvoidingView } from 'react-native';
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
            trip: null,
            currenciesValue: [],
            currencies: [],
            selectedCurrencies: [],
            selectedItems: [],
            tripParticipants: [],
            originalRates: [],
            rates: [],
            tripRates: [],
            participants: [],
            firstName: "",
            lastName: "",
            email: "",

        }
    }

    async componentDidMount() {
        AsyncStorage.getItem('currency').then((currency) => {
            this.setState({ currency });
        });
        await this.getTrip();
        this.props.navigation.addListener("didFocus", () => this.getTrip() & BackHandler.addEventListener('hardwareBackPress', this._handleBackButton));
        this.props.navigation.addListener("willBlur", () => BackHandler.removeEventListener('hardwareBackPress', this._handleBackButton))
        this.renderCurrentValutaToArrayLabel(this.props.navigation.state.params.trip.rates);
    }

    _handleBackButton = () => {
        this.props.navigation.navigate('DashboardTrips');
        return true;
    }

    updateCurrency(newCurrency) {
        this.setState({ currency: newCurrency });
        AsyncStorage.setItem('currency', newCurrency).then(console.log("Currency updated to " + newCurrency));
    }

    async checkEmail() {
        if (this.state.email === null || this.state.email === "") {
            await this.addDummyParticipant()
            await this.addParticipant()
        } else {
            await this.addParticipant()
        }
    }

    addDummyParticipant() {
        this.state.errors = [];
        console.log("dummy")
        var url = "http://193.191.177.73:8080/karafinREST/addDummyPerson/" + this.state.firstName + "/" + this.state.lastName
        return fetch(url, {
            method: 'POST',
            header: {
                'Content-Type': 'application/json'
            }

        })

            .then((res) => res.json())
            .then((response) => {
                console.log("added dummy successfully: ");
                console.log(response.email)
                this.setState({ email: response.email })
            }).catch(error => this.checkError(error));
    }

    checkError(error) {
        if (error === "Participant already added.") {
            alert(I18n.t('alreadyadded'))
            this.clearFields()
        } else if (error === "Invalid arguments") {
            this.clearEmail()
            alert(I18n.t('falseemail'))
        } else {
            this.clearFields()
        }
    }

    addParticipant() {
        if (this.state.firstName === null || this.state.firstName === "") {
            alert("Firstname cannot be empty")
        } else if (this.state.lastName === null || this.state.lastName === "") {
            alert("Lastname cannot be empty")
        } else {
            console.log(this.props.navigation.state.params.trip.id)
            var url = "http://193.191.177.73:8080/karafinREST/addPersonToTripFromEmail/" + this.state.email + "/" + this.props.navigation.state.params.trip.id
            return fetch(url, {
                method: 'POST',
                header: {
                    'Content-Type': 'application/json'
                }

            })
                .then((response) => {
                    this.checkError(response._bodyText)
                    this.renderParticipants()
                }).catch(error => console.log("Invalid"));
        }
    }

    clearFields() {
        this.setState({ firstName: "", lastName: "", email: "" })
        this.getTrip();
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
        let trip = this.props.navigation.state.params.trip;

        let url = 'http://193.191.177.73:8080/karafinREST/removeTrip/' + trip.id;
        return fetch(url, {
            method: 'POST',
            header: {
                'Content-Type': 'application/json'
            }
        })
            .then((res) => {
                console.log(res);
                this.props.navigation.navigate('DashboardTrips');
            })
            .catch((error) => console.log(error));
    }

    onSelectedCurrencyChange = selectedCurrencies => {
        let tripRates = [];
        for (currency of this.state.currenciesValue) {
            for (selectedCurrency of selectedCurrencies) {
                if (selectedCurrency == currency.name) {
                    console.log(currency);
                    tripRates.push(currency);
                }
            }
        }
        this.setState({ tripRates });
        this.setState({ selectedCurrencies });
        console.log(selectedCurrencies);
    };

    onSelectedItemsChange = selectedItems => {
        console.log(selectedItems);
        this.setState({ selectedItems }, this.updateTripGuides(selectedItems));
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
                        onChangeText={(text) => console.log(text) & this.updateRate(rate, text)} />
                </View>
            )
        });
    }

    renderParticipants() {        
        return this.state.participants.map((participant, index) => {
            this.state.tripParticipants.push(participant)
            return (
                <View key={index}>
                    <Text>{participant[0].firstName} {participant[0].lastName}</Text>
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
        this.setState({ tripCurrencyRates })
        console.log(tripCurrencyRates);
        this.renderChangeRates();
    }

    updateTripGuides(guides) {
        let trip = this.props.navigation.state.params.trip;
        for (participant of trip.participants) {
            if (!(participant[1] === 'ADMIN')) {
                if (guides.includes(participant[0].email)) {
                    participant[1] = 'GUIDE'
                } else {
                    participant[1] = 'PARTICIPANT'
                }
            }
        }
    }

    updateTrip() {
        let trip = this.props.navigation.state.params.trip;
        trip.rates = this.formatCurrenciesAPI(trip);
        trip.participants = this.state.tripParticipants;
        console.log(trip.rates);
        let url = 'http://193.191.177.73:8080/karafinREST/updateTrip';
        return fetch(url, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(trip)
        }).then((res) => console.log(res)).catch((error) => console.log(error))
    }

    formatCurrenciesAPI(trip) {
        let formatCurrencies = {};
        for (currency of this.state.selectedCurrencies) {
            formatCurrencies[currency] = this.state.fixerRates[currency];
        }
        return formatCurrencies;
    }

    async saveTrip() {
        await this.updateTrip();
        Alert.alert(I18n.t('saved'));
        this.props.navigation.navigate('DashboardTrips')
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

        return newText;
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
                this.setState({ trip });
                this.setState({ participants: trip.participants });
                let participants = [];
                let guides = [];
                for (participant of trip.participants) {
                    if (!(participant[1] === 'ADMIN')) {
                        let newParticipant = {
                            email: participant[0].email,
                            name: participant[0].firstName + " " + participant[0].lastName
                        }
                        participants.push(newParticipant);
                    }
                    if (participant[1] === 'GUIDE') {
                        guides.push(participant[0].email)
                    }
                }
                this.setState({ selectedItems: guides });
                this.setState({ tripParticipants: participants });
                this.setState({ rates: trip.rates });
                this.renderValutaToArray(trip.rates);
                this.getExchangeRatesWithBase(trip.baseCurrency)
                trip.
                    this.renderValutaToArray(trip.rates)
            }).catch(error => console.log("network/rest error"));
    }

    renderValutaToArray(rate) {
        var array = [];
        Object.keys(rate).map((val) => {
            array.push({
                name: val,
                value: rate[val]
            })
        });
        this.setState({ tripRates: array });
        this.setState({ originalRates: array });
        this.setState({ tripCurrencyRates: array });
    }

    getExchangeRatesWithBase(baseCurrency) {
        console.log("Rates met base wordt uitgevoerd " + baseCurrency)
        var url = "http://api.openrates.io/latest?base=" + baseCurrency;
        //if (this.state.loadRates) {
        return fetch(url)
            .then((resp) => resp.json())
            .then((data) => this.parseRates(data) & this.setState({ fixerRates: data.rates }))
            .catch(error => console.log("network/fixer error"));
        //}
        console.log(url);
    }

    parseRates(data) {
        console.log(data.rates)
        //if (this.state.loadRates) {
        this.renderValutaToArrayLabel(data.rates);
        this.renderValutaToArrayValue(data.rates);
        //}
    }

    renderValutaToArrayValue(rate) {
        var array = [];
        Object.keys(rate).map((val) => {
            array.push({
                name: val,
                value: rate[val]
            })
        });
        this.setState({ currenciesValue: array });
    }

    renderValutaToArrayLabel(rate) {
        var array = [];
        Object.keys(rate).map((val) => {
            var label = val + "(" + rate[val] + ")";
            array.push({
                id: val,
                name: label
            })
        });
        this.setState({ currencies: array });
    }

    renderCurrentValutaToArrayLabel(rate) {
        var array = [];
        Object.keys(rate).map((val) => {
            array.push(val);
        });
        console.log(array);
        this.setState({ selectedCurrencies: array });
    }

    render() {
        const { selectedItems } = this.state;
        return (
            <ScrollView style={styles.container}>
                <View style={styles.separator}>
                    <Text style={styles.textfieldaboveMultiSelect}>{I18n.t('addcurrency')}</Text>
                    <MultiSelect
                        hideTags
                        items={this.state.currencies}
                        uniqueKey="id"
                        ref={(component) => { this.multiSelect = component }}
                        selectedItems={this.state.selectedCurrencies}
                        onSelectedItemsChange={this.onSelectedCurrencyChange}
                        selectText={I18n.t('pickcurrency')}
                        searchInputPlaceholderText={I18n.t('pickcurrency')}
                        onChangeInput={(item) => console.log(item)}
                        backgroundColor="#d4e8e5"
                        displayKey="name"
                        style={backgroundColor = "#d4e8e5"}
                        tagTextColor='#303030'
                        selectedItemTextColor="#edc14f"
                        selectedItemIconColor="#edc14f"
                        itemTextColor="#303030"
                        searchInputStyle={{ color: '#303030' }}
                        submitButtonColor="#edc14f"
                        submitButtonText={I18n.t('submit')} />
                </View>

                <View style={styles.separator}>
                    <Text>{I18n.t('changecurrency')}</Text>
                    {this.renderChangeRates()}
                </View>

                <View>
                    <Text style={styles.textfieldaboveMultiSelect}>{I18n.t('addguides')}</Text>
                    <MultiSelect
                        hideTags
                        items={this.state.tripParticipants}
                        uniqueKey="email"
                        ref={(component) => { this.multiSelect = component }}
                        selectedItems={this.state.selectedItems}
                        onSelectedItemsChange={this.onSelectedItemsChange}
                        selectText="Kies guides"
                        searchInputPlaceholderText={I18n.t('chooseguide')}
                        onChangeInput={(item) => console.log(item)}
                        displayKey={"name"}
                        style={backgroundColor = "#d4e8e5"}
                        selectedItemTextColor="#edc14f"
                        selectedItemIconColor="#edc14f"
                        itemTextColor="#303030"
                        searchInputStyle={{ color: '#303030' }}
                        submitButtonColor="#edc14f"
                        submitButtonText={I18n.t('submit')}
                        color="#303030" />
                </View>
                <KeyboardAvoidingView behavior="padding" keyboardVerticalOffset={100}>
                    <View>
                        <View style={styles.separator}>
                            <TextInput
                                ref="firstName"
                                placeholder={I18n.t('first')}
                                value={this.state.firstName}
                                style={styles.inputField}
                                underlineColorAndroid="transparent"
                                placeholderTextColor="#818181"
                                onChangeText={(text) => console.log(text) & this.setState({ firstName: text })} />
                        </View>
                        <View style={styles.separator}>
                            <TextInput
                                ref="lastName"
                                placeholder={I18n.t('last')}
                                value={this.state.lastName}
                                style={styles.inputField}
                                underlineColorAndroid="transparent"
                                placeholderTextColor="#818181"
                                onChangeText={(text) => console.log(text) & this.setState({ lastName: text })} />
                        </View>
                        <View style={styles.separator}>
                            <TextInput
                                ref="email"
                                placeholder="email"
                                value={this.state.email}
                                style={styles.inputField}
                                underlineColorAndroid="transparent"
                                placeholderTextColor="#818181"
                                onChangeText={(text) => console.log(text) & this.setState({ email: text })} />
                        </View>

                        <View style={styles.addParticipantStyle}>
                            <TouchableOpacity style={styles.button}
                                onPress={() => this.checkEmail()}>
                                <Text style={styles.buttonText}>{I18n.t('addparticipant')}</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </KeyboardAvoidingView>

                <View style={styles.separator}>
                    {this.renderParticipants()}
                </View>

                <View style={styles.buttons}>
                    <TouchableOpacity style={styles.button} onPress={() => this.saveTrip()}>
                        <Text style={styles.buttonText}>{I18n.t('save')}</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.button} onPress={() => this.askToDeleteTrip()}>
                        <Text style={styles.buttonText}>{I18n.t('delete')}</Text>
                    </TouchableOpacity>
                </View>
            </ScrollView>
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
    },
    buttons: {
        marginBottom: 25
    },
    addParticipantStyle: {
        marginBottom: 10
    },
});
