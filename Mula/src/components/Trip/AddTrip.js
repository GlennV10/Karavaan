import React, { Component, cloneElement } from 'react';
import { StyleSheet, KeyboardAvoidingView, View, Image, Text, TextInput, Button, Modal, TouchableOpacity, ScrollView, Picker, AsyncStorage, Label,FlatList  } from 'react-native';
import { StackNavigator } from 'react-navigation';
import DatePicker from 'react-native-datepicker';
import { Switch } from 'react-native-switch';
import Autocomplete from 'react-native-autocomplete-input';

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
            onlineFriends: [],
            isLoading: true,
            trips: [],
            teller: 0,
            errors: [],
            paling:[],
            company: "",
            formatCurrencies: []
        };


    }

    componentDidMount() {
        selectedStartDate = new Date().toDateString
        selectedEndDate = new Date().toDateString

        this.getExchangeRates();
        AsyncStorage.getItem('id_teller')
            .then((id_teller) => {
                this.setState({ teller: id_teller })
            })
            .catch(error => console.log('Error loading teller'));
        console.log("MMMMm" + this.state.teller);

        AsyncStorage.getItem('userName')
        .then((userName) => {
            this.setState({ username: userName })
        })
        .catch(error => console.log('Error loading userName'));
    }
    


    addTrip() {

        this.state.errors = [];
        this.state.paling =[];
        this.renderPaling();


        
        //if(this.isValid()){
            console.log(this.state.paling)
            
            this.formatCurrenciesAPI();
            console.log(this.state.formatCurrencies)
            if (this.state.connectionMode == "online") {
                console.log("ONLINE")
                
                
                return fetch('https://193.191.177.73:8181/karafinREST/addTrip', {
                    method: 'POST',
                    header: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        "email": this.state.username,
                        "tripName": this.state.title,
                        "startDate": {
                            "dayOfMonth": parseInt(this.state.selectedStartDate.substring(0, 2)),
                            "month": parseInt(this.state.selectedStartDate.substring(3, 5)),
                            "year": parseInt(this.state.selectedStartDate.substring(6))                            
                        },
                        "endDate": {
                            "dayOfMonth": parseInt(this.state.selectedEndDate.substring(0, 2)),
                            "month": parseInt(this.state.selectedEndDate.substring(3, 5)),
                            "year": parseInt(this.state.selectedEndDate.substring(6))
                            
                        },
                        "baseCurrency": this.state.baseCurrency,
                        "rates": this.state.formatCurrencies
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
                
                let trp = {
                    tripID: this.state.teller,
                    email: this.state.username,
                    name: this.state.title,
                    startDate: this.state.selectedStartDate,
                    endDate: this.state.selectedEndDate,
                    users: this.state.selectedItems,
                    expenseList: [],
                    baseCurrency: this.state.baseCurrency,
                    currencies: this.state.formatCurrencies
                    
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
        this.props.navigation.navigate('TripParticipants');
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
    renderPaling() {

        console.log("running" + this.state.selectedCurrencies[0])
        for(let i= 0; i < this.state.selectedCurrencies.length; i++){
            for(key of Object.keys(this.state.rates)){
                if(key === this.state.selectedCurrencies[i]){
                    
                   
                    this.state.paling.push({
                        rate: this.state.rates[key],
                        val: key
                    })
                }
            }
            
        }
        console.log(this.state.paling)

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
                id: label,
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
                
                if(this.state.startDate == null ){
                    this.state.errors.push("please add a valid startDate ")
                    res = false;
                }
                if(this.state.endDate == null){
                    this.state.errors.push("please add a valid endDate ")
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
    
    
    formatCurrenciesAPI() {
        console.log(this.state.paling)
        let formatCurrencies = {};
        for(currency of this.state.paling) {
            let key = currency.val;
            formatCurrencies[key] = currency.rate;
        }
        console.log(formatCurrencies)
        this.setState({ formatCurrencies });
    }

    
    
    render() {
        const { selectedItems } = this.state;
        const { selectedGuides } = this.state;
        const { selectedCurrencies } = this.state;
        const {errors} = this.state;
        const { rates } = this.state;
        const { baseCurrency } = this.state;
        const { loadRates } = this.state;
        const {company} = this.state;
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
                    <Text>{this.state.selectedStartDate}</Text> 
                    {/*this.isFieldInError('startDate') && this.getErrorsInField('startDate').map(errorMessage => <Text>{errorMessage}</Text>) */}

                    <DatePicker
                        mode='date'
                        format='DD/MM/YYYY'
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
                <Text>{this.state.selectedEndDate}</Text>    
                
                    <DatePicker
                        mode='date'
                        format='DD/MM/YYYY'
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