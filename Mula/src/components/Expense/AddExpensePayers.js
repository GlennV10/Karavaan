import React, { Component } from 'react';
import { StyleSheet, View, Image, Text, TextInput, Button, TouchableOpacity, Picker, AsyncStorage } from 'react-native';
import DatePicker from 'react-native-datepicker';
import I18n from 'react-native-i18n';
import Prompt from 'react-native-prompt';

export default class AddExpensePayers extends Component {
    constructor(props) {
        super(props);
        this.state = {
            payers: []
        }
    }

    componentDidMount() {
        console.log(this.props.navigation.state.params.expense);
        this.populatePayersState();
    }

    populatePayersState() {
        let payers = this.state.payers.slice();
        for(user of this.props.navigation.state.params.trip.users) {
            let payer = {
                user: user,
                amount: 0
            }
            payers.push(payer);
        }
        this.setState({ payers });
    }

    updatePayerAmount(amount, user) {
        let payers = this.state.payers.slice();
        for(payer of payers) {
            if(payer.user === user) {
                payer.amount = parseInt(amount);
            }
        }
        this.setState({ payers });
    }

    renderPayers() {
        console.log(this.state.payers);
        return this.state.payers.map((payer, index) => {
            return(
                <View key={index}>
                    <Text style={styles.label}>{ payer.user }</Text>
                    <TextInput
                        placeholder="Amound paid..."
                        keyboardType="numeric"
                        style={styles.inputField}
                        underlineColorAndroid="#ffd185"
                        placeholderTextColor="#bfbfbf"
                        onChangeText={(amount) => this.updatePayerAmount(amount, payer.user)} />
                </View>
            )
        });
    }

    getExpense() {
        let expense = this.props.navigation.state.params.expense;
        expense.payers = this.state.payers;

        this.props.navigation.navigate('AddExpenseConsumed', { expense, trip: this.props.navigation.state.params.trip });

    }

    render() {
        return (
            <View style={styles.container}>
                <View style={styles.contentView}>
                    <Text style={styles.title}>Who are the payers?</Text>
                    { this.renderPayers() }

                    <TouchableOpacity style={styles.saveButton} onPress={() => this.getExpense()}>
                        <Text style={styles.saveText}>Who consumed?</Text>
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
