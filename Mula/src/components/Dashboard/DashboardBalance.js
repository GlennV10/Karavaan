import React, {Component} from 'react';
import {StyleSheet, View, Image, Text, TextInput, Button, TouchableOpacity, ScrollView} from 'react-native';
import I18n from 'react-native-i18n';

export default class DashboardBalance extends Component {
    constructor(props) {
      super(props);
      this.state = {
        expenses: []
      }
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
          <Text>DASHBOARD BALANCE</Text>
        </View>
      )
    }
}

const styles = StyleSheet.create({
    container:{
        flex:1,
        backgroundColor: '#d4e8e5'
    }
});
