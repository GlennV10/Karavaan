import React, {Component} from 'react';
import {StyleSheet, View, Image, Text, TextInput, Button, TouchableOpacity, ScrollView} from 'react-native';
import I18n from 'react-native-i18n';

export default class TripCategory extends Component {
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
          <Text>TRIP CATEGORY</Text>
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
