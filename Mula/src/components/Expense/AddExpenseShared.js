import React, { Component } from 'react';
import { StyleSheet, View, Image, Text, TextInput, Button, TouchableOpacity, Picker, AsyncStorage, BackHandler, Alert } from 'react-native';
import DatePicker from 'react-native-datepicker';
import I18n from 'react-native-i18n';
import Prompt from 'react-native-prompt';

export default class AddExpensePayers extends Component {
    constructor(props) {
        super(props);
        this.state = {
            shared: []
        }
    }

    componentDidMount() {
        console.log(this.props.navigation.state.params.expense);

        this.props.navigation.addListener("didFocus", () => BackHandler.addEventListener('hardwareBackPress', this._handleBackButton));
        this.props.navigation.addListener("willBlur", () => BackHandler.removeEventListener('hardwareBackPress', this._handleBackButton));
    }

    _handleBackButton = () => {
        Alert.alert(
            I18n.t('back'),
            I18n.t('backmessage'), [{
            text: 'Cancel',
            onPress: () => console.log('Cancel Pressed'),
            style: 'cancel'
          }, {
            text: 'OK',
            onPress: () => this.props.navigation.navigate('TripDashboard', { trip: this.props.navigation.state.params.trip })
          },], {
            cancelable: false
          }
        )
        return true;
      }

    getExpense() {
        let expense = this.props.navigation.state.params.expense;
        // expense.consumers = this.state.consumers;

        /* ==============================
          Add new expense to AsyncStorage
        ============================== */

        AsyncStorage.getItem('expenses')
              .then(req => JSON.parse(req))
              .then((expenses) => {
                  expenses.push(expense);
                  AsyncStorage.setItem('expenses', JSON.stringify(expenses))
                        .then(res => console.log('Expenses stored in AsyncStorage'))
                        .catch(error => console.log('Error storing expenses'));
              })
              .catch(error => console.log('Error loading expenses'));

        //===========================
        //ADD EXPENSE TO DB CODE HERE
        //===========================

        this.props.navigation.navigate('TripDashboard', { trip: this.props.navigation.state.params.trip });

    }

    render() {
        return (
            <View style={styles.container}>
                <View style={styles.contentView}>
                    <Text style={styles.title}>Shared</Text>

                    <TouchableOpacity style={styles.saveButton} onPress={() => this.getExpense()}>
                        <Text style={styles.saveText}>{I18n.t('sharedexpense')}</Text>
                    </TouchableOpacity>
                </View>
            </View>
        )
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#d4e8e5',
        padding: 20
    },
    contentView: {
        marginTop: 10
    },
    title: {
        marginLeft: 10,
        marginBottom: 10,
        fontSize: 17
    },
    label: {
        marginLeft: 10,
        fontSize: 17
    },
    inputField: {
        marginLeft: 13,
        fontSize: 15,
        padding: 10,
        marginBottom: 2,
        color: 'black',
        borderBottomWidth: 0,
        borderRadius: 5
    },
    picker: {
        marginLeft: 13
    },
    saveButton: {
        height: 40,
        alignItems: 'center',
        backgroundColor: '#ffd185',
        borderRadius: 5
    },
    saveText: {
        fontSize: 15,
        lineHeight: 28,
        color: '#303030',
        textAlign: 'center'
    }
});
