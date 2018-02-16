import React, {Component} from 'react';
import {StyleSheet, View, Image, Text, TextInput, Button, TouchableOpacity, Picker} from 'react-native';
import I18n from 'react-native-i18n';

export default class AddExpense extends Component {
    constructor(props) {
      super(props);
      this.state = {
          currency: ""
      }
    }

    componentDidMount() {
        console.log(this.props.navigation.state.params.trip);
    }

    renderPickerCurrencies() {
        return this.props.navigation.state.params.trip.currencies.map((currency, index) => {
          return(
            <Picker.Item value={currency} label={currency} key={index}/>
          )
        });
    }

    render() {
        return(
          <View style={styles.container}>
            <Text style={styles.label}>Currency</Text>
            <Picker selectedValue={this.state.currency} onValueChange={(currency) => this.setState({ currency })}>
                { this.renderPickerCurrencies() }
            </Picker>
          </View>
        )
    }
}

const styles = StyleSheet.create({
    container:{
        flex: 1,
        backgroundColor: '#d4e8e5',
        marginLeft: 5
    }, 
    label: {
        
    }
});
