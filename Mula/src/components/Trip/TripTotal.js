import React, {Component} from 'react';
import {StyleSheet, View, Image, Text, TextInput, Button, TouchableOpacity, ScrollView} from 'react-native';
import I18n from 'react-native-i18n';

export default class TripTotal extends Component {
    constructor(props) {
      super(props);
      this.state = {}
    }

    componentDidMount() {

    }

    getAllExpensesByTrip(){

    }

    renderExpenses() {

    }

    render() {
      return(
        <View style={styles.container}>
          <Text>Hier moet de balans van elke user getoond worden => Jos heeft al 600 euro betaald (in totaal betaald), 200 euro daarvan heeft hij zelf
          gebruikt (aan drank en eten bv) => de Jos moet nog 400 euro terugkrijgen
          </Text>
        </View>
      )
    }
}

const styles = StyleSheet.create({
    container:{
        flex:1,
        backgroundColor: '#d4e8e5',
        padding: 20
    }
});