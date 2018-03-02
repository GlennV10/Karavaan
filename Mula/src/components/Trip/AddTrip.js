import React, { Component, cloneElement } from 'react';
import { StyleSheet, KeyboardAvoidingView, View, Image, Text, TextInput, Button, Modal, TouchableOpacity, ScrollView, Picker, AsyncStorage, Label,FlatList  } from 'react-native';
import { StackNavigator } from 'react-navigation';
import DatePicker from 'react-native-datepicker';
import { Switch } from 'react-native-switch';
import Autocomplete from 'react-native-autocomplete-input';
import CheckBox from 'react-native-checkbox-heaven';
import FontAwesome, { Icons } from 'react-native-fontawesome';
import MultiSelect from 'react-native-multiple-select';
import I18n from 'react-native-i18n';
import { TextInputMask } from 'react-native-masked-text';


export default class AddTrip extends Component{

    constructor(props) {
        super(props);
        this.state = {
            users: [],
            currencies: [],
            selectedStartDate: "",
            selectedEndDate: "",
            selectedItems: [],
            selectedFriends:[],
            selectedCurrencies: [],
            baseCurrency: "EUR",
            rates: Object,
            loadRates: true,
            title: "",
            username: "",
            loadJSON: true,
            connectionMode: "",
            offlineFriends: {},
            loadTests: true,
            onlineFriends: {},
            isLoading: true,
            trips: [],
            teller: 0,
            errors: []

        };


    }

    componentDidMount() {
        selectedStartDate = new Date().toDateString
        selectedEndDate = new Date().toDateString

        this.getExchangeRates();
        this.mainFetch();
        AsyncStorage.getItem('id_teller')
            .then(req => JSON.parse(req))
            .then((id_teller) => {
                this.setState({ teller: id_teller })
            })
            .catch(error => console.log('Error loading teller'));
        console.log("MMMMm" + this.state.teller);

    }
    


    addTrip() {

        this.state.errors = [];
        console.log("addTrip")
        //if(this.isValid()){
            console.log(this.state.teller)
            /*var month = this.state.selectedStartDate.getUTCMonth() - 1;
            var yeara =this.state.selectedStartDate.getFullYear() ;
            var day = this.state.selectedStartDate.getUTCDate() ;
    
            var endmonth = this.state.selectedEndDate.getUTCMonth() - 1;
            var yearb =this.state.selectedEndDate.getFullYear() ;
            var endday = this.state.selectedEndDate.getUTCDate() ;*/
    
            if (this.state.connectionMode == "pony") {
                return fetch('http://193.191.177.73:8080/karafinREST/addTrip', {
                    method: 'POST',
                    header: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        email: this.state.username,
                        name: this.state.title,
                        startDate: {
                            dayOfMonth: day,
                            month: month,
                            year: yeara
                        },
                        endDate: {
                            dayOfMonth: endday,
                            month: endmonth,
                            year: yearb
                        },
                        participants: this.state.selectedItems,
                        currency: this.state.baseCurrency,
                        rates: this.state.currencies
                    })
                })
                    .then((res) => res.json())
                    .then((response) => {
                        console.log("added trip successfully: " + responseJson.addTrip_succes);
                        if (responseJson.addTrip_succes === "true") {
                            this.moveOn();
                        }
                    }).catch(error => console.log("network/rest error"));
            }
            else {
                console.log("NOOOOO" + this.state.teller)
                let trp = {
                    tripID: this.state.teller,
                    email: this.state.username,
                    name: this.state.title,
                    startDate: this.state.selectedStartDate,
                    endDate: this.state.selectedEndDate,
                    users: this.state.selectedItems,
                    expenseList: [],
                    baseCurrency: this.state.baseCurrency,
                    currencies: this.state.selectedCurrencies
                    
                }
                AsyncStorage.getItem('trips')
                    .then(req => JSON.parse(req))
                    .then((trips) => {
                        trips.push(trp);
                        AsyncStorage.setItem('trips', JSON.stringify(trips))
                            .then(res => console.log(trips))
                            .catch(error => console.log('Error storing trips'));
                    })
                    .catch(error => console.log('Error loading trips'));
                var tel = parseInt(this.state.teller) + 1;
                console.log("TEL:" + tel);
    
                AsyncStorage.setItem('id_teller', JSON.stringify(tel))
                    .then(res => console.log(teller))
                    .catch(error => console.log('Error storing teller BBBB'));
    
                this.moveOn();
            }
        

        //}
        //alert(this.state.errors)
        
    }

    //////////////////////////////////////////////////////////
    ////////////////////CURRENCY//////////////////////////////
    moveOn() {
        console.log('moveOn');
        this.props.navigation.navigate('DashboardTrips');
    }

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
                .then((data) => this.parseRates(data))
                .catch(error => console.log("network/fixer error"));
        }
    }
    getExchangeRatesWithBase(baseCurrency) {
        console.log("Rates met base wordt uitgevoerd" + baseCurrency)
        var url = "https://api.fixer.io/latest?base=" + baseCurrency;
        //if (this.state.loadRates) {
        return fetch(url)
            .then((resp) => resp.json())
            .then((data) => this.parseRates(data))
            .catch(error => console.log("network/fixer error"));
        //}
        console.log(url);
    }

    parseRates(data) {
        console.log(data.rates)
        //if (this.state.loadRates) {
        this.setState({ rates: data.rates });
        this.renderValutaToArray(data.rates);
        //}
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
    isValid() {
        var res = true;
           
                if(this.state.title.length === 0 || this.state.title.length > 15){
                    this.state.errors.push("please add a valid tripName ")
                    res = false;
                }
                
                var dateType = /(\d{4})([\/-])(\d{1,2})\2(\d{1,2})/;
                var startisMatch = dateType.test(this.state.selectedStartDate);
                var endisMatch = dateType.test(this.state.selectedEndDate)
                if(!startisMatch ||this.state.startDate == null ){
                    this.state.errors.push("please add a valid startDate ")
                    res = false;
                }
                if(!endisMatch || this.state.endDate == null){
                    this.state.errors.push("please add a valid endDate ")
                    res = false;
                }
                if(this.state.selectedItems.length == 0){
                    this.state.errors.push("please add some company ")
                    res = false;
                }
            return res;
    }
    
    //////////////////////////////////////////////////////////
    ////////////////////FRIENDS//////////////////////////////

    onSelectedItemsChange = selectedItems => {
        this.setState({ selectedItems });


    };
    onSelectedGuidesChange = selectedGuides => {
        this.setState({ selectedGuides });
        console.log(selectedGuides);
    } 
    

    mainFetch() {
        // Get ... uit memory
        console.log(AsyncStorage.getItem('userName'));
        AsyncStorage.getItem('userName').then((username, error) => {
            if (error) {
                console.log(error);
            }
            // Set username state
            this.setState({ username: username, loadJSON: false });
            console.log("Setting username state #1" + this.state.username);
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
                    return fetch('http://193.191.177.73:8080/karafinREST/allPersons', {
                        method: 'GET',
                        header: {
                            'Accept': 'application/json',
                            'Content-Type': 'application/json'
                        }
                    }).then((response) => response.json())
                        .then((responseJson) => {
                            
                            console.log("Set loadingStates to false #3 "+ responseJson);
                            this.setState({ isLoading: false, loadJSON: false, offlineFriends: Array.from(responseJson) });
                        }).then(() => {
                            // =======================================================
                            // set asyncstorage data
                            // =======================================================
                            AsyncStorage.setItem('friends', JSON.stringify(this.state.offlineFriends));

                        }).catch(error => console.log("network/rest error"));
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
        const { selectedGuides } = this.state;
        const { selectedCurrencies } = this.state;
        const {errors} = this.state;
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
                        
                
                        <View style={styles.separator}>
                            <TextInput
                                ref="tripName"
                                placeholder={I18n.t('tripname')}
                                style={styles.inputField}
                                underlineColorAndroid="transparent"
                                placeholderTextColor="#818181"
                                onChangeText={(text) => console.log(text) & this.setState({ title: text })} />
                        </View>
                    
                <View style={{ flex: 1, flexDirection: 'row' }}>
                    <TextInput
                        ref="startDate"
                        placeholder={I18n.t('startdate')}
                        
                        value={this.state.selectedStartDate}
                        style={styles.inputdate}
                        underlineColorAndroid="transparent"
                        placeholderTextColor="#818181"
                        keyboardType='numeric'
                        onChangeText={(text) => console.log(text) & this.setState({ selectedStartDate: text })}
                    />
                    {/*this.isFieldInError('startDate') && this.getErrorsInField('startDate').map(errorMessage => <Text>{errorMessage}</Text>) */}

                    <DatePicker
                        mode='date'
                        format='YYYY-MM-DD'
                        minDate={yearbefore}
                        maxDate={yearafter}
                        date={this.state.selectedStartDate}
                        showIcon={true}
                        placeholder={I18n.t('selectdate')}
                        hideText={true}
                        // date={this.state.selectedDate}
                        style={[styles.input, styles.datePickerStyle]}
                        onDateChange={(date) => this.setState({ selectedStartDate: date })}
                    />
                </View >

                <View style={[{ flex: 1, flexDirection: 'row' }, styles.separator]}>
                  <TextInput
                    ref="endDate"
                    placeholder={I18n.t('enddate')}
                    
                    value={this.state.selectedEndDate}
                    style={styles.inputdate}
                    underlineColorAndroid="transparent"
                    placeholderTextColor="#818181"
                    keyboardType='numeric'
                    onChangeText={(text) => console.log(text) & this.setState({ selectedEndDate: text })}
                />
                    <DatePicker
                        mode='date'
                        format='YYYY-MM-DD'
                        minDate={yearbefore}
                        maxDate={yearafter}
                        date={this.state.selectedEndDate}
                        showIcon={true}
                        placeholder={I18n.t('selectdate')}
                        hideText={true}
                        // date={this.state.selectedDate}
                        style={[styles.input, styles.datePickerStyle]}
                        onDateChange={(date) => this.setState({ selectedEndDate: date })}
                    />

                </View>

                <View style={[styles.subItem, styles.separator]}>
                    <Text style={styles.textfield}>{I18n.t('company')}</Text>
                    <MultiSelect
                        hideTags
                        items={this.state.offlineFriends}
                        uniqueKey="email"
                        ref={(component) => { this.multiSelect = component }}
                        selectedItems={selectedItems}
                        onSelectedItemsChange={this.onSelectedItemsChange}
                        selectText={I18n.t('company')}
                        searchInputPlaceholderText={I18n.t('company')}
                        onChangeInput={(item) => console.log(item)}
                        displayKey="email"
                        style={backgroundColor = "#d4e8e5"}
                        selectedItemTextColor="#edc14f"
                        selectedItemIconColor="#edc14f"
                        itemTextColor="#303030"
                        searchInputStyle={{ color: '#303030' }}
                        submitButtonColor="#edc14f"
                        submitButtonText={I18n.t('submit')}
                        color="#303030" />
                </View>
                

                <View style={[styles.subItem, styles.separator]}>
                    <Text>{I18n.t('tripcurrency')}</Text>
                    <Picker style={{ flex: .50 , backgroundColor:"#FFFFFF"}}
                        onValueChange={currency => this.setState({ baseCurrency: currency }) & this.setState({ loadRates: true }) & this.getExchangeRatesWithBase(currency)}
                        selectedValue={this.state.baseCurrency}>
                        <Picker.Item value="EUR" label="EUR" key="EUR" />
                        <Picker.Item value="USD" label="USD" key="USD" />
                    </Picker>
                </View>


                <View>
                    <Text style={styles.textfield}>{I18n.t('othercurrency')}</Text>
                    <MultiSelect
                        hideTags
                        items={this.state.currencies}
                        uniqueKey="id"
                        ref={(component) => { this.multiSelect = component }}
                        selectedItems={selectedCurrencies}
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
                        displayKey="name"
                        searchInputStyle={{ color: '#303030' }}
                        submitButtonColor="#edc14f"
                        submitButtonText={I18n.t('submit')}
                    />


                </View>

                {/* <View style={[styles.subItem, styles.separator]}>
                <Text style ={styles.textfield}>Select your base currency</Text>
                <Picker style={{flex:.50}}           
                    onValueChange={currency => this.setState({baseCurrency: currency}) &this.setState({loadRates: true}) & this.getExchangeRatesWithBase(currency) & this.renderValutaToArray(this.state.rates)}
                    selectedValue={this.state.baseCurrency}>
                    <Picker.Item value= {this.state.baseCurrency} label={this.state.baseCurrency} key={this.state.baseCurrency}/>
                    {this.renderValutaWithoutRate(this.state.rates)}
                </Picker>
            </View>
           
            
            <View style={[styles.subItem]}>
                <Text style ={styles.textfield}>Select the other currency you're going to use on the trip</Text>
                <MultiSelect
                    hideTags
                    items={this.state.currencies}
                    uniqueKey="id"
                    ref={(component) => { this.multiSelect = component }}
                    selectedItems={selectedCurrencies}
                    onSelectedItemsChange={this.onSelectedCurrencyChange}
                    selectText="Pick your currencies"
                    searchInputPlaceholderText="Search currency..."
                    onChangeInput={ (item)=> console.log(item)}
                    backgroundColor ="#d4e8e5"
                    displayKey="name"
                    tagTextColor='#303030'
                    selectedItemTextColor="#edc14f"
                    selectedItemIconColor="#edc14f"
                    itemTextColor="#303030"
                    displayKey="name"
                    searchInputStyle={{ color: '#303030' }}
                    submitButtonColor="#edc14f"
                    submitButtonText="Submit"
                    color = "#edc14f"
                    
                    
                    
                /> 
                
            </View>*/}
                <Button color="#edc14f"
                    title={I18n.t('savetrip')}
                    onPress={() => this.addTrip() & console.log("Waiting for backend...")}

                />
                <View>
                    <FlatList
                        data={this.state.errors}
                        renderItem={({error}) => <Text>{error}</Text>}
                    />
                </View>

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
        margin: 10
    },
    parts: {

    },
    input: {
        backgroundColor: '#d4e8e5',
        flex: 0.2
    },
    inputdate: {
        backgroundColor: '#d4e8e5',
        flex: 0.75
    },
    textfield: {
        paddingBottom: 8,
        marginBottom: 10

    },
    separator: {
        borderBottomColor: '#bbb',
        borderBottomWidth: StyleSheet.hairlineWidth,
        marginBottom: 5
    }




});