import React, {Component, cloneElement} from 'react';
import {StyleSheet, View, Image, Text, TextInput, Button, Modal, TouchableOpacity, ScrollView, Picker, AsyncStorage} from 'react-native';
import {StackNavigator} from 'react-navigation';
import DatePicker from 'react-native-datepicker';
import {Switch} from 'react-native-switch' ;
import Autocomplete from 'react-native-autocomplete-input';
import CheckBox from 'react-native-checkbox-heaven';
import FontAwesome, {Icons} from 'react-native-fontawesome';
import MultiSelect from 'react-native-multiple-select';

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
            currencies: [],
            selectedCurrencies: []

            
        };
        
      }
  
      componentDidMount() {
        selectedStartDate = new Date().toDateString
        selectedEndDate = new Date().toDateString
        
      }
    onSelectedItemsChange = selectedItems => {
        this.setState({ selectedItems });
        console.log(selectedItems);
        
      };
      onSelectedCurrencyChange = selectedCurrencies => {
        this.setState({ selectedItems });
        console.log(selectedItems);
        
      };

      //GET EXCHANGE RATES
    getExchangeRates(){
        if(this.state.loadRates){
            return fetch('https://api.fixer.io/latest')
            .then((resp) => resp.json())
            .then((data) => this.parseRates(data));
        }
    }
    
      
    render(){
        const { selectedItems } = this.state;
        var month =  new Date().getUTCMonth() +1 ;
        var yeara = new Date().getFullYear() +1 ;
        var yearb = new Date().getFullYear()-1 ;
        var yearbefore = ""+ yearb +"-"+ month+ "-"+ new Date().getUTCDate();
        var yearafter = ""+yeara +"-"+ month+ "-"+ new Date().getUTCDate();
        
        console.log(yearbefore);
        console.log(yearafter);
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
                <MultiSelect
                hideTags
                items={items}
                uniqueKey="id"
                ref={(component) => { this.multiSelect = component }}
                selectedItems={selectedItems}
                onSelectedItemsChange={this.onSelectedItemsChange}
                selectText="Pick Items"
                searchInputPlaceholderText="Search Items..."
                onChangeInput={ (item)=> console.log(text)}
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