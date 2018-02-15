import React, {Component, cloneElement} from 'react';
import {StyleSheet, View, Image, Text, TextInput, Button, Modal, TouchableOpacity, ScrollView, Picker, AsyncStorage,Label} from 'react-native';
import {StackNavigator} from 'react-navigation';
import DatePicker from 'react-native-datepicker';
import {Switch} from 'react-native-switch' ;
import Autocomplete from 'react-native-autocomplete-input';
import CheckBox from 'react-native-checkbox-heaven';
import FontAwesome, {Icons} from 'react-native-fontawesome';
import MultiSelect from 'react-native-multiple-select';
import I18n from 'react-native-i18n';

var items = [{
    id: '92iijs7yta',
    name: 'Appel',
  }, {
    id: 'a0s0a8ssbsd',
    name: 'Ogun',
  }, {
    id: '16hbajsabsd',
    name: 'Calabar',
  }, {
    id: 'nahs75a5sg',
    name: 'Lagos',
  }, {
    id: '667atsas',
    name: 'Maiduguri',
  }, {
    id: 'hsyasajs',
    name: 'Anambra',
  }, {
    id: 'djsjudksjd',
    name: 'Benue',
  }, {
    id: 'sdhyaysdj',
    name: 'Kaduna',
  }, {
    id: 'suudydjsjd',
    name: 'Abuja',
  }];
export default class AddTrip extends Component{
    
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
            loadRates: true

            
        };
        
      }
  
      componentDidMount() {
        selectedStartDate = new Date().toDateString
        selectedEndDate = new Date().toDateString
         
        this.getExchangeRates();
        
      }
    onSelectedItemsChange = selectedItems => {
        this.setState({ selectedItems });
        console.log(selectedItems);
        
      };
    onSelectedCurrencyChange = selectedCurrencies => {
        console.log("hallo");
        this.setState({ selectedCurrencies });
        console.log(selectedCurrencies);
        
      };
    onSelectBaseCurrencyChange = baseCurrency => { 
        this.setState({baseCurrency});
        console.log(baseCurrency);
    }

      //GET EXCHANGE RATES
    getExchangeRates(){
        if(this.state.loadRates){
            return fetch('https://api.fixer.io/latest')
            .then((resp) => resp.json())
            .then((data) => this.parseRates(data));
        }
    }
    getExchangeRatesWithBase(baseCurrency){
        var url = "https://api.fixer.io/latest?base="+baseCurrency;
        console.log(this.state.loadRates)
        if(this.state.loadRates){
            return fetch(url)
            .then((resp) => resp.json())
            .then((data) => this.parseRates(data));
        }
        console.log(url);
        console.log(this.state.rates)
    }
    
    parseRates(data){
        if(this.state.loadRates){
            this.setState({loadRates:false, rates: data.rates});
        }
    }
    renderValuta(rate){
        return Object.keys(rate).map((val)=> {
            var label= val+"("+ rate[val]+")";
            return(
                <Picker.Item value={val} label={label} key={val}/>
            )
        });
        
    }
    renderValutaToArray(rate){
        var array = [];
        return Object.keys(rate).map((val)=> {
            var label= val+"("+ rate[val]+")";
            array.push({
                id: val,
                name: label
              })
            this.setState({currencies: array});
            
        });
        
    }
    renderValutaWithoutRate(rate){
        return Object.keys(rate).map((val)=> {
            
            return(
                <Picker.Item value={val} label={val} key={val}/>
            )
        });
    }
      
    render(){
        const { selectedItems } = this.state;
        const {selectedCurrencies} = this.state;
        const { rates } = this.state;
        const {baseCurrency}= this.state;
        const {loadRates} = this.state;
        var month =  new Date().getUTCMonth() +1 ;
        var yeara = new Date().getFullYear() +1 ;
        var yearb = new Date().getFullYear()-1 ;
        var yearbefore = ""+ yearb +"-"+ month+ "-"+ new Date().getUTCDate();
        var yearafter = ""+yeara +"-"+ month+ "-"+ new Date().getUTCDate();
        
        console.log();
        
        return(
            <ScrollView style={styles.container}>
            <View >
                <TextInput
                    placeholder="Subject (Taxi, Restaurant, ...)"
                    style={styles.inputField}
                    underlineColorAndroid="transparent"
                    placeholderTextColor="#818181"
                    onChangeText={(text)=>console.log(text) & this.setState({title: text})}/>
                <TextInput
                    placeholder= "Startdate"
                    value = {this.state.selectedStartDate}
                    style={styles.inputField}
                    underlineColorAndroid="transparent"
                    placeholderTextColor="#818181"
                    keyboardType= 'numeric'
                    onChangeText={(text)=>console.log(text) & this.setState({selectedStartDate: text})}
                        
                />
                <DatePicker
                    mode='date'
                    format='YYYY-MM-DD'
                    minDate= {yearbefore}
                    maxDate={yearafter}
                    date={this.state.selectedStartDate}
                    showIcon={true}
                    placeholder="Select date..."
                    hideText={true}
                    // date={this.state.selectedDate}
                    style={[styles.inputField, styles.datePickerStyle]}
                    onDateChange={(date) => this.setState({selectedStartDate: date})}
                    />
                <TextInput
                    placeholder= "Enddate"
                    value = {this.state.selectedEndDate}
                    style={styles.inputField}
                    underlineColorAndroid="transparent"
                    placeholderTextColor="#818181"
                    keyboardType= 'numeric'
                    onChangeText={(text)=>console.log(text) & this.setState({selectedEndDate: text})}
                        
                />
                <DatePicker
                    mode='date'
                    format='YYYY-MM-DD'
                    minDate= {yearbefore}
                    maxDate={yearafter}
                    date={this.state.selectedEndDate}
                    showIcon={true}
                    placeholder="Select date..."
                    hideText={true}
                    // date={this.state.selectedDate}
                    style={[styles.inputField, styles.datePickerStyle]}
                    onDateChange={(date) => this.setState({selectedEndDate: date})}
                />

            </View>
            
            <View style={{ flex: 1 }}>
                <Text>Select your travel company</Text>
                <MultiSelect
                hideTags
                items={items}
                uniqueKey="id"
                ref={(component) => { this.multiSelect = component }}
                selectedItems={selectedItems}
                onSelectedItemsChange={this.onSelectedItemsChange}
                selectText="Pick Items"
                searchInputPlaceholderText="Search Items..."
                onChangeInput={ (item)=> console.log(item)}
                tagRemoveIconColor="#CCC"
                tagBorderColor="#CCC"
                tagTextColor="#CCC"
                selectedItemTextColor="#CCC"
                selectedItemIconColor="#CCC"
                itemTextColor="#000"
                displayKey="name"
                searchInputStyle={{ color: '#CCC' }}
                submitButtonColor="#CCC"
                submitButtonText="Submit"
                />
                
            </View>
            <View style={[styles.subItem]}>
                        <Text>Select your base currency</Text>
                        <Picker style={{flex:.50}}           
                            onValueChange={currency => this.setState({baseCurrency: currency}) &this.setState({loadRates: true}) & this.getExchangeRatesWithBase(currency) & this.renderValutaToArray(this.state.rates)}
                            selectedValue={this.state.baseCurrency}>
                            <Picker.Item value= {this.state.baseCurrency} label={this.state.baseCurrency} key={this.state.baseCurrency}/>
                            {this.renderValutaWithoutRate(this.state.rates)}
                        </Picker>
            </View>
           
            
            <View style={{ flex: 1 }}>
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
                onChangeInput={ (item)=> console.log(item)}
                tagRemoveIconColor="#CCC"
                tagBorderColor="#CCC"
                tagTextColor="#CCC"
                selectedItemTextColor="#CCC"
                selectedItemIconColor="#CCC"
                itemTextColor="#000"
                displayKey="name"
                searchInputStyle={{ color: '#CCC' }}
                submitButtonColor="#CCC"
                submitButtonText="Submit"
                />
                
            </View>
            
          
            
            </ScrollView>
        );
        }

}

const styles = StyleSheet.create({
    container:{
        flex:1,
        backgroundColor: 'rgba(176,207,227,34)',
        paddingTop: 10,
        paddingLeft:20,
        paddingRight:20
    }
});