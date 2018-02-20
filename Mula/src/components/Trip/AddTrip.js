import React, { Component, cloneElement } from 'react';
import { StyleSheet, KeyboardAvoidingView, View, Image, Text, TextInput, Button, Modal, TouchableOpacity, ScrollView, Picker, AsyncStorage, Label } from 'react-native';
import { StackNavigator } from 'react-navigation';
import DatePicker from 'react-native-datepicker';
import { Switch } from 'react-native-switch';
import Autocomplete from 'react-native-autocomplete-input';
import CheckBox from 'react-native-checkbox-heaven';
import FontAwesome, { Icons } from 'react-native-fontawesome';
import MultiSelect from 'react-native-multiple-select';
import I18n from 'react-native-i18n';


export default class AddTrip extends Component {

    constructor(props) {
        super(props);
        this.state = {
            users: [],
            currencies: [],
            selectedStartDate: "",
            selectedEndDate: "",
            selectedItems: [],
            selectedCurrencies: [],
            baseCurrency: "EUR",
            rates: Object,
            loadRates: true,
            title: "",
            username: "",
            loadJSON: true,
            connectionMode: "",
            offlineFriends: {
                friends: []
            },
            loadTests: true,
            onlineFriends: {},
            isLoading: true,
            tripList: []

        };

    }

    componentDidMount() {
        selectedStartDate = new Date().toDateString
        selectedEndDate = new Date().toDateString

        this.getExchangeRates();
        this.mainFetch();

    }


    addTrip() {
        if (this.state.connectionMode == "online") {
            return fetch('url', {
                method: 'POST',
                header: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    email: this.state.username,
                    title: this.state.title,
                    selectedStartDate: this.state.selectedStartDate,
                    selectedEndDate: this.state.selectedEndDate,
                    users: this.state.selectedItems,
                    baseCurrency: this.state.baseCurrency,
                    currencies: this.state.currencies
                })
            })
                .then((res) => res.json())
        }
        else {
            AsyncStorage.getItem("trips").then(trips);
            this.setState({ tripList: trips });
            tripList.push({
                email: this.state.username,
                title: this.state.title,
                selectedStartDate: this.state.selectedStartDate,
                selectedEndDate: this.state.selectedEndDate,
                users: this.state.selectedItems,
                baseCurrency: this.state.baseCurrency,
                currencies: this.state.currencies
            })
        }
    }

    //////////////////////////////////////////////////////////
    ////////////////////CURRENCY//////////////////////////////

    onSelectedCurrencyChange = selectedCurrencies => {
        this.setState({ selectedCurrencies });
        console.log(selectedCurrencies);

    };
    onSelectBaseCurrencyChange = baseCurrency => {
        this.setState({ baseCurrency });
        console.log(baseCurrency);
    }
    getExchangeRates() {
        if (this.state.loadRates) {
            return fetch('https://api.fixer.io/latest')
                .then((resp) => resp.json())
                .then((data) => this.parseRates(data));
        }
    }
    getExchangeRatesWithBase(baseCurrency) {
        var url = "https://api.fixer.io/latest?base=" + baseCurrency;
        console.log(this.state.loadRates)
        if (this.state.loadRates) {
            return fetch(url)
                .then((resp) => resp.json())
                .then((data) => this.parseRates(data));
        }
        console.log(url);
        console.log(this.state.rates)
    }

    parseRates(data) {
        if (this.state.loadRates) {
            this.setState({ loadRates: false, rates: data.rates });
        }
    }
    renderValuta(rate) {
        return Object.keys(rate).map((val) => {
            var label = val + "(" + rate[val] + ")";
            return (
                <Picker.Item value={val} label={label} key={val} />
            )
        });

    }
    renderValutaToArray(rate) {
        var array = [];
        return Object.keys(rate).map((val) => {
            var label = val + "(" + rate[val] + ")";
            array.push({
                id: val,
                name: label
            })
            this.setState({ currencies: array });

        });

    }
    renderValutaWithoutRate(rate) {
        return Object.keys(rate).map((val) => {

            return (
                <Picker.Item value={val} label={val} key={val} />
            )
        });
    }

    //////////////////////////////////////////////////////////
    ////////////////////FRIENDS//////////////////////////////

    onSelectedItemsChange = selectedItems => {
        this.setState({ selectedItems });
        console.log(selectedItems);

    };


    mainFetch() {
        // Get gerbuikersnaam uit memory
        AsyncStorage.getItem('userName').then((userName, error) => {
            if (error) {
                console.log(error);
            }
            // Set username state
            this.setState({ username: userName, loadJSON: false });
            console.log("Setting username state #1");
            // Get connection status
            AsyncStorage.getItem('connectionStatus').then((connection, error) => {
                if (error) {
                    console.log(error);
                }
                this.setState({ connectionMode: connection });
                if (this.state.connectionMode == "online") {
                    // =======================================================
                    // Get online data
                    // =======================================================
                    console.log("Fetching online data #2");
                    return fetch('http://193.191.177.169:8080/mula/Controller?action=getFriends', {
                        method: 'POST',
                        header: {
                            'Accept': 'application/json',
                            'Content-Type': 'application/json'
                        },
                        body: JSON.stringify({
                            email: this.state.username
                        })
                    }).then((response) => response.json())
                        .then((responseJson) => {

                            console.log("Set loadingStates to false #3");
                            this.setState({ isLoading: false, loadJSON: false, onlineFriends: responseJson });
                        }).then(() => {
                            // =======================================================
                            // get offline data
                            // =======================================================

                            console.log("Getting offline friends data #4");
                            AsyncStorage.getItem('friends').then((friendsJson, error) => {
                                if (error) {
                                    console.log(error);
                                }
                                this.setState({ offlineFriends: JSON.parse(friendsJson) });
                                AsyncStorage.setItem('friends', JSON.parse(friendsJson));
                                console.log("CHECK HERE");
                                console.log(this.state.offlineFriends);
                                console.log(this.state.offlineFriends.friends);
                            });
                        });
                } else {
                    // Get offline data en render
                    console.log("Connection is offline");
                    AsyncStorage.getItem('friends').then((friendsJson, error) => {
                        if (error) {
                            console.log(error);
                        }
                        // Send JSON to renderfriends
                        console.log("Parse friends with offline data #8");
                        this.setState({ friends: JSON.parse(friendsJson), offlineFriends: JSON.parse(friendsJson), loadJSON: false, isLoading: false });
                    });
                }
            })
        })

    }
    render() {
        const { selectedItems } = this.state;
        const { selectedCurrencies } = this.state;
        const { rates } = this.state;
        const { baseCurrency } = this.state;
        const { loadRates } = this.state;
        var month = new Date().getUTCMonth() + 1;
        var yeara = new Date().getFullYear() + 1;
        var yearb = new Date().getFullYear() - 1;
        var yearbefore = "" + yearb + "-" + month + "-" + new Date().getUTCDate();
        var yearafter = "" + yeara + "-" + month + "-" + new Date().getUTCDate();

        console.log();

        return (
            
            <ScrollView style={styles.container}>
                
                <View >
                    <TextInput
                        placeholder="Trip name"
                        style={styles.inputField}
                        underlineColorAndroid="transparent"
                        placeholderTextColor="#818181"
                        onChangeText={(text) => console.log(text) & this.setState({ title: text })} />
                    <TextInput
                        placeholder="Startdate"
                        value={this.state.selectedStartDate}
                        style={styles.input}
                        underlineColorAndroid="transparent"
                        placeholderTextColor="#818181"
                        keyboardType='numeric'
                        onChangeText={(text) => console.log(text) & this.setState({ selectedStartDate: text })}

                    />
                    <DatePicker
                        mode='date'
                        format='YYYY-MM-DD'
                        minDate={yearbefore}
                        maxDate={yearafter}
                        date={this.state.selectedStartDate}
                        showIcon={true}
                        placeholder="Select date..."
                        hideText={true}
                        // date={this.state.selectedDate}
                        style={[styles.input, styles.datePickerStyle]}
                        onDateChange={(date) => this.setState({ selectedStartDate: date })}
                    />
                    <TextInput
                        placeholder="Enddate"
                        value={this.state.selectedEndDate}
                        style={styles.input}
                        underlineColorAndroid="transparent"
                        placeholderTextColor="#818181"
                        keyboardType='numeric'
                        onChangeText={(text) => console.log(text) & this.setState({ selectedEndDate: text })}

                    />
                    <DatePicker
                        mode='date'
                        format='YYYY-MM-DD'
                        minDate={this.state.selectedStartDate}
                        maxDate={yearafter}
                        date={this.state.selectedEndDate}
                        showIcon={true}
                        placeholder="Select date..."
                        hideText={true}
                        // date={this.state.selectedDate}
                        style={[styles.input, styles.datePickerStyle]}
                        onDateChange={(date) => this.setState({ selectedEndDate: date })}
                    />

                </View>
                <View>
                    <Text></Text>
                </View>

                <View style={[styles.subItem]}>
                    <Text>Select your travel company</Text>
                    <MultiSelect
                        hideTags
                        items={this.state.offlineFriends.friends}
                        uniqueKey="email"
                        ref={(component) => { this.multiSelect = component }}
                        selectedItems={selectedItems}
                        onSelectedItemsChange={this.onSelectedItemsChange}
                        selectText="Pick Items"
                        searchInputPlaceholderText="Search Items..."
                        onChangeInput={(item) => console.log(item)}
                        displayKey="userName"
                        style={backgroundColor = "#d4e8e5"}
                        tagTextColor='#303030'
                        selectedItemTextColor="#edc14f"
                        selectedItemIconColor="#edc14f"
                        itemTextColor="#303030"
                        searchInputStyle={{ color: '#303030' }}
                        submitButtonColor="#edc14f"
                        submitButtonText="Submit"
                    />

                </View>
                <View style={[styles.subItem]}>
                    <Text>Select your base currency</Text>
                    <Picker style={{ flex: .50 }}
                        onValueChange={currency => this.setState({ baseCurrency: currency }) & this.setState({ loadRates: true }) & this.getExchangeRatesWithBase(currency) & this.renderValutaToArray(this.state.rates)}
                        selectedValue={this.state.baseCurrency}>
                        <Picker.Item value={this.state.baseCurrency} label={this.state.baseCurrency} key={this.state.baseCurrency} />
                        {this.renderValutaWithoutRate(this.state.rates)}
                    </Picker>
                </View>


                <View style={styles.multi}>
                    <Text>Select the other currency you're going to use on the trip</Text>
                    <MultiSelect
                        hideTags
                        items={this.state.currencies}
                        uniqueKey="id"
                        ref={(component) => { this.multiSelect = component }}
                        selectedItems={selectedCurrencies}
                        onSelectedItemsChange={this.onSelectedCurrencyChange}
                        selectText="Pick your currencies"
                        searchInputPlaceholderText="Search currency..."
                        onChangeInput={(item) => console.log(item)}
                        backgroundColor="#d4e8e5"
                        displayKey="name"
                        style={backgroundColor = "#d4e8e5"}
                        tagTextColor='#303030'
                        selectedItemTextColor="#edc14f"
                        selectedItemIconColor="#edc14f"
                        itemTextColor="#303030"
                        displayKey="name"
                        searchInputStyle={{ color: '#303030' }}
                        submitButtonColor="#edc14f"
                        submitButtonText="Submit"
                    />
                
            </View>
                <Button style={styles.savebutton}
                    title="Save"
                    onPress={() => this.addTrip() & console.log("Waiting for backend...")}

                />


            </ScrollView>
            
        );
    }

}


const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#d4e8e5',
        paddingTop: 10,
        paddingLeft: 20,
        paddingRight: 20
    },
    multi: {
        backgroundColor: '#d4e8e5',
    },
    savebutton: {
        backgroundColor: '#d4e8e5',
    },
    input: {

        backgroundColor: '#d4e8e5',
        flex: 0.5

    }



});