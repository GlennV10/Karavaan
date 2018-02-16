import React, {Component} from 'react';
import {StyleSheet, View, ScrollView, Image, Text, TextInput, Button, TouchableOpacity, ActivityIndicator, Modal} from 'react-native';
import I18n from 'react-native-i18n';

export default class DetailExpense extends Component{
    constructor(props) {
      super(props);
      this.state = {

      };
    }

    componentDidMount() {

    }

    render(){
        const {expense} = this.props.navigation.state.params;

        return(
          <ScrollView style={styles.container}>
              <Text>{ expense.name }</Text>
          </ScrollView>
        )
    }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#d4e8e5',
  }
});
